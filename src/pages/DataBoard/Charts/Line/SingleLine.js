import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
// import moment from 'moment';
import { DataView } from '@antv/data-set';
import LinePoint from './BaseLine';
import { DATABOARD } from '../constants';

const { TIME_TYPE } = DATABOARD;

// 基于时间维度（小时，日，月）的折线图

const valToTime = val => {
	// 1->00:00 2->01:00
	const t = parseInt(val, 10);
	return t > 9 ? `${t}:00` : `0${t}:00`;
};

const latestDataSuppl = (data, timeType) => {
	// return data;
	let dataPoint;
	const ponitSuppl = [];
	if (timeType === TIME_TYPE.DAY) {
		dataPoint = 24;
	}
	if (timeType === TIME_TYPE.WEEK) {
		dataPoint = 7;
	}
	if (timeType === TIME_TYPE.MONTH) {
		dataPoint = 31;
	}

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
		console.log('wx:', dataGroupByName);
		Object.keys(dataGroupByName).forEach(name => {
			const dataList = dataGroupByName[name];
			if (timeType === TIME_TYPE.DAY) {
				// 日维度补0点
				ponitSuppl.push({ name, time: 0, value: 0 });
			}
			if (dataList.length < dataPoint) {
				// 实时数据补上最后一个点
				ponitSuppl.push({ name, time: dataPoint });
			}
		});
	} else {
		// eslint-disable-next-line no-lonely-if
		if (timeType === TIME_TYPE.DAY) {
			// 日维度补0点
			ponitSuppl.push({ time: 0, value: 0 });
		}
		if (data.length < dataPoint) {
			// 实时数据补上最后一个点
			ponitSuppl.push({ time: dataPoint });
		}
	}
	return [...data, ...ponitSuppl];
};

export default class Line extends Component {
	formatToolTipAxisX = (time, timeType) => {
		if (timeType === TIME_TYPE.DAY) {
			if (time === 0) {
				return `时间：${valToTime(time)}`;
			}
			return `时间：${valToTime(time - 1)} - ${valToTime(time)}`;
		}
		return `时间：${time} convert 几月几号 缺周数，月份`;
	};

	formatXLabel = (val, timeType) => {
		if (val < 0) {
			return '';
		}
		if (timeType === TIME_TYPE.DAY) {
			const t = parseInt(val, 10);
			return t > 9 ? `${t}:00` : `0${t}:00`;
		}
		if (timeType === TIME_TYPE.WEEK) {
			const t = parseInt(val, 10) + 1;
			return formatMessage({ id: `common.week.${t}` });
		}
		if (timeType === TIME_TYPE.MONTH) {
			const t = parseInt(val, 10) + 1;
			return t;
			// return moment()
			// 	.startOf('month')
			// 	.add(val - 1, 'day')
			// 	.format('MM/DD');
		}
		return val;
	};

	foramtData = (data, timeType) => {
		// time修正
		const dv = new DataView();
		const dataSuppl = latestDataSuppl(data, timeType);
		if (timeType === TIME_TYPE.DAY) {
			dataSuppl.forEach(item => {
				item.time += 1;
			});
		}
		dv.source(dataSuppl).transform({
			type: 'map',
			callback(row) {
				// 数据从0开始
				row.time -= 1;
				return row;
			},
		});
		console.log('wx:----after foramtData', dv);
		return dv;
	};

	barWidthFit = timeType => {
		if (timeType === TIME_TYPE.DAY) {
			return 5;
		}
		if (timeType === TIME_TYPE.WEEK) {
			return undefined;
		}
		if (timeType === TIME_TYPE.MONTH) {
			return 5;
		}
		return undefined;
	};

	render() {
		const { formatXLabel, formatToolTipAxisX, foramtData, barWidthFit } = this;

		const {
			timeType = 1,
			data = [],
			area = false,
			areaColor = ['l (90) 0:rgba(75,122,250, 1) 1:rgba(75,122,250,0.1)'],
			lineColor = ['value', 'rgb(75,122,250)'],
			type = 'lineStack',
			legend = {},
			innerTitle: title,
			lineTooltip = [
				'name*time*value',
				(name, labelX, value) =>
					// array
					({
						value,
						timeRange: formatToolTipAxisX(labelX, timeType),
						name,
					}),
			],
			chartScale = {},
			crosshairs = {},
			lineActive,
			chartHeight,
		} = this.props;

		let { lineSize } = this.props;

		const dataForamtted = foramtData(data, timeType);
		if (type === 'interval') {
			lineSize = barWidthFit(timeType);
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
								formatter: val => formatXLabel(val, timeType),
							},
						},
						y: {
							name: 'value',
							// label: {
							// 	formatter: val => `${val}%`,
							// },
						},
					},
					tooltip: {
						shared: false,
						// useHtml: true,
						containerTpl: `<div class="g2-tooltip">
						    <ul class="g2-tooltip-list data-chart-list"></ul>
						 </div>`,
						itemTpl: `<li class="detail" data-index={index}>
						    <p class="item item__name">{name}</p>
						    <p class="item item__value">{value}</p>
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
