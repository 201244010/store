import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, Form, Input, Button, Radio } from 'antd';
import OrgnizationSelect from './OrgnizationSelect';
import { getLocationParam } from '@/utils/utils';
import { HEAD_FORM_ITEM_LAYOUT } from '@/constants/form';

@connect(
	state => ({
		employee: state.employee,
	}),
	dispatch => ({
		getCompanyIdFromStorage: () => dispatch({ type: 'global/getCompanyIdFromStorage' }),
		getShopListFromStorage: () => dispatch({ type: 'global/getShopListFromStorage' }),
		getCompanyListFromStorage: () => dispatch({ type: 'global/getCompanyListFromStorage' }),
		getEmployeeInfo: ({ employeeId }) =>
			dispatch({ type: 'employee/getEmployeeInfo', payload: { employeeId } }),
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
		if (this.employeeId && this.action === 'edit') {
			const { getEmployeeInfo } = this.props;
			getEmployeeInfo();
		}

		this.createOrgnizationTree();
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

	handleSubmit = () => {
		const {
			form: { validateFields },
		} = this.props;

		validateFields((err, values) => {
			console.log(values);
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
			employee: {
				employeeInfo: {
					name = null,
					number = null,
					username = null,
					gender = null,
					ssoUsername = null,
					organizationRoleMappingList = [],
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
						{getFieldDecorator('employeeNumber', {
							initialValue: number,
							rules: [
								{
									required: true,
									message: formatMessage({ id: 'employee.number.isEmpty' }),
								},
							],
						})(<Input />)}
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'employee.name' })}>
						{getFieldDecorator('employeeNumber', {
							initialValue: name,
							rules: [
								{
									required: true,
									message: formatMessage({ id: 'employee.name.isEmpty' }),
								},
							],
						})(<Input maxLength={32} />)}
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'employee.gender' })}>
						{getFieldDecorator('employeeGender', {
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
						{getFieldDecorator('employeeUsername', {
							initialValue: username,
						})(<Input />)}
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'employee.sso.account' })}>
						{getFieldDecorator('ssoUsername', {
							initialValue: ssoUsername,
						})(<Input />)}
					</Form.Item>
					<Form.Item
						label={formatMessage({ id: 'employee.orgnization' })}
						labelCol={{ md: { span: 4 }, xxl: {span: 2} }}
						wrapperCol={{ md: { span: 16 }, xxl: {span: 12} }}
					>
						{getFieldDecorator('organizationRoleMappingList', {
							initialValue: organizationRoleMappingList,
						})(<OrgnizationSelect {...{ orgnizationTree }} />)}
					</Form.Item>
					<Form.Item label=" " colon={false}>
						<Button type="primary" onClick={this.handleSubmit}>
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
