import redis, json

r = redis.Redis(
    host="localhost",
    port=6379,
    db=2,
    decode_responses=True
)

data = r.get("user_order_result:u1")
print(json.loads(data))