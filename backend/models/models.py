# models.py
from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean, ForeignKey, DateTime
from core.db import Base
from datetime import datetime
from sqlalchemy.orm import relationship


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



class Partes(Base):
    __tablename__ = "partes"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(120), nullable=False)
    telefone = Column(String(20))
    celular = Column(String(20))
    tipo = Column(String(20))  # 'fisica' ou 'juridica'
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)
    cep = Column(String(9))
    logradouro = Column(String(120))
    numero = Column(String(50))
    complemento = Column(String(50))
    bairro = Column(String(120))
    cidade = Column(String(120))
    uf = Column(String(2))
    cpf_responsavel = Column(String(11))  # sem pontuação
    deleted_at = Column(DateTime)

    pessoa_fisica = relationship("PessoaFisica", back_populates="parte", uselist=False)
    pessoa_juridica = relationship("PessoaJuridica", back_populates="parte", uselist=False)


class PessoaFisica(Base):
    __tablename__ = "pessoa_fisica"

    id = Column(Integer, ForeignKey("partes.id"), primary_key=True)
    nome = Column(String(120), nullable=False)
    cpf = Column(String(11), unique=True, nullable=False)  # sem pontuação
    data_nascimento = Column(Date)
    identidade = Column(String(50))
    orgao_expedidor = Column(String(50))
    data_expedicao = Column(Date)
    nit = Column(String(50))
    nome_social = Column(String(120))
    genero = Column(String(50))
    estado_civil = Column(String(50))
    profissao = Column(String(100))
    nacionalidade = Column(String(50))
    genitor_1 = Column(String(120))
    genitor_2 = Column(String(120))

    parte = relationship("Partes", back_populates="pessoa_fisica")


class PessoaJuridica(Base):
    __tablename__ = "pessoa_juridica"

    id = Column(Integer, ForeignKey("partes.id"), primary_key=True)
    cnpj = Column(String(14), unique=True, nullable=False)  # sem pontuação
    razao_social = Column(String(255), nullable=False)
    nome_fantasia = Column(String(255))
    inscricao_estadual = Column(String(120))
    inscricao_municipal = Column(String(120))

    parte = relationship("Partes", back_populates="pessoa_juridica")
