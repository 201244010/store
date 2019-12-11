import React from 'react';
import {
	Input,
	Button,
	Table,
	Popconfirm,
	Icon,
	Divider,
	Form,
	Row,
	Col,
	message,
	Modal,
	Card,
} from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { unixSecondToDate, idEncode } from '@/utils/utils';
import { SEARCH_FORM_COL, FORM_FORMAT, FORM_ITEM_LAYOUT_COMMON } from '@/constants/form';
import { ERROR_OK, ALERT_NOTICE_MAP, ALERT_ROLE_MAP } from '@/constants/errorCode';

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
	})
)
@Form.create()
class RoleList extends React.Component {
	constructor(props) {
		super(props);
		const { loading } = this.props;
		this.state = {
			visible: false,
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
						<a href="javascript:void(0);" onClick={() => this.goPath(record, 'view')}>
							{formatMessage({ id: 'list.action.view' })}
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
									href="javascript:void(0);"
									onClick={() => this.goPath(record, 'modify')}
								>
									{formatMessage({ id: 'list.action.edit' })}
								</a>
								<Divider type="vertical" />
								<Popconfirm
									title={formatMessage({
										id: 'roleManagement.role.deleteRole',
									})}
									icon={
										<Icon
											theme="filled"
											style={{ color: 'red' }}
											type="close-circle"
										/>
									}
									onConfirm={() => this.deleteRole(record)}
									okButtonProps={{
										loading: loading.effects['role/deleteRole'],
									}}
								>
									<a href="javascript:void(0);">
										{formatMessage({ id: 'list.action.delete' })}
									</a>
								</Popconfirm>
							</span>
						)}
					</div>
				),
				// );
			},
		];
	}

	async componentDidMount() {
		const { getRoleList, checkAdmin } = this.props;
		await checkAdmin();
		await getRoleList();
	}

	deleteRole = async rowDetail => {
		const { deleteRole, getRoleList } = this.props;
		const response = await deleteRole({ roleId: rowDetail.id });
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

	goPath = (rowDetail, path) => {
		const { goToPath } = this.props;
		const encodeID = rowDetail.id ? idEncode(rowDetail.id) : null;
		const urlMap = {
			modify: {
				pathId: 'roleModify',
				urlParams: {
					action: 'modify',
					id: encodeID,
				},
			},
			view: {
				pathId: 'roleInfo',
				urlParams: { id: encodeID },
			},
			create: {
				pathId: 'roleCreate',
				urlParams: {
					action: 'create',
				},
			},
			employee: {
				pathId: 'employeeTable',
				urlParams: {
					role: rowDetail.name,
					roleId: encodeID,
				},
			},
		};

		const { pathId, urlParams = {} } = urlMap[path] || {};
		goToPath(pathId, urlParams);
		// router.push(`${urlMap[path]}`);
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

	render() {
		const {
			role: { roleList, pagination },
			form: { getFieldDecorator },
			loading,
		} = this.props;
		const { visible } = this.state;
		return (
			<Card bordered={false}>
				<div className={styles.wrapper}>
					<div className={styles['search-bar']}>
						<Form layout="inline">
							<Row gutter={FORM_FORMAT.gutter}>
								<Col {...SEARCH_FORM_COL.ONE_THIRD}>
									<FormItem
										label={formatMessage({
											id: 'roleManagement.role.roleName',
										})}
									>
										{getFieldDecorator('keyword', {})(
											<Input
												maxLength={40}
												placeholder={formatMessage({
													id: 'esl.device.upload.device.version.input',
												})}
											/>
										)}
									</FormItem>
								</Col>
								<Col {...SEARCH_FORM_COL.ONE_THIRD} />
								<Col {...SEARCH_FORM_COL.ONE_THIRD}>
									<Form.Item className={styles['query-item']}>
										<Button type="primary" onClick={this.handleSubmit}>
											{formatMessage({ id: 'btn.query' })}
										</Button>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</div>
					<Button
						type="primary"
						icon="plus"
						onClick={() => this.goPath({}, 'create')}
						className={styles['add-role']}
					>
						{formatMessage({ id: 'roleManagement.role.addRole' })}
					</Button>
					<Table
						rowKey="id"
						loading={loading.effects['role/getRoleList']}
						columns={this.columns}
						dataSource={roleList}
						pagination={{ ...pagination }}
						onChange={this.onTableChange}
					/>
				</div>
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
