import { Transaction, TransactionMetrics } from './types';
import { addTransaction } from './addTransaction';
import { spendPoints } from './spendPoints';

// express
import express from 'express';
const app = express();
app.use(express.json());

// information related to transactions
let transactionMetrics: TransactionMetrics = {
	transactions: [],         // keep transactions stored in memory
	totalAvailablePoints: 0,  // total points earned by user so far
	totalPerPayer: []         // points grouped by payers
};

// default endpoint
app.get('/', (_, res) => res.send('Hello World'));

// view transactions
app.get('/transactions', (_, res) => res.send(transactionMetrics.transactions));

// add transactions
app.post('/transactions', (req, res) => {
	// create new transaction object from request body
	const newTransaction: Transaction = {
		payer: req.body.payer,
		points: req.body.points,
		// if timestamp is not given, default to current datetime
		timestamp: req.body.timestamp ? req.body.timestamp : new Date(),
	}

	// update transaction metrics with new transaction info
	transactionMetrics = addTransaction(newTransaction, transactionMetrics);

	// send newly created transaction as response
	res.send(newTransaction);
})

// spend points
app.post('/spend', (req, res) => {
	// get amount of points to spend from request body
	const pointsToSpend = req.body.points;

	// call spendPoints calculation function
	const spendingResult = spendPoints(pointsToSpend, transactionMetrics);

	// calculate spending metrics based on points and transactions so far
	const spendingMetrics = spendingResult.spending;
	// update the new transaction metrics state
	transactionMetrics = spendingResult.transactionMetrics;

	// check if spending metrics is empty
	// NOTE: I am not entirely sure what error status code to send here.
	// currently I am sending 417 Expectation Failed
	if (!spendingMetrics.length) {
		res.status(417).send({
			code: 417,
			message: 'insufficient points'
		})
	} else {
		// otherwise send spending metrics as response
		res.send(spendingMetrics);
	}
})

// check balance
app.get('/balance', (_, res) => {
	// gather current balance and convert to payer: points format
	const balance = transactionMetrics.totalPerPayer.map(({ payer, points }) => {
		// not entirely sure how to avoid using `any` here
		// since required output has non unique keys
		let n: any = {};
		// assign points under new key with id `payer`
		n[payer] = points;
		// return the new object and store inside balance
		return n;
	});

	// send current balance as response
	res.send(balance);
})

// define port value for either process environment
// or development environment (localhost)
const port = process.env.port || 3000;

// start express server at defined port
app.listen(port, () => console.log(`Server started on port ${port}`));
