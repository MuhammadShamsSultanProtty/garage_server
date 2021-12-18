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
        const usersCollections = database.collection('users');


        app.get('/appoinments', async (req, res) => {
            const email = req.query.email;
            const date = new Date(req.query.date).toLocaleDateString();
            console.log(date);
            const query = { email: email, date: date };
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
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollections.insertOne(user);
            console.log(result);
            res.json(result)
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollections.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;

            }
            res.json({ admin: isAdmin });

        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollections.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            // const options = { upsert: true };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollections.updateOne(filter, updateDoc);
            res.json(result);
        })

    }

    finally {

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