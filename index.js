const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.va5jejf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    tourismCollection = client.db('tourismSpotsDB').collection('tourismSpots');

    //----------------------data update------------>
    app.get('/updateTouristSpot/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const result = await tourismCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
      console.log(result);
    });
    ///////////////////////////////////////////////////////////////

    app.get('/myList/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await tourismCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
      console.log(result);
    });
    ///////////////////////data add////////////////////////////////
    app.post('/addTouristsSpot', async (req, res) => {
      const request = req.body;
      console.log(request);
      const result = await tourismCollection.insertOne(request);
      console.log(result);
      res.send(result);
    });

    ////////////////data show/////////////////////

    app.get('/touristsSpots', async (req, res) => {
      const cursor = tourismCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    /////////////////////////////////////////////
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('simple crud is running ');
});

app.listen(port, () => {
  console.log(`simple CRUD is running on port ${port}`);
});
