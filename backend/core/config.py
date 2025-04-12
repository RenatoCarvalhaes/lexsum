from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional
from dotenv import load_dotenv

# Garante o carregamento do arquivo correto
load_dotenv(dotenv_path="../.env/system.env")

class Settings(BaseSettings):
    # Segurança JWT
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # Banco de dados MySQL
    MYSQL_USERNAME_ADMIN: str = Field(..., env="MYSQL_USERNAME_ADMIN")
    MYSQL_PASSWORD_ADMIN: str = Field(..., env="MYSQL_PASSWORD_ADMIN")
    MYSQL_HOST: str = Field(..., env="MYSQL_HOST")
    MYSQL_DATABASE: str = Field(..., env="MYSQL_DATABASE")

    # Token para autenticar requisições internas (ex: /party)
    SECRET_API_KEY: str

    # URL de conexão MySQL já montada
    @property
    def DATABASE_URL(self) -> str:
        from urllib.parse import quote_plus
        escaped_pw = quote_plus(self.MYSQL_PASSWORD_ADMIN)
        return f"mysql+pymysql://{self.MYSQL_USERNAME_ADMIN}:{escaped_pw}@{self.MYSQL_HOST}/{self.MYSQL_DATABASE}"

settings = Settings()
