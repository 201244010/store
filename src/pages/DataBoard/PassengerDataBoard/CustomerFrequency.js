import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import { frequencyFormat } from '@/utils/format';

import FrequencyBar from '../Charts/Bars/FrequencyBar';
import SingleLine from '../Charts/Line/SingleLine';
import FrequencyAgeGenderBar from '../Charts/Bars/FrequencyAgeGenderBar';

import styles from './index.less';

const CHART_HEIGHT = 250;
class CustomerFrequency extends PureComponent {
	render() {
		const { frequencyList, frequencyTrend, customerDistri, loading, timeType } = this.props;
		const dataAddName = frequencyTrend.map(item => ({
			...item,
			name: 'customerFrequency',
		}));
		const chartOption = {
			chartHeight: CHART_HEIGHT,
			chartType: 'weekFrequency',
			timeType,
			data: dataAddName,
			lineColor: ['value', '#FF8133'],
			area: {
				// 是否填充面积
				show: false,
				color: ['l (90) 0:rgba(75,122,250, 1) 1:rgba(75,122,250,0.1)'],
				type: 'area',
				position: 'time*value',
			},
			lineSize: 3,
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
			formatToolTipValue: value => {
				if (!value) return value;
				const val = frequencyFormat({ value, returnType: 'join' });
				if (timeType === 1) {
					return val.day;
				}
				if (timeType === 2) {
					return val.week;
				}
				if (timeType === 3) {
					return val.week;
				}
				return val.day;
			},
		};
		return (
			<Card
				bordered={false}
				title={formatMessage({ id: 'databoard.passenger.frequency.title' })}
				className={styles['distri-chart-wrapper']}
				loading={loading}
			>
				{timeType === 1 ? <FrequencyBar data={frequencyList} /> : ''}
				{timeType !== 1 ? (
					<Row>
						<Col span={8}>
							<FrequencyBar data={frequencyList} chartHeight={CHART_HEIGHT} />
						</Col>
						<Col span={8}>
							<SingleLine {...chartOption} />
						</Col>
						<Col span={8}>
							<FrequencyAgeGenderBar
								data={customerDistri}
								chartHeight={CHART_HEIGHT}
								timeType={timeType}
							/>
						</Col>
					</Row>
				) : (
					''
				)}
			</Card>
		);
	}
}
export default CustomerFrequency;
