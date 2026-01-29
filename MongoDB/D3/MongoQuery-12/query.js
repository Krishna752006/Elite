/*
Find the total number of orders placed by each membership type.

Collection Names:customers, orders

Sample Document in customers Collections:
-----------------------------------------
{
  _id: ObjectId('69799f4032713a3c10683245'),
  customerId: 'C101',
  name: 'Arjun',
  city: 'Hyderabad',
  membership: 'PREMIUM'
}

Sample Document in orders Collections:
--------------------------------------
{
  _id: ObjectId('69799f2132713a3c1068323b'),
  orderId: 'O001',
  customerId: 'C101',
  amount: 4500,
  status: 'PAID',
  createdAt: ISODate('2026-01-10T00:00:00.000Z')
}

Sample Output:
--------------
[
  { totalOrders: 6, membership: 'PREMIUM' },
  ....
]


Query Reference:
-------------------
printjson() : JS library function to display the JSON Object data.
    In db.<collection>.find()/aggregate():
    	->  db -> Refers to the database.
    	->  <collection> -> Your collection name
	
*/

printjson(
    
)

