export const DASHBOARD = {
	PURCHASE_ORDER: ['支付宝', '微信', '银联二维码', '银行卡刷卡', '现金', '其他'],
	PIE_COLOR: ['#4DBBFF', '#9BEB5E', '#FF9C66', '#FF6000', '#FF80B9', '#BB7CF7'],
	LAST_HAND_REFRESH_TIME: 'lastHandRefreshTime',
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
		PASSENGER_FLOW_TYPE: {
			GENDER: 'gender',
			REGULAR: 'regular',
		},
	},
	TIME_INTERVAL: {
		HOUR: 60 * 60,
		DAY: 60 * 60 * 24,
	},
	TIME_TICKS: {
		HOUR: [
			'00:00',
			'02:00',
			'04:00',
			'06:00',
			'08:00',
			'10:00',
			'12:00',
			'14:00',
			'16:00',
			'18:00',
			'20:00',
			'22:00',
		],
		MONTH: ['1', '4', '7', '10', '13', '16', '19', '22', '25', '28', '31'],
	},
};
