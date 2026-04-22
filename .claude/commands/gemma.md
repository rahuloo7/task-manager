# Gemma AI Integration Skill

You are an expert at integrating Google's Gemma language model into applications using the `google-generativeai` Python SDK. When this skill is invoked, help the user add Gemma-powered AI features to their project.

## What to do

When invoked with `$ARGUMENTS`:

1. If `$ARGUMENTS` is empty or "help", explain what this skill does and the available Gemma models.
2. If `$ARGUMENTS` contains a feature description, implement that Gemma-powered feature in the current project.
3. If `$ARGUMENTS` is "setup", guide the user through API key setup and install the SDK.

## Setup

### Install the SDK
```bash
pip install google-generativeai
```

### Configure your API key
Get a free API key from https://aistudio.google.com/app/apikey and set it:
```bash
export GEMMA_API_KEY="your-api-key-here"
```

## Available Models

| Model | Best for |
|-------|----------|
| `gemma-3-27b-it` | Most capable, complex reasoning |
| `gemma-3-12b-it` | Balanced capability and speed |
| `gemma-3-4b-it` | Fast, lightweight tasks |
| `gemma-3-1b-it` | Ultra-fast, simple tasks |

## Standard Integration Pattern

```python
import google.generativeai as genai
import os

genai.configure(api_key=os.environ.get("GEMMA_API_KEY"))
model = genai.GenerativeModel("gemma-3-27b-it")

response = model.generate_content("Your prompt here")
print(response.text)
```

## Django REST Framework Pattern

When adding Gemma to a Django project, use this view pattern:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
import google.generativeai as genai
import os, json

class GemmaView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        prompt = request.data.get("prompt", "").strip()
        if not prompt:
            return Response({"error": "prompt is required"}, status=status.HTTP_400_BAD_REQUEST)

        api_key = os.environ.get("GEMMA_API_KEY")
        if not api_key:
            return Response({"error": "GEMMA_API_KEY not set"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemma-3-27b-it")
        response = model.generate_content(prompt)
        return Response({"result": response.text})
```

## Implementation Steps

When adding Gemma to the current project:

1. **Check requirements.txt** — add `google-generativeai` if missing
2. **Create the API view** — use the Django pattern above, adapted to the task
3. **Register the URL** — add the endpoint to `urls.py`
4. **Add the frontend action** — call the endpoint via Axios
5. **Update the UI** — surface the Gemma response to the user
6. **Document the env var** — remind the user to set `GEMMA_API_KEY`

## Error Handling

Always handle these cases:
- Missing `GEMMA_API_KEY` → return 500 with a clear message
- Empty prompt → return 400
- Gemma API errors → catch exceptions and return 500
- Malformed JSON in response → fall back gracefully

## Testing

```python
# Test the view without hitting the real API
from unittest.mock import patch, MagicMock

@patch("google.generativeai.GenerativeModel")
def test_gemma_view(mock_model):
    mock_instance = MagicMock()
    mock_instance.generate_content.return_value.text = '["Task A", "Task B"]'
    mock_model.return_value = mock_instance
    # ... assert view returns expected data
```
