import React from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import { frequencyData } from './mock';
import styles from './chartsCommon.less';

const FREQUENCY_MAX = [5, 11];

export default class FrequencyBar extends React.Component {
	formatLabelX = val => {
		if (FREQUENCY_MAX.includes(val - 0)) {
			return `${val - 1}以上`;
		}
		return val;
	};

	formatToolTipAxisX = x => {
		if (FREQUENCY_MAX.includes(x - 0)) {
			return `${x - 1}次以上`;
		}
		return `${x}次`;
	};

	barWidthFit = i => {
		if (i > 5) {
			return 40;
		}
		if (i > 10) {
			return 20;
		}
		return 20;
	};

	render() {
		const { formatToolTipAxisX, formatLabelX, barWidthFit } = this;
		const chartTitle = '到店次数分布';
		const data = frequencyData;

		return (
			<div>
				<Chart
					height={400}
					data={data}
					forceFit
					scale={{ frequency: { type: 'cat', nice: false } }}
				>
					<h1 className={styles['chart-title']}>{chartTitle}</h1>
					<Axis name="frequency" label={{ formatter: formatLabelX }} />
					<Axis name="value" />
					<Tooltip
						shared={false}
						{...{
							containerTpl: `<div class="g2-tooltip">
					<ul class="g2-tooltip-list data-chart-list"></ul>
				 </div>`,
							itemTpl: `<li class="detail" data-index={index}>
					<p class="item item__name">到店人数</p>
					<p class="item item__value">{value}人</p>
					<p class="item item__labelX">频次：{labelX}</p>
				</li>`,
						}}
					/>
					<Geom
						type="interval"
						position="frequency*value"
						color="l(270) 0:rgba(255,161,102,1) 1:rgba(255,129,51,1)"
						size={barWidthFit(data.length)}
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
									labelX: formatToolTipAxisX(labelX),
								}),
						]}
					/>
				</Chart>
			</div>
		);
	}
}
