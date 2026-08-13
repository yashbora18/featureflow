import requests

FEATURE_FLAG_API = "http://127.0.0.1:8000/evaluate"


def is_feature_enabled(flag_key, environment, user_id):
    try:
        response = requests.post(
            FEATURE_FLAG_API,
            json={
                "flag_key": flag_key,
                "environment": environment,
                "user_id": user_id,
            },
            timeout=5,
        )

        if response.status_code == 200:
            return response.json().get("enabled", False)

    except Exception as e:
        print("Feature Flag API Error:", e)

    return False