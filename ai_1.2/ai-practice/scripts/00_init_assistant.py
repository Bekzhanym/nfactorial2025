#!/usr/bin/env python3
"""
00 — Assistant Bootstrap Script

Creates or updates a reusable OpenAI assistant with file_search capabilities.
Stores the ASSISTANT_ID in a local .assistant file for reuse across labs.

Usage: python scripts/00_init_assistant.py

Docs: https://platform.openai.com/docs/api-reference/assistants
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

def get_client():
    api_key = os.getenv("OPENAI_API_KEY")
    print(api_key)
    if not api_key:
        print("❌ Error: OPENAI_API_KEY not found in environment variables.")
        print("   Please copy .env.example to .env and add your API key.")
        sys.exit(1)
    org_id = os.getenv("OPENAI_ORG")
    client_kwargs = {"api_key": api_key}
    if org_id:
        client_kwargs["organization"] = org_id
    return OpenAI(**client_kwargs)

def load_assistant_id():
    path = Path(".assistant")
    if path.exists():
        return path.read_text().strip()
    return None

def save_assistant_id(assistant_id):
    path = Path(".assistant")
    path.write_text(assistant_id)
    print(f"💾 Assistant ID saved to {path.resolve()}")

def create_or_update_assistant(client):
    existing_id = load_assistant_id()
    config = {
        "name": "Talapty AI",
        "model": "gpt-4o-mini",
        "instructions": (
            "You are a helpful lab assistant for OpenAI API practice sessions.\n\n"
            "You can help with:\n"
            "- Math questions\n"
            "- Create options for the UNT\n"
            "- Training tasks on specific topics\n"
            "- Identify topics that need to be taught to a student through diagnostics\n"
            "- You must show concern for the student\n\n"
            "Always be clear, concise, and educational in your responses. When working with files, "
            "provide specific citations and references to the source material."
        ),
        "tools": [{"type": "file_search"}],
        "temperature": 1.0,
        "top_p": 1.0
    }
    try:
        if existing_id:
            print(f"🔄 Updating existing assistant: {existing_id}")
            assistant = client.beta.assistants.update(
                assistant_id=existing_id,
                **config
            )
            print("✅ Assistant updated successfully!")
        else:
            print("🆕 Creating new assistant...")
            assistant = client.beta.assistants.create(**config)
            save_assistant_id(assistant.id)
            print("✅ Assistant created successfully!")
        print(f"📋 Assistant Details:")
        print(f"   ID: {assistant.id}")
        print(f"   Name: {assistant.name}")
        print(f"   Model: {assistant.model}")
        print(f"   Tools: {[tool.type for tool in assistant.tools]}")

        # --- PDF upload and vector store logic ---
        pdf_path = "/home/bekzhan/Рабочий стол/ai_1.2/ai-practice/data/perimeters_questions.pdf"
        if os.path.exists(pdf_path):
            with open(pdf_path, "rb") as file_obj:
                uploaded_file = client.files.create(
                    file=file_obj,
                    purpose="assistants"
                )
            try:
                # Try the newer API structure first
                vector_store = client.vector_stores.create(
                    name="Study Materials"
                )
                client.vector_stores.files.create(
                    vector_store_id=vector_store.id,
                    file_id=uploaded_file.id
                )
                print("✅ PDF uploaded and added to vector store (client.vector_stores API)")
            except AttributeError:
                # Fallback to beta API structure
                try:
                    vector_store = client.beta.vector_stores.create(
                        name="Study Materials"
                    )
                    client.beta.vector_stores.files.create(
                        vector_store_id=vector_store.id,
                        file_id=uploaded_file.id
                    )
                    print("✅ PDF uploaded and added to vector store (client.beta.vector_stores API)")
                except AttributeError as e:
                    print(f"❌ Error: Vector stores API not found. OpenAI library version issue: {e}")
                    print("Please try upgrading or downgrading the OpenAI library")
                    return assistant
            # Update assistant with vector store
            client.beta.assistants.update(
                assistant.id,
                tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}}
            )
            print("🔗 Assistant now linked to your PDF file for file_search.")
        else:
            print(f"❌ PDF file not found at {pdf_path}")
        # --- end PDF logic ---

        return assistant
    except Exception as e:
        print(f"❌ Error creating/updating assistant: {e}")
        sys.exit(1)

def main():
    print("🚀 OpenAI Practice Lab - Assistant Bootstrap")
    print("=" * 50)
    client = get_client()
    print("✅ OpenAI client initialized")
    create_or_update_assistant(client)
    print("\n🎯 Next Steps:")
    print("   1. Run: python scripts/01_responses_api.py")
    print("   2. Or explore other lab modules in the scripts/ directory")
    print("\n💡 Tip: Use 'python scripts/99_cleanup.py' to clean up resources when done")

if __name__ == "__main__":
    main()