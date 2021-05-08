import { spendPoints } from './spendPoints';
import { Balance, TransactionMetrics } from './types';

// lodash is used for checking results with expected output
import _ from 'lodash';

// test data type
interface SpendPointsTest {
	points: number,
	transactionMetrics: TransactionMetrics,
	output: Balance[]
}

const tests: SpendPointsTest[] = [
	{
		points: 5000,
		transactionMetrics: {
			transactions: [
				{ "payer": "DANNON",       "points": 1000,  "timestamp": "2020-11-02T14:00:00Z" },
				{ "payer": "UNILEVER",     "points": 200,   "timestamp": "2020-10-31T11:00:00Z" },
				{ "payer": "DANNON",       "points": -200,  "timestamp": "2020-10-31T15:00:00Z" },
				{ "payer": "MILLER COORS", "points": 10000, "timestamp": "2020-11-01T14:00:00Z" },
				{ "payer": "DANNON",       "points": 300,   "timestamp": "2020-10-31T10:00:00Z" },
			],
			totalAvailablePoints: 11300,
			totalPerPayer: [
				{ payer: 'DANNON', points: 1100 },
				{ payer: 'UNILEVER', points: 200 },
				{ payer: 'MILLER COORS', points: 10000 }
			]
		},
		output: [
			{ payer: 'DANNON', points: -100 },
			{ payer: 'UNILEVER', points: -200 },
			{ payer: 'MILLER COORS', points: -4700 }
		]
	},
	{
		points: 400,
		transactionMetrics: {
			transactions: [
				{ "payer": "A", "points":  300, "timestamp": "2021-05-07T14:00:00Z" },
				{ "payer": "A", "points":  200, "timestamp": "2021-05-07T15:00:00Z" },
				{ "payer": "B", "points": 1000, "timestamp": "2021-05-07T16:00:00Z" },
				{ "payer": "C", "points": 2000, "timestamp": "2021-05-07T17:00:00Z" },
				{ "payer": "A", "points": -400, "timestamp": "2021-05-07T18:00:00Z" },
				{ "payer": "C", "points": -800, "timestamp": "2021-05-07T19:00:00Z" }
			],
			totalAvailablePoints: 2300,
			totalPerPayer: [
				{ payer: 'A', points: 100 },
				{ payer: 'B', points: 1000 },
				{ payer: 'C', points: 1200 }
			]
		},
		output: [
			{ payer: 'A', points: -100 },
			{ payer: 'B', points: -300 }
		]
	}
];

// run all tests
tests.forEach(test => {
	// use lodash to check whether result is same as expected output
	if (_.isEqual(
		spendPoints(test.points, test.transactionMetrics),
		test.output
	)) console.log('PASSED');

	// otherwise, failure
	else console.log('FAILED');
})

