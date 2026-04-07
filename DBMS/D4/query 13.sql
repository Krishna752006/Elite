/*

Write an SQL query to display the names of food items along with the total 
quantity ordered for each item, showing only those items whose total ordered 
quantity is greater than the average quantity ordered across all food items.

Tables:
------
Customers (customer_id, first_name, last_name, email, phone, address) 
FoodItems (food_id, name, description, price, category, availability)
Orders (order_id, customer_id, food_id, quantity, status, total_amount, order_date, )

OUTPUT:
+-------------+----------------+
| name        | total_quantity |
+-------------+----------------+
| Masala Dosa |              5 |
| Samosa      |              9 |
+-------------+----------------+

*/

USE GT;
SELECT name, SUM(quantity) AS total_quantity FROM FoodItems f JOIN Orders o ON f.food_id = o.food_id GROUP BY f.food_id, name 
HAVING SUM(quantity) > (
    SELECT AVG(total_qty)
    FROM (
        SELECT SUM(quantity) AS total_qty
        FROM Orders
        GROUP BY food_id
    ) AS item_totals
);