const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.u2hpa9s.mongodb.net/?retryWrites=true&w=majority`;


app.use(cors());
app.use(express.json());






app.get('/', (req, res) => {
    res.send("Welcome to the server")
})

app.listen(port, () => {
    console.log(`Your server is running on PORT: ${port}`)
})