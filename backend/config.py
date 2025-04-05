import os
from dotenv import load_dotenv

# Carrega o arquivo .env/system.env
load_dotenv(dotenv_path="../.env/system.env")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

DB_USER = os.getenv("MYSQL_USERNAME_ADMIN")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD_ADMIN")
DB_HOST = os.getenv("MYSQL_HOST")
DB_NAME = os.getenv("MYSQL_DATABASE")
