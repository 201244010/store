import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { DataView } from '@antv/data-set';
import { DATABOARD } from '@/pages/DataBoard/Charts/constants';
import LinePoint from '@/pages/DataBoard/Charts/Line/BaseLine';

const { TIME_TYPE } = DATABOARD;

// 基于时间维度（小时，日，月）的折线图

const valToTime = val => {
	// 1->00:00 2->01:00
	const t = parseInt(val, 10);
	return t > 9 ? `${t}:00` : `0${t}:00`;
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

const latestDataSuppl = (data, timeType) => {
	// return data;
	const ponitSuppl = [];

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
			if (timeType === TIME_TYPE.DAY) {
				// 日维度补0点
				ponitSuppl.push({ name, time: 0, value: 0 });
			}
		});
	} else {
		// eslint-disable-next-line no-lonely-if
		if (timeType === TIME_TYPE.DAY) {
			// 日维度补0点
			ponitSuppl.push({ time: 0, value: 0 });
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
			return `时间：${valToTime(0)} - ${valToTime(time)}`;
		}
		if (timeType === TIME_TYPE.WEEK) {
			return `时间：${moment()
				.startOf('week')
				.add(time, 'day')
				.format('MM.DD')}`;
		}
		if (timeType === TIME_TYPE.MONTH) {
			return `时间：${moment()
				.startOf('month')
				.add(time, 'day')
				.format('MM.DD')}`;
		}
		return time;
	};

	formatToolTipName = name => formatMessage({ id: `databoard.data.${name}` });

	formatXLabel = (val, timeType) => {
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
		// console.log('wx:----after foramtData', dv);
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
		const {
			formatXLabel,
			formatToolTipAxisX,
			foramtData,
			barWidthFit,
			formatToolTipName,
		} = this;

		const {
			timeType = 1,
			data = [],
			area = false,
			areaColor = ['l (90) 0:rgba(75,122,250, 1) 1:rgba(75,122,250,0.1)'],
			lineColor = ['value', 'rgb(75,122,250)'],
			type = 'lineStack',
			legend = {},
			innerTitle: title,
			formatToolTipValue = val => val,
			lineTooltip = [
				'name*time*value',
				(name, labelX, value) => {
					const valString = formatToolTipValue(value);
					const valReg = /^\d*\.?\d*/;
					const unitReg = /\D+$/;
					let val = valString;
					let unit = '';
					if (typeof valString === 'string') {
						val = valString.match(valReg) ? valString.match(valReg)[0] : valString;
						unit = valString.match(unitReg) ? valString.match(unitReg)[0] : '';
					}
					// array
					return {
						value: val,
						timeRange: formatToolTipAxisX(labelX, timeType),
						name: formatToolTipName(name),
						unit,
					};
				},
			],

			crosshairs = {},
			lineActive,
			chartHeight,
		} = this.props;

		let { lineSize, chartScale = {} } = this.props;
		chartScale = {
			time: {
				type: 'linear',
				nice: false,
				min: 0,
				tickInterval: 2,
				max: thickTimeMax(timeType),
			},
			value: {
				type: 'linear',
				nice: true,
				tickCount: 6,
				// range: [0.09, 0.91],
			},
		};
		const dataForamtted = foramtData(data, timeType);
		if (type === 'interval') {
			lineSize = barWidthFit(timeType);
			chartScale = {
				time: {
					type: 'linear',
					nice: false,
					range: [0.09, 0.91],
					// tickCount: barAmout,
				},
			};
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
