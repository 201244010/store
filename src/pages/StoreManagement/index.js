import React, { Component } from 'react';
import { Table, Form, Input, Button, Row, Col, Cascader, Divider, Card } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import Storage from '@konata9/storage.js';
import { SEARCH_FORM_COL, FORM_FORMAT } from '@/constants/form';
import styles from './StoreManagement.less';
import { formatEmptyWithoutZero } from '@/utils/utils';

const FormItem = Form.Item;

@connect(
	state => ({
		store: state.store,
	}),
	dispatch => ({
		changeSearchFormValue: payload =>
			dispatch({ type: 'store/changeSearchFormValue', payload }),
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
				dataIndex: 'shop_id',
				key: 'shop_id',
			},
			{
				title: formatMessage({ id: 'storeManagement.list.columnName' }),
				dataIndex: 'shop_name',
				key: 'shop_name',
			},
			{
				title: formatMessage({ id: 'storeManagement.list.columnStatus' }),
				dataIndex: 'business_status',
				key: 'business_status',
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
										? record.region.split(',').join(' ')
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
				dataIndex: 'type_name',
				key: 'type_name',
			},
			{
				title: formatMessage({ id: 'storeManagement.list.area' }),
				dataIndex: 'business_area',
				key: 'business_area',
			},
			{
				title: formatMessage({ id: 'storeManagement.list.columnContacts' }),
				dataIndex: 'contact_person',
				key: 'contact_person',
			},
			{
				title: formatMessage({ id: 'storeManagement.list.columnOperation' }),
				dataIndex: 'operation',
				key: 'operation',
				width: 120,
				render: (_, record) => (
					<span>
						<a
							onClick={() => this.toPath('viewInfo', record.shop_id)}
							className={styles.infoAnchor}
						>
							{formatMessage({ id: 'storeManagement.list.operation1' })}
						</a>
						<Divider type="vertical" />
						<a
							onClick={() => this.toPath('update', record.shop_id)}
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
		if (!Storage.get('__shopTypeList__', 'local')) {
			getShopTypeList();
		}

		if (!Storage.get('__regionList__', 'local')) {
			getRegionList();
		}
		clearSearch();
		getStoreList({});
	}

	componentWillUnmount() {
		const { clearSearch } = this.props;
		clearSearch();
	}

	toPath = (target, shopId) => {
		const { goToPath } = this.props;
		const path = {
			create: {
				pathId: 'storeCreate',
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
		const { form, clearSearch } = this.props;
		if (form) {
			form.resetFields();
		}
		await clearSearch();
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
						type_one: (values.shopType || [])[0] || 0,
						type_two: (values.shopType || [])[1] || 0,
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

	render() {
		const {
			form: { getFieldDecorator },
			store: {
				storeList,
				shopType_list,
				searchFormValue: { keyword, type_one, type_two },
				loading,
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
										initialValue: type_one ? [type_one, type_two] : undefined,
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
						rowKey="shop_id"
						dataSource={formattedList}
						columns={this.columns}
						pagination={{ showSizeChanger: true }}
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
