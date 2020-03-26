import React, { PureComponent } from 'react';
import { Card } from 'antd';
import SingleLine from '../Charts/Line/SingleLine';

import styles from './index.less';

class PassengerTrendLine extends PureComponent {
	render() {
		const { data, loading } = this.props;
		return(
			<Card className={styles['line-chart-wrapper']} title="客流趋势" loading={loading}>
				<SingleLine timeType={1} data={data} />
			</Card>
		);
	}
}
export default PassengerTrendLine;