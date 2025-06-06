# controller/interview_flow.py

from agents.hr_gemini import generate_hr_question
from agents.candidate_gpt import generate_candidate_reply

def run_interview(rounds: int = 3):
    """
    Запускает интервью из N раундов между HR (Gemini) и кандидатом (GPT).
    """
    print("👔 Начинаем собеседование с мидл-разработчиком...\n")

    # Первый вопрос задаётся вручную (или по умолчанию)
    hr_question = "Расскажите немного о себе."

    for i in range(rounds):
        print(f"🔵 HR (Gemini): {hr_question}")
        
        # Кандидат отвечает
        candidate_reply = generate_candidate_reply(hr_question)
        print(f"🟢 Кандидат (GPT): {candidate_reply}\n")

        # HR задаёт следующий вопрос на основе ответа
        hr_question = generate_hr_question(candidate_reply)
