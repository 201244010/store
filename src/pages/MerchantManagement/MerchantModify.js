import React, { Component } from 'react';
import { Form, Button, Input, Card } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { FORM_ITEM_LAYOUT_BUSINESS } from '@/constants/form';
import { customValidate } from '@/utils/customValidate';
import * as CookieUtil from '@/utils/cookies';
import styles from './Merchant.less';
import { ERROR_OK } from '@/constants/errorCode';

@connect(
	state => ({
		merchant: state.merchant,
	}),
	dispatch => ({
		companyGetInfo: () => dispatch({ type: 'merchant/companyGetInfo' }),
		companyUpdate: payload => dispatch({ type: 'merchant/companyUpdate', payload }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
@Form.create()
class MerchantModify extends Component {
	componentDidMount() {
		const { companyGetInfo } = this.props;
		companyGetInfo();
	}

	saveInfo = () => {
		const {
			form: { validateFields, setFields },
			companyUpdate,
		} = this.props;
		validateFields(async (err, values) => {
			if (!err) {
				const payload = {
					options: {
						company_id: CookieUtil.getCookieByKey(CookieUtil.COMPANY_ID_KEY),
						company_name: values.companyName,
						contact_person: values.contactPerson,
						contact_tel: values.contactTel,
						contact_email: values.contactEmail,
					},
				};
				const response = await companyUpdate(payload);
				if (response && response.code !== ERROR_OK) {
					setFields({
						companyName: {
							value: values.companyName,
							errors: [
								new Error(
									formatMessage({
										id: 'merchantManagement.merchant.existed.error',
									})
								),
							],
						},
					});
				}
			}
		});
	};

	cancel = () => {
		const { goToPath } = this.props;
		goToPath('merchantView');
		// router.push(`${MENU_PREFIX.MERCHANT}/view`);
	};

	render() {
		const {
			form: { getFieldDecorator },
			merchant: {
				loading,
				companyInfo: {
					companyName,
					contactPerson,
					contactTel,
					contactEmail,
				},
			},
		} = this.props;
		return (
			<Card bordered={false}>
				<h1>{formatMessage({ id: 'merchantManagement.merchant.modify' })}</h1>
				<div className={styles['form-content']}>
					<Form {...FORM_ITEM_LAYOUT_BUSINESS}>
						<Form.Item
							label={formatMessage({ id: 'merchantManagement.merchant.name' })}
						>
							{getFieldDecorator('companyName', {
								initialValue: companyName,
								validateTrigger: 'onBlur',
								rules: [
									{
										required: true,
										message: formatMessage({
											id: 'merchantManagement.merchant.inputMerchant',
										}),
									},
								],
							})(<Input maxLength={40} />)}
						</Form.Item>
						<Form.Item
							label={formatMessage({
								id: 'merchantManagement.merchant.contactPerson',
							})}
						>
							{getFieldDecorator('contactPerson', {
								initialValue: contactPerson,
							})(<Input />)}
						</Form.Item>
						<Form.Item
							label={formatMessage({
								id: 'merchantManagement.merchant.contactPhone',
							})}
						>
							{getFieldDecorator('contactTel', {
								initialValue: contactTel,
								validateTrigger: 'onBlur',
								rules: [
									{
										validator: (rule, value, callback) =>
											customValidate({
												field: 'telephone',
												rule,
												value,
												callback,
											}),
									},
								],
							})(<Input />)}
						</Form.Item>
						<Form.Item
							label={formatMessage({
								id: 'merchantManagement.merchant.contactEmail',
							})}
						>
							{getFieldDecorator('contactEmail', {
								initialValue: contactEmail,
								validateTrigger: 'onBlur',
								rules: [
									{
										type: 'email',
										message: formatMessage({ id: 'mail.validate.isFormatted' }),
									},
								],
							})(<Input />)}
						</Form.Item>
						<Form.Item label=" " colon={false}>
							<Button type="primary" loading={loading} onClick={this.saveInfo}>
								{formatMessage({ id: 'btn.save' })}
							</Button>
							<Button style={{ marginLeft: 20 }} onClick={this.cancel}>
								{formatMessage({ id: 'btn.cancel' })}
							</Button>
						</Form.Item>
					</Form>
				</div>
			</Card>
		);
	}
}

export default MerchantModify;
