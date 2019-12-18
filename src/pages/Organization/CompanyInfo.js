import React from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Button, Input, Radio, Cascader, Card, AutoComplete, TreeSelect, Select, TimePicker, Checkbox } from 'antd';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import * as CookieUtil from '@/utils/cookies';
import { getLocationParam } from '@/utils/utils';
import { customValidate } from '@/utils/customValidate';
import { FORM_FORMAT, HEAD_FORM_ITEM_LAYOUT } from '@/constants/form';
import { STORE_EXIST } from '@/constants/errorCode';
import { mail } from '@/constants/regexp';

import styles from './CompanyInfo.less';


const FormItem = Form.Item;
const { Option } = Select;

const treeData = [
	{
		title: 'Node1',
		value: '0-0',
		key: '0-0',
		children: [
			{
				title: 'Child Node1',
				value: '0-0-1',
				key: '0-0-1',
			},
			{
				title: 'Child Node2',
		  value: '0-0-2',
		  key: '0-0-2',
			},
	  ],
	},
	{
	  title: 'Node2',
	  value: '0-1',
	  key: '0-1',
	},
];

@connect(
	state => ({
		loading: state.loading,
		store: state.companyInfo,
	}),
	dispatch => ({
		createNewStore: payload => dispatch({ type: 'companyInfo/createNewStore', payload }),
		updateStore: payload => dispatch({ type: 'companyInfo/updateStore', payload }),
		getShopTypeList: () => dispatch({ type: 'companyInfo/getShopTypeList' }),
		getRegionList: () => dispatch({ type: 'companyInfo/getRegionList' }),
		getStoreDetail: payload => dispatch({ type: 'companyInfo/getStoreDetail', payload }),
		clearState: () => dispatch({ type: 'companyInfo/clearState' }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
@Form.create()
class CompanyInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			addressSearchResult: [],
			organizationType: 0,
		};
	}

	componentDidMount() {
		const { getShopTypeList, getRegionList, getStoreDetail, clearState } = this.props;
		const [action = 'create', shopId] = [
			getLocationParam('action'),
			getLocationParam('organizationId'),
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

	onTypeChangeHandler = (value) => {
		this.setState({
			organizationType: value
		});
	}

	deepFindCity = (regionValues = []) => {
		const [province, city, ,] = regionValues;
		const regionList = Storage.get('__regionList__', 'local') || [];
		if (province && city) {
			const findedCity = (
				(regionList.find(provinceInfo => provinceInfo.province === province) || {})
					.children || []
			).find(cityInfo => cityInfo.city === city);
			return findedCity;
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

	onSelectHandler = () => {
		const { form: { validateFields } } = this.props;
		validateFields(['higherLevel']);
	}

	blurHandler = () => {
		const { form: { validateFields } } = this.props;
		validateFields(['higherLevel']);
	}

	handleSubmit = () => {
		const [action = 'create', shopId] = [
			getLocationParam('action'),
			getLocationParam('organizationId'),
		];
		const companyId = CookieUtil.getCookieByKey(CookieUtil.COMPANY_ID_KEY);
		const {
			form: { validateFields },
			createNewStore,
			updateStore,
		} = this.props;

		validateFields(async (err, values) => {
			console.log(values);
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
			}
		});
	};

	render() {
		const {
			form: { getFieldDecorator },
			loading: cardLoading,
			store: {
				shopTypeList,
				regionList,
				loading,
				storeInfo: {
					typeOne = null,
					typeTwo = null,
					businessStatus,
					province = null,
					city = null,
					area = null,
					address = null,
					businessArea = null,
					contactPerson,
					contactTel,
				},
			},
			goToPath,
		} = this.props;
		const { addressSearchResult, organizationType } = this.state;
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
						? formatMessage({ id: 'companyInfo.create.title' })
						: formatMessage({ id: 'companyInfo.alter.title' })}
				</h3>
				<Form
					{...{
						...FORM_FORMAT,
						...HEAD_FORM_ITEM_LAYOUT,
					}}
				>
					<FormItem label='组织编号'>
						{getFieldDecorator('organizationId', {
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: '组织编号不能为空',
								},
							],
						})(
							<Input maxLength={20} />
						)}
					</FormItem>
					<FormItem label='组织名称'>
						{getFieldDecorator('organizationName', {
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: '组织名称不能为空',
								},
							],
						})(
							<Input
								maxLength={20}
								placeholder='例如：星巴克杨浦店'
							/>
						)}
					</FormItem>
					<FormItem label='上级组织'>
						{getFieldDecorator('higherLevel', {
							// validateTrigger: 'onSelect',
							rules: [
								{
									required: true,
									message: '不可以不选择',
								},
							],
						})(
							<TreeSelect
								onBlur={this.blurHandler}
								onChange={this.changeTest}
								onSelect={this.onSelectHandler}
								treeData={treeData}
								placeholder="请选择"
								treeDefaultExpandAll
							/>
						)}
					</FormItem>
					<FormItem label='组织属性'>
						{getFieldDecorator('organizationType', {
							validateTrigger: 'onBlur',
							initialValue: 0,
							rules: [
								{
									required: true,
									message: '不可以不选择',
								},
							],
						})(
							<Select
								// onSelect={this.selectTest}
								// onBlur={this.blurTest}
								placeholder="请选择"
								onChange={this.onTypeChangeHandler}
							>
								<Option value={0}>门店</Option>
								<Option value={1}>部门</Option>
							</Select>
						)}
					</FormItem>
					{organizationType === 0 &&
					<div>
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
									options={shopTypeList}
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
									<Radio value={1}>
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
									placeholder='省/市/区'
								/>
							)}
						</FormItem>
						<FormItem label=" " colon={false}>
							{getFieldDecorator('address', {
								initialValue: address,
							})(
								<AutoComplete
									placeholder="请输入详细地址"
									dataSource={autoCompleteSelection}
									onChange={this.handleSelectSearch}
								/>
							)}
						</FormItem>
						<Form.Item label='营业时间' className={styles['open-time']}>
							<Form.Item className={styles['time-picker']}>
								{
									getFieldDecorator('startTime', {
										rules: [
										],
									})(
										<TimePicker
											placeholder='开始时间'
											format="HH:mm"
										/>
									)
								}
							</Form.Item>
							<span className={styles.to} style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>～</span>
							<Form.Item className={styles['time-picker']}>
								{
									getFieldDecorator('endTime', {
										rules: [
										],
									})(
										<TimePicker
											placeholder='结束时间'
											format="HH:mm"
										/>
									)
								}
							</Form.Item>
							<Form.Item className={styles['all-day']}>
								{
									getFieldDecorator('allDaysSelect', {
										rules: [
										],
									})(
										<Checkbox>全天</Checkbox>
									)
								}
							</Form.Item>
						</Form.Item>
						<FormItem label={formatMessage({ id: 'storeManagement.create.area' })}>
							{getFieldDecorator('businessArea', {
								initialValue: businessArea || null,
								validateTrigger: 'onBlur',
								rules: [
									{
										validator: (rule, value, callback) => {
											if (value && !/^(([1-9]\d{0,5})|0)(\.\d{1,2})?$/.test(value)) {
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
							})(<Input placeholder="请输入营业面积" suffix="㎡" />)}
						</FormItem>
					</div>
					}
					
					<FormItem label='联系人'>
						{getFieldDecorator('contactPerson', {
							initialValue: contactPerson,
						})(<Input placeholder="请输入联系人" />)}
					</FormItem>
					<FormItem label='联系号码'>
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
						})(<Input placeholder="请输入联系号码" />)}
					</FormItem>
					<FormItem label='联系人邮箱'>
						{
							getFieldDecorator('email', {
								validateTrigger: 'onBlur',
								rules: [
									{
										pattern: mail,
										message: formatMessage({id: 'cloudStorage.email.error'}),
									},
								],
							})(
								<Input placeholder="请输入联系人邮箱" />
							)
						}
					</FormItem>
					<FormItem label=" " colon={false}>
						<Button loading={loading} type="primary" onClick={this.handleSubmit}>
							{formatMessage({ id: 'btn.save' })}
						</Button>
						<Button
							style={{ marginLeft: '20px' }}
							htmlType="button"
							onClick={() => goToPath('storeList')}
						>
							{formatMessage({ id: 'btn.cancel' })}
						</Button>
					</FormItem>
				</Form>
			</Card>
		);
	}
}

export default CompanyInfo;
