/*
Find deliveries where number of packages > 3 return the latest 5 deliveries 
(newest first). Return only: customerId, packages (Hide _id)


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
    customerId: 'CUST-1012',                                                                                                                          
    packages: [                                                                                                                                       
      {                                                                                                                                               
        sku: 'Q17',                                                                                                                                   
        weightKg: 1.2,                                                                                                                                
        fragile: false                                                                                                                                
      },                                                                                                                                              
      {                                                                                                                                               
        sku: 'R18',                                                                                                                                   
        weightKg: 1.6,                                                                                                                                
        fragile: false                                                                                                                                
      },                                                                                                                                              
      {                                                                                                                                               
        sku: 'S19',                                                                                                                                   
        weightKg: 0.8,                                                                                                                                
        fragile: false                                                                                                                                
      },                                                                                                                                              
      {                                                                                                                                               
        sku: 'T20',                                                                                                                                   
        weightKg: 2.2,                                                                                                                                
        fragile: true                                                                                                                                 
      }                                                                                                                                               
    ]                                                                                                                                                 
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
    db.deliveries.find({$expr: {$gt : [{$size:"$packages"},3]}},{_id:0,customerId:1,packages:1}).sort({createdAt:-1}).limit(5)
)
