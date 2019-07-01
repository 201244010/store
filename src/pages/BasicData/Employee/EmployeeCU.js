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
	}

	componentDidMount() {
		if (this.employeeId && this.action === 'edit') {
			const { getEmployeeInfo } = this.props;
			getEmployeeInfo();
		}
	}

	handleSubmit = () => {
		const {
			form: { validateFields },
		} = this.props;

		validateFields((err, values) => {
			console.log(values);
		});
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
						labelCol={{ span: 4 }}
						wrapperCol={{ span: 16 }}
					>
						{getFieldDecorator('organizationRoleMappingList', {
							initialValue: organizationRoleMappingList,
						})(<OrgnizationSelect />)}
					</Form.Item>
					<Form.Item label=" " colon={false}>
						<Button type="primary" onClick={this.handleSubmit}>
							{this.action === 'create'
								? formatMessage({ id: 'btn.create' })
								: formatMessage({ id: 'btn.alter' })}
						</Button>
						<Button style={{ marginLeft: '20px' }}>
							{formatMessage({ id: 'btn.cancel' })}
						</Button>
					</Form.Item>
				</Form>
			</Card>
		);
	}
}

export default EmployeeCU;
