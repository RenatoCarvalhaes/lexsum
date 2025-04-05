# models.py
from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean
from db import Base
from datetime import datetime


class Usuarios(Base):
    __tablename__ = "usuarios"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    celular = Column(String(20), unique=True, nullable=False)
    usuario_id = Column(Integer)
    data_nascimento = Column(Date, default=None)
    cep = Column(String(10), default=None)
    logradouro = Column(String(255), default=None)
    numero = Column(Integer, default=None)
    complemento = Column(String(50), default=None)
    bairro = Column(String(120), default=None)
    cidade = Column(String(150), default=None)
    estado = Column(String(2), default=None)
    telefone = Column(String(120), default=None)
    cpf = Column(String(20), default=None)
    cnpj = Column(String(14), default=None)
    inscricao = Column(String(18), default=None)
    created_at = Column(DateTime, default=datetime.now)
    deleted_at = Column(DateTime, default=None)
    verificado = Column(Boolean, default=False, nullable=False)
    codigo_verificacao = Column(String(10), nullable=True)
    codigo_expiracao = Column(DateTime, nullable=True)