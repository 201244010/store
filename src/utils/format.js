import * as d3 from 'd3-format';
import { getLocale } from 'umi/locale';

import {
	RETURNModel, splitString, ReturnResultSplit,
} from './commonFormat';

/** 千位分隔并保留2位小数 */
const formatTo2floatWithComma = value => d3.format(',.2f')(value);

/** 保留2位小数 */
const formatTo2float = value => d3.format('.2f')(value);

/** 转百分数保留2位小数 */
const formatTo2floatPercent = value => d3.format('.2%')(value);

/** 千位分隔 */
const formatWithComma = value => d3.format(',')(value);

/**
 * 中文 数字达到万后换算为万，到亿后换算为亿，始终保留2位小数（eg:销售额，客单价）
 */
const formatFloatByMillionUnit = ({ value, returnType = RETURNModel.join }) => {
	let result = value;
	let unit = '';
	if (Math.abs(result) < 10000) {
		result = formatTo2float(result);
	} else if (Math.abs(result) >= 10000 && Math.abs(result) < 100000000) {
		result = formatTo2float(result / 10000);
		unit = '万';
	} else if (Math.abs(result) >= 100000000) {
		result = formatTo2float(result / 100000000);
		unit = '亿';
	}

	if (returnType === RETURNModel.split) {
		return {
			...splitString(result),
			unit,
		};
	}
	return `${result}${unit}`;
};

/**
 * 英文 整数部分千位分隔, 达到百万用m单位，始终保留2位小数（eg:销售额，客单价）
 */
const formatFloatWithComma = ({ value, returnType = RETURNModel.join }) => {
	let result = value;
	let unit = '';
	if (Math.abs(result) < 1000000) {
		result = formatTo2floatWithComma(result);
	} else if (Math.abs(result) >= 1000000) {
		result = formatTo2floatWithComma(result / 1000000);
		unit = 'm';
	}

	if (returnType === RETURNModel.split) {
		return {
			...splitString(result),
			unit,
		};
	}
	return `${result}${unit}`;
};

/**
 * 中文 数字达到万后换算为万，到亿后换算为亿，转换单位后显示小数点后两位（eg:客流流量、订单数、退款笔数，整数）
 */
const formatInterByMillionUnit = ({ value, returnType = RETURNModel.join }) => {
	let result = value;
	let unit = '';
	if (Math.abs(result) >= 10000 && Math.abs(result) < 100000000) {
		result = formatTo2float(result / 10000);
		unit = '万';
	} else if (Math.abs(result) >= 100000000) {
		result = formatTo2float(result / 100000000);
		unit = '亿';
	}

	if (returnType === RETURNModel.split) {
		return {
			...splitString(result),
			unit,
		};
	}
	return `${result}${unit}`;
};

/**
 * 英文 整数部分千位分隔, 达到百万用m单位，转换单位后显示小数点后两位（eg:客流流量、订单数、退款笔数，整数）
 */
const formatInterWithComma = ({ value, returnType = RETURNModel.join }) => {
	let result = value;
	let unit = '';
	if (Math.abs(result) < 1000000) {
		result = formatWithComma(result);
	} else if (Math.abs(result) >= 1000000) {
		result = formatTo2floatWithComma(result / 1000000);
		unit = 'm';
	}

	if (returnType === RETURNModel.split) {
		return {
			...ReturnResultSplit,
			...splitString(result),
			unit,
		};
	}
	return `${result}${unit}`;
};

/**
 * 输入[数值]和[单位]，往数值后追加单位。若数值为小数则保留1位，若为整数则不要小数位（eg:进店频率）
 * value:待格式化的数, returnType: join返回字符串 split返回对象{int:'', point:'', float:'', unit:''}
 */
const formatNumWithStr = ({ value, returnType = RETURNModel.join, unit }) => {
	let result = value;
	const str = value.toString();
	const decReg = /(\.0+)$/; // 小数点后都为0
	if (str.indexOf('.') === -1 || decReg.test(value.str)) {
		// 为整数
		result = result.toFixed(0);
	} else {
		// 为小数
		result = d3.format('.1f')(result);
	}

	if (returnType === RETURNModel.split) {
		return {
			...ReturnResultSplit,
			...splitString(result),
			unit,
		};
	}
	return `${result}${unit}`;
};

