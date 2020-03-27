import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';

import styles from './index.less';

class NoDataTip extends PureComponent {
	render() {
		// const { tipText } = this.props;
		// console.log('tipText=', tipText);
		return(
			<div className={styles['no-data-tip']}>
				<div className={styles['tip-img']} />
				<div className={styles['tip-text']}>
					<span>{formatMessage({ id: 'databoard.nodata.tip1'})}</span>
					<span>{formatMessage({ id: 'databoard.passenger.nodata.tip2'})}</span>
				</div>
			</div>
		);
	}
}
export default NoDataTip;