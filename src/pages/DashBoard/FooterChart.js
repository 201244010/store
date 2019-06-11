import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Radio } from 'antd';
import Charts from '@/components/Charts';

import styles from './DashBoard.less';

const { Pie } = Charts;

class FooterChart extends Component {
	render() {
		return (
			<div className={styles['footer-chart-wrapper']}>
				<div className={styles['title-wrapper']}>
					<div className={styles['chart-title']}>
						{formatMessage({ id: 'dashBoard.payment' })}
					</div>
					<div className={styles['title-btn-bar']}>
						<Radio.Group defaultValue={0}>
							<Radio.Button value={0}>
								{formatMessage({ id: 'dashBoard.order.sales' })}
							</Radio.Button>
							<Radio.Button value={1}>
								{formatMessage({ id: 'dashBoard.order.count' })}
							</Radio.Button>
						</Radio.Group>
					</div>
				</div>

				<div className={styles['content-wrapper']}>
					<Pie />
				</div>
			</div>
		);
	}
}

export default FooterChart;