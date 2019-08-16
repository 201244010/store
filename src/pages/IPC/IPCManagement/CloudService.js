import React, { Component } from 'react';
import { Card,Button } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import styles from './CloudService.less';


const mapStateToProps = (state) => {
	const { cloudService } = state;
	return {
		cloudService
	};
};
const mapDispatchToProps = (dispatch) => ({
	load: () => {
		dispatch({
			type: 'cloudService/read'
		});
	}
});

@connect(mapStateToProps, mapDispatchToProps)
class CloudService extends Component {
	state = {

	}

	render() {
		// console.log(this.props)
		const { cloudService } = this.props;
		const { isMember, isExpired, deadline } = cloudService;
		return (
			<Card bordered={false} className={styles.card} title={formatMessage({ id: 'cloudService.title' })}>


				<p className={styles.tips}>
					{isMember && isExpired ? formatMessage({ id: 'cloudService.renewalMsg' }):''}
					{isMember && !isExpired ? <span>{formatMessage({ id: 'cloudService.openMsg' })}{deadline}</span>:''}
					{!isMember ? formatMessage({ id: 'cloudService.closeMsg' }) :''}
				</p>

				<p className={styles.center}>
					<Button type="default">
						{isMember ? formatMessage({ id: 'cloudService.renewal' })
							: formatMessage({ id: 'cloudService.open' })}
					</Button>
				</p>

			</Card>
		);
	}
}
export default CloudService;