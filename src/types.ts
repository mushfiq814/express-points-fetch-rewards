export interface Transaction {
	payer: string,
	points: number,
	timestamp: string
}

export interface SpendingMetrics {
	payer: string,
	points: number,
}
