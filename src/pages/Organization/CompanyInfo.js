/* eslint-disable no-restricted-syntax */
/* eslint-disable no-restricted-globals */
import React from 'react';
import { formatMessage , getLocale } from 'umi/locale';
import { Form, Button, Input, Radio, Cascader, Card, AutoComplete, TreeSelect, Select, TimePicker, Checkbox, message, Spin } from 'antd';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import moment from 'moment';
import { getLocationParam } from '@/utils/utils';
import { customValidate } from '@/utils/customValidate';
import * as CookieUtil from '@/utils/cookies';
import { FORM_FORMAT, HEAD_FORM_ITEM_LAYOUT } from '@/constants/form';
import { ERROR_OK, STORE_EXIST, ORGANIZATION_LEVEL_LIMITED } from '@/constants/errorCode';
import * as RegExp from '@/constants/regexp';

import styles from './CompanyInfo.less';


const FormItem = Form.Item;
const { Option } = Select;

@connect(
	state => ({
		loading: state.loading,
		companyInfo: state.companyInfo,
	}),
	dispatch => ({
		createOrganization: payload => dispatch({ type: 'companyInfo/createOrganization', payload }),
		updateOrganization: payload => dispatch({ type: 'companyInfo/updateOrganization', payload }),
		getShopTypeList: () => dispatch({ type: 'companyInfo/getShopTypeList' }),
		getRegionList: () => dispatch({ type: 'companyInfo/getRegionList' }),
		getOrganizationInfo: orgId => dispatch({ type: 'companyInfo/getOrganizationInfo', orgId }),
		getAllOrgName: () => dispatch({ type: 'companyInfo/getAllOrgName' }),
		clearState: () => dispatch({ type: 'companyInfo/clearState' }),
		getOrganizationTreeByCompanyInfo: (payload) => dispatch({ type: 'companyInfo/getOrganizationTreeByCompanyInfo', payload}),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
		getPathId: (path) =>
			dispatch({ type: 'menu/getPathId', payload: { path } }),
		getCurrentHeight: orgId => dispatch({ type: 'companyInfo/getCurrentHeight', orgId }),
		getOrgName: orgId => dispatch({ type: 'companyInfo/getOrgName', orgId }),
	})
)
@Form.create()
class CompanyInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			addressSearchResult: [],
			organizationType: undefined,
			treeData: {},
			allDayChecked: false,
			isDisabled: true,
			orgPidParams: undefined,
			orgId: undefined,
			action: undefined,
		};
	}

	async componentDidMount() {
		await this.init();
	}

	componentWillReceiveProps(nextProps) {
		const { companyInfo: { orgInfo: { businessHours: nextBusinessHours }}} = nextProps;
		const { companyInfo: { orgInfo: { businessHours }}} = this.props;
		if(nextBusinessHours !== businessHours){
			this.setState({
				allDayChecked: nextBusinessHours === '00:00~23:59'
			});
		}
	}

	init = async() => {
		const { getShopTypeList, getRegionList, getOrganizationInfo, getOrganizationTreeByCompanyInfo, getAllOrgName, clearState, getCurrentHeight, getPathId } = this.props;
		let treeData = {};
		let isDisabled = true;
		let orgPidParams;
		getAllOrgName();
		const [action = 'create', orgId, orgPid] = [
			getLocationParam('action'),
			Number(getLocationParam('orgId')),
			Number(getLocationParam('orgPid')),
		];
		const {
			location: { pathname },
		} = window;
		const pathId = await getPathId(pathname);
		if(pathId === 'newSubOrganization') {
			orgPidParams = orgPid;
		}

		// 获得当前操作类型和organizationId


		if(action === 'create') {
			clearState();
			treeData = await getOrganizationTreeByCompanyInfo({
				currentLevel: 1
			});
		}

		if (action === 'edit') {
			getOrganizationInfo(orgId);
			const height = await getCurrentHeight(orgId);
			treeData = await getOrganizationTreeByCompanyInfo({
				currentLevel: height,
				orgId,
			});
			isDisabled = false;
		}
		const currentLanguage = getLocale();
		const storageLanaguage = Storage.get('__lang__', 'local');
		if (!Storage.get('__shopTypeList__', 'local') || currentLanguage !== storageLanaguage) {
			Storage.set({ __lang__: currentLanguage }, 'local');
			getShopTypeList();
		}

		if (!Storage.get('__regionList__', 'local')) {
			getRegionList();
		}

		this.setState({
			treeData,
			isDisabled,
			orgPidParams,
			orgId,
			action,
		});
	}

	onTypeChangeHandler = (value) => {
		this.setState({
			organizationType: value
		});
		this.submitButtonDisableHandler(value, 'orgTag');
	}

	submitButtonDisableHandler = (e, key) => {
		const keys = ['orgName', 'orgTag', 'orgPid'];
		keys.splice(keys.indexOf(key), 1);
		let currentValue;
		if(e.target){
			currentValue = e.target.value;
		}else{
			currentValue = e;
		}
		const { form:{ getFieldsValue }} = this.props;
		const fieldsValue = getFieldsValue();
		const isDisabled = fieldsValue[keys[0]] === undefined ||
			fieldsValue[keys[1]] === undefined || currentValue === undefined || currentValue === '';
		this.setState({
			isDisabled
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
		const cityInfo = regionValue ? this.deepFindCity(regionValue) : {};

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
			form: { getFieldValue }
		} = this.props;
		const { addressSearchResult } = this.state;

		const regionValue = getFieldValue('region');
		const address = getFieldValue('address');

		const cityInfo = regionValue ? this.deepFindCity(regionValue) : {};
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
						if (status === 'complete') {
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

	backHandler =  async () => {
		const { getPathId, goToPath } = this.props;
		const {
			location: { pathname },
		} = window;
		const pathId = await getPathId(pathname);
		const { orgPidParams, orgId } = this.state;
		if(pathId === 'editDetail' || pathId ===  'newSubOrganization'){
			goToPath('detail',{
				orgId: pathId ===  'newSubOrganization' ? orgPidParams : orgId,
			});
		}else{
			goToPath('organizationList');
		}
	}

	isNextDay = () => {
		const { form } = this.props;
		const { getFieldValue } = form;
		const startTime = getFieldValue('startTime');
		const endTime = getFieldValue('endTime');
		// console.log(startTime, endTime);
		if (startTime && startTime.isAfter(endTime) || startTime && startTime.isSame(endTime)){
			return `HH:mm ${formatMessage({id: 'activeDetection.nextDay'})}`;
		}
		return 'HH:mm';
	}

	onSelectHandler = () => {
		const { form: { validateFields } } = this.props;
		validateFields(['orgPid']);
	}

	blurHandler = () => {
		const { form: { validateFields } } = this.props;
		validateFields(['orgPid']);
	}

	allDayCheckChange = (e) => {
		const { form: { setFieldsValue } } = this.props;
		if(e.target.checked){
			setFieldsValue({
				startTime: moment('00:00','HH:mm'),
				endTime: moment('23:59','HH:mm'),
			});
		}

		this.setState({
			allDayChecked: e.target.checked
		});
	}

	startTimeHandler = (rule, value, callback) => {
		const { form:{ getFieldValue, setFieldsValue }} = this.props;
		if(!value && getFieldValue('endTime')){
			callback('startTime-empty');
		}
		if(!value && !getFieldValue('endTime')){
			setFieldsValue({
				endTime: null,
			});
			callback();
		}
		callback();
	}

	endTimeHandler = (rule, value, callback) => {
		const { form:{ getFieldValue, setFieldsValue }} = this.props;
		if(!value && getFieldValue('startTime')){
			callback('endTime-empty');
		}
		if( !value && !getFieldValue('startTime')){
			setFieldsValue({
				startTime: null,
			});
			callback();
		}
		callback();
	}

	handleSubmit = () => {
		const [action = 'create', orgId] = [
			getLocationParam('action'),
			Number(getLocationParam('orgId')),
		];
		const companyId = CookieUtil.getCookieByKey(CookieUtil.COMPANY_ID_KEY);
		const {
			form: { validateFields },
			createOrganization,
			updateOrganization,
			getPathId
		} = this.props;

		validateFields(async (err, values) => {
			const { goToPath } = this.props;
			if (!err) {
				const { address, startTime, endTime, allDaysSelect } = values;
				let businessHours = null;
				if(allDaysSelect){
					businessHours = '00:00~23:59';
				}else if(startTime && endTime){
					businessHours = `${startTime.format('HH:mm')}~${endTime.format('HH:mm')}`;
				}
				const { poiList: { pois = [] } = {} } =
					address ? (await this.getAddressLocation(address)) || {} : {};

				const { location: { lat = null, lng = null } = {} } =
					pois.find(poi => address === `${poi.name}${poi.address}`) || {};
				// console.log(lat, lng);
				const options = {
					...values,
					orgId,
					companyId,
					typeOne: values.shopType ? values.shopType[0] || null : null,
					typeTwo: values.shopType ? values.shopType[1] || null : null,
					province: values.region ? values.region[0] || null : null,
					city: values.region ? values.region[1] || null : null,
					area: values.region ? values.region[2] || null : null,
					lat: lat ? `${lat}` : null,
					lng: lng ? `${lng}` : null,
					businessHours,
				};
				const {
					location: { pathname },
				} = window;
				const pathId = await getPathId(pathname);


				let response = null;
				if (action === 'edit') {
					response = await updateOrganization({ options });
					const { code } = response;
					if(code === ERROR_OK){
						if(pathId === 'editDetail'){
							const { orgId: orgIdValue } = this.state;
							goToPath('detail', {
								orgId: orgIdValue,
							});
						}else{
							goToPath('organizationList');
						}
						message.success(formatMessage({id: 'companyInfo.save.success'}));
					}else{
						message.error(formatMessage({id: 'companyInfo.save.fail'}));
						await this.init();
					}

				}else{
					response = await createOrganization({ options });
					const { code } = response;
					if(code === ERROR_OK){
						if(pathId === 'newSubOrganization') {
							const { orgPidParams } = this.state;
							goToPath('detail', {
								orgId: orgPidParams,
							});
							message.success(formatMessage({id: 'companyInfo.newSubOrganization.success'}));
						}else{
							goToPath('organizationList');
							message.success(formatMessage({id: 'companyInfo.save.success'}));
						}
					}else if(code === STORE_EXIST){
						message.error(formatMessage({id: 'companyInfo.message.name.exist'}));
						await this.init();
					}else if(code === ORGANIZATION_LEVEL_LIMITED){
						message.error(formatMessage({id: 'companyInfo.message.level.limited'}));
						await this.init();
					}
				}
			}
		});
	};

	render() {
		const {
			form: { getFieldDecorator },
			loading,
			companyInfo: {
				shopTypeList,
				regionList,
				orgNameList,
				orgInfo: {
					orgName = undefined,
					orgPid = undefined,
					typeOne = null,
					typeTwo = null,
					businessStatus,
					orgTag,
					businessHours,
					province = null,
					city = null,
					area = null,
					address = null,
					businessArea = null,
					contactPerson,
					contactTel,
					// contactEmail,
				},
			}
		} = this.props;
		const { treeData, allDayChecked, orgPidParams } = this.state;
		const { addressSearchResult, organizationType, isDisabled, action, orgId } = this.state;
		const autoCompleteSelection = addressSearchResult.map((addressInfo, index) => {
			const finalAddress = addressInfo.address && addressInfo.address.length > 0 ? addressInfo.address : addressInfo.district;
			return (
				<AutoComplete.Option
					key={`${index}-${addressInfo.id}`}
					value={`${addressInfo.name} ${finalAddress}`}
				>
					{`${addressInfo.name} ${finalAddress}`}
				</AutoComplete.Option>
			);
		});
		const tagValue = organizationType === undefined ? orgTag : organizationType;
		const showShopInfo = tagValue === undefined ? true : tagValue === 0;
		return (
			<Spin spinning={!!(loading.effects['companyInfo/getAllOrgName'] ||
				loading.effects['companyInfo/getOrganizationTreeByCompanyInfo'] ||
				loading.effects['companyInfo/getCurrentHeight'] ||
				loading.effects['companyInfo/getOrganizationInfo' ])}
			>
				<Card
					bordered={false}
					title={action === 'create'
						? (orgPidParams ? formatMessage({ id: 'companyInfo.create.sub.title' }) : formatMessage({ id: 'companyInfo.create.title' }))
						: formatMessage({ id: 'companyInfo.alter.title' })}
				>
					<Form
						{...{
							...FORM_FORMAT,
							...HEAD_FORM_ITEM_LAYOUT,
						}}
					>
						<FormItem label={formatMessage({ id: 'companyInfo.org.name' })}>
							{getFieldDecorator('orgName', {
								validateTrigger: 'onBlur',
								initialValue: orgName,
								rules: [
									{
										required: true,
										message: formatMessage({ id: 'companyInfo.no.input.name' }),
									},
									{
										validator: (rule, value, callback) => {
											let illegalFlag = false;
											for(const word of value){
												if(isNaN(word.charCodeAt(1)) === false){
													illegalFlag = true;
													break;
												}
												if((word.charCodeAt(0) >= 8203 && word.charCodeAt(0) <= 8205) ||
												(word.charCodeAt(0) >= 8232 && word.charCodeAt(0) <= 8238) ||
												(word.charCodeAt(0) >= 8 && word.charCodeAt(0) <= 13) ||
												(word.charCodeAt(0) >= 8 && word.charCodeAt(0) <= 13) ||
												word.charCodeAt(0) === 34 || word.charCodeAt(0) === 39 ||
												word.charCodeAt(0) === 92 || word.charCodeAt(0) === 160 ||
												word.charCodeAt(0) === 65279 && isNaN(word.charCodeAt(1)) === true){
													illegalFlag = true;
													break;
												}
											}

											if (illegalFlag) {
												callback('name-illegal');
											} else {
												callback();
											}
										},
										message: formatMessage({ id: 'organization.name.illegal' }),
									},
									{
										validator: (rule, value, callback) => {
											let confictFlag = false;
											orgNameList.every(item => {
												if (item.name === value && action === 'create') {
													confictFlag = true;
													return false;
												}
												if(item.name === value && action === 'edit' && item.id !== orgId){
													confictFlag = true;
													return false;
												}
												return true;
											});

											if (confictFlag) {
												callback('name-confict');
											} else {
												callback();
											}
										},
										message: formatMessage({ id: 'companyInfo.name.exit' }),
									},
								],
							})(
								<Input
									onChange={(e) => this.submitButtonDisableHandler(e, 'orgName')}
									maxLength={20}
									placeholder={formatMessage({ id: 'companyInfo.name.placeholder' })}
								/>
							)}
						</FormItem>
						<FormItem label={formatMessage({ id: 'companyInfo.org.parent.label' })}>
							{getFieldDecorator('orgPid', {
							// validateTrigger: 'onSelect',
								initialValue: treeData && treeData.value &&(orgPidParams || orgPid),
								rules: [
									{
										required: true,
										message: formatMessage({ id: 'companyInfo.org.parent.no.input' }),
									},
								],
							})(
								<TreeSelect
									disabled={!!orgPidParams}
									onBlur={this.blurHandler}
									onSelect={this.onSelectHandler}
									onChange={(e) => this.submitButtonDisableHandler(e, 'orgPid')}
									treeData={[treeData]}
									placeholder={formatMessage({ id: 'companyInfo.please.select' })}
									treeDefaultExpandedKeys={[`${treeData.key}`]}
									dropdownStyle={{maxHeight:288}}
								/>
							)}
						</FormItem>
						<FormItem label={formatMessage({ id: 'companyInfo.org.tag.label' })}>
							{getFieldDecorator('orgTag', {
								validateTrigger: 'onBlur',
								initialValue: orgTag || 0,
								rules: [
									{
										required: true,
										message: formatMessage({ id: 'companyInfo.org.tag.select' }),
									},
								],
							})(
								<Select
								// onSelect={this.selectTest}
								// onBlur={this.blurTest}
									placeholder={formatMessage({ id: 'companyInfo.please.select' })}
									onChange={this.onTypeChangeHandler}
								>
									<Option value={0}>{formatMessage({ id: 'companyInfo.shop' })}</Option>
									<Option value={1} disabled>{formatMessage({ id: 'companyInfo.department' })}</Option>
								</Select>
							)}
						</FormItem>
						{showShopInfo &&
						<div>
							<FormItem label={formatMessage({ id: 'storeManagement.create.typeLabel' })}>
								{getFieldDecorator('shopType', {
									initialValue: action === 'create' ? null : [
										typeOne ? `${typeOne}` : null,
										typeTwo ? `${typeTwo}` : null,
									],
								})(
									<Cascader
										placeholder={formatMessage({ id: 'companyInfo.please.input' })}
										options={shopTypeList}
									/>
								)}
							</FormItem>
							<FormItem label={formatMessage({ id: 'companyInfo.businessStatus' })}>
								{getFieldDecorator('businessStatus', {
									initialValue: businessStatus || 0,
								})(
									<Radio.Group>
										<Radio value={0}>
											{formatMessage({ id: 'storeManagement.create.status.open' })}
										</Radio>
										<Radio value={1} disabled={action==='create'}>
											{formatMessage({ id: 'storeManagement.create.status.closed' })}
										</Radio>
									</Radio.Group>
								)}
							</FormItem>
							<FormItem label={formatMessage({ id: 'storeManagement.create.address' })}>
								{getFieldDecorator('region', {
									initialValue: action === 'create' ? null :[
										province ? `${province}` : null,
										city ? `${city}` : null,
										area ? `${area}` : null,
									],
								})(
									<Cascader
										options={regionList}
										placeholder={formatMessage({ id: 'companyInfo.region.placeholder' })}
									/>
								)}
							</FormItem>
							<FormItem label=" " colon={false}>
								{getFieldDecorator('address', {
									initialValue: address,
									rules: [
										{
											max: 60,
											message: formatMessage({ id: 'companyInfo.max.length' }),
										},
									],
								})(
									<AutoComplete
										placeholder={formatMessage({ id: 'companyInfo.please.input.detail.address' })}
										dataSource={autoCompleteSelection}
										onChange={this.handleSelectSearch}
									/>
								)}
							</FormItem>
							<Form.Item label={formatMessage({ id: 'companyInfo.open.time' })} className={styles['open-time']}>
								<Form.Item className={styles['time-picker']}>
									{
										getFieldDecorator('startTime',{
											initialValue: (typeof(businessHours) === 'string' &&
											businessHours.indexOf('~') !== -1) ?
												moment(businessHours.split('~')[0], 'HH:mm') : null,
											rules: [
												{
													validator: this.startTimeHandler,
													message: formatMessage({id: 'companyInfo.please.select.startTime'}),
												},
											]
										})(
											<TimePicker
												allowClear
												disabled={allDayChecked}
												placeholder={formatMessage({ id: 'companyInfo.start.time' })}
												format="HH:mm"
											/>
										)
									}
								</Form.Item>
								<span className={styles.to} style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>～</span>
								<Form.Item className={styles['time-picker']}>
									{
										getFieldDecorator('endTime', {
											initialValue: (typeof(businessHours) === 'string' &&
											businessHours.indexOf('~') !== -1) ?
												moment(businessHours.split('~')[1], this.isNextDay()) : null,
											rules: [
												{
													validator: this.endTimeHandler,
													message: formatMessage({id: 'companyInfo.please.select.endTime'}),
												},
											]
										})(
											<TimePicker
												allowClear
												disabled={allDayChecked}
												placeholder={formatMessage({ id: 'companyInfo.end.time' })}
												format={this.isNextDay()}
											/>
										)
									}
								</Form.Item>
								<Form.Item className={styles['all-day']}>
									{
										getFieldDecorator('allDaysSelect', {
										})(
											<Checkbox checked={allDayChecked} onChange={this.allDayCheckChange}>{formatMessage({ id: 'companyInfo.allDay' })}</Checkbox>
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
								})(<Input placeholder={formatMessage({ id: 'companyInfo.please.input.businessArea' })} suffix="㎡" />)}
							</FormItem>
						</div>
						}

						<FormItem label={formatMessage({ id: 'companyInfo.contactPerson.label' })}>
							{getFieldDecorator('contactPerson', {
								initialValue: contactPerson,
							})(<Input maxLength={40} placeholder={formatMessage({ id: 'companyInfo.please.input.contactPerson' })} />)}
						</FormItem>
						<FormItem label={formatMessage({ id: 'companyInfo.contactTel.label' })}>
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
							})(<Input placeholder={formatMessage({ id: 'companyInfo.please.input.contactTel' })} />)}
						</FormItem>
						{/* <FormItem label={formatMessage({ id: 'companyInfo.contactEmail.label' })}>
							{
								getFieldDecorator('contactEmail', {
									initialValue: contactEmail,
									validateTrigger: 'onBlur',
									rules: [
										{
											pattern: mail,
											message: formatMessage({id: 'cloudStorage.email.error'}),
										},
									],
								})(
									<Input placeholder={formatMessage({ id: 'companyInfo.please.input.contactEmail' })} />
								)
							}
						</FormItem> */}
						<FormItem label=" " colon={false}>
							<Button
								loading={!!(loading.effects['companyInfo/createOrganization'] ||
								!!loading.effects['companyInfo/updateOrganization'] ||
								!!loading.effects['menu/getPathId'])}
								type="primary"
								onClick={this.handleSubmit}
								disabled={isDisabled}
							>
								{formatMessage({ id: 'btn.save' })}
							</Button>
							<Button
								style={{ marginLeft: '20px' }}
								htmlType="button"
								onClick={this.backHandler}
							>
								{formatMessage({ id: 'btn.cancel' })}
							</Button>
						</FormItem>
					</Form>
				</Card>
			</Spin>
		);
	}
}

export default CompanyInfo;
