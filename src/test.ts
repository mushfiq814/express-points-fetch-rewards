import { spendPoints } from './spendPoints';
import { Transaction } from './types';

// const transactions: Transaction[] = [
// 	{ "payer": "DANNON",       "points": 1000,  "timestamp": "2020-11-02T14:00:00Z" },
// 	{ "payer": "UNILEVER",     "points": 200,   "timestamp": "2020-10-31T11:00:00Z" },
// 	{ "payer": "DANNON",       "points": -200,  "timestamp": "2020-10-31T15:00:00Z" },
// 	{ "payer": "MILLER COORS", "points": 10000, "timestamp": "2020-11-01T14:00:00Z" },
// 	{ "payer": "DANNON",       "points": 300,   "timestamp": "2020-10-31T10:00:00Z" },
// ];
// const result = spendPoints(5000, transactions);

const transactions: Transaction[] = [
	{ "payer": "A", "points":   300, "timestamp": "2021-05-07T14:00:00Z" },
	{ "payer": "A", "points":   200, "timestamp": "2021-05-07T15:00:00Z" },
	{ "payer": "B", "points":  1000, "timestamp": "2021-05-07T16:00:00Z" },
	{ "payer": "C", "points":  2000, "timestamp": "2021-05-07T17:00:00Z" },
	{ "payer": "A", "points":  -400, "timestamp": "2021-05-07T18:00:00Z" },
	{ "payer": "C", "points":  -800, "timestamp": "2021-05-07T19:00:00Z" },
];
const result = spendPoints(400, transactions);

console.log(result);

