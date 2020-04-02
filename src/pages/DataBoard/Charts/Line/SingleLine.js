import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { DataView } from '@antv/data-set';
import LinePoint from './BaseLine';
import { DATABOARD } from '../constants';

const { TIME_TYPE } = DATABOARD;
const localMoment = moment();
localMoment.locale('zh-cn');

// 基于时间维度（小时，日，月）的折线图

const THICK_INTERVAL_TIME = {
	[TIME_TYPE.DAY]: 2,
	[TIME_TYPE.WEEK]: 1,
	[TIME_TYPE.MONTH]: 2,
};

const BAR_WIDTH = {
	[TIME_TYPE.DAY]: 12,
	[TIME_TYPE.WEEK]: 20,
	[TIME_TYPE.MONTH]: 12,
};

const THICK_INTERVAL_VALUE = 6;

const valToTime = val => {
	// 1->00:00 2->01:00
	const t = parseInt(val, 10);
	return t > 9 ? `${t}:00` : `${t}:00`;
};

const thickTimeMax = (timeType, chartType) => {
	// day: 24->24 week 7->6 month: 31->30
	let max;
	if (timeType === TIME_TYPE.DAY) {
		max = 24;
	}
	if (timeType === TIME_TYPE.WEEK) {
		max = 6;
	}
	if (timeType === TIME_TYPE.MONTH) {
		if (chartType === 'weekFrequency') {
			max = 4;
		} else {
			max = localMoment.endOf('month').format('D') - 1;
		}
	}
	return max;
};

// 只有一个数据点时，补全时间轴最大范围内的点
const latestDataSuppl = (data, timeType) => {
	// return data;
	// let dataPoint;
	const ponitSuppl = [];
	// if (timeType === TIME_TYPE.DAY) {
	// 	dataPoint = 24;
	// }
	// if (timeType === TIME_TYPE.WEEK) {
	// 	dataPoint = 7;
	// }
	// if (timeType === TIME_TYPE.MONTH) {
	// 	dataPoint = moment()
	// 		.endOf('month')
	// 		.format('D');
	// }

	const nameList = [];
	data.forEach(item => {
		const { name } = item;
		if (name) {
			nameList.push(name);
		}
	});

	if (nameList.length > 0) {
		const dataGroupByName = {};
		data.forEach(item => {
			const { name } = item;
			dataGroupByName[name]
				? dataGroupByName[name].push(item)
				: (dataGroupByName[name] = [item]);
		});
		// console.log('wx:', dataGroupByName);
		Object.keys(dataGroupByName).forEach(name => {
			// const dataList = dataGroupByName[name];
			if (timeType === TIME_TYPE.DAY) {
				// 日维度补0点
				ponitSuppl.push({ name, time: 0, value: 0 });
			}
			// if (dataList.length < dataPoint) {
			// 	// 实时数据补上最后一个点
			// 	ponitSuppl.push({ name, time: dataPoint });
			// }
		});
	} else {
		// eslint-disable-next-line no-lonely-if
		if (timeType === TIME_TYPE.DAY) {
			// 日维度补0点
			ponitSuppl.push({ time: 0, value: 0 });
		}
		// if (data.length < dataPoint) {
		// 	// 实时数据补上最后一个点
		// 	ponitSuppl.push({ time: dataPoint });
		// }
	}
	return [...data, ...ponitSuppl];
};

// 客群周到店频次分析
const formatToolTipTime = (time, timeFormat) => {
	// time: 0,1,2,3,4
	const startTime = moment(timeFormat).format('MM.DD');
	let endTime;
	if (time === 0) {
		endTime = localMoment
			.startOf('month')
			.endOf('week')
			.format('MM.DD');
	} else {
		endTime = moment(timeFormat).add(7, 'days');
		const duration = moment().endOf('month') - endTime;
		// if (duration < 0 || time ===4) {
		if (duration < 0) {
			// 一周后时间超出月末时间
			endTime = moment().endOf('month');
		}
		endTime = endTime.format('MM.DD');
	}
	return `${formatMessage({ id: 'databoard.time' })}：${startTime}-${endTime}`;
};

export default class Line extends Component {
	// toopTip内· 时间： x-x
	formatToolTipAxisX = (time, timeType, name, timeFormat) => {
		if (timeType === TIME_TYPE.DAY) {
			if (time === 0) {
				return `${formatMessage({ id: 'databoard.time' })}：${valToTime(time)}`;
			}
			return `${formatMessage({ id: 'databoard.time' })}：${valToTime(
				time - 1
			)} - ${valToTime(time)}`;
		}
		if (timeType === TIME_TYPE.WEEK) {
			return `${formatMessage({ id: 'databoard.time' })}：${localMoment
				.startOf('week')
				.add(time, 'day')
				.format('MM.DD')}`;
		}
		if (timeType === TIME_TYPE.MONTH) {
			if (name === 'customerFrequency') {
				localMoment.startOf('month');
				return formatToolTipTime(time, timeFormat);
			}
			return `${formatMessage({ id: 'databoard.time' })}：${localMoment
				.startOf('month')
				.add(time, 'day')
				.format('MM.DD')}`;
		}
		return time;
	};

	// toopTip内· 标题
	formatToolTipName = name => formatMessage({ id: `databoard.data.${name}` });

