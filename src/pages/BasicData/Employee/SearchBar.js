import React from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Row, Col, TreeSelect, Input, Button } from 'antd';
import { COL_THREE_NORMAL, FORM_FORMAT } from '@/constants/form';
import styles from './Employee.less';

const treeData = [
	{
		title: 'Node1',
		value: '0-0',
		key: '0-0',
		children: [
			{
				title: 'Child Node1',
				value: '0-0-1',
				key: '0-0-1',
			},
			{
				title: 'Child Node2',
				value: '0-0-2',
				key: '0-0-2',
			},
		],
	},
	{
		title: 'Node2',
		value: '0-1',
		key: '0-1',
	},
];

const SearchBar = ({
	searchValue: { shopIdList = [], name = null, number = null, username = null } = {},
	setSearchValue = null,
	getEmployeeList = null,
	clearSearchValue = null,
	goToPath = null,
}) => {
	console.log(shopIdList);

	const handleSearchChange = (field, value, label, extra) => {
		console.log(field, value, label, extra);
		setSearchValue({
			[field]: value,
		});
	};

	const handleQuery = async () => {
		console.log('do query');
		await getEmployeeList();
	};

	const handleReset = async () => {
		console.log('do reset');
		await clearSearchValue();
	};

	return (
		<div className={styles['search-bar']}>
			<Form layout="inline">
				<Row gutter={FORM_FORMAT.gutter}>
					<Col {...COL_THREE_NORMAL}>
						<Form.Item label={formatMessage({ id: 'employee.orgnization' })}>
							<TreeSelect
								treeData={treeData}
								onChange={(value, label, extra) =>
									handleSearchChange('orgnization', value, label, extra)
								}
							/>
						</Form.Item>
					</Col>
					<Col {...COL_THREE_NORMAL}>
						<Form.Item label={formatMessage({ id: 'employee.name' })}>
							<Input
								value={name}
								onChange={e => handleSearchChange('name', e.target.value)}
							/>
						</Form.Item>
					</Col>
					<Col {...COL_THREE_NORMAL}>
						<Form.Item label={formatMessage({ id: 'employee.number' })}>
							<Input
								value={number}
								onChange={e => handleSearchChange('number', e.target.value)}
							/>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={FORM_FORMAT.gutter}>
					<Col {...COL_THREE_NORMAL}>
						<Form.Item label={formatMessage({ id: 'employee.phone' })}>
							<Input
								value={username}
								onChange={e => handleSearchChange('username', e.target.value)}
							/>
						</Form.Item>
					</Col>
					<Col {...COL_THREE_NORMAL}>
						<Form.Item>
							<Button type="primary" onClick={handleQuery}>
								{formatMessage({ id: 'btn.query' })}
							</Button>
							<Button style={{ marginLeft: '20px' }} onClick={handleReset}>
								{formatMessage({ id: 'btn.reset' })}
							</Button>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={FORM_FORMAT.gutter}>
					<Col {...COL_THREE_NORMAL}>
						<Form.Item>
							<Button
								type="primary"
								icon="plus"
								onClick={() => goToPath('employeeCreate', { action: 'create' })}
							>
								{formatMessage({ id: 'employee.create' })}
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</div>
	);
};

export default SearchBar;
