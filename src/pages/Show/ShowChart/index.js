import React from 'react';
import { connect } from 'dva';
import { Chart, Axis, Tooltip, Geom, Label } from 'bizcharts';
import moment from 'moment';
import { DASHBOARD } from '@/pages/DashBoard/constants';
import { formatTime } from '@/pages/DashBoard/ContentChart';
import { X_TEXT_STYLE, Y_TEXT_STYLE, Y_LINE_STYLE, COLORS } from './chartShape';

import styles from './index.less';

const {
	SEARCH_TYPE: { RANGE },
} = DASHBOARD;

@connect(
	state => ({
		showInfo: state.showInfo,
	}),
)
class ShowChart extends React.Component {
	render() {
		const { time: timeInterval, saleType } = this.props;
		const {
			showInfo: {
				[timeInterval]: {
					orderList = [],
					range = '',
				} = {},
			},
		} = this.props;

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
			fillColor = [COLORS.FILL_ONE, COLORS.FILL_TWO],
			shadowColor = COLORS.SHADOW,
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
							textStyle: X_TEXT_STYLE,
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
							textStyle: Y_TEXT_STYLE,
							autoRotate: false,
						}}
						grid={{
							type: 'line',
							lineStyle: Y_LINE_STYLE,
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
									nowTime === time ? shadowColor : COLORS.SHADOW_NOR,
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
export default ShowChart;
