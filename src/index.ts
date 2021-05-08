import { Transaction } from './types';
import express from 'express';
const app = express();

const transactions: Transaction[] = [];

// default endpoint
app.get('/', (req, res) => {
	res.send('Hello World');
});

// view transactions
app.get('/transactions', (req, res) => {
	res.send(transactions);
})

// add transactions
app.post('/transactions', (req, res) => {
	// create transaction object
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

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
