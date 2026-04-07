/*

Write an SQL query to display the food_id and name of food items whose names 
contain at least two consecutive vowels (a, e, i, o, u).

Tables:
------
Customers (customer_id, first_name, last_name, email, phone, address) 
FoodItems (food_id, name, description, price, category, availability)
Orders (order_id, customer_id, food_id, quantity, status, total_amount, order_date, )

OUTPUT:
+---------+----------------------+
| food_id | name                 |
+---------+----------------------+
|       1 | Paneer Butter Masala |
+---------+----------------------+

*/

use GT;
SELECT food_id, name from FoodItems where LOWER(name) REGEXP '[aeiou]{2}';