from tasks import join_users_orders

task = join_users_orders.delay("u1")
print("Submitted task ID:", task.id)