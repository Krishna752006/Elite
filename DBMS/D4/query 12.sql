/*
Write an SQL query to display the full name and email of customers, along with 
the food item name and its price, who ordered the most expensive food item(s) 
available.


Tables:
------
Customers (customer_id, first_name, last_name, email, phone, address) 
FoodItems (food_id, name, description, price, category, availability)
Orders (order_id, customer_id, food_id, quantity, status, total_amount, order_date, )

OUTPUT:

+-------------+-----------------------+-----------------+--------+
| full_name   | email                 | food_item       | price  |
+-------------+-----------------------+-----------------+--------+
| Amit Sharma | amit.sharma@gmail.com | Chicken Biryani | 300.00 |
+-------------+-----------------------+-----------------+--------+
*/

USE GT;

SELECT 
    CONCAT(first_name, ' ', last_name) AS full_name,
    email,
    name AS food_item,
    price
FROM Customers c JOIN Orders o ON c.customer_id = o.customer_id JOIN FoodItems f ON o.food_id = f.food_id WHERE price = (SELECT MAX(price) FROM FoodItems);