import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { formatMessage } from 'umi/locale';
import Pie from '../Charts/Pie/Pie';
import DataAgeGender from '../Charts/Bars/AgeGenderBar';


import styles from './index.less';

class DistriChart extends PureComponent {
	render() {
		const { regularList, ageGenderList } = this.props;
		// console.log('=====pie', regularList);
		const colorArray = ['rgba(255, 128, 0, 1)', 'rgba(90, 151, 252, 1)'];
		return(
			<Card title={formatMessage({ id: 'databoard.passenger.distri.title'})} className={styles['distri-chart-wrapper']}>
				<div className={styles['regular-chart']}>
					<h4 className={styles['regular-title']}>{formatMessage({ id: 'databoard.passenger.regular.title'})}</h4>
					<Pie data={regularList} colorArray={colorArray} />
				</div>
				<div className={styles['age-chart']}>
					{/* <h4>性别年龄占比</h4> */}
					<DataAgeGender ageGenderList={ageGenderList} />
				</div>
			</Card>
		);
	}
}
export default DistriChart;