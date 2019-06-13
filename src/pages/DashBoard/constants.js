export const DASHBOARD = {
	QUERY_TYPE: {
		TOTAL_AMOUNT: 'getTotalAmount',
		TOTAL_COUNT: 'getTotalCount',
		TOTAL_REFUND: 'getRefundCount',
		AVG_UNIT: 'getAvgUnitSale',
	},
	SEARCH_TYPE: {
		RANGE: {
			FREE: 'free',
			TODAY: 'today',
			WEEK: 'week',
			MONTH: 'month',
		},
		TRADE_TIME: {
			AMOUNT: 'amount',
			COUNT: 'count',
		},
		PAYMENT_TYPE: {
			AMOUNT: 'amount',
			COUNT: 'count',
		},
	},
	TIME_INTERVAL: {
		HOUR: 60 * 60,
		DAY: 60 * 60 * 24,
	},
};
