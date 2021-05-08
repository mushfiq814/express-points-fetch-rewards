import {
	Balance,
	SpendingMetrics,
	Transaction,
	TransactionMetrics
} from "./types";

/**
 * calculate spending balance based on points to spend and
 * current transactionMetrics
 */
export const spendPoints = (
	pointsRemaining: number,
	transactionMetrics: TransactionMetrics
): { // define return signature
	spending: Balance[],
	transactionMetrics: TransactionMetrics
} => {

	// gather fields from transaction metrics
	const transactions = transactionMetrics.transactions;
	const totalPerPayer = transactionMetrics.totalPerPayer;
	const totalAvailablePoints = transactionMetrics.totalAvailablePoints;

	// if sufficient points are not available, return with no result
	if (pointsRemaining > totalAvailablePoints)
		return { spending: [], transactionMetrics: transactionMetrics };

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
	let spendingMetrics: SpendingMetrics[] = [];

	// loop through each transaction
	for (let i=0; i<transactions.length; i++) {
		// get payer and points for current transaction
		let currPayer = transactions[i].payer;
		let currPoints = transactions[i].points;

		// update currPoints if we have more points from payer than we require
		if (currPoints > pointsRemaining) currPoints = pointsRemaining;
		
		// check current payer available points
		let currPayerBalance = totalPerPayer.filter(p => p.payer == currPayer);
		let availablePoints = currPayerBalance.length
			? currPayerBalance[0].points
			: 0;

		// check if current payer is already in spending list
		// this returns an index to the spending item
		let existingPayerIndex =
			spendingMetrics.findIndex(s => s.payer == currPayer);

		// update max reached flag if payer points are less
		// than what curr points balance indicates
		let maxReached = availablePoints < currPoints;

		// update how much was spent this loop
		let spentThisTime = maxReached ? availablePoints : currPoints;

		// if it's a new payer, add them to spending metrics
		if (existingPayerIndex < 0) {
			// append to spending metrics with relevant data
			spendingMetrics.push({
				payer: currPayer,
				points: spentThisTime,
				maxReached: maxReached
			});
		}

		// otherwise, if payer exists in spending list and if not already reached
		// max points for payer, update their points
		else if (existingPayerIndex > -1
			&& !spendingMetrics[existingPayerIndex].maxReached) {

			// calculate new points for this payer
			const newPoints = maxReached
				// if max has been reached, we can only still spend available points
				? availablePoints
				// otherwise, increment by however much we decide to spend this time
				: spendingMetrics[existingPayerIndex].points + spentThisTime;

			spendingMetrics[existingPayerIndex].points = newPoints;
		}

		// otherwise, no points were spent this loop
		else spentThisTime = 0;

		// decrement spending points by amount spent this loop
		pointsRemaining -= spentThisTime;

		// if all required spending points are available and have been added to
		// spending list, end loop
		if (pointsRemaining <= 0) break;
	}

	// if we ran out of points at end of traversing through transactions,
	// then return with empty result
	if (pointsRemaining > 0)
		return { spending: [], transactionMetrics: transactionMetrics };

	// use object destructuring to remove maxReached from spendingMetrics for
	// final output
	let spending = spendingMetrics.map(({ maxReached, ...rest }) => rest);

	// convert spending points to negative values
	spending.map(items => items.points *= -1);

	// remove entries from spending if they contain 0 points
	// NOTE: I am not sure if this is a requirement,
	// this can easily be reverted if not
	spending = spending.filter(s => s.points != 0);

	// reduce points from transactionMetrics by the amounts in spending
	spending.forEach(sb => {
		// go through each payer totals and compare
		for (let i=0; i<totalPerPayer.length; i++) {
			// if the payer is found in the list, update the new balance and
			// break out of loop
			if (totalPerPayer[i].payer === sb.payer) {
				totalPerPayer[i].points += sb.points;
				break;
			}
		}
	});

	// update transactionMetrics with new totalPerPayer
	transactionMetrics.totalPerPayer = totalPerPayer;

	// return spending metrics
	return { spending, transactionMetrics };
}

