from pydantic import BaseModel, EmailStr, field_validator
# from typing import Optional
import re
# from datetime import datetime

class UserCreate(BaseModel):
    nome: str
    email: EmailStr
    telefone: str
    senha: str
    
    @field_validator('nome')
    def validate_nome(cls, v):
        v = v.strip()
        if len(v) < 3:
            raise ValueError('Nome deve ter pelo menos 3 caracteres')
        if len(v) > 100:
            raise ValueError('Nome deve ter no máximo 100 caracteres')
        return v.title()  # Capitaliza corretamente
    
    @field_validator('telefone')
    def validate_telefone(cls, v):
        # Remove todos os não dígitos
        digits = re.sub(r'\D', '', v)
        
        if len(digits) < 10 or len(digits) > 11:
            raise ValueError('Telefone deve ter 10 ou 11 dígitos')
        
        return digits  # Armazena apenas números
    
    @field_validator('senha')
    def validate_senha(cls, v):
        if len(v) < 6:
            raise ValueError('Senha deve ter no mínimo 6 caracteres')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Senha deve conter pelo menos uma letra maiúscula')
        if not re.search(r'[a-z]', v):
            raise ValueError('Senha deve conter pelo menos uma letra minúscula')
        if not re.search(r'[0-9]', v):
            raise ValueError('Senha deve conter pelo menos um número')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Senha deve conter pelo menos um caractere especial')
        return v
    

class VerificacaoInput(BaseModel):
    email: EmailStr
    codigo: str    


class LoginData(BaseModel):
    email: str
    senha: str
