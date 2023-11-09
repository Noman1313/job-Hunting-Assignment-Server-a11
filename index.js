const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

// jobHunter
// dvet15B8LGU3d3MO


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wnwhdjk.mongodb.net/?retryWrites=true&w=majority`;

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

        const jobsCollection = client.db('jobsHunter').collection('jobs');
        const applyJobsCollection = client.db('jobsHunter').collection('applyJobs');

        app.get('/jobs', async (req, res) => {
            const cursor = jobsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobsCollection.findOne(query);
            res.send(result);
        })

        app.post('/jobs', async(req,res)=>{
            const addJob = req.body
            console.log(addJob);
            const result = await jobsCollection.insertOne(addJob)
            res.send(result);
        })

        //apply jobs
        app.get('/applyJobs', async (req, res) => {
            console.log(req.query.email);
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await applyJobsCollection.find(query).toArray()
            res.send(result);
        })

        app.post('/applyJobs', async (req, res) => {
            const applyJobs = req.body
            console.log(applyJobs);
            const result = await applyJobsCollection.insertOne(applyJobs)
            res.send(result);
        })

        //delete
        app.delete('/applyJobs/:id', async(req,res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await applyJobsCollection.deleteOne(query)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('server site running in local with nodemon')
})

app.listen(port, () => {
    console.log(`server site port ${port}`);
})
