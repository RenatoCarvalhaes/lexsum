from fastapi import APIRouter, Depends, Query, HTTPException, Header, Body, Response
from sqlalchemy.orm import Session
from core.db import get_db
from models.models import PessoaFisica, PessoaJuridica
from schemas.schemas import PartySearchResponse
from utils.validators import clean_document, is_cpf, is_cnpj
from core.config import settings
from openai import OpenAI
import os

router = APIRouter()

@router.get("/party", response_model=PartySearchResponse)
def get_party(
    document: str = Query(..., description="CPF ou CNPJ"),
    x_api_key: str = Header(...),
    db: Session = Depends(get_db)
):
    if x_api_key != settings.SECRET_API_KEY:
        raise HTTPException(status_code=403, detail="Acesso negado")

    normalized = clean_document(document)

    if is_cpf(normalized):
        pessoa = db.query(PessoaFisica).filter(PessoaFisica.cpf == normalized).first()
        return {"name": pessoa.nome if pessoa else None}

    elif is_cnpj(normalized):
        empresa = db.query(PessoaJuridica).filter(PessoaJuridica.cnpj == normalized).first()
        return {"name": empresa.razao_social if empresa else None}

    else:
        raise HTTPException(status_code=400, detail="Documento inválido")


@router.post("/parse-party-data", summary="Recebe texto livre e retorna XML com campos de PartyData")
async def parse_party_data(payload: dict = Body(...)):
    text = payload.get("text", "").strip()
    if not text:
        return {"error": "Nenhum texto fornecido."}
    
    client = OpenAI(api_key=settings.OPENAI_KEY)
    
    system = (
        "Você é um assistente que recebe um texto com dados de pessoa e "
        "deve retornar **apenas** um XML válido contendo estas tags:\n"
        "<name>,<nationality>,<maritalStatus>,<profession>,"
        "<rg>,<orgaoExpedidor>,<dataExpedicao>,<email>,<phone>,"
        "<address><street>,<number>,<complement>,<neighborhood>,"
        "<city>,<state>,<cep></address>\n"
        "**Importante:** Para o campo `<maritalStatus>` use **somente** um destes valores (exatamente como abaixo):\n"
        "- Solteiro(a)\n"  
        "- Casado(a)\n"  
        "- Divorciado(a)\n"  
        "- Viúvo(a)\n"  
        "- Separado(a) Judicialmente\n"        
        "Nada além do XML."
    )
    user = f"Dado o texto:\n'''{text}'''\nGere o XML."
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system},
            {"role": "user",   "content": user}
        ],
        temperature=0
    )
    xml = resp.choices[0].message.content
    return Response(content=xml, media_type="application/xml")