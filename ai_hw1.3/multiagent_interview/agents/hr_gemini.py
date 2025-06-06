# agents/hr_gemini.py

import google.generativeai as genai
from config.env import GOOGLE_API_KEY

# Configure the API
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the model
generation_config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_NONE"
    },
]

model = genai.GenerativeModel(model_name="gemini-2.0-flash",
                            generation_config=generation_config,
                            safety_settings=safety_settings)

def generate_hr_question(prev_response: str) -> str:
    prompt = (
        "Ты HR, проводишь собеседование на позицию мидл-разработчика.\n"
        f"Кандидат только что ответил:\n\n"
        f"{prev_response}\n\n"
        "Какой следующий вопрос ты бы задал? Отвечай на русском языке."
    )
    
    try:
        response = model.generate_content(prompt)
        if hasattr(response, 'text'):
            return response.text.strip()
        return "Расскажите о сложном техническом вызове, с которым вы столкнулись, и как вы его решили."
    except Exception as e:
        print(f"Error generating response: {str(e)}")
        return "Расскажите о сложном техническом вызове, с которым вы столкнулись, и как вы его решили."
