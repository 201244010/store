import React, { Component } from 'react';
import { Switch, Icon, Tooltip } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './NVRManagement.less';


class NVRTitle extends Component { 
	render(){
		const { onChange, checked, loading } = this.props;
		return(
			<div className={styles['nvr-title']}>
				<span className={styles['title-txt']}>{formatMessage({ id: 'nvrManagement.title' })}</span>
				<Switch className={styles['nvr-switch']} defaultChecked onChange={onChange} checked={checked} loading={loading} />
				{checked &&
				<Tooltip 
					placement="right" 
					title={formatMessage({ id: 'nvrManagement.tips' })}
					overlayClassName={styles.tooltip}
				>
					<Icon 
						className={styles['info-icon']} 
						type="info-circle"
						style={{
							fontSize: 22,
						}}
					/>
				</Tooltip>
				}
			</div>
		);
	}
}

export default NVRTitle;