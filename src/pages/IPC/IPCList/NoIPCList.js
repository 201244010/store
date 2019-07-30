import React from 'react';
import { Button } from 'antd';
import { formatMessage } from 'umi/locale';

import styles from './IPCList.less';

class NoIPCList extends React.Component {

	render(){
		return(
			<div className={styles['no-device']}>
				<div className={styles['ipc-pic']} />
				<h2>{formatMessage({id: 'ipcList.noDevice.addIPC.tips'})}</h2>
				<div className={styles.tips}>
					<div className={styles['tips-item']}><span className={styles.num}>1</span>{formatMessage({id: 'ipcList.noDevice.addIPC.first.step'})}<span className={styles['blue-span']}>{formatMessage({id: 'ipcList.noDevice.addIPC.first.step.blue'})}</span></div>
					<div className={styles['tips-item']}><span className={styles.num}>2</span>{formatMessage({id: 'ipcList.noDevice.addIPC.second.step'})}</div>
				</div>
				<Button
					className={styles['device-link']}
					type="primary"
				>
					{formatMessage({id: 'ipcList.link.ipc'})}
				</Button>
			</div>
		);
	}
	
}

export default NoIPCList;