const { MongoClient, ServerApiVersion } = require('mongodb');
const express= require('express');
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const app= express();
//middleware
app.use(cors());
app.use(express.json());
const {ObjectId} = require('mongodb');
app.get('/', (req, res)=>{
    res.send('running genius server');
})
//var mongo = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_admin}:${process.env.DB_password}@cluster0.hz4tt11.mongodb.net/?retryWrites=true&w=majority`;
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
    await client.connect();
    console.log("Genius Car DB Connected");
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    app.get('/products', async(req, res) =>{
        const productCollection = client.db('cse470').collection('products');
        const query = {};
        const cursor = productCollection.find(query);
        const products = await cursor.toArray();
        res.send(products);
    })
    app.get('/product/:productId', async(req, res) => {
        const productCollection = client.db('cse470').collection('products');
        const productId = req.params.productId;
        const query = {_id: ObjectId(productId)};
        //console.log(query);
        const product = await productCollection.findOne(query);
        //console.log(blogs);
        res.send(product);

    })
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.listen(port, ()=>{
    console.log(`Running on port, ${port}`);
})
