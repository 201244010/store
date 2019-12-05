import React from 'react';
import { Button, Card } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-locale';
import styles from './SubscriptionSuccess.less';

@connect(
	_,
	(dispatch) => ({
		navigateTo: (pathId, urlParams) => dispatch({
			type: 'menu/goToPath',
			payload: {
				pathId,
				urlParams
			}
		}),
		// getStorageListByOrder: (orderId) => dispatch({
		// 	type: ''
		// })

	}))
class SubscriptionSuccess extends React.Component{

	render(){
		const { navigateTo } = this.props;
		return(
			<Card className={styles['subscription-success-container']} bordered={false}>
				<div className={styles['sucess-icon']} />
				<div className={styles['success-tip']}>{formatMessage({id: 'cloudStorage.service.success.subscribe'})}</div>
				<Button type="primary" onClick={() => navigateTo('serviceManagement')} className={styles.btn}>{formatMessage({id: 'cloudStorage.service.management'})}</Button>
				{/* <Button className={styles.btn} onClick={() => navigateTo('cloudStorage')}>{formatMessage({id: 'cloudStorage.back'})}</Button> */}
			</Card>
		);
	}
}

export default SubscriptionSuccess;