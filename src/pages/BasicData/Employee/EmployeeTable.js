import React, { Component } from 'react';
import { Table, Form, Input, Button, Row, Col, Card } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { COL_THREE_NORMAL, FORM_FORMAT } from '@/constants/form';
import moment from 'moment';
import styles from './Employee.less';
import global from '@/styles/common.less';

const FormItem = Form.Item;

@connect(
	state => ({
		query: state.routing.location.query,
		loading: state.loading,
		employee: state.employee,
	}),
	dispatch => ({
		getEmployeeList: ({ current = 1, pageSize = 10, name, number, username }) =>
			dispatch({
				type: 'employee/getEmployeeList',
				payload: { current, pageSize, name, number, username },
			}),
		clearSearchValue: () => dispatch({ type: 'employee/clearSearchValue' }),
	})
)
@Form.create()
class EmployeeTable extends Component {
	componentDidMount() {
		const { getEmployeeList } = this.props;
		getEmployeeList({});
	}

	handleSubmit = () => {
		const {
			form: { validateFields },
			getEmployeeList,
		} = this.props;
		validateFields(async (err, values) => {
			if (!err) {
				const { name, number, username } = values;
				const payload = {
					name,
					number,
					username,
				};
				const response = await getEmployeeList(payload);
				if (response && response.code !== ERROR_OK) {
					setFields({
						companyName: {
							value: values.name,
							errors: [
								new Error(
									formatMessage({
										id: 'roleManagement.role.accountNotExist',
									})
								),
							],
						},
					});
				}
			}
		});
	};

	handleReset = async () => {
		const { form, clearSearchValue, getEmployeeList } = this.props;
		if (form) {
			form.resetFields();
		}
		await clearSearchValue();
		await getEmployeeList({});
	};

	onTableChange = page => {
		const {getEmployeeList} = this.props;
		const { current = 1, pageSize = 10 } = page;
		if (getEmployeeList) {
			getEmployeeList({ current, pageSize });
		}
	};

	render() {
		const {
			form: { getFieldDecorator },
			query: { role },
			employee: { employeeList , pagination},
			loading,
		} = this.props;

		const columns = [
			{
				title: formatMessage({ id: 'roleManagement.role.companyNumber' }),
				dataIndex: 'number',
			},
			{
				title: formatMessage({ id: 'roleManagement.role.name' }),
				dataIndex: 'name',
			},
			{
				title: formatMessage({ id: 'roleManagement.role.gender' }),
				dataIndex: 'gender',
				render: gender =>
					gender === 1
						? formatMessage({ id: 'employee.gender.male' })
						: formatMessage({ id: 'employee.gender.female' }),
			},
			{
				title: formatMessage({ id: 'roleManagement.role.employeePhone' }),
				dataIndex: 'phone',
			},
			{
				title: formatMessage({ id: 'roleManagement.role.authorName' }),
				render: (_, record) => (
					<span>{`${record.ssoUsername}(${record.phone || record.email || '--'})`}</span>
				),
			},
			{
				title: formatMessage({ id: 'roleManagement.role.authTime' }),
				dataIndex: 'createTime',
				render: createTime => moment.unix(createTime).format('YYYY-MM-DD HH:mm:ss') || '--',
			},
		];

		return (
			<Card bordered={false}>
				<div className={styles['role-title']}>
					<span>{formatMessage({ id: 'employee.info.currentRole' })}</span>
					<span>{role}</span>
				</div>
				<div className={global['search-bar']}>
					<Form layout="inline">
						<Row gutter={FORM_FORMAT.gutter}>
							<Col {...COL_THREE_NORMAL}>
								<FormItem label={formatMessage({ id: 'roleManagement.role.name' })}>
									{getFieldDecorator('name', {})(<Input />)}
								</FormItem>
							</Col>
							<Col {...COL_THREE_NORMAL}>
								<FormItem
									label={formatMessage({
										id: 'roleManagement.role.companyNumber',
									})}
								>
									{getFieldDecorator('number', {})(<Input />)}
								</FormItem>
							</Col>
							<Col {...COL_THREE_NORMAL}>
								<FormItem
									label={formatMessage({
										id: 'roleManagement.role.telePhone',
									})}
								>
									{getFieldDecorator('username', {})(<Input />)}
								</FormItem>
							</Col>
							<Col {...COL_THREE_NORMAL}>
								<Button type="primary" onClick={this.handleSubmit}>
									{formatMessage({ id: 'btn.query' })}
								</Button>
								<Button style={{ marginLeft: '20px' }} onClick={this.handleReset}>
									{formatMessage({ id: 'storeManagement.list.buttonReset' })}
								</Button>
							</Col>
						</Row>
					</Form>
				</div>
				<div className={styles['employee-table']}>
					<Table
						rowKey="shop_id"
						dataSource={employeeList}
						columns={columns}
						loading={loading.effects['employee/getEmployeeList']}
						pagination={pagination}
						onChange={this.onTableChange}
					/>
				</div>
			</Card>
		);
	}
}

export default EmployeeTable;
