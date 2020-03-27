import React, { Component } from 'react';
import { connect } from 'dva';
import { ROLE_MAPPING } from '@/constants/mapping';
import BasicInfo from './BasicInfo';
import Security from './Security';
import Store from './Store';
import * as styles from './Account.less';

@connect(
	state => ({
		user: state.user,
		sso: state.sso,
		merchant: state.merchant,
		role: state.role,
	}),
	dispatch => ({
		logout: () => dispatch({ type: 'user/logout' }),
		updateUsername: payload => dispatch({ type: 'user/updateUsername', payload }),
		changePassword: payload => dispatch({ type: 'user/changePassword', payload }),
		updatePhone: payload => dispatch({ type: 'user/updatePhone', payload }),
		updateIcon: payload => dispatch({ type: 'user/updateIcon', payload }),
		sendCode: payload => dispatch({ type: 'sso/sendCode', payload }),
		checkUserExist: payload => dispatch({ type: 'user/checkUserExist', payload }),
		getCompanyList: () => dispatch({ type: 'merchant/getCompanyList' }),
		goToPath: (pathId, urlParams = {}, linkType = null) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams, linkType } }),
	})
)
class UserCenter extends Component {
	componentDidMount() {
		const { getCompanyList } = this.props;
		getCompanyList();
	}

	render() {
		const {
			user,
			sso,
			role: { userPermissionList = [] } = {},
			updateUsername,
			changePassword,
			updatePhone,
			sendCode,
			updateIcon,
			checkUserExist,
			goToPath,
			logout,
		} = this.props;

		return (
			<div className={styles['account-wrapper']}>
				<BasicInfo
					{...{
						user,
						updateUsername,
						updateIcon,
					}}
				/>
				<Security
					{...{
						user,
						sso,
						changePassword,
						updatePhone,
						sendCode,
						checkUserExist,
						goToPath,
						logout,
					}}
				/>
				{userPermissionList.find(
					permission => permission.path === ROLE_MAPPING.COMPANY_LIST
				) && <Store />}
			</div>
		);
	}
}

export default UserCenter;
