import React, { Component } from 'react';
import { formatMessage, getLocale } from 'umi/locale';
import { connect } from 'dva';
import { Tabs, Form, Button, Modal } from 'antd';
import Storage from '@konata9/storage.js';
import { encryption } from '@/utils/utils';
import * as CookieUtil from '@/utils/cookies';
import AccountLogin from './AccountLogin';
import AccountLoginLocal from './AccountLoginLocal';
import MobileLogin from './MobileLogin';
import RegisterModal from '@/pages/User/Register/RegisterModal';
import ResetModal from '@/pages/User/ResetPassword/ResetModal';
import * as Regexp from '@/constants/regexp';
import { ERROR_OK, ALERT_NOTICE_MAP, USER_NOT_EXIST } from '@/constants/errorCode';
import { KEY } from '@/constants';
import { env } from '@/config';
import styles from './Login.less';

const VALIDATE_FIELDS = {
	tabAccount: ['username', 'password'],
	tabMobile: ['phone', 'code'],
};

const tabBarStyle = {
	fontSize: '16px',
	color: '#525866',
	textAlign: 'center',
	border: 'none',
};

@connect(
	state => ({
		user: state.user,
		sso: state.sso,
		merchant: state.merchant,
		store: state.store,
		loading: state.loading,
	}),
	dispatch => ({
		clearStorage: () => dispatch({ type: 'global/clearStorage' }),
		userLogin: payload => dispatch({ type: 'user/login', payload }),
		checkImgCode: payload => dispatch({ type: 'user/checkImgCode', payload }),
		checkUser: payload => dispatch({ type: 'sso/checkUser', payload }),
		sendCode: payload => dispatch({ type: 'sso/sendCode', payload }),
		getImageCode: () => dispatch({ type: 'sso/getImageCode' }),
		getCompanyList: () => dispatch({ type: 'merchant/getCompanyList' }),
		getStoreList: payload => dispatch({ type: 'store/getStoreList', payload }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
@Form.create()
class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			notice: '',
			currentTab: 'tabAccount',
			showRegisterModal: false,
			showResetModal: false,
		};
	}

	componentDidMount() {
		const { clearStorage } = this.props;
		clearStorage();
		document.addEventListener('keydown', this.handleKeyDown);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeyDown);
	}

	onTabChange = tabName => {
		this.setState({
			notice: '',
			currentTab: tabName,
		});
	};

	openModalForm = (name = 'register') => {
		const modalName = name === 'register' ? 'showRegisterModal' : 'showResetModal';
		this.setState({
			[modalName]: true,
		});
	};

	closeModalForm = (name = 'register') => {
		const modalName = name === 'register' ? 'showRegisterModal' : 'showResetModal';
		this.setState({
			[modalName]: false,
		});
	};

	showAccountMergeModal = (path = '/') => {
		Modal.confirm({
			icon: 'info-circle',
			title: formatMessage({ id: 'account.merge.title' }),
			content: formatMessage({ id: 'account.merge.content' }),
			okText: formatMessage({ id: 'btn.confirm' }),
			cancelText: formatMessage({ id: 'btn.cancel' }),
			onOk: () => window.open(path),
		});
	};

	checkStoreExist = async () => {
		const { getStoreList, goToPath } = this.props;
		const response = await getStoreList({});
		if (response && response.code === ERROR_OK) {
			const result = response.data || {};
			const shopList = result.shop_list || [];
			Storage.set({ [CookieUtil.SHOP_LIST_KEY]: shopList }, 'local');
			if (shopList.length === 0) {
				CookieUtil.removeCookieByKey(CookieUtil.SHOP_ID_KEY);
				goToPath('storeCreate');
				// router.push(`${MENU_PREFIX.STORE}/createStore`);
			} else {
				const lastStore = shopList.length;
				const defaultStore = shopList[lastStore - 1] || {};
				CookieUtil.setCookieByKey(CookieUtil.SHOP_ID_KEY, defaultStore.shop_id);
				goToPath('root');
				// router.push('/');
			}
		}
	};

	checkCompanyList = async () => {
		const { getCompanyList, goToPath } = this.props;
		const response = await getCompanyList({});
		if (response && response.code === ERROR_OK) {
			const data = response.data || {};
			const companyList = data.company_list || [];
			const companys = companyList.length;
			if (companys === 0) {
				// router.push('/user/merchantCreate');
				goToPath('userMerchant');
			} else if (companys === 1) {
				this.checkStoreExist();
			} else {
				goToPath('userStore');
				// router.push('/user/storeRelate');
			}
		} else {
			goToPath('userLogin');
			// router.push('/user/login');
		}
	};

	handleResponse = async response => {
		const { currentTab } = this.state;
		const {
			form: { getFieldValue },
			checkUser,
		} = this.props;

		if (response && response.code === ERROR_OK) {
			const checkUserName =
				currentTab === 'tabAccount' ? getFieldValue('username') : getFieldValue('phone');
			if (env !== 'local') {
				const result = await checkUser({ options: { username: checkUserName } });
				if (result && result.code === ERROR_OK) {
					const {
						location: { origin },
					} = window;
					const data = result.data || {};
					if (data.needMerge) {
						this.showAccountMergeModal(`${data.url}&from=${origin}/user/login`);
					} else {
						this.checkCompanyList();
					}
				}
			} else {
				this.checkCompanyList();
			}
		} else if (response.code === USER_NOT_EXIST) {
			const checkUserName =
				currentTab === 'tabAccount' ? getFieldValue('username') : getFieldValue('phone');
			let type = 'other';
			if (Regexp.mail.test(checkUserName)) {
				type = 'mail';
			} else if (Regexp.cellphone.test(checkUserName)) {
				type = 'mobile';
			}
			this.setState({
				notice: `${response.code}-${type}` || '',
			});
		} else if (Object.keys(ALERT_NOTICE_MAP).includes(`${response.code}`)) {
			this.setState({
				notice: response.code || '',
			});
		}
	};

	doLogin = async (loginType, values) => {
		const { userLogin } = this.props;
		const options = {
			...values,
			password: encryption(values.password),
		};

		const response = await userLogin({
			type: loginType,
			options,
		});
		this.handleResponse(response);
	};

	onSubmit = () => {
		const {
			form: { validateFields, getFieldValue, setFields },
			user: { errorTimes },
			sso: { imgCode },
			checkImgCode,
			getImageCode,
		} = this.props;
		const { currentTab } = this.state;
		const loginType = currentTab === 'tabAccount' ? 'login' : 'quickLogin';

		validateFields(VALIDATE_FIELDS[currentTab], async (err, values) => {
			if (!err) {
				if (errorTimes > 2 && currentTab === 'tabAccount') {
					const code = getFieldValue('vcode');
					if (!code) {
						setFields({
							vcode: {
								errors: [new Error(formatMessage({ id: 'code.validate.isEmpty' }))],
							},
						});
					} else {
						const result = await checkImgCode({
							options: {
								code: getFieldValue('vcode') || '',
								key: imgCode.key || '',
							},
						});

						if (result && result.code === ERROR_OK) {
							this.doLogin(loginType, values);
						} else {
							if (Object.keys(ALERT_NOTICE_MAP).includes(`${result.code}`)) {
								this.setState({
									notice: result.code,
								});
							}
							getImageCode();
						}
					}
				} else {
					this.doLogin(loginType, values);
				}
			}
		});
	};

	handleKeyDown = e => {
		if (e.keyCode === KEY.ENTER) {
			this.onSubmit();
		}
	};

	render() {
		const { notice, showRegisterModal, showResetModal } = this.state;
		const {
			form,
			getImageCode,
			sendCode,
			sso: { imgCode, imgCaptcha, needImgCaptcha },
			user: { errorTimes },
			loading,
		} = this.props;
		const currentLanguage = getLocale();

		return (
			<div className={styles['login-warp']}>
				<Form>
					<Tabs
						animated={false}
						defaultActiveKey="tabAccount"
						tabBarGutter={currentLanguage === 'zh-CN' && env !== 'local' ? 64 : 0}
						tabBarStyle={tabBarStyle}
						onChange={this.onTabChange}
					>
						<Tabs.TabPane
							tab={formatMessage({ id: 'login.useAccount' })}
							key="tabAccount"
							style={{ padding: '0 2px' }}
						>
							{env !== 'local' ? (
								<AccountLogin
									{...{
										form,
										getImageCode,
										imgCode,
										notice,
										errorTimes,
									}}
								/>
							) : (
								<AccountLoginLocal
									{...{
										form,
										notice,
									}}
								/>
							)}
						</Tabs.TabPane>
						{currentLanguage === 'zh-CN' && env !== 'local' && (
							<Tabs.TabPane
								tab={formatMessage({ id: 'login.useMobile' })}
								key="tabMobile"
								style={{ padding: '0 2px' }}
							>
								<MobileLogin
									{...{
										form,
										sendCode,
										imgCaptcha,
										needImgCaptcha,
										notice,
									}}
								/>
							</Tabs.TabPane>
						)}
					</Tabs>
					<Form.Item className={styles['formItem-margin-clear']}>
						<Button
							className={`${styles['primary-btn']} ${styles['login-primary-button']}`}
							size="large"
							loading={
								loading.effects['user/login'] ||
								loading.effects['sso/checkUser'] ||
								loading.effects['merchant/getCompanyList']
							}
							block
							onClick={this.onSubmit}
						>
							{formatMessage({ id: 'btn.login' })}
						</Button>
					</Form.Item>
				</Form>
				<div className={styles['login-footer']}>
					{currentLanguage === 'zh-CN' ? (
						<a
							onClick={() => this.openModalForm('reset')}
							href="javascript:void(0);"
							className={`${styles['link-common']}`}
						>
							{formatMessage({ id: 'link.forgot.password' })}
						</a>
					) : (
						<div />
					)}
					<a
						onClick={() => this.openModalForm('register')}
						href="javascript:void(0);"
						className={`${styles['link-active']}`}
					>
						{formatMessage({ id: 'link.to.register' })}
					</a>
				</div>

				<RegisterModal
					{...{
						visible: showRegisterModal,
						onCancel: () => this.closeModalForm('register'),
					}}
				/>

				<ResetModal
					{...{
						visible: showResetModal,
						onCancel: () => this.closeModalForm('reset'),
					}}
				/>
			</div>
		);
	}
}

export default Login;
