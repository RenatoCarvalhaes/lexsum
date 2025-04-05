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