# backend/agents/llm.py

import os
import openai

# Make sure you’ve set your OpenAI key in the environment:
#   export OPENAI_API_KEY="sk-…"
openai.api_key = os.getenv("OPENAI_API_KEY")

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

# Export a shared instance
llm = ChatLLM()
