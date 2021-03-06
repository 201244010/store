import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { formatMessage } from 'umi/locale';
import SingleLine from '../Charts/Line/SingleLine';
import { passengerNumFormat } from '@/utils/format';

import styles from './index.less';

class PassengerTrendLine extends PureComponent {
	render() {
		const { RTPassengerFlowList, loading, timeType } = this.props;
		const chartOption = {
			chartHeight: 370,
			timeType,
			data: RTPassengerFlowList,
			lineColor: ['value', 'rgb(75,122,250)'],
			area: {
				// 是否填充面积
				show: true,
				color: ['l (90) 0:rgba(75,122,250, 1) 1:rgba(75,122,250,0)'],
				type: 'area',
				position: 'time*value',
			},
			lineSize: 3,
			// innerTitle: 'chart title area=true',
			chartScale: {
				time: {
					type: 'linear',
					nice: false,
					min: 0,
					// tickInterval: 2,
				},
				value: {
					type: 'linear',
					nice: true,
					min: 0,
				},
			},
			formatYLabel: value => passengerNumFormat({ value, returnType: 'join' }),
			formatToolTipValue: value => passengerNumFormat({ value, returnType: 'join' }),
		};
		return (
			<Card
				bordered={false}
				className={styles['line-chart-wrapper']}
				title={formatMessage({ id: 'databoard.passenger.trend.title' })}
				loading={loading}
			>
				<SingleLine {...chartOption} />
			</Card>
		);
	}
}
export default PassengerTrendLine;
