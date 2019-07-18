import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Form, Input, Button, Radio, message } from 'antd';
import OrgnizationSelect from './OrgnizationSelect';
import { getLocationParam } from '@/utils/utils';
import { HEAD_FORM_ITEM_LAYOUT } from '@/constants/form';
import { ERROR_OK, USER_EXIST, SSO_BINDED, EMPLOYEE_BINDED } from '@/constants/errorCode';
import * as RegExp from '@/constants/regexp';
import styles from './Employee.less';

@connect(
	state => ({
		loading: state.loading,
		employee: state.employee,
		role: state.role,
	}),
	dispatch => ({
		getCompanyIdFromStorage: () => dispatch({ type: 'global/getCompanyIdFromStorage' }),
		getShopListFromStorage: () => dispatch({ type: 'global/getShopListFromStorage' }),
		getCompanyListFromStorage: () => dispatch({ type: 'global/getCompanyListFromStorage' }),
		checkUsernameExist: ({ username }) =>
			dispatch({ type: 'employee/checkUsernameExist', payload: { username } }),
		checkSsoBinded: ({ ssoUsername }) =>
			dispatch({ type: 'employee/checkSsoBinded', payload: { ssoUsername } }),
		getEmployeeInfo: ({ employeeId }) =>
			dispatch({ type: 'employee/getEmployeeInfo', payload: { employeeId } }),
		createEmployee: ({ name, number, username, gender, ssoUsername, mappingList }) =>
			dispatch({
				type: 'employee/createEmployee',
				payload: { name, number, username, gender, ssoUsername, mappingList },
			}),
		updateEmployee: ({ employeeId, name, number, username, gender, mappingList }) =>
			dispatch({
				type: 'employee/updateEmployee',
				payload: { employeeId, name, number, username, gender, mappingList },
			}),
		getAllRoles: () => dispatch({ type: 'role/getAllRoles' }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
@Form.create()
class EmployeeCU extends Component {
	constructor(props) {
		super(props);

		[this.employeeId, this.action, this.from] = [
			getLocationParam('employeeId') || null,
			getLocationParam('action') || 'create',
			getLocationParam('from') || 'list',
		];

		this.state = {
			orgnizationTree: [],
		};
	}

	componentDidMount() {
		const { getAllRoles } = this.props;
		getAllRoles();
		this.createOrgnizationTree();
		if (this.employeeId && this.action === 'edit') {
			const { getEmployeeInfo } = this.props;
			getEmployeeInfo({ employeeId: this.employeeId });
		}
	}

	createOrgnizationTree = async () => {
		const {
			getCompanyIdFromStorage,
			getShopListFromStorage,
			getCompanyListFromStorage,
		} = this.props;
		const currentCompanyId = await getCompanyIdFromStorage();
		const companyList = await getCompanyListFromStorage();
		const shopList = await getShopListFromStorage();

		const companyInfo =
			companyList.find(company => company.company_id === currentCompanyId) || {};

		const orgnizationTree = [
			{
				title: companyInfo.company_name,
				value: companyInfo.company_id,
				key: companyInfo.company_id,
				children: shopList.map(shop => ({
					title: shop.shop_name,
					value: `${companyInfo.company_id}-${shop.shop_id}`,
					key: `${companyInfo.company_id}-${shop.shop_id}`,
				})),
			},
		];
		this.setState({
			orgnizationTree,
		});
	};

	decodeMappingList = mappingList => {
		// console.log(mappingList);
		const orgnizationMap = new Map();
		mappingList
			.filter(item => item.roleName !== 'admin')
			.forEach(item => {
				const { companyId = null, shopId = null, roleId = null } = item;
				const orgnizationKey =
					shopId === 0 || !shopId ? `${companyId}` : `${companyId}-${shopId}`;

				if (orgnizationMap.has(orgnizationKey)) {
					const { roleList = [] } = orgnizationMap.get(orgnizationKey);
					orgnizationMap.set(orgnizationKey, {
						roleList: [...roleList, roleId],
					});
				} else {
					orgnizationMap.set(orgnizationKey, {
						roleList: [roleId],
					});
				}
			});

		const result = [...orgnizationMap.keys()].map(key => {
			const { roleList = [] } = orgnizationMap.get(key);
			return {
				orgnization: key,
				role: roleList,
			};
		});
		// console.log(result);
		return result;
	};

	formatMappingList = mappingList => {
		// console.log('in format map:', mappingList);
		const formattedList = Object.keys(mappingList)
			.map(key => {
				const { orgnization = '', role = [] } = mappingList[key];
				const [companyId = null, shopId = null] = `${orgnization}`.split('-');
				return role.map(r => ({
					companyId,
					shopId,
					roleId: r,
				}));
			})
			.reduce((prev, cur) => [...prev, ...cur], []);
		// console.log(formattedList);
		return formattedList;
	};

	handleSubmit = () => {
		const {
			form: { validateFields, setFields },
			checkUsernameExist,
			checkSsoBinded,
			createEmployee,
			updateEmployee,
			goToPath,
		} = this.props;

		validateFields(async (err, values) => {
			// console.log(values);
			if (!err) {
				const { mappingList = [], ssoUsername = '', username, number } = values;
				const submitData = {
					...values,
					number: number.toUpperCase(),
					mappingList: this.formatMappingList(mappingList),
				};

				if (this.action === 'edit' && this.employeeId) {
					const response = await updateEmployee({
						employeeId: this.employeeId,
						...submitData,
					});
					if (response && response.code === ERROR_OK) {
						if (this.from === 'detail' && this.employeeId) {
							goToPath('employeeInfo', { employeeId: this.employeeId });
						} else {
							goToPath('employeeList');
						}
					} else if (response && response.code === EMPLOYEE_BINDED) {
						message.error(formatMessage({ id: 'employee.info.binded.error' }));
					} else {
						message.error(formatMessage({ id: 'employee.info.update.failed' }));
					}
				} else {
					const userExistCheckResult = await checkUsernameExist({ username });
					if (userExistCheckResult && userExistCheckResult.code === USER_EXIST) {
						setFields({
							username: {
								value: username,
								errors: [new Error(formatMessage({ id: 'employee.phone.exist' }))],
							},
						});
						return;
					}

					if (ssoUsername) {
						const checkResponse = await checkSsoBinded({ ssoUsername: username });
						if (checkResponse && checkResponse.code === SSO_BINDED) {
							setFields({
								ssoUsername: {
									value: ssoUsername,
									errors: [
										new Error(formatMessage({ id: 'employee.sso.binded' })),
									],
								},
							});
							return;
						}
					}

					const response = await createEmployee(submitData);
					if (response && response.code === ERROR_OK) {
						goToPath('employeeList');
					} else if (response && response.code === EMPLOYEE_BINDED) {
						setFields({
							number: {
								value: number,
								errors: [new Error(formatMessage({ id: 'employee.number.exist' }))],
							},
						});
					} else {
						message.error(formatMessage({ id: 'employee.info.create.failed' }));
					}
				}
			}
		});
	};

	handleCancel = () => {
		const { goToPath } = this.props;
		if (this.from === 'list' || !this.from) {
			goToPath('employeeList');
		} else if (this.employeeId) {
			goToPath('employeeInfo', { employeeId: this.employeeId });
		}
	};

	render() {
		const {
			form: { getFieldDecorator },
			loading,
			role: { roleSelectList = [] } = {},
			employee: {
				employeeInfo: {
					name = '',
					number = '',
					username = '',
					gender = '',
					ssoUsername = '',
					mappingList = [],
				} = {},
			} = {},
		} = this.props;
		const { orgnizationTree } = this.state;
		let decodedMapList = [];
		// console.log(mappingList);
		if (this.action === 'edit') {
			decodedMapList = this.decodeMappingList(mappingList);
		}

		return (
			<Card bordered={false} loading={loading.effects['employee/getEmployeeInfo']}>
				<h3>
					{this.action === 'create'
						? formatMessage({ id: 'employee.create' })
						: formatMessage({ id: 'employee.alter' })}
				</h3>
				<Form {...HEAD_FORM_ITEM_LAYOUT}>
					<Form.Item label={formatMessage({ id: 'employee.number' })}>
						{getFieldDecorator('number', {
							initialValue: this.action === 'edit' ? number : '',
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({ id: 'employee.number.isEmpty' }),
								},
								{
									validator: (rule, value, callback) => {
										if (value && !RegExp.employeeNumber.test(value)) {
											callback(
												formatMessage({ id: 'employee.number.formatError' })
											);
										} else {
											callback();
										}
									},
								},
							],
						})(<Input maxLength={20} className={styles['uppercase-input']} />)}
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'employee.name' })}>
						{getFieldDecorator('name', {
							initialValue: this.action === 'edit' ? name : '',
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({ id: 'employee.name.isEmpty' }),
								},
							],
						})(<Input maxLength={32} />)}
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'employee.gender' })}>
						{getFieldDecorator('gender', {
							initialValue: this.action === 'edit' ? gender : '',
						})(
							<Radio.Group>
								<Radio value={1}>
									{formatMessage({ id: 'employee.gender.male' })}
								</Radio>
								<Radio value={2}>
									{formatMessage({ id: 'employee.gender.female' })}
								</Radio>
							</Radio.Group>
						)}
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'employee.phone.or.email' })}>
						{getFieldDecorator('username', {
							initialValue: this.action === 'edit' ? username : '',
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'employee.phone.or.email.isEmpty',
									}),
								},
								{
									validator: (rule, value, callback) => {
										if (
											value &&
											!RegExp.phone.test(value) &&
											!RegExp.mail.test(value)
										) {
											callback(
												formatMessage({ id: 'employee.phone.formatError' })
											);
										} else {
											callback();
										}
									},
								},
							],
						})(<Input />)}
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'employee.sso.account' })}>
						{getFieldDecorator('ssoUsername', {
							initialValue: this.action === 'edit' ? ssoUsername : '',
						})(<Input disabled={!!(ssoUsername && this.action === 'edit')} />)}
					</Form.Item>
					<Form.Item
						label={formatMessage({ id: 'employee.orgnization' })}
						labelCol={{ md: { span: 4 }, xxl: { span: 2 } }}
						wrapperCol={{ md: { span: 16 }, xxl: { span: 12 } }}
					>
						{getFieldDecorator('mappingList', {
							initialValue: this.action === 'edit' ? decodedMapList : [],
						})(<OrgnizationSelect {...{ orgnizationTree, roleSelectList }} />)}
					</Form.Item>
					<Form.Item label=" " colon={false}>
						<Button
							type="primary"
							onClick={this.handleSubmit}
							loading={
								loading.effects['employee/createEmployee'] ||
								loading.effects['employee/updateEmployee']
							}
						>
							{this.action === 'create'
								? formatMessage({ id: 'btn.create' })
								: formatMessage({ id: 'btn.alter' })}
						</Button>
						<Button style={{ marginLeft: '20px' }} onClick={this.handleCancel}>
							{formatMessage({ id: 'btn.cancel' })}
						</Button>
					</Form.Item>
				</Form>
			</Card>
		);
	}
}

export default EmployeeCU;
