import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { connect } from 'dva';
import { Button, Form, Input } from 'antd';
import * as CookieUtil from '@/utils/cookies';
import { ERROR_OK } from '@/constants/errorCode';
import { MENU_PREFIX } from '@/constants';
import Storage from '@konata9/storage.js';
import styles from './StoreRelate.less';

const MerchantCreate = props => {
	const { getFieldDecorator, loading, createMerchant } = props;
	return (
		<>
			<h1 className={styles['store-title']}>
				{formatMessage({ id: 'merchantManagement.merchant.welcome' })}
			</h1>
			<div className={styles['store-content']}>
				<Form>
					<Form.Item>
						{getFieldDecorator('company_name', {
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'merchantManagement.merchant.inputMerchant',
									}),
								},
							],
						})(
							<Input
								maxLength={40}
								style={{ height: 42 }}
								placeholder={formatMessage({
									id: 'merchantManagement.merchant.inputMerchant',
								})}
							/>,
						)}
					</Form.Item>
					<div>
						<Button
							className={`${styles['primary-btn']} ${styles['create-brn']}`}
							loading={loading}
							type="primary"
							block
							onClick={createMerchant}
						>
							{formatMessage({
								id: 'merchantManagement.merchant.createMerchant',
							})}
						</Button>
					</div>
				</Form>
				<p className={styles['mechant-description']}>
					{formatMessage({ id: 'merchantManagement.merchant.joinMerchant' })}
				</p>
			</div>
		</>
	);
};

const MerchantInfo = props => {
	const {
		getFieldDecorator,
		companyList,
		hoverIndex,
		iconStyle,
		loading,
		changeButtonStyles,
		createMerchant,
		enterSystem,
	} = props;

	return (
		<>
			{companyList.length > 0 ? (
				<>
					<h1 className={styles['store-title']}>
						{formatMessage({ id: 'relatedStore.choose' })}
					</h1>
					<div className={styles['store-list-wrapper']}>
						<div className={styles['store-list']}>
							{companyList.map((company, index) => (
								<Button
									key={company.company_id}
									onMouseOver={() => changeButtonStyles('add', index)}
									onMouseLeave={() => changeButtonStyles('remove', index)}
									onClick={() => enterSystem(company)}
									className={styles['list-btn']}
									block
								>
									<span className={styles['btn-name']}>
										{company.company_name}
									</span>
									<span
										className={`${styles['btn-icon']}
                                            ${iconStyle === 'hover' &&
										hoverIndex === index &&
										styles['btn-icon-hover']}`}
									/>
								</Button>
							))}
						</div>
					</div>
				</>
			) : (
				<MerchantCreate {...{ getFieldDecorator, loading, createMerchant }} />
			)}
		</>
	);
};

@connect(
	state => ({
		merchant: state.merchant,
		store: state.store,
	}),
	dispatch => ({
		getStoreList: payload => dispatch({ type: 'store/getStoreList', payload }),
		companyCreate: payload => dispatch({ type: 'merchant/companyCreate', payload }),
		setCurrentCompany: payload => dispatch({ type: 'merchant/setCurrentCompany', payload }),
	}),
)
@Form.create()
class StoreRelate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			onHoverIndex: -1,
			iconStyle: '',
		};
	}

	checkStoreExist = async () => {
		const { getStoreList } = this.props;
		const response = await getStoreList({});
		if (response && response.code === ERROR_OK) {
			const result = response.data || {};
			const shopList = result.shop_list || [];
			Storage.set({ [CookieUtil.SHOP_LIST_KEY]: shopList }, 'local');
			if (shopList.length === 0) {
				CookieUtil.removeCookieByKey(CookieUtil.SHOP_ID_KEY);
				router.push(`${MENU_PREFIX.STORE}/createStore`);
			} else {
				const lastStore = shopList.length;
				const defaultStore = shopList[lastStore - 1] || {};
				CookieUtil.setCookieByKey(CookieUtil.SHOP_ID_KEY, defaultStore.shop_id);
				router.push('/');
			}
		}
	};

	changeButtonStyles = (type, index) => {
		this.setState({
			onHoverIndex: type === 'add' ? index : -1,
			iconStyle: type === 'add' ? 'hover' : '',
		});
	};

	enterSystem = company => {
		const { setCurrentCompany } = this.props;
		CookieUtil.setCookieByKey(CookieUtil.COMPANY_ID_KEY, company.company_id);
		setCurrentCompany({ companyId: company.company_id });
		this.checkStoreExist();
	};

	createMerchant = () => {
		const {
			form: { validateFields, setFields },
			companyCreate,
		} = this.props;
		validateFields(async (err, values) => {
			if (!err) {
				const response = await companyCreate({ ...values });
				if (response && response.code !== ERROR_OK) {
					setFields({
						company_name: {
							value: values.company_name || '',
							errors: [
								new Error(
									formatMessage({ id: 'merchantManagement.merchant.existed' }),
								),
							],
						},
					});
				} else {
					this.checkStoreExist();
				}
			}
		});
	};

	render() {
		const { iconStyle, onHoverIndex } = this.state;
		const {
			form: { getFieldDecorator },
			merchant: { companyList, loading },
		} = this.props;

		const {
			location: { pathname },
		} = window;

		return (
			<div className={styles['store-wrapper']}>
				{pathname.indexOf('merchantCreate') > -1 ? (
					<MerchantCreate
						{...{ getFieldDecorator, loading, createMerchant: this.createMerchant }}
					/>
				) : (
					<MerchantInfo
						{...{
							getFieldDecorator,
							companyList,
							hoverIndex: onHoverIndex,
							iconStyle,
							loading,
							changeButtonStyles: this.changeButtonStyles,
							createMerchant: this.createMerchant,
							enterSystem: this.enterSystem,
						}}
					/>
				)}
			</div>
		);
	}
}

export default StoreRelate;
