import React from 'react';
import { formatMessage } from 'umi/locale';

import styles from './IPCList.less';

class NoIPCList extends React.Component {

	render(){
		return(
			<div className={styles['no-device']}>
				<div className={styles['qr-code-container']}>
					<div className={styles['ipc-qr-code']}>
						<div className={styles['scan-border']}>
							<div className={`${styles.border} ${styles['border-top-left']}`} />
							<div className={`${styles.border} ${styles['border-top-right']}`} />
							<div className={`${styles.border} ${styles['border-bottom-left']}`} />
							<div className={`${styles.border} ${styles['border-bottom-right']}`} />
						</div>
					</div>
				</div>
				<div className={styles.tips}>
					<div className={styles['tips-item']}>{formatMessage({id: 'ipcList.noDevice.first.tips'})}</div>
					<div className={styles['tips-item']}>{formatMessage({id: 'ipcList.noDevice.second.tips'})}</div>
				</div>
			</div>
		);
	}
	
}

export default NoIPCList;