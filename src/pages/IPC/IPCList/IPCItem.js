import React from 'react';
import { Button, Col, Card } from 'antd';
import { formatMessage } from 'umi/locale';

import styles from './IPCList.less';

class IPCItem extends React.Component {

	render(){
		const { empty, isOnline, img, sn, type, name, listLength, onClickPlay, onClickSetting } = this.props;
		return(
			<div>
				{!empty&&isOnline&&
					<Col span={listLength <= 4 ? 12 : 6} className={styles.col}>
						<Card
							className={styles.card}
							bodyStyle={{ padding: 0, margin: 0 }}
							cover={img ? <img alt="example" src={img} /> : <div className={styles['no-pic']} />}
						/>
						{sn&&
							<Button
								className={styles['setting-btn']}
								size='small'
								onClick={() => {
									onClickSetting(sn);
								}}
							>
								{formatMessage({id: 'ipcList.setting'})}
							</Button>
						}
						{sn&&
						<a
							className={styles.play}
							// href='javascript:void(0);'
							onClick={() => {
								onClickPlay(sn);
							}}
						>
							play
						</a>
						}
						<div
							className={styles['ipc-name-type']}
						>
							{`${name || formatMessage({id: 'ipcList.noIPCName'})} (${ type || formatMessage({id: 'ipcList.noIPCType'})})`}
						</div>
					</Col>
				}
				{!empty&&!isOnline&&
					<Col span={listLength <= 4 ? 12 : 6} className={styles.col}>
						<Card
							className={styles['outline-card']}
							bodyStyle={{ padding: 0, margin: 0 }}
							cover={img ? 
								<img alt="example" src={img} /> : 
								<div className={styles['no-pic']} />
							}
						/>
						{sn&&
							<Button
								className={styles['setting-btn']}
								size='small'
								onClick={() => {
									onClickSetting(sn);
								}}
							>
								{formatMessage({id: 'ipcList.setting'})}
							</Button>
						}
						<div className={styles['offline-play']}>
							{sn&&
							<a
								className={(type === 'FM010' || type === 'SS1') ? styles['ss-offline-play'] : styles['fs-offline-play']}
								// href='javascript:void(0);'
								onClick={() => {
									onClickPlay(sn);
								}}
							>
							play
							</a>
							}
							<div className={styles['offline-tips']}>
								<h3>{(type === 'FM010' || type === 'SS1') ?
									formatMessage({id: 'ipcList.devices.ss.outline.tips'}) :
									formatMessage({id: 'ipcList.devices.fs.outline.tips'})}
								</h3>
							</div>
						</div>
						<div
							className={styles['ipc-name-type']}
						>
							{`${name || formatMessage({id: 'ipcList.noIPCName'})} (${ type || formatMessage({id: 'ipcList.noIPCType'})})`}
						</div>
					</Col>
				}
				{empty&&
					<Col span={listLength <= 4 ? 12 : 6} className={styles.col}>
						<Card
							className={styles.empty}
							bodyStyle={{ padding: 0 }}
						/>
					</Col>
				}
			</div>
		);
	}

}

export default IPCItem;