# logger.py
from loguru import logger
import sys

# Remove handlers padrão do loguru
logger.remove()

# Adiciona handler para terminal (com cores)
logger.add(sys.stdout, colorize=True, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level}</level> | <cyan>{module}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>", level="DEBUG")

# Adiciona handler para arquivo
logger.add("logs/app.log", rotation="1 week", retention="4 weeks", compression="zip", level="INFO", enqueue=True)
