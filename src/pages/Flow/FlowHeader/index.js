import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { env } from '@/config';
import { ERROR_OK } from '@/constants/errorCode';
import { SHOP_ID_KEY, SHOP_LIST_KEY, getCookieByKey } from '@/utils/cookies';
import { DASHBOARD } from '@/pages/DashBoard/constants';

import styles from './index.less';

const {
	TIME_INTERVAL: { HOUR },
} = DASHBOARD;

@connect(
	state => ({
		showInfo: state.showInfo,
	}),
	dispatch => ({
		refreshStoreToken: () => dispatch({ type: 'showInfo/refreshStoreToken' }),
	})
)

class FlowHeader extends React.PureComponent {
	constructor(props) {
		super(props);
		this.startTime = new Date().getTime();
		this.setTime = 0;
	}

	state = {
		time: '',
	};

	componentDidMount() {
		this.startRefreshToken();
		clearInterval(this.setTime);
		this.setTime = setInterval(() => {
			const time = moment().format('YYYY-MM-DD HH:mm:ss');
			this.setState({ time });

			const nowTime = new Date().getTime();
			if (nowTime - this.startTime > 5 * HOUR * 1000) {
				this.startRefreshToken();
			}
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.setTime);
	}

	startRefreshToken = () => {
		const { refreshStoreToken } = this.props;
		refreshStoreToken().then(response => {
			const { code } = response;
			if (code === ERROR_OK) {
				this.startTime = new Date().getTime();
			} else {
				this.startRefreshToken();
			}
		});
	};

	render() {
		const { time } = this.state;

		const shopList = JSON.parse(localStorage.getItem(SHOP_LIST_KEY)) || [];
		const shopID = getCookieByKey(SHOP_ID_KEY) || '';
		const { shopName = '' } = shopList.find(item => item.shopId === shopID) || {};

		return (
			<div className={styles['flow-header']}>
				<div className={styles['header-title']}>
					<div className={styles['header-logo']} />
					<div className={styles['header-name']}>{shopName}</div>
					<div className={`${styles['header-time']} ${env === 'onl'&&styles['header-time-disappear']}`}>{time}</div>
				</div>
			</div>
		);
	}
}

export default FlowHeader;