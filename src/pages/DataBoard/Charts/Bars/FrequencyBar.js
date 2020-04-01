import React from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import { formatMessage } from 'umi/locale';
// import { frequencyData } from './mock';
import styles from '../chartsCommon.less';

import { DATABOARD } from '../constants';

const { VALUE_THICK_INTERVAL } = DATABOARD;
const FREQUENCY_MAX = [5, 11];
const UNIT = formatMessage({ id: 'databoard.passenger.unit' });

export default class FrequencyBar extends React.Component {
	thickInterval = (scale, data) => {
		if (!data.length)
			return {
				...scale,
				value: {
					type: 'linear',
					nice: true,
					min: 0,
					// tickCount: 6,
				},
			};
		// 计算y轴最大值,最小值
		const max = _.maxBy(data, o => o.value).value;
		const min = _.minBy(data, o => o.value).value;
		console.log('groupBy', max, min, data.rows);
		// return scale;
		if (min < 0) {
			// 自适应
			return scale;
		}
		if (max < 10) {
			return {
				...scale,
				value: {
					type: 'linear',
					nice: false,
					max: 10,
					tickCount: 6,
				},
			};
		}
		if (max < 50) {
			return {
				...scale,
				value: {
					type: 'linear',
					nice: true,
					max: 50,
					tickCount: 6,
				},
			};
		}
		//  max > 50 计算数字位数n * 10
		const mul = 10 ** Math.floor(Math.log10(max / 5));
		const tickInterval = Math.ceil(max / 5 / mul) * mul;
		return {
			...scale,
			value: {
				type: 'linear',
				nice: true,
				tickInterval,
				max: tickInterval * 5,
			},
		};
	};

	formatLabelX = barAmout => val => {
		if (FREQUENCY_MAX.includes(barAmout)) {
			// 5组数据 or 11组数据时 最后一组 xxx以上 X轴
			val -= 0;
			if (val === barAmout) {
				return `${val - 1}${formatMessage({ id: 'databoard.chart.above' })}`;
			}
		}
		return val;
	};

	formatToolTipAxisX = (x, barAmout) => {
		// 提示框
		if (FREQUENCY_MAX.includes(barAmout)) {
			if (x === barAmout) {
				return `${x - 1}${formatMessage({ id: 'databoard.chart.frequency.above' })}`;
			}
		}
		return `${x}${formatMessage({ id: 'databoard.data.frequency.unit' })}`;
	};

	barWidthFit = barAmout => {
		if (barAmout > 10) {
			return 12;
		}
		if (barAmout > 4) {
			return 25;
		}
		return 20;
	};

	render() {
		const { formatToolTipAxisX, formatLabelX, barWidthFit, thickInterval } = this;
		const chartTitle = formatMessage({ id: 'databoard.chart.title.frequencyDistri' });
		// const data = frequencyData;
		const { data, chartHeight = 250 } = this.props;
		const barAmout = data.length;
		const scale = {
			frequency: {
				type: 'linear',
				nice: false,
				range: [0.09, 0.91],
				tickCount: barAmout,
			},
			value: {
				type: 'linear',
				nice: true,
				tickCount: VALUE_THICK_INTERVAL,
			},
		};
		return (
			<div>
				<Chart
					padding="auto"
					height={chartHeight}
					data={data}
					forceFit
					scale={thickInterval(scale, data)}
				>
					<h1 className={styles['chart-title']}>{chartTitle}</h1>
					<Axis name="frequency" label={{ formatter: formatLabelX(barAmout) }} />
					<Axis name="value" />
					<Tooltip
						shared={false}
						crosshairs={{
							type: 'rect',
						}}
						{...{
							containerTpl: `<div class="g2-tooltip">
					<ul class="g2-tooltip-list data-chart-list"></ul>
				 </div>`,
							itemTpl: `<li class="detail" data-index={index}>
					<p class="item item__name">${formatMessage({ id: 'databoard.chart.passengerEnterCount' })}</p>
					<p class="item item__value">{value}<span class="unit">${UNIT}</span></p>
					<p class="item item__labelX">${formatMessage({ id: 'databoard.chart.frequency' })}：{labelX}</p>
				</li>`,
						}}
					/>
					<Geom
						type="interval"
						position="frequency*value"
						color="#FFD0B3"
						size={barWidthFit(barAmout)}
						active={[
							true,
							{
								highlight: true,
								style: {
									fill: 'l(270) 0:rgba(255,161,102,1) 1:rgba(255,129,51,1)',
								},
							},
						]}
						tooltip={[
							'frequency*value',
							(labelX, value) =>
								// array
								({
									value,
									name: labelX,
									labelX: formatToolTipAxisX(labelX, barAmout),
								}),
						]}
					/>
				</Chart>
			</div>
		);
	}
}
