import { Transaction, TransactionMetrics } from "./types";

/**
 * update transaction metrics with new transaction
 */
export const addTransaction = (
	newTransaction: Transaction,
	transactionMetrics: TransactionMetrics
): TransactionMetrics => {
	// add transaction to list of transactions
	transactionMetrics.transactions.push(newTransaction);

	// update total available points
	transactionMetrics.totalAvailablePoints += newTransaction.points;

	// check if currently added payer is already in total per payer list
	// this returns an index to the totalPerPayer list item
	let existingPayerIndex = transactionMetrics.totalPerPayer
		.findIndex(bal => bal.payer == newTransaction.payer);

	// if current payer is not in list
	if (existingPayerIndex < 0) {
		// create a new balance entry in list
		const currPayerBalance = {
			payer: newTransaction.payer,
			points: newTransaction.points,
		};
		// add entry to list
		transactionMetrics.totalPerPayer.push(currPayerBalance);
	} else {
		// otherwise, update the points of the current payer in the list
		transactionMetrics.totalPerPayer[existingPayerIndex].points += newTransaction.points;
	}

	return transactionMetrics;
}
