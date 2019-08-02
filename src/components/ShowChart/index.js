import React from 'react';
import { Chart, Axis, Tooltip, Geom, Label, Shape } from 'bizcharts';
import moment from 'moment';
import { DASHBOARD } from '@/pages/DashBoard/constants';
import { formatTime } from '@/pages/DashBoard/ContentChart';

import styles from './index.less';

const {
	SEARCH_TYPE: { RANGE },
} = DASHBOARD;

Shape.registerShape('interval', 'myShape', {
	getPoints(pointInfo) {
		const { x, y, y0, size } = pointInfo;
		const n = 60;
		const unit = size / n;
		return [
			{ x: x - (n / 3) * unit, y: y0 },
			{ x: x - (n / 2.5) * unit, y: y - y0 < unit ? y0 : y0 + unit },
			{ x: x - (n / 2.22) * unit, y: y - y0 < (n / 20) * unit ? y0 : y0 + (n / 20) * unit },
			{ x: x - (n / 2.06) * unit, y: y - y0 < (n / 6) * unit ? y0 : y0 + (n / 6) * unit },
			{ x: x - (n / 2) * unit, y: y - y0 < (n / 3) * unit ? y0 : y0 + (n / 3) * unit },
			{ x: x - (n / 2) * unit, y: y - y0 < (n / 3) * unit ? y : y - (n / 3) * unit },
			{ x: x - (n / 2.06) * unit, y: y - y0 < (n / 6) * unit ? y : y - (n / 6) * unit },
			{ x: x - (n / 2.22) * unit, y: y - y0 < (n / 20) * unit ? y : y - (n / 20) * unit },
			{ x: x - (n / 2.5) * unit, y: y - y0 < unit ? y : y - unit },
			{ x: x - (n / 3) * unit, y },
			{ x: x + (n / 3) * unit, y },
			{ x: x + (n / 2.5) * unit, y: y - y0 < unit ? y : y - unit },
			{ x: x + (n / 2.22) * unit, y: y - y0 < (n / 20) * unit ? y : y - (n / 20) * unit },
			{ x: x + (n / 2.06) * unit, y: y - y0 < (n / 6) * unit ? y : y - (n / 6) * unit },
			{ x: x + (n / 2) * unit, y: y - y0 < (n / 3) * unit ? y : y - (n / 3) * unit },
			{ x: x + (n / 2) * unit, y: y - y0 < (n / 3) * unit ? y0 : y0 + (n / 3) * unit },
			{ x: x + (n / 2.06) * unit, y: y - y0 < (n / 6) * unit ? y0 : y0 + (n / 6) * unit },
			{ x: x + (n / 2.22) * unit, y: y - y0 < (n / 20) * unit ? y0 : y0 + (n / 20) * unit },
			{ x: x + (n / 2.5) * unit, y: y - y0 < unit ? y0 : y0 + unit },
			{ x: x + (n / 3) * unit, y: y0 },
		];
	},
	draw(cfg, container) {
		const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
		const polygon = container.addShape('polygon', {
			attrs: {
				points: [
					[points[0].x, points[0].y],
					[points[1].x, points[1].y],
					[points[2].x, points[2].y],
					[points[3].x, points[3].y],
					[points[4].x, points[4].y],
					[points[5].x, points[5].y],
					[points[6].x, points[6].y],
					[points[7].x, points[7].y],
					[points[8].x, points[8].y],
					[points[9].x, points[9].y],
					[points[10].x, points[10].y],
					[points[11].x, points[11].y],
					[points[12].x, points[12].y],
					[points[13].x, points[13].y],
					[points[14].x, points[14].y],
					[points[15].x, points[15].y],
					[points[16].x, points[16].y],
					[points[17].x, points[17].y],
					[points[18].x, points[18].y],
					[points[19].x, points[19].y],
				],
				shadowColor: cfg.style.shadowColor,
				shadowBlur: cfg.style.shadowBlur,
				shadowOffsetX: cfg.style.shadowOffsetX,
				shadowOffsetY: cfg.style.shadowOffsetY,
				fill: cfg.color,
			},
		});
		return polygon;
	},
});

export default class ShowChart extends React.PureComponent {
	render() {
		const { orderList, saleType, range } = this.props;

		let nowTime = moment(new Date().getTime());
		let labelWidth = 0;
		if (range === RANGE.TODAY) {
			nowTime = nowTime.format('HH:00');
			labelWidth = 33;
		}
		if (range === RANGE.WEEK) {
			nowTime = nowTime.format('ddd');
			labelWidth = 73;
		}
		if (range === RANGE.MONTH) {
			nowTime = nowTime.format('D');
			labelWidth = 30;
		}

		const dataList = orderList.map(data => ({
			time: formatTime(data.time, range),
			[saleType]: data[saleType],
		}));

		const {
			chartName = '',
			fillColor = ['l(90) 0:#6CBBFF 1:#6CBBFF', 'l(90) 0:#667ECC 1:#3D6DCC'],
			shadowColor = '#1A56FF',
		} = this.props;

		const mockData = () =>
			dataList.map(item => ({
				time: item.time,
				[saleType]: item[saleType],
			}));

		return (
			<div className={styles['show-chart']}>
				<div className={styles['chart-name']}>{chartName}</div>
				<Chart width={841} height={214} padding="auto" data={mockData()}>
					<Axis
						name="time"
						label={{
							offset: 36,
							textStyle: {
								textAlign: 'center',
								fill: '#FFFFFF',
								fontSize: '14',
								fontWeight: '400',
							},
							autoRotate: false,
							formatter(text, _, index) {
								if (range === RANGE.TODAY) {
									return index % 2 !== 0 ? '' : text;
								}

								if (range === RANGE.WEEK) {
									return text;
								}

								return index % 3 !== 0 ? '' : text;
							},
						}}
						line={null}
						tickLine={null}
					/>
					<Axis
						name={saleType}
						label={{
							offset: 11,
							textStyle: {
								fill: '#FFFFFF',
								fontSize: '12',
								fontWeight: 'lighter',
							},
							autoRotate: false,
						}}
						grid={{
							type: 'line',
							lineStyle: {
								stroke: 'rgba(114,134,217,0.20)',
								lineWidth: 1,
								lineDash: [1, 0],
							},
						}}
					/>
					<Tooltip />
					<Geom
						type="interval"
						position={`time*${saleType}`}
						color={['time', time => (nowTime === time ? fillColor[0] : fillColor[1])]}
						style={[
							'time',
							{
								shadowBlur: 20,
								shadowOffsetX: 0,
								shadowOffsetY: 10,
								shadowColor: time =>
									nowTime === time ? shadowColor : 'transparent',
							},
						]}
						shape="myShape"
						tooltip={false}
					>
						<Label
							autoRotate={false}
							position="bottom"
							content={saleType}
							htmlTemplate={(_, item) => {
								const { point = {} } = item;
								return nowTime === point.time
									? `<div class="template-title">
										<div class="template-content" style="width:${labelWidth}px;">
											<div class="template-top">${point[saleType] !== 0 ? point[saleType] : ''}</div>
										</div>
									</div>`
									: '';
							}}
						/>
					</Geom>
				</Chart>
			</div>
		);
	}
}
