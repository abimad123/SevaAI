import os
import pypdf
import docx
import chromadb
import google.generativeai as genai

CHROMA_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "sevaai_knowledge")

def get_chroma_collection():
  client = chromadb.PersistentClient(path=CHROMA_PATH)
  return client.get_or_create_collection(
    name=COLLECTION_NAME,
    metadata={"hnsw:space": "cosine"}
  )

def split_text(text: str, chunk_size: int = 800, chunk_overlap: int = 100) -> list[str]:
  chunks = []
  start = 0
  while start < len(text):
    end = min(start + chunk_size, len(text))
    if end < len(text):
      last_boundary = -1
      for boundary in ["\n\n", "\n", ". ", " "]:
        pos = text.rfind(boundary, start, end)
        if pos != -1:
          last_boundary = pos + len(boundary)
          break
      if last_boundary != -1 and last_boundary > start + chunk_overlap:
        end = last_boundary
    chunks.append(text[start:end].strip())
    start = end - chunk_overlap
    if start < 0 or end >= len(text):
      break
  return [c for c in chunks if c]

def extract_text_from_file(file_path: str) -> list[tuple[int, str]]:
  _, ext = os.path.splitext(file_path.lower())
  pages = []
  if ext == ".pdf":
    reader = pypdf.PdfReader(file_path)
    for i, page in enumerate(reader.pages):
      text = page.extract_text() or ""
      if text.strip():
        pages.append((i + 1, text))
  elif ext == ".docx":
    doc = docx.Document(file_path)
    text = "\n".join([p.text for p in doc.paragraphs])
    pages.append((1, text))
  else:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
      text = f.read()
    pages.append((1, text))
  return pages

def ingest_document(file_path: str, title: str, source: str, category: str, state: str, language: str):
  pages = extract_text_from_file(file_path)
  chunks = []
  chunk_metadata = []
  
  for page_num, text in pages:
    text_chunks = split_text(text)
    for text_chunk in text_chunks:
      chunks.append(text_chunk)
      chunk_metadata.append({
        "title": title,
        "source": source,
        "category": category,
        "state": state,
        "language": language,
        "page": page_num
      })
      
  if not chunks:
    return 0

  genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
  embeddings = []
  batch_size = 32
  for i in range(0, len(chunks), batch_size):
    batch = chunks[i:i+batch_size]
    res = genai.embed_content(
      model="models/gemini-embedding-2",
      content=batch
    )
    embeddings.extend(res["embedding"])

  collection = get_chroma_collection()
  collection.delete(where={"source": source})
  
  ids = [f"{source}_chunk_{i}" for i in range(len(chunks))]
  collection.add(
    ids=ids,
    embeddings=embeddings,
    metadatas=chunk_metadata,
    documents=chunks
  )
  return len(chunks)

def delete_document_index(source: str):
  collection = get_chroma_collection()
  collection.delete(where={"source": source})

def rebuild_all_indexes(documents: list):
  client = chromadb.PersistentClient(path=CHROMA_PATH)
  try:
    client.delete_collection(COLLECTION_NAME)
  except Exception:
    pass
  collection = client.get_or_create_collection(
    name=COLLECTION_NAME,
    metadata={"hnsw:space": "cosine"}
  )
  
  results = []
  total_chunks = 0
  for doc in documents:
    path = doc.get("file_path")
    title = doc.get("title")
    source = doc.get("source")
    category = doc.get("category")
    state = doc.get("state")
    language = doc.get("language")
    
    chunk_count = ingest_document(path, title, source, category, state, language)
    total_chunks += chunk_count
    results.append({"source": source, "chunk_count": chunk_count})
  return total_chunks, results

def get_chroma_statistics():
  collection = get_chroma_collection()
  return {
    "total_chunks": collection.count(),
    "collection_name": COLLECTION_NAME,
    "persist_directory": CHROMA_PATH
  }

def retrieve_top_chunks(query: str, k: int = 5, role: str = None) -> list[dict]:
  collection = get_chroma_collection()
  genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
  res = genai.embed_content(
    model="models/gemini-embedding-2",
    content=query
  )
  query_vector = res["embedding"]
  
  results = collection.query(
    query_embeddings=[query_vector],
    n_results=k
  )
  
  retrieved = []
  if results and results["documents"] and results["documents"][0]:
    for i in range(len(results["documents"][0])):
      dist = results["distances"][0][i] if results["distances"] else None
      similarity = max(0.0, min(1.0, 1.0 - dist if dist is not None else 0.5))
      retrieved.append({
        "content": results["documents"][0][i],
        "metadata": results["metadatas"][0][i],
        "similarity": similarity
      })
  return retrieved
