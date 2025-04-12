import re
from fastapi import HTTPException

def validar_email(email: str) -> bool:
    """Valida formato de email com regex avançado"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.fullmatch(pattern, email))

def validar_telefone(telefone: str) -> str:
    """Remove formatação e valida telefone brasileiro"""
    digits = re.sub(r'\D', '', telefone)
    if len(digits) not in (10, 11):
        raise HTTPException(
            status_code=400,
            detail="Telefone deve ter 10 ou 11 dígitos (incluindo DDD)"
        )
    return digits

def clean_document(document: str) -> str:
    return re.sub(r'\D', '', document)

def is_cpf(document: str) -> bool:
    digits = clean_document(document)
    return len(digits) == 11

def is_cnpj(document: str) -> bool:
    digits = clean_document(document)
    return len(digits) == 14
