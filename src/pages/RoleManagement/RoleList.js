import React from 'react';
import { Input, Button, Table, Popconfirm, Icon, Divider } from 'antd';
import { unixSecondToDate, idEncode } from '@/utils/utils';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { MENU_PREFIX } from '@/constants';
import { connect } from 'dva';

import styles from './Role.less';

@connect(
	state => ({
		role: state.role,
	}),
	dispatch => ({
		getRoleList: payload => dispatch({ type: 'role/getRoleList', payload }),
		deleteRole: payload => dispatch({ type: 'role/deleteRole', payload }),
	})
)
class RoleList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			keyword: '',
		};
	}

	componentDidMount() {
		const { getRoleList } = this.props;
		getRoleList();
	}

	deleteRole = rowDetail => {
		const { deleteRole } = this.props;
		deleteRole({ roleId: rowDetail.id });
	};

	goPath = (rowDetail, path) => {
		const encodeID = rowDetail.id ? idEncode(rowDetail.id) : null;
		const urlMap = {
			modify: `${MENU_PREFIX.ROLE}/modify?id=${encodeID}`,
			view: `${MENU_PREFIX.ROLE}/view?id=${encodeID}`,
			create: `${MENU_PREFIX.ROLE}/create`,
		};
		router.push(`${urlMap[path]}`);
	};

	search = () => {
		const { keyword } = this.state;
		const { getRoleList } = this.props;
		getRoleList({ keyword });
	};

	changeKeyword = e => {
		this.setState({
			keyword: e.target.value,
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
			role: { loading, roleList, pagination },
		} = this.props;
		const columns = [
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
							<span
								className={styles.view}
								onClick={() => this.goPath(record, 'view')}
							>
								{formatMessage({ id: 'list.action.view' })}
							</span>
							<Divider type="vertical" />
							<span
								className={styles.view}
								onClick={() => this.goPath(record, 'modify')}
							>
								{formatMessage({ id: 'list.action.edit' })}
							</span>
							<Divider type="vertical" />
							<Popconfirm
								title="你确定要删除该角色吗"
								icon={
									<Icon
										theme="filled"
										style={{ color: 'red' }}
										type="close-circle"
									/>
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
		return (
			<div className={styles.wrapper}>
				<div className={styles.search}>
					<span>角色名称：</span>
					<Input
						onChange={this.changeKeyword}
						style={{ width: 320, marginRight: 20 }}
						placeholder="请输入"
					/>
					<Button onClick={this.search} type="primary">
						查询
					</Button>
				</div>
				<div className={styles['add-role']}>
					<Button type="primary" icon="plus" onClick={() => this.goPath({}, 'create')}>
						添加角色
					</Button>
				</div>
				<Table
					rowKey="id"
					loading={loading}
					columns={columns}
					dataSource={roleList}
					pagination={{ ...pagination }}
					onChange={this.onTableChange}
				/>
			</div>
		);
	}
}

export default RoleList;
