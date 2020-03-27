/* 数据指标格式化公用函数 */

// return模式
export const RETURNModel = {
	join: 'join', // 返回字符串
	split: 'split', // 返回对象，数值拆分成对象的属性返回
};

// split模式时，返回的对象
export const ReturnResultSplit = {
	int: ''/* 整数部分 */, point: ''/* 小数点 */, float: ''/* 小数部分 */, percent: ''/* 百分号 */, unit: ''/* 单位 */,
};

/**
 * 精度处理
 * @param {Object} obj
 * @param {number} obj.value - 待处理的数值
 * @param {object} obj.precisionOption - 精度配置 precisionOption: {carryType, num}
 * @param {string} obj.returnType - return配置 split join
 * carryType - 进位规则： round四舍五入（默认），up 向上取，down 向下取
 * num - 取小数的位数
 * @returns {number|object} - obj:{ int:整数部分, point:小数点, float:小数部分 }
 */
export const precisionDeal = ({
	value,
	precisionOption,
	returnType,
}) => {
	const {
		carryType = 'round', // 取精度时的进位类型，round 四舍五入（默认），up 向上取，down 向下取
		num = 0, // 精度位数
	} = precisionOption;
	const returnModel = returnType || RETURNModel.join;

	let result = value;

	if (carryType === 'up') {
		// 向上取（不舍只入）
		result = Math.ceil(result * (10 ** num)) / (10 ** num);
	} else if (carryType === 'down') {
		// 向下取（只舍不入）
		result = Math.floor(result * (10 ** num)) / (10 ** num);
	}
	result = value.toFixed(num);

	if (returnModel === RETURNModel.split) {
		result = result.toString();
		let int = '';
		let point = '';
		let float = '';
		const pointIndex = result.indexOf('.');
		if (pointIndex === -1) {
			int = result;
			point = '';
			float = '';
		} else {
			int = result.slice(0, pointIndex);
			point = '.';
			float = result.slice(pointIndex + 1);
		}
		return {
			...ReturnResultSplit,
			int,
			point,
			float,
		};
	}

	return result;
};

/**
 * 分隔符处理
 * @param {Object} obj
 * @param {number} obj.value - 待处理的数值
 * @param {object} obj.separatorOption - 分隔配置
 * @param {string} obj.returnType - return配置 split join
 * separatorOption: {integerSeparator,intergerSplitNum,decimalSeparator,decimalSplitNum}
 * integerSeparator - 整数部分分隔符，intergerSplitNum - 整数部分分隔位数，
 * decimalSeparator - 小数部分分隔符，decimalSplitNum - 小数部分分隔位数
 * @returns {string}
 */
export const separatorDeal = ({
	value, // 待处理的数值
	separatorOption, // 分隔配置
	returnType,
}) => {
	const {
		integerSeparator = '',
		intergerSplitNum = 3,
		decimalSeparator = '',
		decimalSplitNum = 3,
	} = separatorOption;

	const returnModel = returnType || RETURNModel.join;

	if (!integerSeparator && !decimalSeparator) {
		return value;
	}

	const parts = value.toString().split('.'); // 分离数字的小数部分和整数部分

	if (integerSeparator && intergerSplitNum) {
		const intReg = new RegExp(`(\\d)(?=(\\d{${intergerSplitNum}})+(?!\\d))`, 'g');
		parts[0] = parts[0].replace(intReg, `$1${integerSeparator}`);
	}

	if (parts.length === 2 && decimalSeparator && decimalSplitNum) {
		const decReg = new RegExp(`(\\d)(?=(\\d{${decimalSplitNum}})+(?!\\d))`, 'g');
		parts[1] = parts[1].replace(decReg, `$1${decimalSeparator}`);
	}

	if (returnModel === RETURNModel.split) {
		return {
			...ReturnResultSplit,
			int: parts[0],
			point: parts.length === 2 ? '.' : '',
			float: parts.length === 2 ? parts[1] : '',
		};
	}
	return parts.join('.');
};

/**
 * 分割数值字符串 12.34% 12.34‰ 1,234.56%
 * @returns {obj} - { int, point, float, percent }
 */
export const splitString = (str) => {
	let int = ''; // 整数部分
	let point = ''; // 小数点
	let float = ''; // 小数部分
	let percent = ''; // 百分号

	const value = str.toString();

	let percentIndex = value.indexOf('%');
	if (percentIndex === -1) {
		percentIndex = value.indexOf('‰');
	}

	if (percentIndex === -1) {
		// 不是百分数
		percent = '';
	} else {
		percent = value.slice(percentIndex);
	}

	const pointIndex = value.indexOf('.');
	if (pointIndex === -1) {
		// 不是小数
		point = '';
		float = '';
		int = percentIndex === -1 ? value : value.slice(0, percentIndex);
	} else {
		point = '.';
		float = percentIndex === -1
			? value.slice(pointIndex + 1) : value.slice(pointIndex + 1, percentIndex);
		int = value.slice(0, pointIndex);
	}

	return {
		// ...ReturnResultSplit,
		int, // 整数部分
		point, // 小数点
		float, // 小数部分
		percent, // 百分号
	};
};
