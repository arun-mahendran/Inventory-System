import os

from google import genai

from dotenv import load_dotenv

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def ask_delivery_ai(context, question):

    prompt = f"""
    You are an AI Delivery Intelligence Assistant.

    Delivery System Data:

    {context}

    User Question:

    {question}

    Answer professionally.
    """

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:

        print("Gemini Error:", e)

        return (
            "⚠️ AI service is currently busy. "
            "Please try again in a few seconds."
        )