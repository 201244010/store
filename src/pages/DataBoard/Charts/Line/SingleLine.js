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

const latestDataSuppl = (data, timeType = 1) => {
	// 实时数据为空的进行补全
	const length = data.length;
	if (timeType === TIME_TYPE.DAY) {
		if (length < 24) {
			return [...data, { time: 24 }];
		}
	}
	if (timeType === TIME_TYPE.WEEK) {
		if (length < 7) {
			return [...data, { time: 7 }];
		}
	}
	if (timeType === TIME_TYPE.MONTH) {
		if (length < 31) {
			return [...data, { time: 31 }];
		}
	}
	return data;
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
		dv.source(latestDataSuppl(data, timeType)).transform({
			type: 'map',
			callback(row) {
				// 数据从0开始
				row.time -= 1;
				return row;
			},
		});
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
				}}
			/>
		);
	}
}
