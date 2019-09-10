import React from 'react';
import { connect } from 'dva';
import { Chart, Axis, Tooltip, Geom, Label, Shape } from 'bizcharts';
import moment from 'moment';
import { formatMessage } from 'umi/locale';

import styles from './index.less';

Shape.registerShape('interval', 'rateShape', {
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

// getPassengerFlowOrderLatest
@connect(
	state => ({
		flowInfo: state.flowInfo,
	}),
	dispatch => ({
		getPassengerFlowOrderLatest: () =>
			dispatch({ type: 'flowInfo/getPassengerFlowOrderLatest' }),
	})
)
class FlowConversionRate extends React.PureComponent {
	componentDidMount() {
		const { getPassengerFlowOrderLatest } = this.props;
		getPassengerFlowOrderLatest();
		this.flowOrder = setInterval(() => {
			getPassengerFlowOrderLatest();
		}, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.flowOrder);
	}

	render() {
		const {
			flowInfo: { passengerFlowOrder = [] },
		} = this.props;
		const listFilter = passengerFlowOrder.filter((item, index) => index > 7 && index < 18);
		const list = listFilter.map(item => {
			const rate = (item.orderCount / (item.passengerFlowCount === 0?  1 :  item.passengerFlowCount)).toFixed(0);
			return {
				time: item.time,
				rate,
			};
		});
		const nowTime = moment(new Date().getTime()).format('HH');

		// const data = [
		// 	{
		// 		time: '8:00',
		// 		rate: 20,
		// 	},
		// 	{
		// 		time: '9:00',
		// 		rate: 30,
		// 	},
		// 	{
		// 		time: '10:00',
		// 		rate: 40,
		// 	},
		// 	{
		// 		time: '11:00',
		// 		rate: 22,
		// 	},
		// 	{
		// 		time: '12:00',
		// 		rate: 26,
		// 	},
		// 	{
		// 		time: '13:00',
		// 		rate: 27,
		// 	},
		// 	{
		// 		time: '14:00',
		// 		rate: 22,
		// 	},
		// 	{
		// 		time: '15:00',
		// 		rate: 36,
		// 	},
		// 	{
		// 		time: '16:00',
		// 		rate: 42,
		// 	},
		// 	{
		// 		time: '17:00',
		// 		rate: 23,
		// 	},
		// 	{
		// 		time: '18:00',
		// 		rate: 32,
		// 	},
		// 	{
		// 		time: '19:00',
		// 		rate: 33,
		// 	},
		// ];

		const fillColor = ['l(90) 0:#6CBBFF 1:#6CBBFF', 'l(90) 0:#667ECC 1:#3D6DCC'];
		const cols = {
			time: {
				ticks: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
			},
		};
		return (
			<div className={styles['flow-chart']}>
				<div className={styles['chart-name']}>
					{formatMessage({ id: 'flow.conversionRate.title' })}
				</div>
				<Chart width={656} height={205} padding="auto" data={list} scale={cols}>
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
							formatter(text) {
								if (parseInt(text, 10) < 10) {
									return `0${text}:00`;
								}
								return `${text}:00`;
							},
						}}
						line={null}
						tickLine={null}
					/>
					<Axis
						name="rate"
						label={{
							offset: 11,
							textStyle: {
								fill: '#FFFFFF',
								fontSize: '12',
								fontWeight: 'lighter',
							},
							autoRotate: false,
							formatter(text) {
								return `${parseInt(text, 10) * 100}%`;
							},
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
						position='time*rate'
						color={['time', time => (nowTime === time ? fillColor[0] : fillColor[1])]}
						style={[
							'time',
							{
								shadowBlur: 20,
								shadowOffsetX: 0,
								shadowOffsetY: 10,
								shadowColor: time => (nowTime === time ? '#1A56FF' : 'transparent'),
							},
						]}
						shape="rateShape"
						tooltip={false}
					>
						<Label
							autoRotate={false}
							position="bottom"
							content="rate"
							htmlTemplate={(_, item) => {
								const { point = {} } = item;
								return parseInt(nowTime, 10) === parseInt(point.time, 10)
									? `<div class="template-title">
										<div class="template-content" style="width:40px;">
											<div class="template-top">${parseInt(point.rate, 10) !== 0 ? point.rate : ''}</div>
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

export default FlowConversionRate;
