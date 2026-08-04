from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class ProposalRequest(BaseModel):
    project_name: str
    location: str
    budget: str
    target_group: str
    duration: str
    description: Optional[str] = ""
    focus_area: Optional[str] = ""


@router.post("")
async def generate_proposal(request: ProposalRequest):
    try:
        from app.services.rag import get_llm, PROPOSAL_PROMPT
        from langchain.prompts import ChatPromptTemplate

        llm = get_llm(temperature=0.5)
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are SevaAI's professional proposal writer for Indian NGOs. Generate detailed, structured project proposals."),
            ("human", PROPOSAL_PROMPT.format(
                project_name=request.project_name,
                location=request.location,
                budget=request.budget,
                target_group=request.target_group,
                duration=request.duration,
                description=request.description or "To be detailed in proposal",
                focus_area=request.focus_area or "Social development",
            )),
        ])
        result = llm.invoke(prompt.format_messages())
        proposal_text = result.content

        return {
            "title": request.project_name,
            "proposal_text": proposal_text,
            "executive_summary": extract_section(proposal_text, "Executive Summary"),
            "objectives": extract_list_section(proposal_text, "Objectives"),
            "timeline": extract_section(proposal_text, "Implementation Plan"),
            "budget_breakdown": extract_section(proposal_text, "Budget"),
            "expected_impact": extract_section(proposal_text, "Expected Outcomes"),
            "monitoring_strategy": extract_section(proposal_text, "Monitoring"),
        }
    except Exception as e:
        # Fallback proposal
        return {
            "title": request.project_name,
            "proposal_text": generate_template_proposal(request),
            "executive_summary": f"This project titled '{request.project_name}' aims to serve {request.target_group} in {request.location} over a period of {request.duration} with a budget of ₹{request.budget}.",
            "objectives": [
                f"Serve {request.target_group} with quality programs in {request.location}",
                "Build community capacity and resilience",
                "Achieve measurable and sustainable impact",
                "Document and share learnings for replication",
            ],
            "timeline": f"{request.duration} phased implementation with monthly reviews",
            "budget_breakdown": f"Total: ₹{request.budget} — Personnel (40%), Materials (30%), Operations (20%), Contingency (10%)",
            "expected_impact": "Significant positive impact on beneficiary lives with documented evidence",
            "monitoring_strategy": "Monthly field visits, quarterly assessments, biannual reviews",
        }


def extract_section(text: str, keyword: str) -> str:
    lines = text.split("\n")
    capturing = False
    section = []
    for line in lines:
        if keyword.lower() in line.lower() and any(c in line for c in ["#", "**", "1.", "2."]):
            capturing = True
            continue
        if capturing:
            if line.strip().startswith("#") or (line.strip() and line[0].isdigit() and ". " in line[:5]):
                break
            section.append(line)
    return "\n".join(section[:10]).strip() or f"See full proposal for {keyword} details."


def extract_list_section(text: str, keyword: str) -> list:
    section = extract_section(text, keyword)
    items = [l.lstrip("•-*1234567890. ").strip() for l in section.split("\n") if l.strip() and len(l.strip()) > 10]
    return items[:6] if items else ["Objective details in full proposal"]


def generate_template_proposal(request: ProposalRequest) -> str:
    return f"""# Project Proposal: {request.project_name}

## Executive Summary
This proposal outlines a {request.duration} project in {request.location} targeting {request.target_group}
with a total budget of ₹{request.budget}. The project will focus on {request.focus_area or 'social development'}
to create lasting positive impact in the community.

## Problem Statement
{request.target_group} in {request.location} face significant challenges that this project aims to address
through targeted interventions, community engagement, and sustainable solutions.

## Objectives
1. Directly benefit at least 500 individuals from {request.target_group}
2. Build local capacity for long-term sustainability
3. Create documented impact evidence for replication
4. Partner with local government for convergence and scale

## Implementation Timeline ({request.duration})
- Phase 1 (Month 1-2): Setup, team hiring, community mobilization
- Phase 2 (Month 3-6): Core program implementation  
- Phase 3 (Month 7-9): Monitoring, review, mid-term correction
- Phase 4 (Month 10-{request.duration}): Scale, documentation, handover

## Budget Breakdown (₹{request.budget} Total)
- Personnel & Training: 40% (₹{int(float(request.budget.replace(',','')) * 0.4):,})
- Materials & Equipment: 30% (₹{int(float(request.budget.replace(',','')) * 0.3):,})
- Operations & Travel: 20% (₹{int(float(request.budget.replace(',','')) * 0.2):,})
- Contingency: 10% (₹{int(float(request.budget.replace(',','')) * 0.1):,})

## Expected Impact
- Direct beneficiaries: 500+ individuals
- Indirect beneficiaries: 2000+ community members
- Measurable outcomes tracked monthly
- Social Return on Investment > 3:1

## Monitoring & Evaluation
- Monthly field visits and data collection
- Quarterly review meetings with stakeholders
- Annual third-party impact assessment
- Real-time dashboard on SevaAI platform
"""
