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

	permissionTree = index => {
		const { permissionList, roleSelectList: roleList } = this.props;
		const { orgnizationRoleList } = this.state;
		const roleSelectd = orgnizationRoleList[index] && orgnizationRoleList[index].role;
		if (roleSelectd.length) {
			const valueList = roleSelectd.reduce((vList, roleId) => {
				const role = roleList.find(i => i.id === roleId) || {};
				return [...vList, ...(role.permissionList || [])];
			}, []);

			return (
				<Tree defaultExpandAll>
					{permissionList.reduce((last, p, key) => {
						const { permissionList: pList, label } = p;
						if (p.valueList.find(i => valueList.includes(i))) {
							const treeNode = (
								<TreeNode title={label} key={`0-${key}`}>
									{pList
										.filter(i => valueList.includes(i.value))
										// eslint-disable-next-line arrow-body-style
										.map(item => {
											return <TreeNode title={item.label} key={item.value} />;
										})}
								</TreeNode>
							);
							return [...last, treeNode];
						}
						return [...last];
					}, [])}
				</Tree>
			);
		}
		return <></>;
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
								content={this.permissionTree(index)}
								trigger="click"
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
