import React, { PureComponent } from 'react';

import styles from './index.less';

class NoDataTip extends PureComponent {
	render() {
		const { tipText } = this.props;
		console.log('tipText=', tipText);
		return(
			<div className={styles['no-data-tip']}>
				<div className={styles['tip-img']} />
				<span className={styles['tip-text']}>{tipText}</span>
			</div>
		);
	}
}
export default NoDataTip;