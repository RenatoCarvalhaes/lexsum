from fastapi import APIRouter, Depends, Query, HTTPException, Header
from sqlalchemy.orm import Session
from core.db import get_db
from models.models import PessoaFisica, PessoaJuridica
from schemas.schemas import PartySearchResponse
from utils.validators import clean_document, is_cpf, is_cnpj
from core.config import settings

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
