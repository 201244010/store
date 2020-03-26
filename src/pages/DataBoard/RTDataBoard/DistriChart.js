import React, { PureComponent } from 'react';
import { Card } from 'antd';
import Pie from '../Charts/Pie/Pie';

import styles from './index.less';

class DistriChart extends PureComponent {
	render() {
		const { regularList } = this.props;
		// console.log('=====pie', regularList);
		const colorArray = ['rgba(90, 151, 252, 1)', 'rgba(255, 128, 0, 1)'];
		return(
			<Card title="客群分布" className={styles['distri-chart-wrapper']}>
				<Pie data={regularList} colorArray={colorArray} />
			</Card>
		);
	}
}
export default DistriChart;