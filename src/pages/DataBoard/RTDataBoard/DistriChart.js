import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import Pie from '../Charts/Pie/Pie';
import DataAgeGender from '../Charts/Bars/AgeGenderBar';


import styles from './index.less';

const NAME_LABEL = {
	'regular': formatMessage({ id: 'databoard.regular'}),
	'stranger': formatMessage({ id: 'databoard.stranger'})
};

class DistriChart extends PureComponent {
	render() {
		const { regularList, ageGenderList, loading } = this.props;
		// console.log('=====pie', regularList);
		const targetList = regularList.map(item => ({
			...item,
			name: NAME_LABEL[item.name]
		}));
		const colorArray = ['rgba(255, 128, 0, 1)', 'rgba(90, 151, 252, 1)'];
		return(
			<Card title={formatMessage({ id: 'databoard.passenger.distri.title'})} className={styles['distri-chart-wrapper']} loading={loading}>
				<Row>
					<Col span={8}>
						<div className={styles['regular-chart']}>
							<h4 className={styles['regular-title']}>{formatMessage({ id: 'databoard.passenger.regular.title'})}</h4>
							<Pie data={targetList} colorArray={colorArray} />
						</div>
					</Col>
					<Col span={16}>
						<DataAgeGender ageGenderList={ageGenderList} />
					</Col>
				</Row>
				
				{/* <div className={styles['age-chart']}>
					<h4>性别年龄占比</h4>
				</div> */}
			</Card>
		);
	}
}
export default DistriChart;