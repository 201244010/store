import React from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Button, Input, Radio, Cascader } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Storage from '@konata9/storage.js';
import * as CookieUtil from '@/utils/cookies';
import styles from './StoreManagement.less';
import { getLocationParam } from '@/utils/utils';
import { customValidate } from '@/utils/customValidate';
import { FORM_FORMAT, HEAD_FORM_ITEM_LAYOUT } from '@/constants/form';

const FormItem = Form.Item;

@connect(
	state => ({
		store: state.store,
	}),
	dispatch => ({
		createNewStore: payload => dispatch({ type: 'store/createNewStore', payload }),
		updateStore: payload => dispatch({ type: 'store/updateStore', payload }),
		getShopTypeList: () => dispatch({ type: 'store/getShopTypeList' }),
		getRegionList: () => dispatch({ type: 'store/getRegionList' }),
		getStoreDetail: payload => dispatch({ type: 'store/getStoreDetail', payload }),
		clearState: () => dispatch({ type: 'store/clearState' }),
	})
)
@Form.create()
class CreateStore extends React.Component {
	componentDidMount() {
		const { getShopTypeList, getRegionList, getStoreDetail, clearState } = this.props;
		const [action = 'create', shopId] = [
			getLocationParam('action'),
			getLocationParam('shopId'),
		];

		if (action === 'create') {
			clearState();
		} else if (action === 'edit') {
			getStoreDetail({ options: { shop_id: shopId } });
		}

		if (!Storage.get('__shopTypeList__', 'local')) {
			getShopTypeList();
		}

		if (!Storage.get('__regionList__', 'local')) {
			getRegionList();
		}
	}

	handleSubmit = () => {
		const [action = 'create', shopId] = [
			getLocationParam('action'),
			getLocationParam('shopId'),
		];
		const companyId = CookieUtil.getCookieByKey(CookieUtil.COMPANY_ID_KEY);
		const {
			form: { validateFields },
			createNewStore,
			updateStore,
		} = this.props;

		validateFields((err, values) => {
			if (!err) {
				const options = {
					...values,
					shop_id: shopId,
					company_id: companyId,
					type_one: values.shopType[0] || null,
					type_two: values.shopType[1] || null,
					province: values.region[0] || null,
					city: values.region[1] || null,
					area: values.region[2] || null,
				};

				if (action === 'create') {
					createNewStore({ options });
				} else if (action === 'edit') {
					updateStore({ options });
				} else {
					createNewStore({ options });
				}
			}
		});
	};

	render() {
		const {
			form: { getFieldDecorator },
			store: {
				shopType_list,
				regionList,
				loading,
				storeInfo: {
					shop_name,
					type_one = null,
					type_two = null,
					business_status,
					province = null,
					city = null,
					area = null,
					address,
					business_hours,
					contact_person,
					contact_tel,
				},
			},
		} = this.props;
		const [action = 'create'] = [getLocationParam('action')];

		return (
			<div className={styles.storeList}>
				<h3>
					{action === 'create'
						? formatMessage({ id: 'storeManagement.create.title' })
						: formatMessage({ id: 'storeManagement.alter.title' })}
				</h3>
				<Form
					{...{
						...FORM_FORMAT,
						...HEAD_FORM_ITEM_LAYOUT,
					}}
				>
					<FormItem label={formatMessage({ id: 'storeManagement.create.nameLabel' })}>
						{getFieldDecorator('shop_name', {
							initialValue: shop_name,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'storeManagement.create.nameMessage',
									}),
								},
							],
						})(
							<Input
								maxLength={20}
								placeholder={formatMessage({
									id: 'storeManagement.create.namePlaceHolder',
								})}
							/>
						)}
					</FormItem>
					<FormItem label={formatMessage({ id: 'storeManagement.create.typeLabel' })}>
						{getFieldDecorator('shopType', {
							initialValue: [
								type_one ? `${type_one}` : null,
								type_two ? `${type_two}` : null,
							],
						})(
							<Cascader
								placeholder={formatMessage({
									id: 'storeManagement.create.typePlaceHolder',
								})}
								options={shopType_list}
							/>
						)}
					</FormItem>
					<FormItem label={formatMessage({ id: 'storeManagement.create.statusLabel' })}>
						{getFieldDecorator('business_status', {
							initialValue: business_status || 0,
						})(
							<Radio.Group>
								<Radio value={0}>
									{formatMessage({ id: 'storeManagement.create.status.open' })}
								</Radio>
								<Radio value={1} disabled={action === 'create'}>
									{formatMessage({ id: 'storeManagement.create.status.closed' })}
								</Radio>
							</Radio.Group>
						)}
					</FormItem>
					<FormItem label={formatMessage({ id: 'storeManagement.create.address' })}>
						{getFieldDecorator('region', {
							initialValue: [
								province ? `${province}` : null,
								city ? `${city}` : null,
								area ? `${area}` : null,
							],
						})(
							<Cascader
								options={regionList}
								placeholder={formatMessage({
									id: 'storeManagement.create.address.region',
								})}
							/>
						)}
					</FormItem>
					<FormItem label=" " colon={false}>
						{getFieldDecorator('address', {
							initialValue: address,
						})(
							<Input
								placeholder={formatMessage({
									id: 'storeManagement.create.address.detail',
								})}
							/>
						)}
					</FormItem>
					<FormItem label={formatMessage({ id: 'storeManagement.create.daysLabel' })}>
						{getFieldDecorator('business_hours', {
							initialValue: business_hours,
						})(<Input />)}
					</FormItem>
					<FormItem label={formatMessage({ id: 'storeManagement.create.contactName' })}>
						{getFieldDecorator('contact_person', {
							initialValue: contact_person,
						})(<Input />)}
					</FormItem>
					<FormItem label={formatMessage({ id: 'storeManagement.create.contactPhone' })}>
						{getFieldDecorator('contact_tel', {
							initialValue: contact_tel,
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
					</FormItem>
					<FormItem label=" " colon={false}>
						<Button loading={loading} type="primary" onClick={this.handleSubmit}>
							{formatMessage({ id: 'btn.save' })}
						</Button>
						<Button
							style={{ marginLeft: '20px' }}
							htmlType="button"
							onClick={() => {
								router.push('list');
							}}
						>
							{formatMessage({ id: 'btn.cancel' })}
						</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
}

export default CreateStore;
