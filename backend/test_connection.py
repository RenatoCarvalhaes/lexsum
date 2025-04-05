import requests
import json

print("=== Teste de Conexão Avançado ===")

data = {
    "nome": "Teste Completo",
    "email": "teste@teste.com",
    "telefone": "11999999999",
    "senha": "Senha@123"
}

try:
    print("Enviando dados:", data)
    response = requests.post(
        'http://127.0.0.1:8000/signup',
        json=data,
        headers={'Content-Type': 'application/json'}
    )
    
    print("\n=== Resultado ===")
    print("Status Code:", response.status_code)
    print("Headers:", response.headers)
    print("Conteúdo:", response.text)  # Mostra o conteúdo bruto
    
    try:
        json_response = response.json()
        print("JSON Parseado:", json_response)
    except:
        print("Não foi possível parsear como JSON")

except Exception as e:
    print("\n=== Erro ===")
    print("Tipo:", type(e).__name__)
    print("Mensagem:", str(e))