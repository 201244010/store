import React, { Component } from 'react';
import { Table, Form, Input, Button, Row, Col, Card } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import { idDecode } from '@/utils/utils';
import { SEARCH_FORM_COL, FORM_FORMAT } from '@/constants/form';
import { EMPLOYEE_NUMBER_LIMIT, EMPLOYEE_NAME_LIMIT, EMPLOYEE_PHONE_LIMIT } from './constants';
import styles from './Employee.less';

const FormItem = Form.Item;
const GENDER_MAP = {
	1: formatMessage({ id: 'employee.gender.male' }),
	2: formatMessage({ id: 'employee.gender.female' }),
};

@connect(
	state => ({
		query: state.routing.location.query,
		loading: state.loading,
		employee: state.employee,
	}),
	dispatch => ({
		getEmployeeList: ({ current = 1, pageSize = 10, roleId = -1 }) =>
			dispatch({
				type: 'employee/getEmployeeList',
				payload: { current, pageSize, roleId },
			}),
		setSearchValue: payload => dispatch({ type: 'employee/setSearchValue', payload }),
		setGetInfoValue: payload => dispatch({ type: 'employee/setGetInfoValue', payload }),
		clearSearchValue: () => dispatch({ type: 'employee/clearSearchValue' }),
	})
)
class EmployeeTable extends Component {
	constructor(props) {
		super(props);
		this.columns = [
			{
				title: formatMessage({ id: 'roleManagement.role.companyNumber' }),
				dataIndex: 'number',
				render: number => number || '--',
			},
			{
				title: formatMessage({ id: 'roleManagement.role.name' }),
				dataIndex: 'name',
				render: name => name || '--',
			},
			{
				title: formatMessage({ id: 'roleManagement.role.gender' }),
				dataIndex: 'gender',
				render: gender => GENDER_MAP[gender] || '--',
			},
			{
				title: formatMessage({ id: 'roleManagement.role.employeePhone' }),
				dataIndex: 'phone',
				render: phone => phone || '--',
			},
			{
				title: formatMessage({ id: 'roleManagement.role.authorName' }),
				render: (_, record) => (
					<span>{`${record.createByUsername || '--'}(${record.createBy || '--'})`}</span>
				),
			},
			{
				title: formatMessage({ id: 'roleManagement.role.authTime' }),
				dataIndex: 'createTime',
				render: createTime => moment.unix(createTime).format('YYYY-MM-DD HH:mm:ss') || '--',
			},
		];
	}

	componentDidMount() {
		const {
			getEmployeeList,
			query: { roleId },
		} = this.props;
		getEmployeeList({ roleId: idDecode(roleId) });
	}

	componentWillUnmount() {
		const { clearSearchValue } = this.props;
		clearSearchValue();
	}

	handleSearchChange = (field, value) => {
		const { setSearchValue } = this.props;
		setSearchValue({
			[field]: value,
		});
	};

	handleSubmit = () => {
		const {
			getEmployeeList,
			query: { roleId },
			setGetInfoValue,
		} = this.props;
		setGetInfoValue();
		getEmployeeList({ roleId: idDecode(roleId) });
	};

	handleReset = () => {
		const {
			form,
			clearSearchValue,
			getEmployeeList,
			query: { roleId },
		} = this.props;
		if (form) {
			form.resetFields();
		}
		clearSearchValue();
		getEmployeeList({ roleId: idDecode(roleId) });
	};

	onTableChange = page => {
		const {
			getEmployeeList,
			query: { roleId },
		} = this.props;
		const { current = 1, pageSize = 10 } = page;
		if (getEmployeeList) {
			getEmployeeList({ current, pageSize, roleId: idDecode(roleId) });
		}
	};

	render() {
		const {
			query: { role },
			employee: {
				employeeList,
				pagination,
				searchValue: { name, username, number },
			},
			loading,
		} = this.props;

		return (
			<Card bordered={false}>
				<div className={styles['role-title']}>
					<span>{formatMessage({ id: 'employee.info.currentRole' })}</span>
					<span>{role}</span>
				</div>
				<div className={styles['search-bar']}>
					<Form layout="inline">
						<Row gutter={FORM_FORMAT.gutter}>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<FormItem label={formatMessage({ id: 'roleManagement.role.name' })}>
									<Input
										maxLength={EMPLOYEE_NAME_LIMIT}
										value={name}
										onChange={e =>
											this.handleSearchChange('name', e.target.value)
										}
									/>
								</FormItem>
							</Col>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<FormItem
									label={formatMessage({
										id: 'roleManagement.role.companyNumber',
									})}
								>
									<Input
										maxLength={EMPLOYEE_NUMBER_LIMIT}
										value={number}
										onChange={e =>
											this.handleSearchChange('number', e.target.value)
										}
									/>
								</FormItem>
							</Col>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<FormItem
									label={formatMessage({
										id: 'roleManagement.role.telePhone',
									})}
								>
									<Input
										maxLength={EMPLOYEE_PHONE_LIMIT}
										value={username}
										onChange={e =>
											this.handleSearchChange('username', e.target.value)
										}
									/>
								</FormItem>
							</Col>
						</Row>
						<Row gutter={FORM_FORMAT.gutter}>
							<Col {...SEARCH_FORM_COL.ONE_THIRD} />
							<Col {...SEARCH_FORM_COL.ONE_THIRD} />
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item className={styles['query-item']}>
									<Button type="primary" onClick={this.handleSubmit}>
										{formatMessage({ id: 'btn.query' })}
									</Button>
									<Button
										style={{ marginLeft: '20px' }}
										onClick={this.handleReset}
									>
										{formatMessage({ id: 'storeManagement.list.buttonReset' })}
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</div>
				<div className={styles['employee-table']}>
					<Table
						rowKey="employeeId"
						dataSource={employeeList}
						columns={this.columns}
						loading={loading.effects['employee/getEmployeeList']}
						pagination={{
							...pagination,
							showTotal: total =>
								`${formatMessage({
									id: 'employee.list.total',
								})}${total}${formatMessage({
									id: 'employee.list.memberCount',
								})}`,
						}}
						onChange={this.onTableChange}
					/>
				</div>
			</Card>
		);
	}
}

export default EmployeeTable;
