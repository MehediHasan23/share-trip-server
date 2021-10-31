const express = require('express');
const app = express();
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId


// dotenv config 
require('dotenv').config()

//port
const port = process.env.PORT || 5000

// middleware 
app.use(cors());
app.use(express.json())

// user & pass 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mil2w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log('database-connected');
    const database = client.db("travel_agency");
    const packageCollection = database.collection("packages")
    const orderCollection = database.collection("orders")
    
    //GET API 
    app.get('/packages', async(req, res)=>{
      const cursor = packageCollection.find({})
      const packages = await cursor.toArray()
      res.send(packages)
    })

    // POST  API 
    app.post('/orders', async(req, res) =>{
      console.log(req.body);
      const order = req.body
      const result = await orderCollection.insertOne(order)
      console.log(result);
      res.send(result)
    })

    //GET Order APi
    app.get('/orders', async(req, res)=>{
      const cursor = orderCollection.find({})
      const order = await cursor.toArray()
      res.send(order)
    })

    //delete order api
    app.delete('/orders/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await orderCollection.deleteOne(query)
      console.log(result);
      res.send(result);
    })

    //my order api
    app.get('/orders/:email', async(req, res)=>{
      const email = req.params.email
      const result = await orderCollection.find({email}).toArray()
      res.json(result)
    })


    // Add service api
    app.post('/packages', async(req, res) =>{
      const service = req.body
      // const result = await packageCollection.insertOne(service)
      console.log('hitting post api', service);
      // console.log(result);
      res.send('post hitted')

    })
   
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




//root
app.get('/', (req, res)=>{
  res.send('hello server site')
})

app.listen(port, ()=>{
  console.log('port is running on server', port);
})