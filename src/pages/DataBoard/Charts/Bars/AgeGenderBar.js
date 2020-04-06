import React from 'react';
import { formatMessage } from 'umi/locale';
import _ from 'lodash';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import styles from '../chartsCommon.less';

const UNIT = formatMessage({ id: 'databoard.passenger.unit' });
export default class AgeGenderBar extends React.Component {
	formatAgeCode = range => {
		switch (range) {
			case 1:
				return formatMessage({ id: 'databoard.age.range.1' });
			case 4:
				return formatMessage({ id: 'databoard.age.range.4' });
			case 5:
				return formatMessage({ id: 'databoard.age.range.5' });
			case 6:
				return formatMessage({ id: 'databoard.age.range.6' });
			case 7:
				return formatMessage({ id: 'databoard.age.range.7' });
			case 8:
				return formatMessage({ id: 'databoard.age.range.8' });
			default:
				return formatMessage({ id: 'databoard.age.range.1' });
		}
	};

	formatLabelX = val => `${val}`;

	formatToolTipAxisX = ageCode =>
		// x
		`${ageCode}`;

	formatScale = data => {
		// 计算y轴最大值,最小值
		const max = _.maxBy(data, o => o.count).count;
		// console.log('groupBy', max, min, data);
		// return scale;
		if (max < 10) {
			return {
				count: {
					type: 'linear',
					nice: false,
					min: 0,
					max: 10,
					tickCount: 6,
				},
			};
		}
		if (max < 50) {
			return {
				count: {
					type: 'linear',
					nice: true,
					min: 0,
					max: 50,
					tickCount: 6,
				},
			};
		}
		//  max > 50 计算数字位数n * 10
		const mul = 10 ** Math.floor(Math.log10(max / 5));
		const tickInterval = Math.ceil(max / 5 / mul) * mul;
		return {
			count: {
				type: 'linear',
				nice: true,
				tickInterval,
				min: 0,
				max: tickInterval * 5,
			},
		};
	};

	render() {
		// const { data, scale = {}, tooltip } = this.props;
		const { ageGenderList } = this.props;
		// const ageGenderList = DataAgeGender;
		const { formatAgeCode } = this;
		// console.log('wx_', ageGenderList);
		const { formatToolTipAxisX, formatLabelX } = this;
		const chartTitle = formatMessage({ id: 'databoard.chart.ageGender' });

		const data = ageGenderList
			.map(row => {
				const { gender, range, count } = row;
				const rangeKey = formatAgeCode(row.range);
				let genderFormat;
				if (gender === 'male') {
					genderFormat = formatMessage({ id: 'databoard.chart.gender.male' });
				}
				if (gender === 'female') {
					genderFormat = formatMessage({ id: 'databoard.chart.gender.female' });
				}
				return {
					gender: genderFormat,
					range,
					count,
					rangeKey,
				};
			})
			.sort((a, b) => a.range - b.range);

		return (
			<div>
				<Chart
					height={250}
					data={data}
					scale={this.formatScale(data)}
					forceFit
					padding="auto"
				>
					<h1 className={styles['chart-title']}>{chartTitle}</h1>
					<Axis name="rangeKey" label={{ formatter: formatLabelX }} />
					<Axis name="count" />
					<Tooltip
						shared={false}
						crosshairs={{
							type: 'rect',
							// style: {
							// 	fill,
							// },
						}}
						{...{
							containerTpl: `<div class="g2-tooltip">
					<ul class="g2-tooltip-list data-chart-list"></ul>
				 </div>`,
							itemTpl: `<li class="detail" data-index={index}>
					<p class="item item__name">{name}</p>
					<p class="item item__value">{value}<span class="unit">${UNIT}</span></p>
					<p class="item item__labelX">{ageInterval}</p>
				</li>`,
						}}
					/>
					<Legend
						{...{ position: 'top-right', offsetX: 0, offsetY: 30, marker: 'circle' }}
					/>
					<Geom
						type="interval"
						position="rangeKey*count"
						color={['gender', ['#4B7AFA', '#FF6666']]}
						adjust={[
							{
								type: 'dodge',
								marginRatio: 1 / 30,
							},
						]}
						size={20}
						// active={[
						// 	// true,
						// 	{
						// 		// highlight: true,
						// 		style: {
						// 			fill: 'l(270) 0:rgba(255,161,102,1) 1:rgba(255,129,51,1)',
						// 		},
						// 	},
						// ]}
						tooltip={[
							'gender*rangeKey*count',
							(name, labelX, value) =>
								// array
								({
									value,
									name,
									ageInterval: formatToolTipAxisX(labelX),
								}),
						]}
					/>
				</Chart>
			</div>
		);
	}
}
