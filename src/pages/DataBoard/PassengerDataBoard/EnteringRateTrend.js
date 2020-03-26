import React, { PureComponent } from 'react';
import { Card } from 'antd';
import SingleLine from '../Charts/Line/SingleLine';

import styles from './index.less';

class EnteringRateTrend extends PureComponent {
	render() {
		const { enteringList, loading, timeType } = this.props;
		const chartOption = {
			timeType,
			data: enteringList,
			lineColor: ['value', '#FF8133'],
			area: {
				// 是否填充面积
				show: false,
				color: ['l (90) 0:rgba(75,122,250, 1) 1:rgba(75,122,250,0.1)'],
				type: 'area',
				position: 'time*value',
			},
			linesize: 4,
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
		};
		return(
			<Card bordered={false} className={styles['line-chart-wrapper']} title="进店率趋势" loading={loading}>
				<SingleLine {...chartOption} />
			</Card>
		);
	}
}
export default EnteringRateTrend;