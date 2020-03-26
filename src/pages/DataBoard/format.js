// 保留一位，为整数时只保留整数
export const formatFrequency = (value) => Number(value.toFixed(1));

// 小于1%保留两位 大于等于1%保留整数
export const formatPassengerRate = (value) => {
	const percent = value * 100;
	if(percent > 1) {
		return percent.toFixed(0);
	}
	if(percent && percent < 1) {
		return percent.toFixed(2);
	}
	return 0;
};

// 始终保留两位
export const formatNormalRate = (value) => value.toFixed(2);

// 销售额，销售量，大于1万/1亿，则显示单位，保留两位
export const formatCount = (value) => {
	if(value >= 100000000) {
		return {
			value: (value / 10000).toFixed(2),
			unit: 'b',
		};
	}
	if(value >= 10000 && value < 100000000) {
		return {
			value: (value / 10000).toFixed(2),
			unit: 'm',
		};
	}
	return {
		value,
		unit: '',
	};
};