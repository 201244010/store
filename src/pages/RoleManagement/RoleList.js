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
	Card,
} from 'antd';
import { unixSecondToDate, idEncode } from '@/utils/utils';
import { formatMessage } from 'umi/locale';
import { COL_THREE_NORMAL, FORM_FORMAT } from '@/constants/form';
import { ERROR_OK, ALERT_NOTICE_MAP } from '@/constants/errorCode';
import { connect } from 'dva';

import styles from './Role.less';

const FormItem = Form.Item;

@connect(
	state => ({
		role: state.role,
		loading: state.loading,
	}),
	dispatch => ({
		getRoleList: payload => dispatch({ type: 'role/getRoleList', payload }),
		deleteRole: payload => dispatch({ type: 'role/deleteRole', payload }),
		goToPath: (pathId, urlParams = {}, open = false) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams, open } }),
	})
)
@Form.create()
class RoleList extends React.Component {
	constructor(props) {
		super(props);
		const { loading } = this.props;
		this.columns = [
			{
				title: formatMessage({ id: 'roleManagement.role.roleName' }),
				dataIndex: 'name',
				render: (_, record) => <div>{record.name || '--'}</div>,
			},
			{
				title: formatMessage({ id: 'roleManagement.role.userCount' }),
				dataIndex: 'userCount',
				render: (_, record) => <div className={styles.view}>{record.userCount}</div>,
			},
			{
				title: formatMessage({ id: 'roleManagement.role.creator' }),
				dataIndex: 'creatorName',
				render: (_, record) => <div>{record.creatorName || '--'}</div>,
			},
			{
				title: formatMessage({ id: 'roleManagement.role.createTime' }),
				dataIndex: 'createTime',
				render: (_, record) => <div>{unixSecondToDate(record.createTime) || '--'}</div>,
			},
			{
				title: formatMessage({ id: 'list.action.title' }),
				render: (_, record) => (
					<div>
						<a
							href="javascript:void(0);"
							className={styles.view}
							onClick={() => this.goPath(record, 'view')}
						>
							{formatMessage({ id: 'list.action.view' })}
						</a>
						{!record.isDefault && (
							<span>
								<Divider type="vertical" />
								<a
									href="javascript:void(0);"
									className={styles.view}
									onClick={() => this.goPath(record, 'modify')}
								>
									{formatMessage({ id: 'list.action.edit' })}
								</a>
								<Divider type="vertical" />
								<Popconfirm
									title={formatMessage({ id: 'roleManagement.role.deleteRole' })}
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
									<a href="javascript:void(0);" className={styles.view}>
										{formatMessage({ id: 'list.action.delete' })}
									</a>
								</Popconfirm>
							</span>
						)}
					</div>
				),
			},
		];
	}

	componentDidMount() {
		const { getRoleList } = this.props;
		getRoleList();
	}

	deleteRole = async rowDetail => {
		const { deleteRole, getRoleList } = this.props;
		const response = await deleteRole({ roleId: rowDetail.id });
		if (response && response.code === ERROR_OK) {
			message.success(formatMessage({ id: 'roleManagement.role.deleteSuccess' }));
			getRoleList();
		} else {
			message.error(
				formatMessage({ id: ALERT_NOTICE_MAP[response.code] }) ||
					formatMessage({ id: 'roleManagement.role.deleteFail' })
			);
		}
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

		validateFields(async (err, values) => {
			if (!err) {
				await getRoleList({ keyword: values.keyword });
			}
		});
	};

	onTableChange = async pagination => {
		const { getRoleList } = this.props;
		await getRoleList({
			pageSize: pagination.pageSize,
			current: pagination.current,
		});
	};

	render() {
		const {
			role: { roleList, pagination },
			form: { getFieldDecorator },
			loading,
		} = this.props;
		return (
			<Card bordered={false}>
				<div className={styles.wrapper}>
					<div className={styles['search-bar']}>
						<Form layout="inline">
							<Row gutter={FORM_FORMAT.gutter}>
								<Col {...COL_THREE_NORMAL}>
									<FormItem
										label={formatMessage({
											id: 'roleManagement.role.roleName',
										})}
									>
										{getFieldDecorator('keyword', {})(
											<Input
												placeholder={formatMessage({
													id: 'esl.device.upload.device.version.input',
												})}
											/>
										)}
									</FormItem>
								</Col>
								<Col {...COL_THREE_NORMAL}>
									<Button type="primary" onClick={this.handleSubmit}>
										{formatMessage({ id: 'btn.query' })}
									</Button>
								</Col>
							</Row>
						</Form>
					</div>
					<div className={styles['add-role']}>
						<Button
							type="primary"
							icon="plus"
							onClick={() => this.goPath({}, 'create')}
						>
							{formatMessage({ id: 'roleManagement.role.addRole' })}
						</Button>
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
			</Card>
		);
	}
}

export default RoleList;
