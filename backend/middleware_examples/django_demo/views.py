from django.http import JsonResponse
from .middleware import is_feature_enabled


def home(request):

    enabled = is_feature_enabled(
        flag_key="chatbot",
        environment="Development",
        user_id="user123",
    )

    if enabled:
        return JsonResponse({
            "message": "🤖 AI Chatbot Enabled"
        })

    return JsonResponse({
        "message": "Chatbot Disabled"
    })


def dashboard(request):

    enabled = is_feature_enabled(
        flag_key="new_dashboard",
        environment="Development",
        user_id="user123",
    )

    if enabled:
        return JsonResponse({
            "dashboard": "New Dashboard UI"
        })

    return JsonResponse({
        "dashboard": "Old Dashboard UI"
    })