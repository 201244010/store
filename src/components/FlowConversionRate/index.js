import React from 'react';
import { connect } from 'dva';
import { Chart, Axis, Tooltip, Geom, Label } from 'bizcharts';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { FILLCOlOR, COLS } from './conversionShape';

import styles from './index.less';

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
	constructor(props) {
		super(props);
		this.flowOrder = 0;
	}

	componentDidMount() {
		const { getPassengerFlowOrderLatest } = this.props;
		getPassengerFlowOrderLatest();
		clearInterval(this.flowOrder);
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
		const listFilter = passengerFlowOrder.filter((item, index) => index > 6 && index < 19);
		const list = listFilter.map(item => {
			const passengerFlowCount = item.passengerFlowCount === 0?  1 :  item.passengerFlowCount;
			const rate = (item.orderCount / passengerFlowCount).toFixed(0);
			return {
				time: item.time,
				rate,
			};
		});
		const nowHour = moment().hour(); 

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

		return (
			<div className={styles['flow-chart']}>
				<div className={styles['chart-name']}>
					{formatMessage({ id: 'flow.conversionRate.title' })}
				</div>
				<Chart width={656} height={205} padding="auto" data={list} scale={COLS}>
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
						color={['time', time => (nowHour === time ? FILLCOlOR[0] : FILLCOlOR[1])]}
						style={[
							'time',
							{
								shadowBlur: 20,
								shadowOffsetX: 0,
								shadowOffsetY: 10,
								shadowColor: time => (nowHour === time ? '#1A56FF' : 'transparent'),
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
								return parseInt(nowHour, 10) === parseInt(point.time, 10)
									? `<div class="template-title">
										<div class="template-content">
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
