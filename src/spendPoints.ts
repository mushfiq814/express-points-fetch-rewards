import { SpendingMetrics, Transaction } from "./types";

export const spendPoints = (points: number, transactions: Transaction[]): SpendingMetrics[] => {
	// sort compare function to compare by timestamp
	const compareByTimestamp = (t1: Transaction, t2: Transaction): number => {
		// convert both timestamps to date objects
		let d1 = new Date(t1.timestamp);
		let d2 = new Date(t2.timestamp);
		// swap if 1st date is greater than 2nd date, i.e. d1-d2 > 0
		return d1.getTime()-d2.getTime();
	}

	// sort transactions list by timestamp to count oldest transactions first
	transactions.sort(compareByTimestamp);

	// to store spending metrics
	let spending: SpendingMetrics[] = [];

	// loop through each transaction
	for (let i=0; i<transactions.length; i++) {
		// get payer and points for current transaction
		let currPayer = transactions[i].payer;
		let currPoints = transactions[i].points;

		// if we only require part of currPoints, update currPoints
		if (currPoints > points) currPoints = points;
		
		// decrement spending points by points from current transaction
		points -= currPoints;

		// check if current payer is already in spending list
		// this returns an index to the spending item
		let existingPayerIndex = spending.findIndex(s => s.payer == currPayer);

		// if payer exists in spending list, update their points
		if (existingPayerIndex > -1)
			spending[existingPayerIndex].points += currPoints;
		// otherwise, add current payer to spending
		else
			spending.push({ payer: currPayer, points: currPoints });

		// if all required spending points are available, end loop
		if (points <= 0) break;
	}

	// check if we ran out of points
	if (points > 0) console.log('not enough points!');

	// convert spending points to negative values
	spending.map(items => items.points *= -1);

	// return spending metrics
	return spending;
}
