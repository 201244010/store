import React from 'react';
import { formatMessage } from 'umi/locale';
import { Table, Divider, Modal, message } from 'antd';
import styles from './Employee.less';
import { ERROR_OK } from '@/constants/errorCode';

const SearchResult = props => {
	const {
		data = [],
		pagination = {},
		loading = false,
		goToPath = null,
		deleteEmployee = null,
		getEmployeeList = null,
	} = props;

	const viewDetail = record => {
		const { employeeId = null } = record;
		if (goToPath && employeeId) {
			goToPath('employeeInfo', {
				employeeId,
				from: 'list',
			});
		}
	};

	const alterDetail = record => {
		const { employeeId = null } = record;
		if (employeeId) {
			goToPath('employeeUpdate', {
				employeeId,
				action: 'edit',
				from: 'list',
			});
		}
	};

	const handleDelete = record => {
		const { employeeId = '' } = record;
		Modal.confirm({
			title: formatMessage({ id: 'employee.info.delete' }),
			content: formatMessage({ id: 'employee.info.delete.confirm' }),
			okText: formatMessage({ id: 'btn.delete' }),
			cancelText: formatMessage({ id: 'btn.cancel' }),
			onOk: async () => {
				if (deleteEmployee && employeeId) {
					const response = await deleteEmployee({ employeeIdList: [employeeId] });
					if (response && response.code === ERROR_OK) {
						message.success(formatMessage({ id: 'employee.info.delete.success' }));
					} else {
						message.error(formatMessage({ id: 'employee.info.delete.failed' }));
					}
				}
			},
		});
	};

	const columns = [
		{ title: formatMessage({ id: 'employee.number' }), dataIndex: 'number' },
		{ title: formatMessage({ id: 'employee.name' }), dataIndex: 'name' },
		{ title: formatMessage({ id: 'employee.gender' }), dataIndex: 'gender' },
		{ title: formatMessage({ id: 'employee.orgnization' }), dataIndex: 'employeeOrgnization' },
		{ title: formatMessage({ id: 'employee.phone' }), dataIndex: 'username' },
		{ title: formatMessage({ id: 'employee.sso.account' }), dataIndex: 'ssoUsername' },
		{
			title: formatMessage({ id: 'list.action.title' }),
			key: 'action',
			render: (_, record) => (
				<>
					<a href="javascript: void (0);" onClick={() => viewDetail(record)}>
						{formatMessage({ id: 'list.action.view' })}
					</a>
					<Divider type="vertical" />
					<a href="javascript: void (0);" onClick={() => alterDetail(record)}>
						{formatMessage({ id: 'list.action.alter' })}
					</a>
					<Divider type="vertical" />
					<a href="javascript: void (0);" onClick={() => handleDelete(record)}>
						{formatMessage({ id: 'list.action.delete' })}
					</a>
				</>
			),
		},
	];

	const onTableChange = page => {
		// console.log(page);
		const { current = 1, pageSize = 10 } = page;
		if (getEmployeeList) {
			getEmployeeList({ current, pageSize });
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
				pagination={{ ...pagination }}
			/>
		</div>
	);
};

export default SearchResult;
