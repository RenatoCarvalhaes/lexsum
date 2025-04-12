# db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from urllib.parse import quote_plus
from core.config import settings  # Certifique-se de definir essas variáveis no seu arquivo de configuração
from typing import Generator

encoded_password = quote_plus(settings.MYSQL_PASSWORD_ADMIN)
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{settings.MYSQL_USERNAME_ADMIN}:{encoded_password}@{settings.MYSQL_HOST}/{settings.MYSQL_DATABASE}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()