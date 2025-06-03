#!/usr/bin/env python3
"""
01 — Responses API Script

Uses the assistant created in 00 to send a message and get a response.
Stores thread ID for reuse.

Usage: python scripts/01_responses_api.py
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

def get_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("❌ Error: OPENAI_API_KEY not found in environment variables.")
        sys.exit(1)
    org_id = os.getenv("OPENAI_ORG")
    client_kwargs = {"api_key": api_key}
    if org_id:
        client_kwargs["organization"] = org_id
    return OpenAI(**client_kwargs)

def load_assistant_id():
    path = Path(".assistant")
    if not path.exists():
        print("❌ Error: .assistant file not found. Run 00_init_assistant.py first.")
        sys.exit(1)
    return path.read_text().strip()

def save_thread_id(thread_id):
    path = Path(".thread")
    path.write_text(thread_id)
    print(f"💾 Thread ID saved to {path.resolve()}")

def load_thread_id():
    path = Path(".thread")
    if path.exists():
        return path.read_text().strip()
    return None

def ask_question(client, assistant_id, question):
    thread_id = load_thread_id()
    if not thread_id:
        thread = client.beta.threads.create()
        thread_id = thread.id
        save_thread_id(thread_id)
    else:
        print(f"📎 Reusing thread: {thread_id}")

    # Add the user's question
    client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=question
    )

    # Run the assistant
    run = client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=assistant_id
    )

    print("⏳ Waiting for assistant to respond...")
    while True:
        run_status = client.beta.threads.runs.retrieve(
            thread_id=thread_id,
            run_id=run.id
        )
        if run_status.status == "completed":
            break
        elif run_status.status in ["failed", "cancelled", "expired"]:
            print(f"❌ Run ended with status: {run_status.status}")
            return
        import time
        time.sleep(1)

    messages = client.beta.threads.messages.list(thread_id=thread_id)
    last_message = messages.data[0]
    print("\n💬 Assistant Response:")
    print(last_message.content[0].text.value)

def main():
    print("🧪 Ask Assistant - Lab Script 01")
    print("=" * 40)
    client = get_client()
    assistant_id = load_assistant_id()
    question = input("📝 Enter your question: ")
    ask_question(client, assistant_id, question)

if __name__ == "__main__":
    main()
