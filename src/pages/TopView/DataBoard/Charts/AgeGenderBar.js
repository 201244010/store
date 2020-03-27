import React from 'react';
import { DataView } from '@antv/data-set';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import { DataAgeGender } from './mock';
import styles from './chartsCommon.less';

export default class AgeGenderBar extends React.Component {
	formatLabelX = val => `text[${val}]`;

	formatToolTipAxisX = ageCode =>
		// x
		`年龄：text[${ageCode}]`;

	render() {
		// const { data, scale = {}, tooltip } = this.props;
		const { formatToolTipAxisX, formatLabelX } = this;
		const chartTitle = '性别年龄占比';

		const dv = new DataView();
		const data = dv
			.source(DataAgeGender)
			.transform({
				type: 'map',
				callback(row) {
					if (row.gender === 'male') {
						row.gender = '男性';
					}
					if (row.gender === 'female') {
						row.gender = '女性';
					}
					return row;
				},
			})
			.transform({
				type: 'fold',
				fields: ['range1', 'range2', 'range3', 'range4', 'range5'],
				key: 'range',
				value: 'value',
			});

		return (
			<div>
				<Chart height={336} data={data} forceFit>
					<h1 className={styles['chart-title']}>{chartTitle}</h1>
					<Axis name="range" label={{ formatter: formatLabelX }} />
					<Axis name="value" />
					<Tooltip
						shared={false}
						{...{
							containerTpl: `<div class="g2-tooltip">
					<ul class="g2-tooltip-list data-chart-list"></ul>
				 </div>`,
							itemTpl: `<li class="detail" data-index={index}>
					<p class="item item__name">{name}</p>
					<p class="item item__value">{value}</p>
					<p class="item item__labelX">{ageInterval}</p>
				</li>`,
						}}
					/>
					<Legend
						{...{ position: 'top-right', offsetX: 0, offsetY: 10, marker: 'circle' }}
					/>
					<Geom
						type="interval"
						position="range*value"
						color={['gender', ['#4B7AFA', '#FF6666']]}
						adjust={[
							{
								type: 'dodge',
								marginRatio: 0,
							},
						]}
						size={30}
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
							'gender*range*value',
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
