const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.u2hpa9s.mongodb.net/?retryWrites=true&w=majority`;


app.use(cors());
app.use(express.json());



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

        // const classesCollection = client.db('summerPlay').collection('classes')
        const classesCollection = client.db('summerPlay').collection('classes')
        const instructorsCollection = client.db('summerPlay').collection('instructors')
        const reviewsCollection = client.db('summerPlay').collection('reviews')
        const cartCollection = client.db('summerPlay').collection('carts')
        
        // Classes Data
        app.get('/classes', async(req, res) => {
            try {
                const result = await classesCollection.find().sort({availableSeats:1}).toArray();
                res.send(result)
            }
            catch (error) {

            }
        })

        // Instructor Data
        app.get('/instructor', async(req, res) => {
            try {
                const result = await instructorsCollection.find().sort({availableSeats:1}).toArray();
                res.send(result)
            }
            catch (error) {

            }
        })

        app.get('/instructor/:name', async(req, res) => {
            try{
                const name = req.params.name;
                const query = {instructor: name};
                const result = await classesCollection.find(query).toArray();
                res.send(result)
            }
            catch(error){
                console.log(error)
            }
        })

        // Reviews Data
        app.get('/reviews', async(req, res) => {
            try {
                const result = await reviewsCollection.find().sort({availableSeats:1}).toArray();
                res.send(result)
            }
            catch (error) {

            }
        })


        // cart collection apis
        app.get('/carts', async (req, res) => {
            const email = req.query.email;
            console.log(email)
            if(!email){
                res.send([]);
            }
            const query = { email: email };
            const result = await cartCollection.find(query).toArray();
            res.send(result)
        })
        
        app.post('/carts', async (req, res) => {
            const item = req.body;
            console.log(item);
            const result = await cartCollection.insertOne(item);
            res.send(result);
        })

        app.delete('/carts/:id', async(req, res) => {
            const id = req.body.id;
            const query = { _id: new ObjectId(id)};
            const result = await cartCollection.deleteOne(query);
            res.send(result)
        })
        
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close?();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Welcome to the server")
})

app.listen(port, () => {
    console.log(`Your server is running on PORT: ${port}`)
})