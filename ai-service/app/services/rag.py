import os
from typing import Optional
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document as LCDocument
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
import chromadb

CHROMA_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "sevaai_knowledge")
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", 800))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", 100))
TOP_K = int(os.getenv("TOP_K_RESULTS", 5))
MODEL_NAME = os.getenv("OPENAI_MODEL", "gpt-4o")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")


def get_embeddings():
    return OpenAIEmbeddings(model=EMBEDDING_MODEL)


def get_vectorstore():
    embeddings = get_embeddings()
    return Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=CHROMA_PATH,
    )


def get_llm(temperature: float = 0.3):
    return ChatOpenAI(model=MODEL_NAME, temperature=temperature, max_tokens=2000)


def chunk_documents(docs: list[LCDocument]) -> list[LCDocument]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ".", "!", "?", ",", " ", ""],
    )
    return splitter.split_documents(docs)


def add_to_vectorstore(docs: list[LCDocument]) -> int:
    chunks = chunk_documents(docs)
    vs = get_vectorstore()
    vs.add_documents(chunks)
    return len(chunks)


def similarity_search(query: str, k: int = TOP_K, filter_meta: Optional[dict] = None):
    vs = get_vectorstore()
    try:
        results = vs.similarity_search_with_relevance_scores(query, k=k, filter=filter_meta)
        return results
    except Exception:
        return []


SYSTEM_PROMPT = """You are SevaAI, an intelligent AI assistant for the NGO-Government Collaboration Platform of India.
You help NGOs, government officers, volunteers, and citizens with:
- Understanding government schemes and policies
- NGO registration and compliance requirements
- Finding funding opportunities (government grants, CSR)
- Project management and impact reporting
- Social welfare programs and beneficiary support

You must:
1. Always be helpful, accurate, and culturally sensitive to the Indian context
2. Cite sources when using retrieved information
3. If uncertain, clearly state your confidence level
4. Recommend professional consultation for legal/financial matters
5. Support both English and Hindi queries
6. Avoid generating harmful, discriminatory, or false information

Context from knowledge base:
{context}

Current user role: {user_role}
"""

PROPOSAL_PROMPT = """You are SevaAI's Proposal Generator. Create a comprehensive, professional project proposal for an Indian NGO.

Project Details:
- Name: {project_name}
- Location: {location}
- Budget: ₹{budget}
- Target Group: {target_group}
- Duration: {duration}
- Description: {description}
- Focus Area: {focus_area}

Generate a detailed proposal including:
1. Executive Summary
2. Problem Statement
3. Project Objectives (SMART goals)
4. Implementation Plan with Timeline
5. Budget Breakdown (with justification)
6. Expected Outcomes & Impact Metrics
7. Monitoring & Evaluation Strategy
8. Risk Assessment & Mitigation
9. Sustainability Plan
10. Conclusion

Write professionally in English. Use Indian context, rupee amounts, and relevant government scheme references."""


def build_rag_chain():
    vs = get_vectorstore()
    retriever = vs.as_retriever(search_kwargs={"k": TOP_K})
    llm = get_llm()

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", "{question}"),
    ])

    def format_docs(docs):
        return "\n\n---\n\n".join(doc.page_content for doc in docs)

    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough(), "user_role": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    return chain, retriever
