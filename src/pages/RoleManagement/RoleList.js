import React from 'react';
import { Input, Button, Table, Divider, Form, Row, Col, message, Modal, Card } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { unixSecondToDate } from '@/utils/utils';
import { SEARCH_FORM_COL, FORM_FORMAT, FORM_ITEM_LAYOUT_COMMON } from '@/constants/form';
import { ERROR_OK, ALERT_NOTICE_MAP, ALERT_ROLE_MAP } from '@/constants/errorCode';
import RoleModify from './RoleCreateModify';
import PermissionList from './PermissionList';

import styles from './Role.less';

const FormItem = Form.Item;

@connect(
	state => ({
		role: state.role,
		loading: state.loading,
		user: state.user,
	}),
	dispatch => ({
		getRoleList: payload => dispatch({ type: 'role/getRoleList', payload }),
		deleteRole: payload => dispatch({ type: 'role/deleteRole', payload }),
		checkAdmin: () => dispatch({ type: 'role/checkAdmin' }),
		changeAdmin: payload => dispatch({ type: 'role/changeAdmin', payload }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
		getUserInfo: () => dispatch({ type: 'user/getUserInfo' }),
		getRoleInfo: payload => dispatch({ type: 'role/getRoleInfo', payload }),
		updateRoleInfo: payload => dispatch({ type: 'role/updateRoleInfo', payload }),
		getPermissionList: payload => dispatch({ type: 'role/getPermissionList', payload }),
	})
)
@Form.create()
class RoleList extends React.Component {
	constructor(props) {
		super(props);
		const { getRoleInfo } = this.props;
		this.state = {
			visible: false,
			visiblePermissionList: false,
			visibleDeleteRole: false,
			roleModify: {
				action: null, // modify create copy
				id: null,
			},
		};
		this.columns = [
			{
				title: formatMessage({ id: 'roleManagement.role.roleName' }),
				dataIndex: 'name',
				render: (_, record) => <div>{record.name || '--'}</div>,
			},
			{
				title: formatMessage({ id: 'roleManagement.role.userCount' }),
				dataIndex: 'userCount',
				render: (_, record) =>
					record.isDefault ? (
						'--'
					) : (
						<a
							href="javascript:void(0);"
							onClick={() => this.goPath(record, 'employee')}
						>
							{record.userCount}
						</a>
					),
			},
			// {
			// 	title: formatMessage({ id: 'roleManagement.role.creator' }),
			// 	dataIndex: 'creatorName',
			// 	render: (_, record) => <div>{record.creatorName || '--'}</div>,
			// },
			{
				title: formatMessage({ id: 'roleManagement.role.createTime' }),
				dataIndex: 'createTime',
				render: (_, record) => <div>{unixSecondToDate(record.createTime) || '--'}</div>,
			},
			{
				title: formatMessage({ id: 'list.action.title' }),
				render: (_, record) => (
					// const {
					// 	user: {
					// 		currentUser: { checkAdmin },
					// 	},
					// } = this.props;
					// return (
					<div>
						<a
							href="javascript:void(0);"
							onClick={() => {
								this.modifyRoleInfo({ id: record.id, action: 'modify' });
							}}
						>
							{record.isDefault
								? formatMessage({ id: 'list.action.view' })
								: formatMessage({ id: 'list.action.edit' })}
						</a>
						{record.isDefault ? (
							// checkAdmin ? (
							// 	<span>
							// 		<Divider type="vertical" />
							// 		<Popconfirm
							// 			title={formatMessage({
							// 				id: 'roleManagement.role.changeRoleTitle',
							// 			})}
							// 			icon={
							// 				<Icon
							// 					theme="filled"
							// 					style={{ color: 'red' }}
							// 					type="close-circle"
							// 				/>
							// 			}
							// 			onConfirm={() => {
							// 				this.setState({
							// 					visible: true,
							// 				});
							// 			}}
							// 			okButtonProps={{
							// 				loading: loading.effects['role/deleteRole'],
							// 			}}
							// 		>
							// 			<a href="javascript:void(0);">
							// 				{formatMessage({
							// 					id: 'roleManagement.role.changeRole',
							// 				})}
							// 			</a>
							// 		</Popconfirm>
							// 	</span>
							// ) : (
							// 	<></>
							// )
							<></>
						) : (
							<span>
								<Divider type="vertical" />
								<a
									// href="javascript:void(0);"
									onClick={() => {
										this.modifyRoleInfo({ id: record.id, action: 'copy' });
									}}
								>
									{formatMessage({ id: 'list.action.copy' })}
								</a>
								<Divider type="vertical" />
								<a
									// href="javascript:void(0);"
									onClick={async () => {
										this.rowSelected = record;
										await getRoleInfo({ roleId: record.id });
										this.setState({ visibleDeleteRole: true });
									}}
								>
									{formatMessage({ id: 'list.action.delete' })}
								</a>
							</span>
						)}
					</div>
				),
				// );
			},
		];
	}

	async componentDidMount() {
		const { getRoleList, checkAdmin, getPermissionList } = this.props;
		await checkAdmin();
		await getRoleList();
		await getPermissionList();
	}

	deleteRole = async () => {
		const { deleteRole, getRoleList } = this.props;
		const {
			rowSelected: { id: roleId },
		} = this;
		const response = await deleteRole({ roleId });
		this.setState({ visibleDeleteRole: false });
		if (response && response.code === ERROR_OK) {
			message.success(formatMessage({ id: 'roleManagement.role.deleteSuccess' }));
			getRoleList();
		} else {
			message.error(
				formatMessage({
					id: ALERT_NOTICE_MAP[response.code] || 'roleManagement.role.deleteFail',
				})
			);
		}
	};

	changeAccount = () => {
		const {
			form: { validateFields, setFields },
			changeAdmin,
		} = this.props;
		validateFields(['account'], async (err, values) => {
			if (!err) {
				const payload = {
					targetSsoUsername: values.account,
				};
				const response = await changeAdmin(payload);
				if (response && response.code !== ERROR_OK) {
					setFields({
						account: {
							value: values.account,
							errors: [
								new Error(formatMessage({ id: ALERT_ROLE_MAP[response.code] })),
							],
						},
					});
				} else {
					message.success(
						formatMessage({ id: 'roleManagement.role.changeRole.success' })
					);
					this.setState({
						visible: false,
					});
					window.location.reload();
				}
			}
		});
	};

	handleSubmit = () => {
		const {
			getRoleList,
			form: { validateFields },
		} = this.props;

		validateFields(['keyword'], async (err, values) => {
			if (!err) {
				const { keyword } = values;
				this.keyword = keyword;
				await getRoleList({ keyword });
			}
		});
	};

	onTableChange = async pagination => {
		const { getRoleList } = this.props;
		await getRoleList({
			pageSize: pagination.pageSize,
			current: pagination.current,
			keyword: this.keyword,
		});
	};

	modifyRoleInfo = async ({ id, action }) => {
		const { getRoleInfo } = this.props;
		id && (await getRoleInfo({ roleId: id }));
		this.setState({
			roleModify: { id, action },
		});
	};

	render() {
		const {
			role: {
				roleList,
				pagination,
				roleInfo: { permissionCount },
				permissionList,
			},
			form: { getFieldDecorator },
			loading,
			updateRoleInfo,
		} = this.props;
		const {
			visible,
			visiblePermissionList,
			roleModify: { id, action },
			visibleDeleteRole,
		} = this.state;
		const { userCount = null } = this.rowSelected || {};
		// const { Search } = Input;

		return (
			<Card bordered={false}>
				<div className={styles.wrapper}>
					<div className={styles['search-bar']}>
						<Row gutter={FORM_FORMAT.gutter}>
							<Col {...SEARCH_FORM_COL.ONE_HALF}>
								<Form layout="inline" className={styles['search-form']}>
									<FormItem className="search-keyword-wrapper">
										{getFieldDecorator('keyword', {})(
											<Input
												maxLength={40}
												placeholder={formatMessage({
													id: 'roleManagement.role.search.keyword',
												})}
											/>
										)}
									</FormItem>
									<Form.Item className={styles['query-item']}>
										<Button type="primary" onClick={this.handleSubmit}>
											{formatMessage({ id: 'btn.query' })}
										</Button>
									</Form.Item>
								</Form>
							</Col>
							<Col {...SEARCH_FORM_COL.ONE_HALF} className={styles['right-wrapper']}>
								<Button
									type="primary"
									icon="plus"
									// onClick={() => this.goPath({}, 'create')}
									onClick={() => {
										updateRoleInfo({
											roleInfo: {
												name: '',
												permissionList: [],
												permissionCount: 0,
											},
										});
										this.setState({
											roleModify: {
												action: 'create',
												id: null,
											},
										});
									}}
									className={styles['add-role']}
								>
									{formatMessage({ id: 'roleManagement.role.addRole' })}
								</Button>
								<a
									onClick={() => {
										this.setState({ visiblePermissionList: true });
									}}
								>
									{formatMessage({ id: 'roleManagement.role.allPermission' })}
								</a>
							</Col>
						</Row>
					</div>
					<Table
						rowKey="id"
						loading={loading.effects['role/getRoleList']}
						columns={this.columns}
						dataSource={roleList}
						pagination={{ ...pagination }}
						onChange={this.onTableChange}
					/>
				</div>
				<PermissionList
					visible={visiblePermissionList}
					data={permissionList}
					closeModal={() => {
						this.setState({ visiblePermissionList: false });
					}}
				/>
				<RoleModify
					action={action}
					id={id}
					visible={Boolean(action)}
					closeModal={() => {
						this.setState({
							roleModify: {
								id: null,
								action: null,
							},
						});
					}}
				/>
				<Modal
					title={formatMessage({ id: 'roleManagement.role.delete' })}
					visible={visibleDeleteRole}
					closable={false}
					okText={formatMessage({ id: 'btn.delete' })}
					onOk={this.deleteRole}
					confirmLoading={loading.effects['role/deleteRole']}
					onCancel={() => this.setState({ visibleDeleteRole: false })}
				>
					{`${formatMessage({
						id: 'roleManagement.role.deleteRole.one',
					})}${permissionCount}${formatMessage({
						id: 'roleManagement.role.deleteRole.two',
					})}${userCount}${formatMessage({
						id: 'roleManagement.role.deleteRole.three',
					})}`}
				</Modal>
				<Modal
					visible={visible}
					title={formatMessage({ id: 'roleManagement.role.changeRole' })}
					onCancel={() => {
						this.setState({ visible: false });
					}}
					onOk={this.changeAccount}
				>
					<Form {...FORM_ITEM_LAYOUT_COMMON}>
						<Form.Item
							className={styles['margin-clear']}
							label={formatMessage({ id: 'roleManagement.role.sunmiAccount' })}
						>
							{getFieldDecorator('account', {
								validateTrigger: 'onBlur',
								rules: [
									{
										required: true,
										message: formatMessage({
											id: 'roleManagement.role.accountNotEmpty',
										}),
									},
								],
							})(<Input maxLength={30} />)}
						</Form.Item>
					</Form>
				</Modal>
			</Card>
		);
	}
}

export default RoleList;
