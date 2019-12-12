import React from 'react';
import { formatMessage } from 'umi/locale';
import { Card, Row, Col, Divider, Table, Spin, Button, Modal } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import ServiceDetail from '@/pages/ServiceManagement/ServiceDetail';
import styles from './orderManagement.less';

const statusTitle = [
	formatMessage({ id: 'orderManagement.title.waiting' }),
	'',
	'',
	formatMessage({ id: 'orderManagement.title.success' }),
	formatMessage({ id: 'orderManagement.title.closed' }),
];

const hold = require('../../assets/icon/mountain.png');

const invoiceTitleType = [
	formatMessage({ id: 'orderManagement.detail.person' }),
	formatMessage({ id: 'orderManagement.detail.enterprise' }),
];

const invoiceKinds = [
	formatMessage({ id: 'orderManagement.detail.normalTax' }),
	formatMessage({ id: 'orderManagement.detail.addValueTax' }),
];

const iconUrl = [
	require('../../assets/icon/clock-circle.png'),
	'',
	'',
	require('../../assets/icon/success.svg'),
	require('../../assets/icon/close-dark.png'),
];

@connect(
	state => ({
		loading: state.loading,
		detail: state.orderManagement.orderDetail,
	}),
	dispatch => ({
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
		getOrderDetail: payload => dispatch({ type: 'orderManagement/getOrderDetail', payload }),
		getDetail: payload => dispatch({ type: 'serviceManagement/getServiceDetail', payload }),
		cancel: payload => dispatch({ type: 'orderManagement/cancelOrder', payload }),
	})
)
class OrderDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showDetail: false,
			showModal: false,
			remainTime: 3600,
		};
		this.interval = null;
		this.columns = [
			{
				title: formatMessage({ id: 'orderManagement.detail.serviceType' }),
				dataIndex: 'serviceName',
				key: 'serviceType',
				render: serviceName => serviceName || '--'
			},
			{
				title: formatMessage({ id: 'orderManagement.detail.imgUrl' }),
				dataIndex: 'imgUrl',
				key: 'imgUrl',
				render: value => (
					<img
						className={styles['hold-pic']}
						src={value === '' || value === undefined ? hold : value}
					/>
				),
			},
			{
				title: formatMessage({ id: 'orderManagement.detail.deviceName' }),
				dataIndex: 'deviceName',
				key: 'deviceName',
				render: value => (value === '' || value === undefined ? '--' : value),
			},
			{
				title: 'SN',
				dataIndex: 'deviceSn',
				key: 'deviceSn',
			},
			{
				title: formatMessage({ id: 'orderManagement.detail.expireTime' }),
				dataIndex: 'expireTime',
				key: 'expireTime',
				render: value => moment.unix(value).format('YYYY-MM-DD'),
			},
			{
				title: formatMessage({ id: 'orderManagement.operation' }),
				render: (_, record) => (
					<a onClick={() => this.showDetail(record)}>
						{formatMessage({ id: 'orderManagement.service.detail' })}
					</a>
				),
			},
		];
	}

	async componentDidMount() {
		const {
			location: {
				query: { orderNo, orderStatus },
			},
			getOrderDetail,
		} = this.props;
		if ( Number(orderStatus) === 5 ) {
			this.columns = this.columns.splice(0,4);
		}
		const response = await getOrderDetail({ orderNo });
		this.setState({ remainTime: response.remainingTime });
		const { status } = response;
		if (status === 1) {
			this.countDown();
		}
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	countDown = () => {
		const {
			location: {
				query: { orderNo },
			},
			getOrderDetail,
		} = this.props;
		clearInterval(this.interval);
		this.interval = setInterval(() => {
			const { remainTime } = this.state;
			if (remainTime === 0) {
				clearInterval(this.interval);
				getOrderDetail({ orderNo });
			} else {
				this.setState({ remainTime: remainTime - 1 });
			}
		}, 1000);
	};

	countDownFormat = remainTime => {
		const minutes = Math.floor(remainTime / 60);
		const seconds = remainTime % 60;

		return `${minutes}分${seconds}秒`;
	};

	showDetail = record => {
		const { getDetail } = this.props;
		const { serviceNo } = record;
		getDetail({ serviceNo });
		this.setState({ showDetail: true });
	};

	closeModal = () => {
		this.setState({ showDetail: false });
	};

	cancelOrderModal = () => {
		this.setState({ showModal: true });
	};

	closeCancelOrderModal = () => {
		this.setState({ showModal: false });
	};

	confirmCancelModal = async () => {
		this.setState({ showModal: false });
		const {
			cancel,
			getOrderDetail,
			location: {
				query: { orderNo },
			},
		} = this.props;
		await cancel({ orderNo });
		await getOrderDetail({ orderNo });
	};

	pay = () => {
		const {
			location: {
				query: { orderNo },
			},
			goToPath,
		} = this.props;
		goToPath('paymentPage', { orderNo });
	};

	bugAgain = () => {
		const { goToPath } = this.props;
		goToPath('cloudStorage');
	};

	render() {
		const { showDetail, showModal, remainTime } = this.state;
		const {
			detail: {
				orderNo,
				createdTime,
				purchaseType,
				issuerAccount,
				payerAccount,
				purchaseAmount,
				paymentAmount,
				invoiceInfo = null,
				serviceList = [],
				status,
			},
			loading,
		} = this.props;
		return (
			<Spin spinning={loading.effects['orderManagement/getOrderDetail']}>
				<div className={styles['status-bar']}>
					<img src={iconUrl[status - 1]} className={styles['status-icon']} />
					<span className={styles['status-title']}>{statusTitle[status - 1]}</span>
					{status === 1 && (
						<span className={styles['waiting-pay']}>
							{formatMessage({ id: 'orderManagement.detail.waitPay' })}
							<span className={styles.price}>
								{formatMessage({ id: 'orderManagement.yuan' })}
								{purchaseAmount === 0 ? 0 : purchaseAmount.toFixed(2)}
							</span>
						</span>
					)}
				</div>
				<Card className={styles.content}>
					<ul>
						<li>
							<span className={styles.title}>
								{formatMessage({ id: 'orderManagement.detail.orderInfo' })}
							</span>
							<Row>
								<Col span={8}>
									{formatMessage({ id: 'orderManagement.detail.orderNo' })}
									{orderNo}
								</Col>
								<Col span={8}>
									{formatMessage({ id: 'orderManagement.detail.createdTime' })}
									{moment.unix(createdTime).format('YYYY-MM-DD HH:mm:ss')}
								</Col>
								{status === 4 && (
									<Col span={8}>
										{formatMessage({ id: 'orderManagement.detail.payType' })}
										{purchaseType === 'purchase-type-alipay'
											? formatMessage({ id: 'orderManagement.detail.aliPay' })
											: '--'}
									</Col>
								)}
								<Col span={8}>
									{formatMessage({ id: 'orderManagement.detail.createdPerson' })}
									{issuerAccount}
								</Col>
								{status === 4 && (
									<Col span={8}>
										{formatMessage({ id: 'orderManagement.detail.payPerson' })}
										{payerAccount === undefined || payerAccount === ''
											? issuerAccount
											: payerAccount}
									</Col>
								)}
							</Row>
							<Divider className={styles.divide} />
						</li>
						{status === 4 && (
							<li>
								<span className={styles.title}>
									{formatMessage({ id: 'orderManagement.detail.payInfo' })}
								</span>
								<Row>
									<Col span={8}>
										{formatMessage({ id: 'orderManagement.detail.totalPay' })}
										{purchaseAmount === 0
											? `${formatMessage({ id: 'orderManagement.yuan' })}0`
											: `${formatMessage({
												id: 'orderManagement.yuan',
											  })}${purchaseAmount.toFixed(2)}`}
									</Col>
									<Col span={8}>
										{formatMessage({ id: 'orderManagement.detail.actualPay' })}
										{paymentAmount === 0
											? `${formatMessage({ id: 'orderManagement.yuan' })}0`
											: `${formatMessage({
												id: 'orderManagement.yuan',
											  })}${paymentAmount.toFixed(2)}`}
									</Col>
								</Row>
								<Divider className={styles.divide} />
							</li>
						)}

						{invoiceInfo !== null && (
							<li>
								<span className={styles.title}>
									{formatMessage({ id: 'orderManagement.detail.invoiceInfo' })}
								</span>
								<Row>
									<Col span={8}>
										{formatMessage({
											id: 'orderManagement.detail.invoiceType',
										})}
										{invoiceKinds[invoiceInfo.invoiceKind]}(
										{invoiceTitleType[invoiceInfo.titleType - 1]})
									</Col>
									<Col span={8}>
										{formatMessage({
											id: 'orderManagement.detail.invoiceHead',
										})}
										{invoiceInfo.titleType === 1
											? formatMessage({
												id: 'orderManagement.detail.personal',
											  })
											: invoiceInfo.titleName}
									</Col>
									{invoiceInfo.titleType === 2 && (
										<Col span={8}>
											{formatMessage({ id: 'orderManagement.detail.taxNo' })}
											{invoiceInfo.taxRegisterNo}
										</Col>
									)}
								</Row>
								<Divider className={styles.divide} />
							</li>
						)}

						{serviceList.length > 0 && (
							<li>
								<span className={styles.title}>
									{formatMessage({ id: 'orderManagement.detail.serviceInfo' })}
								</span>
								<Table
									columns={this.columns}
									dataSource={serviceList}
									pagination={false}
									rowKey="serviceNo"
								/>
							</li>
						)}
					</ul>
				</Card>
				{(status === 1 || status === 5) && (
					<div className={styles['bottom-bar']}>
						{status === 1 && (
							<>
								<span>
									{formatMessage({ id: 'orderManagement.detail.remainTime' })}
									<span className={styles['remain-time']}>
										{this.countDownFormat(remainTime)}
									</span>
								</span>
								<Button
									type="primary"
									className={styles['pay-at-once']}
									onClick={this.pay}
								>
									{formatMessage({
										id: 'orderManagement.operation.payImmediately',
									})}
								</Button>
								<Button
									className={styles['cancel-pay']}
									onClick={this.cancelOrderModal}
								>
									{formatMessage({ id: 'orderManagement.detail.cancelOrder' })}
								</Button>
							</>
						)}
						{status === 5 && (
							<Button
								type="primary"
								className={styles['cancel-pay']}
								onClick={this.bugAgain}
							>
								{formatMessage({ id: 'orderManagement.operation.purchaseAgain' })}
							</Button>
						)}
					</div>
				)}

				{showDetail && <ServiceDetail closeModal={this.closeModal} />}
				<Modal
					visible={showModal}
					onCancel={this.closeCancelOrderModal}
					onOk={this.confirmCancelModal}
					title={formatMessage({ id: 'orderManagement.detail.tip' })}
				>
					{formatMessage({ id: 'orderManagement.detail.tipContent' })}
				</Modal>
			</Spin>
		);
	}
}

export default OrderDetail;
