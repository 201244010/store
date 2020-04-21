import React, { Component } from 'react';
import { Row, Col, TreeSelect, Select, Button, Form, Popover, Tree } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { FORM_ITEM_LAYOUT_EMPLOYEE } from '@/constants/form';
import styles from './Employee.less';

const { TreeNode } = Tree;
@connect(
	state => ({
		valueList: state.role.permissionListByRoleList,
		permissionList: state.role.permissionList,
		loading: state.loading,
	}),
	dispatch => ({
		getCompanyIdFromStorage: () => dispatch({ type: 'global/getCompanyIdFromStorage' }),
		getPListByRole: ({ roleList }) =>
			dispatch({ type: 'role/getPermissionListByRoleList', payload: { roleList } }),
		getPermissionList: () => dispatch({ type: 'role/getPermissionList' }),
	})
)
class OrgnizationSelect extends Component {
	constructor(props) {
		super(props);
		const value = props.value || [];
		this.state = {
			orgnizationRoleList: value.length > 0 ? value : [{ orgnization: null, role: [] }],
			orgId: props.orgId,
			// rolePermissionList: [],
		};
	}

	async componentDidMount() {
		const { getCompanyIdFromStorage, getPermissionList } = this.props;
		const { orgId } = this.state;
		await getPermissionList();
		const companyId = await getCompanyIdFromStorage();
		if (orgId && orgId !== 'NAN') {
			const orgnizationRoleList = [{ orgnization: `${companyId}-${orgId}`, role: [] }];
			this.setState({
				orgnizationRoleList,
			});
		}
	}

	handleOnchange = () => {
		const { orgnizationRoleList } = this.state;
		const { onChange } = this.props;
		if (onChange) {
			onChange({ ...orgnizationRoleList });
		}
	};

	handleTreeChange = (item, index, value) => {
		const { orgnizationRoleList } = this.state;
		item.orgnization = value;
		orgnizationRoleList.splice(index, 1, item);
		this.setState({
			orgnizationRoleList,
		});
		this.handleOnchange();
	};

	handleSelectChange = (item, index, value) => {
		const { orgnizationRoleList } = this.state;
		// const { roleSelectList } = this.props;
		// rolePermissionList[index] = Array.from(
		// 	new Set(
		// 		roleSelectList.permissionList.reduce((last, current) => [...last, ...current], [])
		// 	)
		// );
		// this.setState({ rolePermissionList });
		item.role = value;
		orgnizationRoleList.splice(index, 1, item);
		this.setState({
			orgnizationRoleList,
		});
		this.handleOnchange();
	};

	addItem = () => {
		const { orgnizationRoleList } = this.state;
		this.setState({
			orgnizationRoleList: [...orgnizationRoleList, { orgnization: null, role: [] }],
		});
	};

	removeItem = index => {
		const { orgnizationRoleList } = this.state;
		orgnizationRoleList.splice(index, 1);
		this.setState({
			orgnizationRoleList,
		});
		this.handleOnchange();
	};

	getPermissionAssign = async index => {
		const { orgnizationRoleList } = this.state;
		const { getPListByRole } = this.props;
		const { role: roleList } = orgnizationRoleList[index];
		await getPListByRole({ roleList });
		// const { valueList } = this.props;
		// console.log('getPermissionAssign', valueList, permissionList);
	};

	permissionTree = () => {
		const { permissionList, valueList } = this.props;
		return valueList.length ? (
			<Tree defaultExpandAll>
				{permissionList.reduce((last, p, index) => {
					const {
						checkedList: { permissionList: pList, label },
					} = p;
					if (p.valueList.find(i => valueList.includes(i))) {
						const treeNode = (
							<TreeNode title={label} key={`0-${index}`}>
								{pList
									.filter(i => valueList.includes(i.value))
									// eslint-disable-next-line arrow-body-style
									.map(item => {
										return <TreeNode title={item.name} key={item.value} />;
									})}
							</TreeNode>
						);
						return [...last, treeNode];
					}
					return [...last];
				}, [])}
			</Tree>
		) : (
			<></>
		);
	};

	render() {
		const { orgnizationRoleList } = this.state;
		const { orgnizationTree = [], roleSelectList = [], isDefault } = this.props;
		const LAYOUT_GUTTER = { xs: 8, sm: 8, md: 8, lg: 16, xl: 32 };
		const LAYOUT_COL = { md: 12, lg: 8 };
		return (
			<div className={styles['select-wrapper']}>
				{orgnizationRoleList.map((item, index) => (
					<Row gutter={LAYOUT_GUTTER} key={index}>
						<Col {...LAYOUT_COL}>
							<Form.Item
								label={formatMessage({ id: 'employee.orgnization' })}
								{...FORM_ITEM_LAYOUT_EMPLOYEE}
								required
								className={styles['form-item']}
							>
								<TreeSelect
									treeDefaultExpandAll
									value={
										orgnizationTree &&
										orgnizationTree.length > 0 &&
										item.orgnization
									}
									placeholder={formatMessage({
										id: 'employee.info.select.orgnizaion',
									})}
									treeData={orgnizationTree}
									dropdownStyle={{ maxHeight: '40vh' }}
									onChange={value => this.handleTreeChange(item, index, value)}
									disabled={isDefault}
								/>
							</Form.Item>
						</Col>
						<Col {...LAYOUT_COL}>
							<Form.Item
								label={formatMessage({ id: 'employee.info.role' })}
								{...FORM_ITEM_LAYOUT_EMPLOYEE}
								required
								className={styles['form-item']}
							>
								<Select
									mode="multiple"
									value={item.role}
									placeholder={formatMessage({
										id: 'employee.info.select.role',
									})}
									onChange={value => this.handleSelectChange(item, index, value)}
									disabled={isDefault}
								>
									{roleSelectList.map((role, i) => (
										<Select.Option key={i} value={role.id}>
											{role.name}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						{orgnizationRoleList.length > 1 && (
							<Col span={2}>
								<Button icon="delete" onClick={() => this.removeItem(index)} />
							</Col>
						)}
						{index === 0 && !isDefault && (
							<Col span={6}>
								<a href="#" onClick={this.addItem} className={styles.addOrg}>
									{formatMessage({ id: 'employee.orgnization.add' })}
								</a>
							</Col>
						)}
						<Col offset={1} span={16} className={styles.tooltip}>
							<Popover
								overlayClassName={styles.popup}
								placement="right"
								// title="xxx"
								content={this.permissionTree()}
								trigger="click"
								onVisibleChange={visible => {
									visible && this.getPermissionAssign(index);
								}}
							>
								<a href="#">
									{formatMessage({ id: 'employee.info.permission.has' })}
								</a>
							</Popover>
							{!isDefault && (
								<span>{formatMessage({ id: 'employee.info.permission.tip' })}</span>
							)}
						</Col>
					</Row>
				))}
			</div>
		);
	}
}

export default OrgnizationSelect;
