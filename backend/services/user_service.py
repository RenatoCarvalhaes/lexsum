from sqlalchemy.orm import Session
from models.models import Usuarios
# from utils.security import hash_senha
# from utils.validators import validar_email
from fastapi import HTTPException
from core.db import SessionLocal

def usuario_existe(email: str) -> bool:
    db = SessionLocal()
    """Verifica se email já está cadastrado"""
    return db.query(Usuarios).filter(Usuarios.email == email).first() is not None


def criar_usuario(db: Session, user_data: dict) -> Usuarios:
    try:
        print("Salvando no banco:", user_data)

        """Cria e salva um novo usuário no banco de dados"""
        novo_usuario = Usuarios(**user_data)
        db.add(novo_usuario)
        db.commit()
        db.refresh(novo_usuario)  # importante: preenche o .id e outros campos automáticos
        print("✅ Usuário criado com ID:", novo_usuario.id)

        return novo_usuario
    except Exception as e:
        print("\n=== Erro ===")
        print("Tipo:", type(e).__name__)
        print("Mensagem:", str(e))    

def enviar_email_verificacao(user_data: dict):
    if not user_data.get('email', None):
        raise HTTPException(status_code=400, detail="Email não disponível para envio de verificação.")
    
    pass