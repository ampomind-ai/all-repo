from langchain.chat_models import ChatOpenAI

llm = ChatOpenAI(model="gpt-4", temperature=0.7)

async def generate_response(prompt: str) -> str:
    return llm.predict(prompt)