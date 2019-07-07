import React from 'react';
import { formatMessage } from 'umi/locale';
import { Table, Divider } from 'antd';
import styles from './Employee.less';

const SearchResult = props => {
	const { data = [], pagination = {}, loading = false, goToPath = null } = props;

	const viewDetail = record => {
		const { employeeId = null } = record;
		if (goToPath && employeeId) {
			goToPath('employeeInfo', {
				employeeId,
				from: 'list',
			});
		}
	};

	const alterDetail = value => {
		console.log(value);
	};

	const handleDelete = value => {
		console.log(value);
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

	return (
		<div className={styles['table-content']}>
			<Table
				rowKey="employeeId"
				loading={loading}
				dataSource={data}
				columns={columns}
				pagination={{ ...pagination }}
			/>
		</div>
	);
};

export default SearchResult;
