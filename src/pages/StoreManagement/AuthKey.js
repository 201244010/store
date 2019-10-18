import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Button, Modal, Spin } from 'antd';
import styles from './authKey.less';

@connect(
	({ store, loading }) => ({
		loading,
		authKey: store.authKey,
	}),
	dispatch => ({
		getAuthKey: () => dispatch({ type: 'store/getAuthKey' }),
	})
)
class AuthKey extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			displayAuth: false,
		};
	}

	openAuthModal = () => {
		const { getAuthKey } = this.props;
		this.setState({ displayAuth: true });
		getAuthKey();
	};

	closeAuthModal = () => {
		this.setState({ displayAuth: false });
	};

	render() {
		const { displayAuth } = this.state;
		const { authKey: { sunmiShopNo = null, sunmiShopKey = null } = {}, loading } = this.props;

		return (
			<>
				<Button className={styles['btn-margin-left']} onClick={this.openAuthModal}>
					{formatMessage({ id: 'store.get.authKey' })}
				</Button>
				<Modal
					title={formatMessage({ id: 'store.get.authKey' })}
					visible={displayAuth}
					footer={null}
					onCancel={this.closeAuthModal}
				>
					<Spin spinning={loading.effects['store/getAuthKey']}>
						<div className={styles['auth-info']}>
							<span>{formatMessage({ id: 'auth.shop.no' })}</span>
							{sunmiShopNo}
						</div>
						<div className={styles['auth-info']}>
							<span>{formatMessage({ id: 'auth.shop.no' })}</span>
							{sunmiShopKey}
						</div>
					</Spin>
				</Modal>
			</>
		);
	}
}

export default AuthKey;
