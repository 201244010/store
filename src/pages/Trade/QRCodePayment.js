import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Card, message } from 'antd';
import { ERROR_OK, ALTERT_TRADE_MAP } from '@/constants/errorCode';
import styles from './trade.less';

import qrPayment from '@/assets/qrpaycode.jpg';

@connect(
	state => ({
		loading: state.loading,
		routing: state.routing,
	}),
	dispatch => ({
		payOrder: ({ orderNo, purchaseType, source }) =>
			dispatch({ type: 'trade/payOrder', payload: { orderNo, purchaseType, source } }),
		goToPath: (pathId, urlParams = {}, linkType = null) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams, linkType } }),
	})
)
class QRCodePayment extends PureComponent {
	constructor(props) {
		super(props);
		const {
			routing: { location: { query: { orderNo, purchaseType, source } = {} } = {} } = {},
		} = props;

		this.qrContainer = React.createRef();
		this.refreshTimer = null;

		this.orderNo = orderNo || null;
		this.purchaseType = purchaseType || null;
		this.source = parseInt(source, 10) || null;
	}

	componentDidMount() {
		this.getQRCodeURL();
		// TODO 等待云端 MQTT 消息返回
	}

	componentWillUnmount() {
		clearTimeout(this.refreshTimer);
	}

	getQRCodeURL = async () => {
		const { current } = this.qrContainer;
		const { payOrder } = this.props;
		const response = await payOrder({
			orderNo: this.orderNo,
			purchaseType: this.purchaseType,
			source: this.source,
		});

		if (response && response.code === ERROR_OK) {
			const { data = {} } = response;
			const { qrCodeUrl = '' } = format('toCamel')(data);
			$(current).qrcode(qrCodeUrl);
		} else if (response && ALTERT_TRADE_MAP[response.code]) {
			message.error(formatMessage({ id: ALTERT_TRADE_MAP[response.code] }));
		} else {
			message.error(formatMessage({ id: 'pay.failed.info' }));
		}
	};

	refreshQRCode = () => {
		clearTimeout(this.refreshTimer);
		this.refreshTimer = setTimeout(() => {
			this.getQRCodeURL();
			this.refreshQRCode();
		}, 1000 * 60 * 2);
	};

	render() {
		const { loading, goToPath } = this.props;

		return (
			<Card title={formatMessage({ id: 'pay.order.commit' })}>
				<div className={styles['qrCode-title']}>
					<div className={styles['order-no']}>
						{formatMessage({ id: 'pay.order.no' })}：{this.orderNo}
					</div>
					<div className={styles['order-price']}>
						{formatMessage({ id: 'pay.true.price' })}：
						<span className={styles.price}>69.00</span>
					</div>
				</div>
				<Card
					type="inner"
					title={this.purchaseType ? formatMessage({ id: this.purchaseType }) : null}
					loading={loading.effects['trade/payOrder']}
				>
					<div className={styles['qrCode-content']}>
						<div className={styles['qrcode-data']} ref={this.qrContainer} />
						<img className={styles['qrcode-info']} src={qrPayment} />
					</div>
				</Card>

				<div className={styles['qrCode-footer']}>
					<a href="javascript:void(0);" onClick={() => goToPath('trade')}>
						{formatMessage({ id: 'pay.retry' })}
					</a>
				</div>
			</Card>
		);
	}
}

export default QRCodePayment;
