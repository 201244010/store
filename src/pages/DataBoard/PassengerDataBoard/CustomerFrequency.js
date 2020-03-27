import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';

import FrequencyBar from '../Charts/Bars/FrequencyBar';
import SingleLine from '../Charts/Line/SingleLine';
import FrequencyAgeGenderBar from '../Charts/Bars/FrequencyAgeGenderBar';

import styles from './index.less';

class CustomerFrequency extends PureComponent {
	render() {
		const { frequencyList, frequencyTrend, customerDistri, loading, timeType } = this.props;
		const chartOption = {
			chartHeight: 280,
			timeType,
			data: frequencyTrend,
			lineColor: ['value', '#FF8133'],
			area: {
				// 是否填充面积
				show: false,
				color: ['l (90) 0:rgba(75,122,250, 1) 1:rgba(75,122,250,0.1)'],
				type: 'area',
				position: 'time*value',
			},
			linesize: 4,
			innerTitle: '周到店频次',
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
			<Card bordered={false} title={formatMessage({ id: 'databoard.passenger.frequency.title'})} className={styles['distri-chart-wrapper']} loading={loading}>
				{
					timeType === 1? <FrequencyBar data={frequencyList} /> : ''
				}
				{
					timeType !== 1?
						<Row>
							<Col span={8}><FrequencyBar data={frequencyList} /></Col>
							<Col span={8}><SingleLine {...chartOption} /></Col>
							<Col span={8}><FrequencyAgeGenderBar data={customerDistri} timeType={timeType} /></Col>
						</Row>
						: ''
				}
			</Card>
		);
	}
}
export default CustomerFrequency;