import React, { Component } from 'react';
import { Button, Divider, message, Modal, Table, Menu, Dropdown, Row, Col, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import { DURATION_TIME } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';
import { unixSecondToDate } from '@/utils/utils';
import Detail from './Detail';
import BindModal from './BindModal';
import styles from './index.less';

const ESL_STATES = {
	0: formatMessage({id:'esl.device.esl.inactivated'}),
	1: formatMessage({ id: 'esl.device.esl.push.wait.bind' }),
	2: formatMessage({ id: 'esl.device.esl.push.wait' }),
	3: formatMessage({ id: 'esl.device.esl.push.success' }),
	4: formatMessage({ id: 'esl.device.esl.push.fail' }),
};

const widthMap = {
	1: 348,
	2: 442,
	3: 510
};

const styleMap = {
	1: 'img-213',
	2: 'img-26',
	3: 'img-42'
};

const imgMap = {
	1: require('../../../../assets/studio/2.13.png'),
	2: require('../../../../assets/studio/2.6.png'),
	3: require('../../../../assets/studio/4.2.png'),
};

class SearchResult extends Component {
	constructor(props) {
		super(props);
		this.state = {
			detailVisible: false,
			templateVisible: false,
			previewVisible: false,
			toggleVisible: false,
			bindVisible: false,
			currentRecord: {},
			selectedProduct: {},
			selectedScreen: undefined
		};
	}

	onTableChange = (pagination, filters, sorter) => {
		const { fetchElectricLabels } = this.props;
		const { field, order } = sorter;
		let desc = -1;
		if (field === 'push_time') {
			desc = order === 'ascend' ? 1 : (order === 'descend' ? 0 : -1);
		} else {
			desc = order === 'ascend' ? 0 : (order === 'descend' ? 1 : -1);
		}

		fetchElectricLabels({
			options: {
				current: pagination.current,
				pageSize: pagination.pageSize,
				sort_key: field === 'battery' ? 1 : (field === 'push_time' ? 2 : -1),
				desc
			},
		});
	};

	previewTemplate = (record) => {
		this.setState({
			previewVisible: true,
			currentRecord: record,
		});
	};

	showDetail = async record => {
		const { detailVisible } = this.state;
		const { fetchESLDetails, fetchScreenPushInfo } = this.props;
		const response = await fetchESLDetails({
			options: {
				esl_id: record.id,
			},
		});
		await fetchScreenPushInfo({
			options: {
				esl_id: record.id,
			},
		});
		if (response && response.code === ERROR_OK) {
			this.setState({
				detailVisible: !detailVisible,
			});
		} else {
			message.error(formatMessage({ id: 'error.retry' }), DURATION_TIME);
		}
	};

	showBind = async record => {
		const { fetchTemplatesByESLCode, fetchProductList } = this.props;
		await fetchTemplatesByESLCode({
			options: {
				esl_code: record.esl_code,
			},
		});
		await fetchProductList({
			options: {
				current: 1,
			},
		});

		this.setState({
			currentRecord: record,
			selectedProduct: {
				id: record.product_id,
			},
			bindVisible: true,
		});
	};

	flushESL = async record => {
		const { flushESL } = this.props;
		await flushESL({
			options: {
				esl_code: record.esl_code,
				product_id: record.product_id,
			},
		});
	};

	togglePage = (record) => {
		const { fetchSwitchScreenInfo } = this.props;
		fetchSwitchScreenInfo({
			options: {
				esl_code: record.esl_code,
			},
		});

		this.setState({
			toggleVisible: true,
			currentRecord: record,
		});
	};

	closeToggle = () => {
		this.setState({
			toggleVisible: false,
			selectedScreen: undefined
		});
	};

	unbindESL = record => {
		const { unbindESL, fetchProductOverview, fetchDeviceOverview } = this.props;
		const content = (
			<div>
				<div>{formatMessage({ id: 'esl.device.esl.unbind.message' })}</div>
			</div>
		);

		Modal.confirm({
			icon: 'info-circle',
			title: formatMessage({ id: 'esl.device.esl.unbind.title' }),
			content,
			okText: formatMessage({ id: 'btn.unbind' }),
			onOk: async () => {
				await unbindESL({
					options: { esl_code: record.eslCode },
				});
				fetchProductOverview();
				fetchDeviceOverview();
			},
		});
	};

	deleteESL = record => {
		const { deleteESL, fetchProductOverview, fetchDeviceOverview } = this.props;
		const content = (
			<div>
				<div>{formatMessage({ id: 'esl.device.esl.delete.message1' })}</div>
				<div>{formatMessage({ id: 'esl.device.esl.delete.message2' })}</div>
			</div>
		);

		Modal.confirm({
			icon: 'info-circle',
			title: formatMessage({ id: 'esl.device.esl.delete.title' }),
			content,
			okText: formatMessage({ id: 'btn.delete' }),
			onOk: async () => {
				await deleteESL({
					options: { esl_id: record.id },
				});
				fetchProductOverview();
				fetchDeviceOverview();
			},
		});
	};

	closeModal = name => {
		const { [name]: modalStatus } = this.state;
		this.setState({
			[name]: !modalStatus,
			currentRecord: {}
		});
	};

	selectProduct = selectedProduct => {
		this.setState({
			selectedProduct,
		});
	};

	updateProduct = templateId => {
		const { currentRecord } = this.state;
		this.setState({
			currentRecord: {
				...currentRecord,
				template_id: templateId,
			},
		});
	};

	updateScreen = (screenNum) => {
		this.setState({
			selectedScreen: screenNum
		});
	};

	handleMoreClick = async e => {
		const { flashModes, flashLed, fetchTemplatesByESLCode, fetchProductOverview, fetchDeviceOverview } = this.props;
		const {
			dataset: { recordId, record },
		} = e.domEvent.target;

		if (e.key === '0') {
			const eslDetail = JSON.parse(record);
			this.unbindESL({
				eslCode: eslDetail.esl_code,
			});
		}
		if (e.key === '1') {
			const eslDetail = JSON.parse(record);
			await fetchTemplatesByESLCode({
				options: {
					esl_code: eslDetail.esl_code,
				},
			});
			this.setState({
				templateVisible: true,
				currentRecord: eslDetail,
			});
		}
		if (e.key === '2') {
			if (flashModes[0]) {
				flashLed({
					options: {
						mode_id: flashModes[0].id,
						esl_id_list: [parseInt(recordId, 10)],
					},
				});
			} else {
				message.error(formatMessage({ id: 'esl.device.esl.flash.mode.error' }));
			}
		}
		if (e.key === '3') {
			this.deleteESL({
				id: recordId,
			});
		}
		if (e.key === '4') {
			const eslDetail = JSON.parse(record);
			this.showBind(eslDetail);
		}
		if (e.key === '5') {
			const eslDetail = JSON.parse(record);
			await this.flushESL(eslDetail);
			fetchProductOverview();
			fetchDeviceOverview();
		}
		if (e.key === '6') {
			const eslDetail = JSON.parse(record);
			this.togglePage(eslDetail);
		}
	};

	confirmBind = () => {
		const { changeTemplate } = this.props;
		const { currentRecord } = this.state;

		changeTemplate({
			options: {
				template_id: currentRecord.template_id,
				esl_code: currentRecord.esl_code,
			},
		});
		this.closeModal('templateVisible');
	};

	confirmToggle = () => {
		const { switchScreen } = this.props;
		const { currentRecord, selectedScreen } = this.state;

		switchScreen({
			options: {
				esl_code: currentRecord.esl_code,
				screen_num: selectedScreen,
			},
		});
		this.closeToggle();
	};

	render() {
		const {
			loading,
			data,
			pagination,
			detailInfo,
			templates4ESL,
			products,
			productPagination,
			screenInfo,
			screenPushInfo,
			fetchProductList,
			fetchProductOverview,
			fetchDeviceOverview,
			bindESL,
		} = this.props;
		const {
			detailVisible,
			templateVisible,
			previewVisible,
			toggleVisible,
			bindVisible,
			currentRecord,
			selectedProduct,
			selectedScreen
		} = this.state;
		const columns = [
			{
				title: formatMessage({ id: 'esl.device.esl.id' }),
				dataIndex: 'esl_code',
			},
			{
				title: formatMessage({ id: 'esl.device.esl.model.name' }),
				dataIndex: 'model_name',
			},
			{
				title: formatMessage({ id: 'esl.device.esl.battery' }),
				dataIndex: 'battery',
				sorter: true,
				render: text => (
					<span className={text < 10 ? styles['low-battery'] : ''}>{text}%</span>
				),
				// sorter: (a, b) => a.battery - b.battery,
				// sortDirections: ['descend', 'ascend'],
			},
			{
				title: formatMessage({ id: 'esl.device.esl.product.seq.num' }),
				dataIndex: 'product_seq_num',
			},
			{
				title: formatMessage({ id: 'esl.device.esl.product.name' }),
				dataIndex: 'product_name',
			},
			{
				title: formatMessage({ id: 'esl.device.esl.template.name' }),
				dataIndex: 'template_name',
			},
			{
				title: formatMessage({ id: 'esl.device.esl.status' }),
				dataIndex: 'status',
				render: text => (
					<span style={{ color: `${text}` === '4' ? 'red' : 'rgba(0, 0, 0, 0.65)' }}>
						{ESL_STATES[text]}
					</span>
				),
			},
			{
				title: formatMessage({ id: 'esl.device.esl.push.time' }),
				dataIndex: 'push_time',
				sorter: true,
				render: text => (text !== 0 ? <span>{unixSecondToDate(text)}</span> : <noscript />),
			},
			{
				title: formatMessage({ id: 'list.action.title' }),
				key: 'action',
				render: (_, record) => (
					<span>
						<a href="javascript: void (0);" onClick={() => this.showDetail(record)}>
							{formatMessage({ id: 'list.action.detail' })}
						</a>
						<Divider type="vertical" />
						{
							[0, 1].includes(record.status) ?
								<a href="javascript: void (0);" className={styles.disabled}>
									{formatMessage({ id: 'list.action.preview' })}
								</a> :
								<a href="javascript: void (0);" onClick={() => this.previewTemplate(record)}>
									{formatMessage({ id: 'list.action.preview' })}
								</a>
						}
						<Divider type="vertical" />
						<Dropdown
							overlay={
								<Menu onClick={this.handleMoreClick}>
									<Menu.Item key="4">
										<a
											href="javascript: void (0);"
											data-record={JSON.stringify(record)}
										>
											{formatMessage({ id: 'list.action.bind' })}
										</a>
									</Menu.Item>
									<Menu.Divider />
									{record.product_id ? (
										<Menu.Item key="5">
											<a
												href="javascript: void (0);"
												data-record={JSON.stringify(record)}
											>
												{formatMessage({ id: 'list.action.push.again' })}
											</a>
										</Menu.Item>
									) : null}
									{record.product_id ? <Menu.Divider /> : null}
									{record.product_id ? (
										<Menu.Item key="0">
											<a
												href="javascript: void (0);"
												data-record={JSON.stringify(record)}
											>
												{formatMessage({ id: 'esl.device.esl.unbind' })}
											</a>
										</Menu.Item>
									) : null}
									{record.product_id ? <Menu.Divider /> : null}
									{record.product_id ? (
										<Menu.Item key="1">
											<a
												href="javascript: void (0);"
												data-record={JSON.stringify(record)}
											>
												{formatMessage({
													id: 'esl.device.esl.template.edit',
												})}
											</a>
										</Menu.Item>
									) : null}
									{record.product_id ? <Menu.Divider /> : null}
									<Menu.Item key="6">
										<a
											href="javascript: void (0);"
											data-record={JSON.stringify(record)}
										>
											{formatMessage({
												id: 'esl.device.esl.page.toggle',
											})}
										</a>
									</Menu.Item>
									<Menu.Divider />
									<Menu.Item key="2">
										<a href="javascript: void (0);" data-record-id={record.id}>
											{formatMessage({ id: 'esl.device.esl.flash' })}
										</a>
									</Menu.Item>
									<Menu.Divider />
									<Menu.Item key="3">
										<a href="javascript: void (0);" data-record-id={record.id}>
											{formatMessage({ id: 'btn.delete' })}
										</a>
									</Menu.Item>
								</Menu>
							}
						>
							<a className="ant-dropdown-link" href="javascript: void (0)">
								{formatMessage({ id: 'list.action.more' })}
							</a>
						</Dropdown>
					</span>
				),
			},
		];

		return (
			<div>
				<Table
					rowKey="id"
					loading={loading}
					columns={columns}
					dataSource={data}
					pagination={{
						...pagination,
						showTotal: total =>
							`${formatMessage({ id: 'esl.device.esl.all' })}${total}${formatMessage({
								id: 'esl.device.esl.total',
							})}`,
					}}
					onChange={this.onTableChange}
				/>
				<Modal
					title={formatMessage({ id: 'esl.device.esl.detail' })}
					visible={detailVisible}
					width={750}
					onCancel={() => this.closeModal('detailVisible')}
					footer={[
						<Button
							key="submit"
							type="primary"
							onClick={() => this.closeModal('detailVisible')}
						>
							{formatMessage({ id: 'btn.confirm' })}
						</Button>,
					]}
				>
					<Detail detailInfo={detailInfo} screenPushInfo={screenPushInfo} />
				</Modal>
				<Modal
					title={formatMessage({ id: 'esl.device.esl.template.edit' })}
					visible={templateVisible}
					width={500}
					onCancel={() => this.closeModal('templateVisible')}
					footer={[
						<Button
							key="cancel"
							type="default"
							onClick={() => this.closeModal('templateVisible')}
						>
							{formatMessage({ id: 'btn.cancel' })}
						</Button>,
						<Button key="submit" type="primary" onClick={this.confirmBind}>
							{formatMessage({ id: 'btn.confirm' })}
						</Button>,
					]}
				>
					<div className={styles['custom-modal-wrapper']}>
						<Row className={styles.row}>
							<Col span={6} className={styles.title}>{formatMessage({ id: 'esl.device.esl.id' })}：</Col>
							<Col span={18}>{currentRecord.esl_code}</Col>
						</Row>
						<Row className={styles.row}>
							<Col span={6} className={styles.title}>
								{formatMessage({ id: 'esl.device.esl.product.seq.num' })}：
							</Col>
							<Col span={18}>{currentRecord.product_seq_num || '---'}</Col>
						</Row>
						<Row className={styles.row}>
							<Col span={6} className={styles.title}>
								{formatMessage({ id: 'esl.device.esl.product.name' })}：
							</Col>
							<Col span={18}>{currentRecord.product_name || '---'}</Col>
						</Row>
						<Row className={styles.row}>
							<Col span={6} className={styles.title}>
								{formatMessage({ id: 'esl.device.esl.template.name' })}：
							</Col>
							<Col span={18}>
								<Select
									style={{ width: '100%' }}
									value={currentRecord.template_id}
									onChange={id => this.updateProduct(id)}
								>
									{templates4ESL.map(template => (
										<Select.Option key={template.id} value={template.id}>
											{template.name}
										</Select.Option>
									))}
								</Select>
							</Col>
						</Row>
					</div>
				</Modal>
				<Modal
					title={formatMessage({ id: 'esl.device.esl.page.toggle' })}
					visible={toggleVisible}
					width={500}
					onCancel={() => this.closeToggle()}
					footer={[
						<Button
							key="cancel"
							type="default"
							onClick={() => this.closeToggle()}
						>
							{formatMessage({ id: 'btn.cancel' })}
						</Button>,
						<Button key="submit" type="primary" onClick={this.confirmToggle}>
							{formatMessage({ id: 'btn.confirm' })}
						</Button>,
					]}
				>
					<div className={styles['custom-modal-wrapper']}>
						<Row className={styles.row}>
							<Col span={6} className={styles.title}>{formatMessage({ id: 'esl.device.esl.id' })}：</Col>
							<Col span={18}>{currentRecord.esl_code}</Col>
						</Row>
						<Row className={styles.row}>
							<Col span={6} className={styles.title}>
								{formatMessage({ id: 'esl.device.esl.product.seq.num' })}：
							</Col>
							<Col span={18}>{currentRecord.product_seq_num || '---'}</Col>
						</Row>
						<Row className={styles.row}>
							<Col span={6} className={styles.title}>
								{formatMessage({ id: 'esl.device.esl.product.name' })}：
							</Col>
							<Col span={18}>{currentRecord.product_name || '---'}</Col>
						</Row>
						<Row className={styles.row}>
							<Col span={6} className={styles.title}>
								{formatMessage({ id: 'esl.device.esl.page.display' })}：
							</Col>
							<Col span={18}>
								<Select
									placeholder={formatMessage({id: 'select.placeholder'})}
									style={{ width: '100%' }}
									value={selectedScreen}
									onChange={screenNum => this.updateScreen(screenNum)}
								>
									{(screenInfo || []).map(screen => (
										<Select.Option key={screen.screen_num} value={screen.screen_num}>
											{formatMessage({id: screen.screen_name})}
										</Select.Option>
									))}
								</Select>
							</Col>
						</Row>
					</div>
				</Modal>
				<BindModal
					{...{
						bindVisible,
						currentRecord: {
							...currentRecord,
							template_id: currentRecord.template_id || undefined,
						},
						templates4ESL,
						products,
						productPagination,
						fetchProductList,
						selectedProduct,
						bindESL,
						fetchProductOverview,
						fetchDeviceOverview,
						closeModal: this.closeModal,
						selectProduct: this.selectProduct,
						updateProduct: this.updateProduct,
					}}
				/>
				<Modal
					title={currentRecord.template_name}
					width={widthMap[currentRecord.model_size]}
					visible={previewVisible}
					onCancel={() => this.closeModal('previewVisible')}
					onOk={() => this.closeModal('previewVisible')}
					footer={[
						<Button key="submit" type="primary" onClick={() => this.closeModal('previewVisible')}>
							{formatMessage({ id: 'btn.confirm' })}
						</Button>
					]}
				>
					<div className={styles['preview-img']}>
						<img className={`${styles['wrap-img}']} ${styles[styleMap[currentRecord.model_size]]}`} src={imgMap[currentRecord.model_size]} alt="" />
						<img className={`${styles['content-img']} ${styles[styleMap[currentRecord.model_size]]}`} src={currentRecord.address} alt="" />
					</div>
				</Modal>
			</div>
		);
	}
}

export default SearchResult;
