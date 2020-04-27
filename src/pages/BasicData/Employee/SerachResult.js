import React from 'react';
import { formatMessage } from 'umi/locale';
import { Table, Divider, Modal, message, Popover, Popconfirm, Icon } from 'antd';
import { uniqWith } from 'lodash-es';
import { omitTooLongString } from '@/utils/utils';
import { ERROR_OK } from '@/constants/errorCode';
import styles from './Employee.less';

const GENDER_MAP = {
	1: formatMessage({ id: 'employee.gender.male' }),
	2: formatMessage({ id: 'employee.gender.female' }),
};

const SearchResult = props => {
	const {
		data = [],
		pagination = {},
		loading = false,
		goToPath = null,
		deleteEmployee = null,
		getEmployeeList = null,
		userId = '',
	} = props;

	// const viewDetail = record => {
	// 	const { employeeId = null } = record;
	// 	if (goToPath && employeeId) {
	// 		goToPath('employeeInfo', {
	// 			employeeId,
	// 			from: 'list',
	// 		});
	// 	}
	// };

	const alterDetail = record => {
		const { employeeId = null, userId: recordUserId } = record;
		if (employeeId) {
			goToPath('employeeUpdate', {
				employeeId,
				action: 'edit',
				from: 'list',
				isDefault: userId === recordUserId ? 1 : 0,
			});
		}
	};

	const handleDelete = async record => {
		const { employeeId = '' } = record;
		if (deleteEmployee && employeeId) {
			const response = await deleteEmployee({ employeeIdList: [employeeId] });
			if (response && response.code === ERROR_OK) {
				message.success(formatMessage({ id: 'employee.info.delete.success' }));
			} else {
				Modal.error({
					title: formatMessage({ id: 'employee.info.delete.failed' }),
					okText: formatMessage({ id: 'btn.confirm' }),
					content: formatMessage({ id: 'employee.info.delete.failed.reason' }),
				});
			}
		}
	};

	// eslint-disable-next-line arrow-body-style
	const listOrg = list => {
		const listUniq = uniqWith(
			list,
			(now, other) => now.companyId === other.companyId && now.shopId === other.shopId
		);
		return listUniq.map((role, index) => {
			const { companyName = null, shopName = null } = role || {};
			return (
				<div key={index}>
					<span>{companyName}</span>
					<span>{shopName ? `(${shopName})` : null} </span>
					{/* <span> - </span>
						<span>{roleName}</span> */}
				</div>
			);
		});
	};

	const columns = [
		{
			title: formatMessage({ id: 'employee.number' }),
			dataIndex: 'number',
			render: number => number || '--',
		},
		{
			title: formatMessage({ id: 'employee.name' }),
			dataIndex: 'name',
			render: name => name || '--',
		},
		{
			title: formatMessage({ id: 'employee.gender' }),
			dataIndex: 'gender',
			render: gender => <>{GENDER_MAP[gender] || '--'}</>,
		},
		{
			title: formatMessage({ id: 'employee.orgnization' }),
			dataIndex: 'mappingList',
			render: (list, record) => {
				const [first] = list.filter(role => role.roleId !== 0) || [];
				const content = listOrg(list.filter(role => role.roleId !== 0) || []);
				const { companyName = null, shopName = null } = first || {};
				const text = shopName ? `${companyName}(${shopName})` : `${companyName}`;
				return (
					<>
						{first && (
							<>
								{/* <span> - </span>
								<span>{roleName}</span> */}
								{
									<Popover onClick={() => alterDetail(record)} content={content}>
										<a href="#">{omitTooLongString(text, 20, true)}</a>
									</Popover>
								}
								{/* {rest.length > 0 && (
									<Popover
										placement="rightTop"
										content={listOrg(rest)}
										title={null}
									>
										<a href="#" style={{ marginLeft: '10px' }}>
											{formatMessage({ id: 'list.action.more' })}
										</a>
									</Popover>
								)} */}
							</>
						)}
					</>
				);
			},
		},
		{
			title: formatMessage({ id: 'employee.info.role' }),
			dataIndex: 'roleList',
			render: (roleList, record) => {
				const text = roleList.reduce((pre, cur) => `${pre}、${cur}`);
				const content = roleList.map((role, key) => (
					<div key={key}>
						<span>{role}</span>
					</div>
				));
				return (
					<Popover onClick={() => alterDetail(record)} content={content}>
						<a href="#" onClick={() => alterDetail(record)}>
							{omitTooLongString(text, 20, true)}
						</a>
					</Popover>
				);
			},
		},
		{
			title: formatMessage({ id: 'employee.phone' }),
			dataIndex: 'username',
			render: username => username || '--',
		},
		// {
		// 	title: formatMessage({ id: 'employee.sso.account' }),
		// 	dataIndex: 'ssoUsername',
		// 	render: ssoUsername => ssoUsername || '--',
		// },
		{
			title: formatMessage({ id: 'list.action.title' }),
			key: 'action',
			render: (_, record) => (
				<>
					{/* <a href="javascript: void (0);" onClick={() => viewDetail(record)}>
						{formatMessage({ id: 'list.action.view' })}
					</a> */}
					{/* <Divider type="vertical" /> */}
					<a href="#" onClick={() => alterDetail(record)}>
						{formatMessage({ id: 'list.action.edit' })}
					</a>
					<Divider type="vertical" />
					{userId !== record.userId && (
						<Popconfirm
							icon={
								<Icon theme="filled" style={{ color: 'red' }} type="close-circle" />
							}
							title={formatMessage({ id: 'employee.info.delete' })}
							onConfirm={() => handleDelete(record)}
							okButtonProps={loading.effects['employee/deleteEmployee']}
							okText={formatMessage({ id: 'btn.confirm' })}
							cancelText={formatMessage({ id: 'btn.cancel' })}
						>
							<a href="#">{formatMessage({ id: 'list.action.delete' })}</a>
						</Popconfirm>
					)}
				</>
			),
		},
	];

	const onTableChange = page => {
		// console.log(page);
		const { current = 1, pageSize = 10 } = page;
		const { shopIdList = [] } = props;
		if (getEmployeeList) {
			getEmployeeList({ current, pageSize, shopIdList });
		}
	};

	return (
		<div className={styles['table-content']}>
			<Table
				onChange={onTableChange}
				rowKey="employeeId"
				loading={loading.effects['employee/getEmployeeList']}
				dataSource={data}
				columns={columns}
				pagination={{
					...pagination,
					showTotal: total =>
						`${formatMessage({ id: 'employee.list.total' })}${total}${formatMessage({
							id: 'employee.list.memberCount',
						})}`,
				}}
			/>
		</div>
	);
};

export default SearchResult;
