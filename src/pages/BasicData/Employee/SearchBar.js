import React from 'react';
import { formatMessage } from 'umi/locale';
import { Form, Row, Col, TreeSelect, Input, Button } from 'antd';
import { SEARCH_FORM_COL, FORM_FORMAT } from '@/constants/form';
import {
	EMPLOYEE_NUMBER_LIMIT,
	EMPLOYEE_NAME_LIMIT,
	EMPLOYEE_PHONE_EMAIL_LIMIT,
} from './constants';
import styles from './Employee.less';

const SearchBar = ({
	currentCompanyId = null,
	orgnizationTree = [],
	searchValue: { shopIdList = [], name = null, number = null, username = null } = {},
	setGetInfoValue = null,
	setSearchValue = null,
	getEmployeeList = null,
	clearSearchValue = null,
	goToPath = null,
}) => {
	// console.log(shopIdList);
	const [shopId = null] = shopIdList;
	const handleSearchChange = (field, value) => {
		// console.log(field, value, label, extra);
		if (field === 'shopIdList') {
			const [, id = null] = `${value}`.split('-');
			setSearchValue({
				[field]: id ? [id] : [],
			});
		} else {
			setSearchValue({
				[field]: value,
			});
		}
	};

	const handleQuery = async () => {
		setGetInfoValue();
		await getEmployeeList({ current: 1 });
	};

	const handleReset = async () => {
		await clearSearchValue();
		await getEmployeeList({ current: 1 });
	};

	return (
		<div className={styles['search-bar']}>
			<Form layout="inline">
				<Row gutter={FORM_FORMAT.gutter}>
					<Col {...SEARCH_FORM_COL.ONE_THIRD}>
						<Form.Item label={formatMessage({ id: 'employee.orgnization' })}>
							<TreeSelect
								value={
									shopId ? `${currentCompanyId}-${shopId}` : `${currentCompanyId}`
								}
								treeDefaultExpandAll
								treeData={orgnizationTree}
								onChange={(value, label, extra) =>
									handleSearchChange('shopIdList', value, label, extra)
								}
							/>
						</Form.Item>
					</Col>
					<Col {...SEARCH_FORM_COL.ONE_THIRD}>
						<Form.Item label={formatMessage({ id: 'employee.name' })}>
							<Input
								maxLength={EMPLOYEE_NAME_LIMIT}
								value={name}
								onChange={e => handleSearchChange('name', e.target.value)}
							/>
						</Form.Item>
					</Col>
					<Col {...SEARCH_FORM_COL.ONE_THIRD}>
						<Form.Item label={formatMessage({ id: 'employee.number' })}>
							<Input
								maxLength={EMPLOYEE_NUMBER_LIMIT}
								value={number}
								onChange={e => handleSearchChange('number', e.target.value)}
							/>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={FORM_FORMAT.gutter}>
					<Col {...SEARCH_FORM_COL.ONE_THIRD}>
						<Form.Item label={formatMessage({ id: 'employee.phone' })}>
							<Input
								maxLength={EMPLOYEE_PHONE_EMAIL_LIMIT}
								value={username}
								onChange={e => handleSearchChange('username', e.target.value)}
							/>
						</Form.Item>
					</Col>
					<Col {...SEARCH_FORM_COL.ONE_THIRD} />
					<Col {...SEARCH_FORM_COL.ONE_THIRD}>
						<Form.Item className={styles['query-item']}>
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
					<Col {...SEARCH_FORM_COL.ONE_THIRD}>
						<Form.Item>
							<Button
								type="primary"
								icon="plus"
								onClick={() =>
									goToPath('employeeCreate', { action: 'create', from: 'list' })
								}
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
