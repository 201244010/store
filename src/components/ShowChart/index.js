import React from 'react';
import { Chart, Axis, Tooltip, Geom, Label, Shape } from 'bizcharts';
import moment from 'moment';
import { DASHBOARD } from '@/pages/DashBoard/constants';

import styles from './index.less';

const {
	SEARCH_TYPE: { RANGE },
} = DASHBOARD;

const formatTime = (time, rangeType) => {
	const timeData = moment.unix(time).local();

	if (rangeType === RANGE.TODAY) {
		return timeData.format('HH:mm');
	}

	if (rangeType === RANGE.WEEK) {
		return timeData.format('ddd');
	}

	if (rangeType === RANGE.MONTH) {
		return timeData.format('D');
	}

	return timeData.format('M/D');
};

Shape.registerShape('interval', 'myShape', {
	getPoints(pointInfo) {
		const { x, y, y0, size } = pointInfo;
		const width = size;
		return [
			{ x: x - width / 4, y: y0 },
			{ x: x - (width * 3) / 8, y: y === 0 ? y0 : y0 + width / 8 },
			{ x: x - width / 2, y: y === 0 ? y0 : y0 + (width * 2) / 3 },
			{ x: x - width / 2, y: y - (width * 2) / 3 < 0 ? y : y - (width * 2) / 3 },
			{ x: x - (width * 3) / 8, y: y - width / 8 < 0 ? y : y - width / 8 },
			{ x: x - width / 4, y },
			{ x: x + width / 4, y },
			{ x: x + (width * 3) / 8, y: y - width / 8 < 0 ? y : y - width / 8 },
			{ x: x + width / 2, y: y - (width * 2) / 3 < 0 ? y : y - (width * 2) / 3 },
			{ x: x + width / 2, y: y === 0 ? y0 : y0 + (width * 2) / 3 },
			{ x: x + (width * 3) / 8, y: y === 0 ? y0 : y0 + width / 8 },
			{ x: x + width / 4, y: y0 },
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

export default class ShowChart extends React.Component {
	render() {
		const { orderList, saleType, range } = this.props;

		let nowTime = new Date();
		let labelWidth = 0;
		if (range === RANGE.TODAY) {
			nowTime = `${nowTime.getHours()}:00`;
			labelWidth = 33;
		}
		if (range === RANGE.WEEK) {
			labelWidth = 73;
			nowTime = moment(nowTime.getTime()).format('ddd');
		}
		if (range === RANGE.MONTH) {
			nowTime = nowTime.getDate().toString();
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
			<div className={styles.showChart}>
				<div className={styles.chartName}>{chartName}</div>
				<Chart width={841} height={214} padding="auto" data={mockData()}>
					<Axis
						name="time"
						label={{
							offset: 36,
							textStyle: {
								textAlign: 'center',
								fill: '#FFFFFF',
								fontSize: '12',
								fontWeight: 'light',
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
					>
						<Label
							autoRotate={false}
							position="bottom"
							content="name"
							htmlTemplate={(_, item) => {
								const { point = {} } = item;
								return nowTime === point.time
									? `<div class="htmlTemplateTitle">
										<div class="htmlTemplateTitleContent" style="width:${labelWidth}px;">
											<div class="htmlTemplateTitleContentTop">${point[saleType]}</div>
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
