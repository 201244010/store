import { formatMessage } from 'umi/locale';

export const DATABOARD = {
	TIME_TYPE: {
		DAY: 1,
		WEEK: 2,
		MONTH: 3,
	},
	DATA_TYPE: {
		current: 1,
		history: 2,
	},
	UNIT_FREQUENCY: {
		1: formatMessage({ id: 'databoard.frequency.day.unit' }),
		2: formatMessage({ id: 'databoard.frequency.week.unit' }),
		3: formatMessage({ id: 'databoard.frequency.month.unit' }),
	},
	EARLY_LABEL_CURRENT: {
		1: formatMessage({ id: 'databoard.search.yesterday' }),
		2: formatMessage({ id: 'databoard.search.week.last' }),
		3: formatMessage({ id: 'databoard.search.month.last' }),
	},
	EARLY_LABEL_HISTORY: {
		1: formatMessage({ id: 'databoard.data.compare.yesterday' }),
		2: formatMessage({ id: 'databoard.data.compare.week' }),
		3: formatMessage({ id: 'databoard.data.compare.month' }),
	},
	FREQUENCY_TYPE: {
		1: 'day',
		2: 'week',
		3: 'month',
	},
	LABEL_TEXT: {
		passengerCount: formatMessage({ id: 'databoard.data.passenger' }),
		deviceCount: formatMessage({ id: 'databoard.device.totalCount' }),
		totalCount: formatMessage({ id: 'databoard.order.count' }),
		regularCount: formatMessage({ id: 'databoard.order.regularCount' }),
		totalAmount: formatMessage({ id: 'databoard.order.sales' }),
		enteringRate: formatMessage({ id: 'databoard.data.entering' }),
		transactionRate: formatMessage({ id: 'databoard.order.transactionRate' }),
		avgFrequency: formatMessage({ id: 'databoard.passenger.frequency' }),
		totalPassengerCount: formatMessage({ id: 'databoard.order.totalPassengerCount' }),
	},
	LINE_SIZE: 3,
};
