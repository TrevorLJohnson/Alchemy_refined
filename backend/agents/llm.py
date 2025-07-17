# backend/agents/llm.py

import os
from dotenv import load_dotenv
import openai

# 1) Load variables from .env (must be in backend/.env)
load_dotenv()

# 2) Grab your key
openai.api_key = os.getenv("OPENAI_API_KEY")

if not openai.api_key:
    raise RuntimeError(
        "Missing OPENAI_API_KEY—make sure backend/.env contains it"
    )

class ChatLLM:
    """Simple wrapper around OpenAI’s ChatCompletion API."""
    def __init__(self, model="gpt-4"):
        self.model = model

    def ask(self, prompt: str) -> str:
        response = openai.ChatCompletion.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content

# Shared instance
llm = ChatLLM()
