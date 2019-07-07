import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Form, Input, Button, Radio } from 'antd';
import OrgnizationSelect from './OrgnizationSelect';
import { getLocationParam } from '@/utils/utils';
import { HEAD_FORM_ITEM_LAYOUT } from '@/constants/form';

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

	formatMappingList = mappingList => {
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
			form: { validateFields },
			createEmployee,
			updateEmployee,
			goToPath,
		} = this.props;

		validateFields((err, values) => {
			if (!err) {
				const { mappingList = [] } = values;
				if (this.action === 'edit' && this.employeeId) {
					updateEmployee({
						employeeId: this.employeeId,
						...values,
						mappingList: this.formatMappingList(mappingList),
					});
				} else {
					const response = createEmployee({
						...values,
						mappingList: this.formatMappingList(mappingList),
					});
					if (response && response.code === ERROR_OK) {
						goToPath('employeeList');
					}
				}
			}
		});
	};

	handleCancel = () => {
		const { goToPath } = this.props;
		if (this.from === 'list' || !this.from) {
			goToPath('employeeList');
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

		return (
			<Card bordered={false}>
				<h3>
					{this.action === 'create'
						? formatMessage({ id: 'employee.create' })
						: formatMessage({ id: 'employee.alter' })}
				</h3>
				<Form {...HEAD_FORM_ITEM_LAYOUT}>
					<Form.Item label={formatMessage({ id: 'employee.number' })}>
						{getFieldDecorator('number', {
							initialValue: number,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({ id: 'employee.number.isEmpty' }),
								},
							],
						})(<Input />)}
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'employee.name' })}>
						{getFieldDecorator('name', {
							initialValue: name,
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
							initialValue: gender,
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
							initialValue: username,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'employee.phone.or.email.isEmpty',
									}),
								},
							],
						})(<Input />)}
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'employee.sso.account' })}>
						{getFieldDecorator('ssoUsername', {
							initialValue: ssoUsername,
						})(<Input />)}
					</Form.Item>
					<Form.Item
						label={formatMessage({ id: 'employee.orgnization' })}
						labelCol={{ md: { span: 4 }, xxl: { span: 2 } }}
						wrapperCol={{ md: { span: 16 }, xxl: { span: 12 } }}
					>
						{getFieldDecorator('mappingList', {
							initialValue: mappingList,
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
