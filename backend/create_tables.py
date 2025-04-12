from core.db import engine, Base
from models import models  # Garante que todos os modelos sejam importados e registrados


if __name__ == "__main__":
    print("Criando tabelas...")
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso.")