	// x轴刻度文本
	formatXLabel = (val, timeType, chartType) => {
		if (val < 0) {
			return '';
		}
		if (timeType === TIME_TYPE.DAY) {
			const t = parseInt(val, 10);
			return t > 9 ? `${t}:00` : `${t}:00`;
		}
		if (timeType === TIME_TYPE.WEEK) {
			const t = parseInt(val, 10) + 1;
			return formatMessage({ id: `common.week.${t}` });
		}
		if (timeType === TIME_TYPE.MONTH) {
			if (chartType === 'weekFrequency') {
				const t = parseInt(val, 10) + 1;
				return formatMessage({ id: `databoard.top.time.month.week.${t}` });
			}
			const t = parseInt(val, 10) + 1;
			return t;
			// return moment()
			// 	.startOf('month')
			// 	.add(val - 1, 'day')
			// 	.format('MM/DD');
		}
		return '';
	};

	/* 对处理的x轴坐标进行调整，数据从x轴原点开始绘制。
	 {x:0,y:value},{x:1,y:value} */

	foramtData = (data, timeType, chartType) => {
		// time修正
		const dv = new DataView();
		const dataSuppl = latestDataSuppl(data, timeType, chartType);
		// if (timeType === TIME_TYPE.DAY) {
		// 	dataSuppl.forEach(item => {
		// 		item.time += 1;
		// 	});
		// }
		dv.source(dataSuppl).transform({
			type: 'map',
			callback(row) {
				// 数据从0开始
				if (timeType === TIME_TYPE.DAY) return row;
				row.time -= 1;
				return row;
			},
		});
		// console.log('wx:----after foramtData', dv);
		return dv;
	};

	render() {
		const { formatToolTipAxisX, foramtData, formatToolTipName } = this;

		const {
			timeType = 1,
			chartType = 'value',
			data = [],
			area = false,
			areaColor = ['l (90) 0:rgba(75,122,250, 1) 1:rgba(75,122,250,0.1)'],
			lineColor = ['value', 'rgb(75,122,250)'],
			type = 'lineStack',
			legend = {},
			innerTitle: title,
			formatToolTipValue = val => val,
			lineTooltip = [
				'name*time*value*timeFormat',
				(name, labelX, value, timeFormat) => {
					const valString = formatToolTipValue(value);
					const valReg = /^\d*.?\d+(?=\D+$)/;
					const unitReg = /(?<=\d*.?\d+)\D+$/;
					let val = valString;
					let unit = '';
					if (typeof valString === 'string') {
						val = valString.match(valReg) ? valString.match(valReg)[0] : valString;
						unit = valString.match(unitReg) ? valString.match(unitReg)[0] : '';
					}
					// array
					return {
						value: val,
						timeRange: formatToolTipAxisX(labelX, timeType, name, timeFormat),
						name: formatToolTipName(name),
						unit,
					};
				},
			],
			crosshairs = {},
			lineActive,
			chartHeight,
			// eslint-disable-next-line no-shadow
			formatYLabel = (val, chartType) => {
				if (chartType === 'rate') {
					return `${val}%`;
				}
				return val;
			},
			formatXLabel = this.formatXLabel,
		} = this.props;

		let { lineSize, chartScale = {} } = this.props;
		const dataForamtted = foramtData(data, timeType, chartType);

		// X轴为时间 调整轴标签间距
		chartScale = {
			...chartScale,
			time: {
				type: 'linear',
				nice: false,
				min: 0,
				tickInterval: THICK_INTERVAL_TIME[timeType],
				max: thickTimeMax(timeType, chartType),
			},
			value: {
				type: 'linear',
				nice: true,
				tickCount: THICK_INTERVAL_VALUE,
				// range: [0.09, 0.91],
			},
		};
		// 柱状图
		if (type === 'interval') {
			lineSize = BAR_WIDTH[timeType];
			chartScale = {
				time: {
					type: 'linear',
					nice: false,
					range: [0.05, 0.95],
					tickInterval: THICK_INTERVAL_TIME[timeType],
					max: thickTimeMax(timeType, chartType),
					// tickCount: barAmout,
				},
				value: {
					type: 'linear',
					nice: true,
					tickCount: THICK_INTERVAL_VALUE,
					// range: [0.09, 0.91],
				},
			};
		}
		// 月维度时以周为维度
		if (chartType === 'weekFrequency') {
			chartScale.time.tickInterval = 1;
		}

		return (
			<LinePoint
				{...{
					forceFit: true,
					data: dataForamtted,
					scale: chartScale,
					axis: {
						x: {
							name: 'time',
							label: {
								formatter: val => formatXLabel(val, timeType, chartType),
							},
						},
						y: {
							name: 'value',
							label: {
								formatter: val => formatYLabel(val, chartType),
							},
						},
					},
					tooltip: {
						shared: false,
						useHtml: true,
						containerTpl: `<div class="g2-tooltip">
						    <ul class="g2-tooltip-list data-chart-list"></ul>
						 </div>`,
						itemTpl: `<li class="detail" data-index={index}>
						    <p class="item item__name">{name}</p>
						    <p class="item item__value">{value}<span class="unit">{unit}</span></p>
						    <p class="item item__labelX">{timeRange}</p>
						</li>`,
						crosshairs,
					},
					line: {
						type,
						position: 'time*value',
						size: lineSize,
						color: lineColor,
						shape: '',
						tooltip: lineTooltip,
						lineActive,
					},
					area,
					areaColor,
					legend,
					title,
					height: chartHeight,
				}}
			/>
		);
	}
}
