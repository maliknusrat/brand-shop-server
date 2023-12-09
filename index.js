const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//Connection code

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dhjafvg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db('productDB').collection('product');
    const cartCollection = client.db('productDB').collection('cart');

    app.post('/product',async(req,res)=>{
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    } )

    app.get('/product',async(req,res)=>{
      const result = await productCollection.find().toArray();
      res.send(result);
    })
    
    app.get('/brandProduct/:id', async (req, res) => {
      const id = req.params.id;
      const query = {brandName : id}
      const result = await productCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/productDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    app.get('/updateProduct/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    app.post('/addToCard', async(req,res)=> {
      const body = req.body;
      const result = await cartCollection.insertOne(body);
      res.send(result);
    })

    app.get('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = {user : id}
      const result = await cartCollection.find(query).toArray();
      res.send(result)
    })
    
    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })

    app.put('/updateProductInfo/:id', async (req, res) => {
      const id=req.params.id
      const filter={_id : new ObjectId(id)}
      const options={upsert: true}
      
      const updatedData=req.body
      const product={
          $set:updatedData
      }

      const result = await productCollection.updateOne(filter, product, options);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req,res) => {
  res.send('BrandShop is Running')
})

app.listen(port,()=>{
  console.log(`Brand Server is Running on Port: ${port}`);
})