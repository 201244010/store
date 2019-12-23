export const EXPIRE_TIME_TYPE = {
	ONE_MONTH: 1,
	HALF_A_YEAR: 2,
	ONE_YEAR: 3
};

export const SERVICE_TYPE = {
	'A08000075': {
		price:'69',
		isFree: true,
		type: EXPIRE_TIME_TYPE.HALF_A_YEAR,
		serviceTag: 1, // 1:7天云存储；2:30天云存储
	},
	'A08000076': {
		productNo:'A08000076',
		price:'119',
		isFree: false,
		type: EXPIRE_TIME_TYPE.ONE_YEAR,
		serviceTag: 1,

	},
	'A08000077': {
		price: '159',
		isFree: false,
		type: EXPIRE_TIME_TYPE.HALF_A_YEAR,
		serviceTag: 2,
	},
	'A08000078': {
		price:'299',
		isFree: false,
		type: EXPIRE_TIME_TYPE.ONE_YEAR,
		serviceTag: 2,
	},
};