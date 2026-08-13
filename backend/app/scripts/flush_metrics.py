from datetime import date

from app.core.redis_client import redis_client
from app.core.database import SessionLocal
from app.models.evaluation_metric import EvaluationMetric


def flush_metrics():

    db = SessionLocal()

    try:

        keys = redis_client.keys("feature_eval:*")

        for key in keys:

            flag_key = key.replace("feature_eval:", "")

            count = int(redis_client.get(key))

            metric = EvaluationMetric(
                flag_key=flag_key,
                date=date.today(),
                evaluation_count=count,
            )

            db.add(metric)

            redis_client.delete(key)

        db.commit()

        print("✅ Evaluation metrics flushed successfully!")

    except Exception as e:

        db.rollback()

        print("❌ Error:", e)

    finally:

        db.close()


if __name__ == "__main__":
    flush_metrics()