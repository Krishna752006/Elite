from celery_app import celery_app
from pymongo import MongoClient
import redis, json

mongo = MongoClient("mongodb://localhost:27017")
db = mongo.shop

redis_client = redis.Redis(
    host="localhost",
    port=6379,
    db=2,
    decode_responses=True
)

@celery_app.task(bind=True)
def join_users_orders(self, user_id):
    pipeline = [
        {"$match": {"_id": user_id}},
        {
            "$lookup": {
                "from": "orders",
                "localField": "_id",
                "foreignField": "userId",
                "as": "orders",
            }
        },
    ]
    result = list(db.users.aggregate(pipeline))
    redis_key = f"user_order_result:{user_id}"
    redis_client.set(redis_key, json.dumps(result), ex=300)
    return {"redis_key": redis_key, "count": len(result)}