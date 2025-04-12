from fastapi import FastAPI, HTTPException, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from schemas.schemas import UserCreate, VerificacaoInput, LoginData
from core.db import SessionLocal
from sqlalchemy.orm import Session
from models.models import Usuarios
from datetime import datetime, timedelta
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request

from services.auth_utils import verify_password
from utils.validators import validar_email
from services.user_service import usuario_existe, enviar_email_verificacao, criar_usuario
from utils.security import create_access_token, get_current_user, gerar_codigo_verificacao, hash_senha
from services.logger import logger
from routers import party


limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
router = APIRouter()

app.include_router(party.router, prefix="/api")

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Muitas tentativas. Aguarde um momento antes de tentar novamente."}
    )

app.state.limiter = limiter

# Configuração do CORS (permite chamadas vindas do frontend React)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


# Função para obter a sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/login")
async def login(usuario: LoginData, db: Session = Depends(get_db)):
    user = db.query(Usuarios).filter(Usuarios.email == usuario.email).first()
    if not user or not verify_password(usuario.senha, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos.")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/protegido")
async def rota_protegida(current_user: dict = Depends(get_current_user)):
    return {"mensagem": "Você acessou uma rota protegida!", "user": current_user}


@app.post("/signup")
async def signup(user: UserCreate):
    try:
        logger.info("🔥 Entrou na rota /signup")

        if not validar_email(user.email):
            logger.error(f"Cadastro recusado. Email inválido: {user.email}")
            raise HTTPException(400, detail="Email inválido")
        
        if usuario_existe(user.email):
            logger.error(f"Cadastro recusado. Usuário já existe: {user.email}")
            raise HTTPException(409, detail="Email já cadastrado")
        
        codigo = gerar_codigo_verificacao()
        usuario_data = {
            "nome": user.nome,
            "email": user.email,
            "hashed_password": hash_senha(user.senha),
            "celular": user.telefone,  # mapeando corretamente
            "verificado": False,
            "codigo_verificacao": codigo,
            "codigo_expiracao": datetime.now() + timedelta(hours=24)
        }    
        
        db = SessionLocal()
        try:
            novo_usuario = criar_usuario(db=db, user_data=usuario_data)
            logger.info(f"Novo usuário cadastrado com sucesso: {user.email}")
        finally:
            db.close()
        
        # await enviar_email_verificacao(user.email, codigo)
        
        return {
            "status": "pending_verification",
            "message": f"Código enviado para {user.email}",
            "user_id": str(novo_usuario.id if hasattr(novo_usuario, 'id') else 1)
        }
    except Exception as e:
        logger.error(f"Falha em signup: {str(e)}")    


@router.post("/verificar-codigo")
@limiter.limit("5/minute")  # 5 tentativas por minuto por IP
def verificar_codigo(data: VerificacaoInput, request: Request, db: Session = Depends(get_db)):
    logger.info(f"Verificando código: {data.email}")
    user = db.query(Usuarios).filter(Usuarios.email == data.email).first()

    if not user:
        logger.error(f"Falha na verificação de código. Usuário não encontrado: {data.email}")
        raise HTTPException(404, detail="Usuário não encontrado")
    
    if user.verificado:
        logger.error(f"Falha na verificação de código. Usuário já verificado: {data.email}")
        return {"message": "Usuário já verificado"}

    if not user.codigo_verificacao or user.codigo_verificacao != data.codigo:
        logger.error(f"Falha na verificação de código. Código inválido: {data.email}. Esperado {user.codigo_verificacao}. Enviado {data.codigo}.")
        raise HTTPException(400, detail="Código inválido")

    if user.codigo_expiracao and user.codigo_expiracao < datetime.now():
        logger.error(f"Falha na verificação de código. Código expirado: {data.email}")
        raise HTTPException(400, detail="Código expirado")

    user.verificado = True
    user.codigo_verificacao = None
    user.codigo_expiracao = None
    db.commit()

    return {"message": "Verificação concluída com sucesso"}


app.include_router(router)


# @app.post("/signup")
# async def signup(user: UserCreate):
#     print("Chegou na rota signup")
#     return {"ok": True}