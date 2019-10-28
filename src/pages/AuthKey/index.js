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
		getAuthKey: ({ shopId }) => dispatch({ type: 'store/getAuthKey', payload: { shopId } }),
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
		const { getAuthKey, shopId = null } = this.props;
		this.setState({ displayAuth: true });
		getAuthKey({ shopId });
	};

	closeAuthModal = () => {
		this.setState({ displayAuth: false });
	};

	render() {
		const { displayAuth } = this.state;
		const {
			authKey: { sunmiShopNo = null, sunmiShopKey = null } = {},
			loading,
			type = 'button',
			className = '',
		} = this.props;

		return (
			<>
				{type === 'link' ? (
					<a
						href="javascript:void(0);"
						className={className}
						onClick={this.openAuthModal}
					>
						{formatMessage({ id: 'store.get.authKey' })}
					</a>
				) : (
					<Button className={className} onClick={this.openAuthModal}>
						{formatMessage({ id: 'store.get.authKey' })}
					</Button>
				)}
				<Modal
					title={formatMessage({ id: 'store.authKey' })}
					visible={displayAuth}
					footer={
						<Button type="primary" onClick={this.closeAuthModal}>
							{formatMessage({ id: 'btn.confirm' })}
						</Button>
					}
					onCancel={this.closeAuthModal}
				>
					<Spin spinning={loading.effects['store/getAuthKey']}>
						<div className={styles['auth-info']}>
							<span>{formatMessage({ id: 'auth.shop.no' })}</span>
							{sunmiShopNo}
						</div>
						<div className={styles['auth-info']}>
							<span>{formatMessage({ id: 'auth.shop.key' })}</span>
							{sunmiShopKey}
						</div>
						<div className={`${styles['auth-info']} ${styles['auth-desc']}`}>
							{formatMessage({ id: 'auth.key.expire' })}
						</div>
					</Spin>
				</Modal>
			</>
		);
	}
}

export default AuthKey;
