import React, { Component } from 'react';
import { Table, Form, Input, Button, Row, Col, Cascader, Divider, Card } from 'antd';
import { formatMessage, getLocale } from 'umi/locale';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import { SEARCH_FORM_COL, FORM_FORMAT } from '@/constants/form';
import { formatEmptyWithoutZero } from '@/utils/utils';
import styles from './StoreManagement.less';

const FormItem = Form.Item;

@connect(
	state => ({
		store: state.store,
	}),
	dispatch => ({
		changeSearchFormValue: payload =>
			dispatch({ type: 'store/changeSearchFormValue', payload }),
		updatePagination: options =>
			dispatch({ type: 'store/updatePagination', payload: { options } }),
		clearSearch: () => dispatch({ type: 'store/clearSearch' }),
		getStoreList: payload => dispatch({ type: 'store/getStoreList', payload }),
		getShopTypeList: () => dispatch({ type: 'store/getShopTypeList' }),
		getRegionList: () => dispatch({ type: 'store/getRegionList' }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class StoreManagement extends Component {
	constructor(props) {
		super(props);
		this.columns = [
			{
				title: formatMessage({ id: 'storeManagement.list.columnId' }),
				dataIndex: 'sunmiShopNo',
				key: 'sunmiShopNo',
			},
			{
				title: formatMessage({ id: 'storeManagement.list.columnName' }),
				dataIndex: 'shopName',
				key: 'shopName',
			},
			{
				title: formatMessage({ id: 'storeManagement.list.columnStatus' }),
				dataIndex: 'businessStatus',
				key: 'businessStatus',
				render: text => (
					<span>
						{text === 0
							? formatMessage({ id: 'storeManagement.create.status.open' })
							: formatMessage({ id: 'storeManagement.create.status.closed' })}
					</span>
				),
			},
			{
				title: formatMessage({ id: 'storeManagement.list.columnAddress' }),
				dataIndex: 'address',
				key: 'address',
				render: (text, record) => (
					<>
						{text === '--' && record.region === '--' ? (
							<span>--</span>
						) : (
							<>
								<span>
									{record.region !== '--'
										? (record.region || '').split(',').join(' ')
										: ''}{' '}
								</span>
								<span>{text !== '--' ? text : ''}</span>
							</>
						)}
					</>
				),
			},
			{
				title: formatMessage({ id: 'storeManagement.list.columnTypes' }),
				dataIndex: 'typeName',
				key: 'typeName',
			},
			{
				title: formatMessage({ id: 'storeManagement.list.area' }),
				dataIndex: 'businessArea',
				key: 'businessArea',
				render: text => <span>{text === 0 ? '--' : text}</span>,
			},
			{
				title: formatMessage({ id: 'storeManagement.list.columnContacts' }),
				dataIndex: 'contactPerson',
				key: 'contactPerson',
			},
			{
				title: formatMessage({ id: 'storeManagement.list.columnOperation' }),
				dataIndex: 'operation',
				key: 'operation',
				width: 120,
				render: (_, record) => (
					<span>
						<a
							onClick={() => this.toPath('viewInfo', record.shopId)}
							className={styles.infoAnchor}
						>
							{formatMessage({ id: 'storeManagement.list.operation1' })}
						</a>
						<Divider type="vertical" />
						<a
							onClick={() => this.toPath('update', record.shopId)}
							className={styles.infoAnchor}
						>
							{formatMessage({ id: 'storeManagement.list.operation2' })}
						</a>
					</span>
				),
			},
		];
	}

	componentDidMount() {
		const { getShopTypeList, getRegionList, getStoreList, clearSearch } = this.props;
		const currentLanguage = getLocale();
		const storageLanaguage = Storage.get('__lang__', 'local');
		if (!Storage.get('__shopTypeList__', 'local') || currentLanguage !== storageLanaguage) {
			Storage.set({ __lang__: currentLanguage }, 'local');
			getShopTypeList();
		}

		if (!Storage.get('__regionList__', 'local')) {
			getRegionList();
		}
		clearSearch();
		getStoreList({ current: 1 });
	}

	componentWillUnmount() {
		const { clearSearch } = this.props;
		clearSearch();
	}

	toPath = (target, shopId) => {
		const { goToPath } = this.props;
		const path = {
			create: {
				pathId: 'newOrganization',
				urlParams: {
					action: 'create',
				},
			},
			viewInfo: {
				pathId: 'storeInfo',
				urlParams: {
					shopId,
				},
			},
			update: {
				pathId: 'storeUpdate',
				urlParams: {
					shopId,
					action: 'edit',
				},
			},
		};

		const { pathId, urlParams = {} } = path[target] || {};
		goToPath(pathId, urlParams);
	};

	handleReset = async () => {
		const { form, clearSearch, getStoreList } = this.props;
		if (form) {
			form.resetFields();
		}
		await clearSearch();
		await getStoreList({ current: 1 });
	};

	handleSubmit = () => {
		const {
			form: { validateFields },
			changeSearchFormValue,
			getStoreList,
		} = this.props;

		validateFields(async (err, values) => {
			if (!err) {
				await changeSearchFormValue({
					options: {
						keyword: values.keyword,
						typeOne: (values.shopType || [])[0] || 0,
						typeTwo: (values.shopType || [])[1] || 0,
					},
				});
				await getStoreList({
					options: {
						type: 'search',
					},
				});
			}
		});
	};

	handleTableChange = pagination => {
		const { current = 1, pageSize = 10 } = pagination;
		const { updatePagination } = this.props;
		updatePagination({ current, pageSize });
	};

	render() {
		const {
			form: { getFieldDecorator },
			store: {
				storeList,
				shopType_list,
				searchFormValue: { keyword, typeOne, typeTwo },
				loading,
				pagination,
			},
		} = this.props;

		const formattedList = storeList.map(store => formatEmptyWithoutZero(store, '--'));

		return (
			<Card bordered={false} className={styles.storeList}>
				<div className={styles['search-bar']}>
					<Form layout="inline">
						<Row gutter={FORM_FORMAT.gutter}>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<FormItem
									label={formatMessage({ id: 'storeManagement.list.inputLabel' })}
								>
									{getFieldDecorator('keyword', {
										initialValue: keyword,
									})(
										<Input
											maxLength={20}
											placeholder={formatMessage({
												id: 'storeManagement.list.inputPlaceHolder',
											})}
										/>
									)}
								</FormItem>
							</Col>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<FormItem
									label={formatMessage({
										id: 'storeManagement.list.selectLabel',
									})}
								>
									{getFieldDecorator('shopType', {
										initialValue: typeOne ? [typeOne, typeTwo] : undefined,
									})(
										<Cascader
											placeholder={formatMessage({
												id: 'storeManagement.create.typePlaceHolder',
											})}
											options={shopType_list}
										/>
									)}
								</FormItem>
							</Col>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item className={styles['query-item']}>
									<Button type="primary" onClick={this.handleSubmit}>
										{formatMessage({ id: 'btn.query' })}
									</Button>
									<Button
										style={{ marginLeft: '20px' }}
										onClick={this.handleReset}
									>
										{formatMessage({ id: 'storeManagement.list.buttonReset' })}
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</div>
				<Button
					loading={loading}
					type="primary"
					icon="plus"
					onClick={() => this.toPath('create')}
				>
					{formatMessage({ id: 'storeManagement.list.newBuiltStore' })}
				</Button>
				<div className={styles.table}>
					<Table
						rowKey="shopId"
						dataSource={formattedList}
						columns={this.columns}
						pagination={pagination}
						onChange={this.handleTableChange}
					/>
				</div>
			</Card>
		);
	}
}

const StoreManagementForm = Form.create({
	mapPropsToFields: () => ({
		storeName: Form.createFormField(''),
		types: Form.createFormField(''),
	}),
})(StoreManagement);
export default StoreManagementForm;
