const express = require('express');
const app = express();
const nodemailer = require('nodemailer');

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

		app.get('/info', async (req, res) => {
			const query = {};
			const information = await infoCollection.find(query).toArray();
			res.send(information);
		});

		app.post('/send-email', async (req, res) => {
			const info = req.body;
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'clashking1545@gmail.com',
					pass: process.env.NODE_MAIL_PASSWORD,
				},
			});

			const mailOptions = {
				from: 'clashking1545@gmail.com',
				to: 'info@redpositive.in',
				subject: 'Redpositive Service Task',
				text: `
                Email - ${info.Email}
                Name - ${info.Name}
                Phone - ${info.Phone}
                Hobbies - ${info.Hobbies}
                `,
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
					// do something useful
				}
			});
		});

		app.patch('/info/:id', async (req, res) => {
			const id = req.params.id;
			const info = req.body;
			const filter = { _id: ObjectId(id) };
			const updatedDoc = {
				$set: info,
			};

			const result = await infoCollection.updateOne(filter, updatedDoc);
			res.send(result);
		});

		app.delete('/info/:id', async (req, res) => {
			const id = req.params.id;
			const filter = { _id: ObjectId(id) };
			const result = await infoCollection.deleteOne(filter);
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
