import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';

@connect()
class QRCodePayment extends PureComponent {
	constructor(props) {
		super(props);
		this.qrContainer = React.createRef();
		this.refreshTimer = null;
	}

	componentDidMount() {
		console.log(this.qrContainer);
		const { current } = this.qrContainer;
		$(current).qrcode('23332333');
	}

	componentWillUnmount() {
		clearTimeout(this.refreshTimer);
	}

	refreshQRCode = () => {
		clearTimeout(this.refreshTimer);
		this.refreshTimer = setTimeout(() => {
			// TODO 自刷新二维码
			this.refreshQRCode();
		}, 1000 * 60 * 2);
	};

	render() {
		return (
			<Card title={null}>
				1234
				<div ref={this.qrContainer} />
			</Card>
		);
	}
}

export default QRCodePayment;
