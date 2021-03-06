import React from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Button, Input, Radio, Cascader, Card, AutoComplete } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Storage from '@konata9/storage.js';
import * as CookieUtil from '@/utils/cookies';
import { getLocationParam } from '@/utils/utils';
import { customValidate } from '@/utils/customValidate';
import { FORM_FORMAT, HEAD_FORM_ITEM_LAYOUT } from '@/constants/form';
import * as RegExp from '@/constants/regexp';
import { STORE_EXIST } from '@/constants/errorCode';

const FormItem = Form.Item;

@connect(
	state => ({
		loading: state.loading,
		store: state.store,
	}),
	dispatch => ({
		createNewStore: payload => dispatch({ type: 'store/createNewStore', payload }),
		updateStore: payload => dispatch({ type: 'store/updateStore', payload }),
		getShopTypeList: () => dispatch({ type: 'store/getShopTypeList' }),
		getRegionList: () => dispatch({ type: 'store/getRegionList' }),
		getStoreDetail: payload => dispatch({ type: 'store/getStoreDetail', payload }),
		clearState: () => dispatch({ type: 'store/clearState' }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
@Form.create()
class CreateStore extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			addressSearchResult: [],
		};
	}

	componentDidMount() {
		const { getShopTypeList, getRegionList, getStoreDetail, clearState } = this.props;
		const [action = 'create', shopId] = [
			getLocationParam('action'),
			getLocationParam('shopId'),
		];

		if (action === 'create') {
			clearState();
		} else if (action === 'edit') {
			getStoreDetail({ options: { shopId } });
		}

		if (!Storage.get('__shopTypeList__', 'local')) {
			getShopTypeList();
		}

		if (!Storage.get('__regionList__', 'local')) {
			getRegionList();
		}
	}

	deepFindCity = (regionValues = []) => {
		const [province, city, ,] = regionValues;
		const regionList = Storage.get('__regionList__', 'local') || [];
		if (province && city) {
			const foundCity = (
				(regionList.find(provinceInfo => provinceInfo.province === province) || {})
					.children || []
			).find(cityInfo => cityInfo.city === city);
			return foundCity;
		}
		return null;
	};

	handleSelectSearch = value => {
		const {
			form: { getFieldValue },
		} = this.props;
		const regionValue = getFieldValue('region');
		const cityInfo = this.deepFindCity(regionValue);
		const { name = null } = cityInfo || {};

		AMap.plugin('AMap.Autocomplete', () => {
			const opts = { city: name || '全国', citylimit: true };
			const autoComplete = new AMap.Autocomplete(opts);
			autoComplete.search(value, (status, result) => {
				// 搜索成功时，result即是对应的匹配数据
				if (status === 'complete') {
					const { tips = [] } = result || {};
					// console.log(tips);
					this.setState({
						addressSearchResult: tips.filter(tip => !!tip.id),
					});
				}
			});
		});
	};

	getAddressLocation = async () => {
		const {
			form: { getFieldValue },
		} = this.props;
		const { addressSearchResult } = this.state;

		const regionValue = getFieldValue('region');
		const address = getFieldValue('address');

		const cityInfo = this.deepFindCity(regionValue);
		const { name = null } = cityInfo || {};

		const inputAddress = addressSearchResult.find(
			addressInfo => address === `${addressInfo.name}${addressInfo.address}`
		);
		// console.log(inputAddress);

		return new Promise(resolve => {
			AMap.plugin('AMap.PlaceSearch', () => {
				const opts = { city: name || '全国', citylimit: true, pageSize: 50 };
				const placeSearch = new AMap.PlaceSearch(opts);

				if (inputAddress && inputAddress.id) {
					placeSearch.getDetails(inputAddress.id, (status, result) => {
						// console.log(status);
						// console.log(result);
						if (status === 'complete') {
							// console.log(result);
							resolve(result);
						} else {
							resolve({});
						}
					});
				} else {
					placeSearch.search(address, (status, result) => {
						// 搜索成功时，result即是对应的匹配数据
						// console.log(result);
						if (status === 'complete') {
							// console.log(result);
							resolve(result);
						} else {
							resolve({});
						}
					});
				}
			});
		});
	};

	handleResponse = response => {
		const {
			form: { setFields, getFieldValue },
		} = this.props;

		if (response && response.code === STORE_EXIST) {
			const storeName = getFieldValue('shopName');
			setFields({
				shopName: {
					value: storeName,
					errors: [
						new Error(formatMessage({ id: 'storeManagement.message.name.exist' })),
					],
				},
			});
		}
	};

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

		validateFields(async (err, values) => {
			// console.log(values);
			if (!err) {
				const { address } = values;
				const { poiList: { pois = [] } = {} } =
					(await this.getAddressLocation(address)) || {};

				const { location: { lat = null, lng = null } = {} } =
					pois.find(poi => address === `${poi.name}${poi.address}`) || {};
				// console.log(lat, lng);

				const options = {
					...values,
					shopId,
					company_id: companyId,
					typeOne: values.shopType[0] || null,
					typeTwo: values.shopType[1] || null,
					province: values.region[0] || null,
					city: values.region[1] || null,
					area: values.region[2] || null,
					lat: lat ? `${lat}` : null,
					lng: lng ? `${lng}` : null,
				};

				let response = null;
				if (action === 'create') {
					response = await createNewStore({ options });
				} else if (action === 'edit') {
					response = await updateStore({ options });
				} else {
					response = await createNewStore({ options });
				}

				this.handleResponse(response);
				router.goBack();
			}
		});
	};

	render() {
		const {
			form: { getFieldDecorator },
			loading: cardLoading,
			store: {
				shopType_list,
				regionList,
				loading,
				storeInfo: {
					shopName,
					typeOne = null,
					typeTwo = null,
					businessStatus,
					province = null,
					city = null,
					area = null,
					address = null,
					businessHours,
					businessArea = null,
					contactPerson,
					contactTel,
				},
			},
		} = this.props;
		const { addressSearchResult } = this.state;
		const [action = 'create'] = [getLocationParam('action')];

		const autoCompleteSelection = addressSearchResult.map((addressInfo, index) => (
			<AutoComplete.Option
				key={`${index}-${addressInfo.id}`}
				value={`${addressInfo.name}${addressInfo.address}`}
			>
				{`${addressInfo.name}${addressInfo.address}`}
			</AutoComplete.Option>
		));

		return (
			<Card bordered={false} loading={cardLoading.effects['store/getStoreDetail']}>
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
						{getFieldDecorator('shopName', {
							initialValue: shopName,
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
								typeOne ? `${typeOne}` : null,
								typeTwo ? `${typeTwo}` : null,
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
						{getFieldDecorator('businessStatus', {
							initialValue: businessStatus || 0,
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
							getValueFromEvent: (val) => (val || '').slice(0, 60)
						})(
							<AutoComplete
								dataSource={autoCompleteSelection}
								onChange={this.handleSelectSearch}
							/>
						)}
					</FormItem>
					<FormItem label={formatMessage({ id: 'storeManagement.create.daysLabel' })}>
						{getFieldDecorator('businessHours', {
							initialValue: businessHours,
						})(<Input maxLength={30} />)}
					</FormItem>
					<FormItem label={formatMessage({ id: 'storeManagement.create.area' })}>
						{getFieldDecorator('businessArea', {
							initialValue: businessArea || null,
							validateTrigger: 'onBlur',
							rules: [
								{
									validator: (rule, value, callback) => {
										if (value === '' || value === null) {
											callback();
										} else if (!Number(value) || !RegExp.area.test(value)) {
											callback(
												formatMessage({
													id: 'storeManagement.create.area.formatError',
												})
											);
										} else {
											callback();
										}
									},
								},
							],
						})(<Input suffix="㎡" />)}
					</FormItem>
					<FormItem label={formatMessage({ id: 'storeManagement.create.contactName' })}>
						{getFieldDecorator('contactPerson', {
							initialValue: contactPerson,
						})(<Input maxLength={30} />)}
					</FormItem>
					<FormItem label={formatMessage({ id: 'storeManagement.create.contactPhone' })}>
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
						})(<Input maxLength={30} />)}
					</FormItem>
					<FormItem label=" " colon={false}>
						<Button loading={loading} type="primary" onClick={this.handleSubmit}>
							{formatMessage({ id: 'btn.save' })}
						</Button>
						<Button
							style={{ marginLeft: '20px' }}
							htmlType="button"
							onClick={() => router.goBack()}
						>
							{formatMessage({ id: 'btn.cancel' })}
						</Button>
					</FormItem>
				</Form>
			</Card>
		);
	}
}

export default CreateStore;
