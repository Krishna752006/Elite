/*
Find deliveries where any package has sku = "A1". 
Return only: customerId, packages.sku (Hide _id)


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
    packages: [                                                                                                                                       
      {                                                                                                                                               
        sku: 'A1'                                                                                                                                     
      },                                                                                                                                              
      {                                                                                                                                               
        sku: 'B2'                                                                                                                                     
      }                                                                                                                                               
    ]                                                                                                                                                 
  },                                                                                                                                                  
  {                                                                                                                                                   
    customerId: 'CUST-1003',                                                                                                                          
    packages: [                                                                                                                                       
      {                                                                                                                                               
        sku: 'A1'                                                                                                                                     
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
    db.deliveries.find({"packages.sku": "A1"},{_id:0,customerId: 1,"packages.sku":1})
)
