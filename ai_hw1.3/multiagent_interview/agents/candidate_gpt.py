# agents/candidate_gpt.py

import openai
from config.env import OPENAI_API_KEY

# Настройка OpenAI client (v1+)
client = openai.OpenAI(api_key=OPENAI_API_KEY)

def generate_candidate_reply(question: str) -> str:
    """
    Генерирует ответ кандидата (мидл-разработчика) на вопрос HR.
    """
    messages = [
        {
            "role": "system",
            "content": (
                "Ты мидл-разработчик, проходишь техническое собеседование. "
                "Отвечай профессионально, уверенно и честно."
            ),
        },
        {"role": "user", "content": question},
    ]

    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages,
        temperature=0.7
    )

    return response.choices[0].message.content.strip()
