import React from 'react';
import { connect } from 'dva';
import { Chart, Axis, Tooltip, Geom, Label } from 'bizcharts';
import moment from 'moment';
import { formatMessage } from 'umi/locale';

import { X_TEXT_STYLE, Y_TEXT_STYLE, Y_LINE_STYLE, COLORS, LIST } from './conversion';

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
		this.cols = {
			time: {
				ticks: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
			},
			rate: {
				minLimit: 0,
				maxLimit: 100,
				ticks: [0, 20, 40, 80, 100],
			}
		};
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
			const rate = (item.orderCount / passengerFlowCount).toFixed(2)*100;
			return {
				time: item.time,
				rate,
			};
		});
		const rateList = LIST;
		list.map(item => {
			for(let i = 0; i < rateList.length; i++) {
				if (item.time === rateList[i].time) {
					rateList[i].rate = item.rate;
				}
			}
		});

		const nowHour = moment().hour(); 

		return (
			<div className={styles['flow-chart']}>
				<div className={styles['chart-name']}>
					{formatMessage({ id: 'flow.conversionRate.title' })}
				</div>
				<Chart width={656} height={205} padding="auto" data={rateList} scale={this.cols}>
					<Axis
						name="time"
						label={{
							offset: 36,
							textStyle: X_TEXT_STYLE,
							autoRotate: false,
							formatter(text) {
								console.log('text', text);
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
							textStyle: Y_TEXT_STYLE,
							autoRotate: false,
							formatter(text) {
								return `${text}%`;
							},
						}}
						grid={{
							type: 'line',
							lineStyle: Y_LINE_STYLE,
						}}
					/>
					<Tooltip />
					<Geom
						type="interval"
						position='time*rate'
						color={['time', time => (nowHour === time ? COLORS.NOW_COLOR : COLORS.NOR_COLOR)]}
						style={[
							'time',
							{
								shadowBlur: 20,
								shadowOffsetX: 0,
								shadowOffsetY: 10,
								shadowColor: time => (nowHour === time ? COLORS.LIGHT_SHADOW : COLORS.NOR_SHADOW),
							}
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
