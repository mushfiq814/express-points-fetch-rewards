import { Transaction } from './types';
import { spendPoints } from './spendPoints';
import express from 'express';
const app = express();
app.use(express.json());

const transactions: Transaction[] = [];

// default endpoint
app.get('/', (_, res) => {
	res.send('Hello World');
});

// view transactions
app.get('/transactions', (_, res) => {
	res.send(transactions);
})

// add transactions
app.post('/transactions', (req, res) => {
	// create transaction object from request body
	const transaction: Transaction = {
		payer: req.body.payer,
		points: req.body.points,
		timestamp: req.body.timestamp,
	}

	// add transaction to list of transactions
	transactions.push(transaction);

	// send newly created transaction as response
	res.send(transaction);
})

// spend points
app.post('/spend', (req, res) => {
	// get amount of points to spend from request body
	const points = req.body.points;

	// calculate spending metrics based on points and transactions so far
	const spendingMetrics = spendPoints(points, transactions);

	res.send(spendingMetrics);
})

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
