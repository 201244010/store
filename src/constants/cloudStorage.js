export const EXPIRE_TIME_TYPE = {
	ONE_MONTH: 1,
	HALF_A_YEAR: 2,
	ONE_YEAR: 3
};

export const SERVICE_TYPE = {
	'YCC0002': {
		price:'69',
		isFree: true,
		type: EXPIRE_TIME_TYPE.HALF_A_YEAR,
		serviceType: 7,
	},
	'YCC0003': {
		productNo:'YCC0003',
		price:'119',
		isFree: false,
		type: EXPIRE_TIME_TYPE.ONE_YEAR,
		serviceType: 7,

	},
	'YCC0004': {
		price: '159',
		isFree: false,
		type: EXPIRE_TIME_TYPE.HALF_A_YEAR,
		serviceType: 30,
	},
	'YCC0005': {
		price:'299',
		isFree: false,
		type: EXPIRE_TIME_TYPE.ONE_YEAR,
		serviceType: 30,
	},
};