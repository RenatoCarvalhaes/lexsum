from db import engine, Base
import models  # Importa seus modelos para que eles sejam registrados

Base.metadata.create_all(bind=engine)
