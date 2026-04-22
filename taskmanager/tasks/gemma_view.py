import json
import os

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

import google.generativeai as genai


class GemmaSuggestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        context = request.data.get("context", "").strip()
        if not context:
            return Response(
                {"error": "context is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        api_key = os.environ.get("GEMMA_API_KEY")
        if not api_key:
            return Response(
                {"error": "GEMMA_API_KEY is not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemma-3-27b-it")

            prompt = (
                "You are a helpful task management assistant. "
                "Based on the following context, suggest 3 to 5 specific, actionable tasks. "
                "Return ONLY a JSON array of short task name strings, with no extra text or explanation.\n\n"
                f"Context: {context}\n\n"
                'Example: ["Buy groceries", "Call the plumber", "Submit report"]'
            )

            response = model.generate_content(prompt)
            text = response.text.strip()

            start = text.find("[")
            end = text.rfind("]") + 1
            suggestions = json.loads(text[start:end]) if start != -1 else []

            return Response({"suggestions": suggestions})

        except json.JSONDecodeError:
            return Response({"suggestions": []})
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
