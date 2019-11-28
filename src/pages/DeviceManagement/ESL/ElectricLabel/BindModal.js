import React, { Component } from 'react';
import { Modal, Row, Col, Select, Button, Input, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { ERROR_OK } from '@/constants/errorCode';
import * as styles from './index.less';

export default class BindModal extends Component {
	handleTemplateChange = templateId => {
		const { updateProduct } = this.props;
		updateProduct(templateId);
	};

	bindESL = async () => {
		const {
			selectedProduct,
			currentRecord,
			bindESL,
			closeModal,
			fetchProductOverview,
			fetchDeviceOverview
		} = this.props;
		if (selectedProduct && selectedProduct.id) {
			const response = await bindESL({
				options: {
					product_id: selectedProduct.id,
					esl_code: currentRecord.esl_code,
					template_id: currentRecord.template_id,
				},
			});

			if (response && response.code === ERROR_OK) {
				closeModal('bindVisible');
				fetchProductOverview();
				fetchDeviceOverview();
			}
		}
	};

	onTableChange = pagination => {
		const { fetchProductList } = this.props;

		fetchProductList({
			options: {
				current: pagination.current,
				pageSize: pagination.pageSize,
			},
		});
	};

	render() {
		const {
			bindVisible,
			currentRecord,
			templates4ESL,
			products,
			productPagination,
			selectedProduct,
			closeModal,
			selectProduct,
			fetchProductList,
		} = this.props;
		const columns = [
			{
				title: formatMessage({ id: 'esl.device.esl.product.seq.num' }),
				dataIndex: 'seq_num',
				key: 'seq_num',
			},
			{
				title: formatMessage({ id: 'esl.device.esl.product.name' }),
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: formatMessage({ id: 'esl.device.esl.product.code' }),
				dataIndex: 'bar_code',
				key: 'bar_code',
			},
			{
				title: formatMessage({ id: 'list.action.title' }),
				key: 'action',
				render: (_, record) => (
					<span>
						{record.id !== selectedProduct.id ? (
							<a
								href="javascript: void (0);"
								onClick={() => {
									selectProduct(record);
								}}
							>
								{formatMessage({ id: 'btn.select' })}
							</a>
						) : (
							<a
								href="javascript: void (0);"
								onClick={() => {
									selectProduct({});
								}}
							>
								{formatMessage({ id: 'btn.cancel' })}
							</a>
						)}
					</span>
				),
			},
		];

		return (
			<Modal
				title={formatMessage({ id: 'esl.device.esl.bind.title' })}
				style={{ top: 40 }}
				width={1000}
				visible={bindVisible}
				onCancel={() => closeModal('bindVisible')}
				footer={[
					<Button key="cancel" onClick={() => closeModal('bindVisible')}>
						{formatMessage({ id: 'btn.cancel' })}
					</Button>,
					<Button key="submit" type="primary" onClick={this.bindESL}>
						{formatMessage({ id: 'btn.bind' })}
					</Button>,
				]}
			>
				<div className={styles['custom-modal-wrapper']}>
					<Row>
						<Row>
							<Col span={4}>{formatMessage({ id: 'esl.device.esl.id' })}:</Col>
							<Col span={20}>{currentRecord.esl_code}</Col>
						</Row>
						<Row className={styles['form-row']}>
							<Col span={4}>
								{formatMessage({ id: 'esl.device.esl.template.name' })}:
							</Col>
							<Col span={20}>
								<Select
									placeholder={formatMessage({id: 'select.placeholder'})}
									value={currentRecord.template_id}
									style={{ width: '100%' }}
									onChange={this.handleTemplateChange}
								>
									{templates4ESL.map(template => (
										<Select.Option key={template.id} value={template.id}>
											{formatMessage({id: template.name})}
										</Select.Option>
									))}
								</Select>
							</Col>
						</Row>
						<Row className={styles['form-row']}>
							<Col span={4}>
								{formatMessage({ id: 'esl.device.esl.select.product' })}:
							</Col>
							<Col span={20}>
								<Input.Search
									placeholder={formatMessage({
										id: 'esl.device.esl.bind.input.placeholder',
									})}
									onSearch={keyword => fetchProductList({ options: { keyword } })}
									enterButton
								/>
							</Col>
						</Row>
						<Row className={styles['form-row']}>
							<Col span={24}>
								<Table
									rowKey="id"
									rowClassName={record =>
										record.id === selectedProduct.id ? styles.selected : ''
									}
									columns={columns}
									dataSource={products}
									pagination={productPagination}
									onChange={this.onTableChange}
								/>
							</Col>
						</Row>
					</Row>
				</div>
			</Modal>
		);
	}
}
