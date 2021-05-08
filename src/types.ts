export interface Balance {
	payer: string,
	points: number,
}

export interface Transaction extends Balance {
	timestamp: string,
}

export interface SpendingMetrics extends Balance {
	maxReached: boolean,
}

export interface TransactionMetrics {
	transactions: Transaction[],
	totalAvailablePoints: number,
	totalPerPayer: Balance[]
}
