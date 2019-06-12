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
import router from 'umi/router';
import { MENU_PREFIX } from '@/constants';
import { ERROR_OK, ALERT_NOTICE_MAP } from '@/constants/errorCode';
import { connect } from 'dva';

import styles from './Role.less';

const FormItem = Form.Item;

@connect(
	state => ({
		role: state.role,
		loading: state.loading.models.role,
	}),
	dispatch => ({
		getRoleList: payload => dispatch({ type: 'role/getRoleList', payload }),
		deleteRole: payload => dispatch({ type: 'role/deleteRole', payload }),
	})
)
@Form.create()
class RoleList extends React.Component {
	columns = [
		{
			title: formatMessage({ id: 'roleManagement.role.roleName' }),
			dataIndex: 'name',
			render: (_, record) => <div>{record.name || '--'}</div>,
		},
		{
			title: formatMessage({ id: 'roleManagement.role.userCount' }),
			dataIndex: 'user_count',
			render: (_, record) => <div className={styles.view}>{record.user_count}</div>,
		},
		{
			title: formatMessage({ id: 'roleManagement.role.creator' }),
			dataIndex: 'creator_name',
			render: (_, record) => <div>{record.creator_name || '--'}</div>,
		},
		{
			title: formatMessage({ id: 'roleManagement.role.createTime' }),
			dataIndex: 'create_time',
			render: (_, record) => <div>{unixSecondToDate(record.create_time) || '--'}</div>,
		},
		{
			title: formatMessage({ id: 'list.action.title' }),
			render: (_, record) =>
				record.isDefault ? (
					<span className={styles.view} onClick={this.viewRole}>
						{formatMessage({ id: 'list.action.view' })}
					</span>
				) : (
					<div>
						<span className={styles.view} onClick={() => this.goPath(record, 'view')}>
							{formatMessage({ id: 'list.action.view' })}
						</span>
						<Divider type="vertical" />
						<span className={styles.view} onClick={() => this.goPath(record, 'modify')}>
							{formatMessage({ id: 'list.action.edit' })}
						</span>
						<Divider type="vertical" />
						<Popconfirm
							title={formatMessage({ id: 'roleManagement.role.deleteRole' })}
							icon={
								<Icon theme="filled" style={{ color: 'red' }} type="close-circle" />
							}
							onConfirm={() => this.deleteRole(record)}
						>
							<span className={styles.view}>
								{formatMessage({ id: 'list.action.delete' })}
							</span>
						</Popconfirm>
					</div>
				),
		},
	];

	componentDidMount() {
		const { getRoleList } = this.props;
		getRoleList();
	}

	deleteRole = async rowDetail => {
		const { deleteRole } = this.props;
		const response = await deleteRole({ roleId: rowDetail.id });
		if (response && response.code === ERROR_OK) {
			message.success(formatMessage({ id: 'roleManagement.role.deleteSuccess' }));
			router.push(`${MENU_PREFIX.ROLE}/roleList`);
		} else {
			message.error(
				formatMessage({ id: ALERT_NOTICE_MAP[response.code] }) ||
					formatMessage({ id: 'roleManagement.role.deleteFail' })
			);
		}
	};

	goPath = (rowDetail, path) => {
		const encodeID = rowDetail.id ? idEncode(rowDetail.id) : null;
		const urlMap = {
			modify: `${MENU_PREFIX.ROLE}/modify?action=modify&id=${encodeID}`,
			view: `${MENU_PREFIX.ROLE}/view?id=${encodeID}`,
			create: `${MENU_PREFIX.ROLE}/create?action=create`,
		};
		router.push(`${urlMap[path]}`);
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
			<Card>
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
						loading={loading}
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
