import React, { Component } from 'react';
import { Switch } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './NVRManagement.less';


class NVRTitle extends Component { 
	render(){
		const { onChange, checked, loading } = this.props;
		return(
			<div className={styles['nvr-title']}>
				<span className={styles['title-txt']}>{formatMessage({ id: 'nvrManagement.title' })}</span>
				<Switch defaultChecked onChange={onChange} checked={checked} loading={loading} />
			</div>
		);
	}
}

export default NVRTitle;