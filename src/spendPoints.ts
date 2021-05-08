import { Balance, SpendingMetrics, Transaction } from "./types";

export const spendPoints = (pointsRemaining: number, transactions: Transaction[]): SpendingMetrics[] => {
	// get a list of all payers in current transactions list
	const payers = transactions.map(trans => trans.payer)
	// convert to Set (and back to array) to remove duplicates
	const uniquePayers: string[] = [...new Set(payers)];

	let payerBalance: Balance[] = [];

	// go through each unique payer
	uniquePayers.forEach(payer => {
		let onlyThisPayersPoints = transactions
			// filter out only this payer's transactions
			.filter(trans => trans.payer === payer)
			// retrieve only the points
			.map(trans => trans.points)
			// accumulate all points
			.reduce((a,c) => a + c);

		payerBalance.push({ payer: payer, points: onlyThisPayersPoints });
	});

	console.log('payerBalance', payerBalance);

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
	transactions.forEach(transaction => {
		// get payer and points for current transaction
		let currPayer = transaction.payer;
		let currPoints = transaction.points;

		// update currPoints if we have more points from payer than we require
		if (currPoints > pointsRemaining) currPoints = pointsRemaining;
		
		// check current payer available points
		let currPayerBalance = payerBalance.filter(p => p.payer == currPayer);
		let availablePoints = currPayerBalance.length
			? currPayerBalance[0].points
			: 0;

		// check if current payer is already in spending list
		// this returns an index to the spending item
		let existingPayerIndex = spending.findIndex(s => s.payer == currPayer);

		let maxReached = existingPayerIndex > -1
			? spending[existingPayerIndex].maxReached
			: false;
		let newPoints = 0;
		let spentThisTime = 0;
		// if payer exists in spending list, update their points
		if (existingPayerIndex > -1) {
			if (!spending[existingPayerIndex].maxReached) {
				newPoints = spending[existingPayerIndex].points + currPoints;
				spentThisTime = currPoints;
				if (newPoints > availablePoints) {
					newPoints = availablePoints;
					spentThisTime = newPoints;
					maxReached = true;
				}
				spending[existingPayerIndex].points = newPoints;
			}
		}

		// otherwise, add current payer to spending
		else {
			newPoints = currPoints;
			if (newPoints > availablePoints) {
				newPoints = availablePoints;
				maxReached = true;
			}
			spending.push({
				payer: currPayer,
				points: newPoints,
				maxReached: maxReached
			});
			spentThisTime = newPoints;
		}

		// decrement spending points
		pointsRemaining -= spentThisTime;

		console.log('spending', spending);
		console.log('points', pointsRemaining);

		// if all required spending points are available, end loop
		if (pointsRemaining <= 0) return;
	})

	// check if we ran out of points
	if (pointsRemaining > 0) console.log('not enough points!');

	// convert spending points to negative values
	spending.map(items => items.points *= -1);

	// return spending metrics
	return spending;
}
