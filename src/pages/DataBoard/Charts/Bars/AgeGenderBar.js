import React from 'react';
import { DataView } from '@antv/data-set';
import { formatMessage } from 'umi/locale';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import styles from '../chartsCommon.less';

const UNIT = '人';
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

	render() {
		// const { data, scale = {}, tooltip } = this.props;
		const { ageGenderList } = this.props;
		// const ageGenderList = DataAgeGender;
		const { formatAgeCode } = this;
		console.log('wx_', ageGenderList);
		const { formatToolTipAxisX, formatLabelX } = this;
		const chartTitle = formatMessage({ id: 'databoard.chart.ageGender' });

		const dv = new DataView();
		const data = dv.source(ageGenderList.sort()).transform({
			type: 'map',
			callback(row) {
				row.rangeKey = formatAgeCode(row.range);
				if (row.gender === 'male') {
					row.gender = formatMessage({ id: 'databoard.chart.gender.male' });
				}
				if (row.gender === 'female') {
					row.gender = formatMessage({ id: 'databoard.chart.gender.female' });
				}
				return row;
			},
		});

		console.log('wx______:', data);

		return (
			<div>
				<Chart height={250} data={data} forceFit padding="auto">
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
					<p class="item item__value">{value}${UNIT}</p>
					<p class="item item__labelX">{ageInterval}</p>
				</li>`,
						}}
					/>
					<Legend
						{...{ position: 'top-right', offsetX: 0, offsetY: 10, marker: 'circle' }}
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
