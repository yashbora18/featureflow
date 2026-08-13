from fastapi import FastAPI
from middleware import is_feature_enabled

app = FastAPI()


@app.get("/")
def home():

    enabled = is_feature_enabled(
        flag_key="chatbot",
        environment="Development",
        user_id="user123",
    )

    if enabled:
        return {
            "message": "🤖 AI Chatbot Feature Enabled"
        }

    return {
        "message": "Chatbot Feature Disabled"
    }


@app.get("/dashboard")
def dashboard():

    enabled = is_feature_enabled(
        flag_key="new_dashboard",
        environment="Development",
        user_id="user123",
    )

    if enabled:
        return {
            "dashboard": "New Dashboard UI"
        }

    return {
        "dashboard": "Old Dashboard UI"
    }