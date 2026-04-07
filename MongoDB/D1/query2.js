/*
Find deliveries where either carrier is in ["fedex", "dhl"] OR state is in 
["RETURNED", "CANCELLED"], Return only: customerId, carrier, state, cost
(Hide _id)


Collection Name: deliveries

Sample Document:
----------------
{
  "_id": "697058b9af49dc18717ef292",
  "customerId": "CUST-1001",
  "state": "DELIVERED",
  "carrier": "dhl",
  "cost": 650,
  "packages": [
    {
      "sku": "A1",
      "weightKg": 2.5,
      "fragile": true
    },
    {
      "sku": "B2",
      "weightKg": 1.2,
      "fragile": false
    }
  ],
  "createdAt": {
    "$date": "2026-01-18T10:00:00.000Z"
  }
}

Sample Output:
--------------
[                                                                                                                                                     
  {                                                                                                                                                   
    customerId: 'CUST-1001',                                                                                                                          
    state: 'DELIVERED',                                                                                                                               
    carrier: 'dhl',                                                                                                                                   
    cost: 650                                                                                                                                         
  },                                                                                                                                                  
  {                                                                                                                                                   
    customerId: 'CUST-1002',                                                                                                                          
    state: 'DELIVERED',                                                                                                                               
    carrier: 'dhl',                                                                                                                                   
    cost: 820                                                                                                                                         
  },                                                                                                                                                  
  {                                                                                                                                                   
    customerId: 'CUST-1003',                                                                                                                          
    state: 'IN_TRANSIT',                                                                                                                              
    carrier: 'fedex',                                                                                                                                 
    cost: 450                                                                                                                                         
  }                                                                                                                                                   
] 


Query Reference:
-------------------
printjson() : JS library function to display the JSON Object data.
    In db.<collection>.find()/aggregate():
    	->  db -> Refers to the database.
    	->  <collection> -> Your collection name
	
*/

printjson(
    db.deliveries.find({$or: [{carrier: {$in: ["dhl","fedex"]}}, {state: {$in : ["RETURNED","CANCELLED"]}}]},{_id:0,customerId: 1,state:1,carrier: 1,cost: 1})
)
