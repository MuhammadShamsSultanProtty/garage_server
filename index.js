const express = require('express')
const app = express()
const cors = require('cors')

const { MongoClient } = require('mongodb');
const { json } = require('express/lib/response');
require('dotenv').config()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wrzam.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('garage_db');
        const appoinnmentCollection = database.collection('appoinments');


        app.get('/appoinments', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = appoinnmentCollection.find(query);
            const appoinments = await cursor.toArray();
            // console.log(result);
            res.json(appoinments)

        })


        app.post('/appoinments', async (req, res) => {
            const appoinment = req.body;
            const result = await appoinnmentCollection.insertOne(appoinment);
            // console.log(result);
            res.json(result)

        })

        // console.log('database connected successfully!');
        // const database = client.db('sample_mflix');
        // const movies = database.collection('movies');
        // Query for a movie that has the title 'Back to the Future'
        // const query = { title: 'Back to the Future' };
        // const movie = await movies.findOne(query);
        // console.log(movie);
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('This is garage-server-done')
})



// console.log(uri);

app.listen(port, () => {
    console.log(`listening at${port}`)
})




//User name: garage-admin
//Password: admin