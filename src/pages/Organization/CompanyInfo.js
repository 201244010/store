import React from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Button, Input, Radio, Cascader, Card, AutoComplete, TreeSelect, Select, TimePicker, Checkbox, message, Spin } from 'antd';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import moment from 'moment';
import { getLocationParam } from '@/utils/utils';
import { customValidate } from '@/utils/customValidate';
import { FORM_FORMAT, HEAD_FORM_ITEM_LAYOUT } from '@/constants/form';
import { ERROR_OK } from '@/constants/errorCode';
import { mail } from '@/constants/regexp';

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
			organizationType: 0,
			treeData: {},
			allDayChecked: false,
			isDisabled: true,
			orgPidParams: undefined,
		};
	}

	async componentDidMount() {
		const { getShopTypeList, getRegionList, getOrganizationInfo, getOrganizationTreeByCompanyInfo, getAllOrgName, clearState, getCurrentHeight, getPathId } = this.props;
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
			this.setState({
				orgPidParams: orgPid,
			});
		}
		
		// 获得当前操作类型和organizationId
		

		if(action === 'create') {
			clearState();
			const treeData = await getOrganizationTreeByCompanyInfo({
				currentLevel: 1
			});
			this.setState({
				treeData,
			});
		}

		if (action === 'edit') {
			getOrganizationInfo(orgId);
			const height = await getCurrentHeight(orgId);
			const treeData = await getOrganizationTreeByCompanyInfo({
				currentLevel: height,
				orgId,
			});
			
			this.setState({
				treeData,
				isDisabled: false,
			});
		}

		if (!Storage.get('__shopTypeList__', 'local')) {
			getShopTypeList();
		}

		if (!Storage.get('__regionList__', 'local')) {
			getRegionList();
		}
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
			form: { getFieldValue }
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
		if(pathId === 'editDetail' || pathId ===  'newSubOrganization'){
			goToPath('detail');
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

	handleSubmit = () => {
		const [action = 'create', orgId] = [
			getLocationParam('action'),
			Number(getLocationParam('orgId')),
		];
		const {
			form: { validateFields },
			createOrganization,
			updateOrganization,
		} = this.props;

		validateFields(async (err, values) => {
			const { goToPath } = this.props;
			if (!err) {
				const { address, startTime, endTime, allDaysSelect } = values;
				let businessHours = null;
				if(allDaysSelect){
					businessHours = '00:00~24:00';
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
					typeOne: values.shopType ? values.shopType[0] || null : null,
					typeTwo: values.shopType ? values.shopType[1] || null : null,
					province: values.region ? values.region[0] || null : null,
					city: values.region ? values.region[1] || null : null,
					area: values.region ? values.region[2] || null : null,
					lat: lat ? `${lat}` : null,
					lng: lng ? `${lng}` : null,
					businessHours, 
				};

				let response = null;
				if (action === 'edit') {
					response = await updateOrganization({ options });
					const { code } = response;
					if(code === ERROR_OK){
						message.success('修改成功');
						goToPath('organizationList');
					}
					
				}else{
					response = await createOrganization({ options });
					const { code } = response;
					if(code === ERROR_OK){
						message.success('保存成功');
						goToPath('organizationList');
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
					businessHours,
					province = null,
					city = null,
					area = null,
					address = null,
					businessArea = null,
					contactPerson,
					contactTel,
					contactEmail,
				},
			}
		} = this.props;
		const { treeData, allDayChecked, orgPidParams } = this.state;
		const { addressSearchResult, organizationType, isDisabled } = this.state;
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
			<Spin spinning={!!(loading.effects['companyInfo/getAllOrgName'] ||
				loading.effects['companyInfo/getOrganizationTreeByCompanyInfo'] ||
				loading.effects['companyInfo/getCurrentHeight'] ||
				loading.effects['companyInfo/getOrganizationInfo' ])}
			>
				<Card 
					bordered={false} 
					title={action === 'create'
						? (orgPidParams ? '新建下级组织' : formatMessage({ id: 'companyInfo.create.title' }))
						: '修改组织详情'}
				>
					<Form
						{...{
							...FORM_FORMAT,
							...HEAD_FORM_ITEM_LAYOUT,
						}}
					>
						<FormItem label='组织名称'>
							{getFieldDecorator('orgName', {
								validateTrigger: 'onBlur',
								initialValue: orgName,
								rules: [
									{
										required: true,
										message: '组织名称为不能空',
									},
									{
										validator: (rule, value, callback) => {
											let confictFlag = false;
											orgNameList.every(item => {
												if (item === value) {
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
										message: '已存在该组织名称',
									},
								],
							})(
								<Input
									onChange={(e) => this.submitButtonDisableHandler(e, 'orgName')}
									maxLength={20}
									placeholder='例如：星巴克杨浦店'
								/>
							)}
						</FormItem>
						<FormItem label='上级组织'>
							{getFieldDecorator('orgPid', {
							// validateTrigger: 'onSelect',
								initialValue: orgPidParams || orgPid,
								rules: [
									{
										required: true,
										message: '请选择上级组织',
									},
								],
							})(
								<TreeSelect
									disabled={!!orgPidParams} 
									onBlur={this.blurHandler}
									onSelect={this.onSelectHandler}
									onChange={(e) => this.submitButtonDisableHandler(e, 'orgPid')}
									treeData={[treeData]}
									placeholder='请选择'
									treeDefaultExpandAll
								/>
							)}
						</FormItem>
						<FormItem label='组织属性'>
							{getFieldDecorator('orgTag', {
								validateTrigger: 'onBlur',
								initialValue: businessStatus || 0,
								rules: [
									{
										required: true,
										message: '请选择组织属性',
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
									initialValue: action === 'create' ? null : [
										typeOne ? `${typeOne}` : null,
										typeTwo ? `${typeTwo}` : null,
									],
								})(
									<Cascader
										placeholder='请输入'
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
										placeholder="省/市/区"
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
										getFieldDecorator('startTime',{
											initialValue: (typeof(businessHours) === 'string' &&
											businessHours.indexOf('~') !== -1) ?
												moment(businessHours.split('~')[0], 'HH:mm') : undefined,
										})(
											<TimePicker
												disabled={allDayChecked}
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
											initialValue: (typeof(businessHours) === 'string' &&
										businessHours.indexOf('~') !== -1) ?
												moment(businessHours.split('~')[1], this.isNextDay()) : undefined,
										})(
											<TimePicker
												disabled={allDayChecked}
												placeholder='结束时间'
												format={this.isNextDay()}
											/>
										)
									}
								</Form.Item>
								<Form.Item className={styles['all-day']}>
									{
										getFieldDecorator('allDaysSelect', {
										})(
											<Checkbox checked={allDayChecked} onChange={this.allDayCheckChange}>全天</Checkbox>
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
							})(<Input maxLength={20} placeholder="请输入联系人" />)}
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
									<Input placeholder="请输入联系人邮箱" />
								)
							}
						</FormItem>
						<FormItem label=" " colon={false}>
							<Button type="primary" onClick={this.handleSubmit} disabled={isDisabled}>
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
