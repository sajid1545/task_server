const express = require('express');
const app = express();

require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.mnpr83s.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});


async function run() {
	try {
		const infoCollection = client.db('Task').collection('info');

		app.post('/info', async (req, res) => {
			const info = req.body;

			const result = await infoCollection.insertOne(info);
			res.send(result);
		});
	} finally {
	}
}

run().catch((err) => console.log(err));

app.get('/', (req, res) => {
	res.send('Practice server running');
});

app.listen(port, () => {
	console.log(`Running server on ${port}`);
});