const language = getLocale();
const zhCN = 'zh-CN';
console.log('language=', language);
export const formater = {
	/**
	 * 销售额格式化 eg:销售额，客单价
	 * @param {number} obj.value - 待处理的数值
	 * @param {string} obj.returnType - return的类型：join返回字符串 split返回对象
	 * @returns {string|object}
	 * returnType: join返回字符串 split返回对象{int:''整数部分, point:''小数点, float:''小数部分, unit:''单位}
	 */
	saleMoneyFormat({ value, returnType }) {
		// 中文
		if (language === zhCN) {
			return formatFloatByMillionUnit({ value, returnType });
		}
		// 英文
		return formatFloatWithComma({ value, returnType });
	},

	/**
	 * 客流数格式化 eg:客流流量、订单数、退款笔数，整数
	 * @param {number} obj.value - 待处理的数值
	 * @param {string} obj.returnType - return的类型：join返回字符串 split返回对象
	 * @returns {string|object}
	 * returnType: join返回字符串 split返回对象{int:''整数部分, point:''小数点, float:''小数部分, unit:''单位}
	 */
	passengerNumFormat({ value, returnType }) {
		// 中文
		if (language === zhCN) {
			return formatInterByMillionUnit({ value, returnType });
		}
		// 英文
		return formatInterWithComma({ value, returnType });
	},

	/**
	 * 频率格式化，数值后追加频率单位。输入若为小数则保留1位，若为整数则不要小数位；（eg:到店频率）
	 * @param {number} obj.value - 待处理的数值
	 * @param {string} obj.returnType - return的类型：join返回字符串 split返回对象
	 * @returns {object}
	 * eg: join模式{ day: '1.2/day' } }
	 * split模式{ day: { int: '1', point: '.', float: '2', unit: '/day' } }
	 */
	frequencyFormat({ value, returnType }) {
		// 中文
		if (language === zhCN) {
			return {
				day: formatNumWithStr({ value, returnType, unit: '次/日' }),
				week: formatNumWithStr({ value, returnType, unit: '次/周' }),
				month: formatNumWithStr({ value, returnType, unit: '次/月' }),
			};
		}
		// 英文
		return {
			day: formatNumWithStr({ value, returnType, unit: '/day' }),
			week: formatNumWithStr({ value, returnType, unit: '/week' }),
			month: formatNumWithStr({ value, returnType, unit: '/month' }),
		};
	},

	/**
	 * 中文时显示原数值，英文时数值进行千位分隔（eg:排行榜）
	 * @returns {string}
	 */
	separateWhenEn(value) {
		// 中文
		if (language === zhCN) {
			return value;
		}
		// 英文
		return formatWithComma(value);
	},

	/**
	 * 进店率。数值换算成百分数，始终保留两位小数，如数值小于0.01%则使用千分，等于0显示0.00%（eg:转化率、进店率、环比）
	 * @param {number} obj.value - 待处理的数值
	 * @param {string} obj.returnType - return的类型：join返回字符串 split返回对象
	 * @returns {string|object}
	 * eg: join返回字符串0.01% split返回对象{int:'0', point:'.', float:'01', percent:'%'}
	 */
	formatFloatByPermile({ value, returnType = RETURNModel.join }) {
		let result = value;
		if (Math.abs(result * 100) >= 0.01 || result === 0) {
			result = formatTo2floatPercent(result);
		} else if (Math.abs(result) > 0 && Math.abs(result * 100) < 0.01) {
			result = `${(result * 1000).toFixed(2)}‰`;
		}

		if (returnType === RETURNModel.split) {
			return {
				...ReturnResultSplit,
				...splitString(result),
			};
		}
		return result;
	},

	/**
	 * 客流量占比。数值换算成百分数，大于1%取整，小于1%取两位小数，0显示0%（eg:客流量占比、客流路线占比）
	 * @param {number} obj.value - 待处理的数值
	 * @param {string} obj.returnType - return的类型：join返回字符串 split返回对象
	 * @returns {string|object}
	 * eg: join返回字符串1% split返回对象{int:'1', point:'', float:'', percent:'%'}
	 */
	formatFloatByPercent({ value, returnType = RETURNModel.join }) {
		let result = value;
		if (result === 0) {
			result = '0%';
		} else if (Math.abs(result * 100) >= 1) {
			result = d3.format('.0%')(value);
		} else if (Math.abs(result * 100) < 1) {
			result = formatTo2floatPercent(result);
		}

		if (returnType === RETURNModel.split) {
			return {
				...ReturnResultSplit,
				...splitString(result),
			};
		}
		return result;
	},
};
