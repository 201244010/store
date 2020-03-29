import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { formatMessage } from 'umi/locale';
import { formatFloatByPermile } from '@/utils/format';
import SingleLine from '../Charts/Line/SingleLine';
import { DATABOARD } from '../Charts/constants';

import styles from './index.less';

const { LINE_SIZE } = DATABOARD;
class EnteringRateTrend extends PureComponent {
	render() {
		const { enteringList, loading, timeType, chartHeight = 400 } = this.props;
		const chartOption = {
			timeType,
			chartHeight,
			data: enteringList,
			lineColor: ['value', '#FF8133'],
			area: {
				// 是否填充面积
				show: false,
				color: ['l (90) 0:rgba(75,122,250, 1) 1:rgba(75,122,250,0.1)'],
				type: 'area',
				position: 'time*value',
			},
			lineSize: LINE_SIZE,
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
					nice: false,
					min: 0,
					max: 100,
				},
			},
			// eslint-disable-next-line arrow-body-style
			formatToolTipValue: value =>
				formatFloatByPermile({ value: value / 100, returnType: 'join' }),
		};
		return (
			<Card
				bordered={false}
				className={styles['line-chart-wrapper']}
				title={formatMessage({ id: 'databoard.entering.rate.title' })}
				loading={loading}
			>
				<SingleLine {...chartOption} />
			</Card>
		);
	}
}
export default EnteringRateTrend;
