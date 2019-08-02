import React from 'react';
import { Tabs } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { SHOP_ID_KEY, SHOP_LIST_KEY, getCookieByKey } from '@/utils/cookies';
import ShowTabContent from '../ShowTabContent';

import styles from './index.less';

const { TabPane } = Tabs;
const ACTIVEKEY = ['today', 'week', 'month'];

export default class ShowHeader extends React.PureComponent {
	constructor(props) {
		super(props);
		this.couter = 0;
	}

	state = {
		time: '',
		activeKey: ACTIVEKEY[0],
	};

	componentDidMount() {
		this.setTime = setInterval(() => {
			const time = moment().format('YYYY-MM-DD HH:mm:ss');
			this.setState({ time });
			this.couter++;
			if (this.couter === 60) {
				const { activeKey } = this.state;
				let activeKeyNum = 0;
				ACTIVEKEY.map((item, index) => {
					if (item === activeKey) {
						activeKeyNum = index;
					}
				});
				if (ACTIVEKEY.length - 1 === activeKeyNum) {
					activeKeyNum = -1;
				}
				activeKeyNum++;
				this.couter = 0;
				this.setState({ activeKey: ACTIVEKEY[activeKeyNum] });
			}
		}, 1000);
	}

	componentWillUnmount() {
		clearInterval(this.setTime);
	}

	tabChange = value => {
		this.setState({ activeKey: value });
	};

	render() {
		const { time, activeKey } = this.state;

		const shopList = JSON.parse(localStorage.getItem(SHOP_LIST_KEY)) || [];
		const shopID = getCookieByKey(SHOP_ID_KEY) || '';
		const { shop_name: shopName = '' } = shopList.find(item => item.shop_id === shopID) || {};

		return (
			<div className={styles['show-header']}>
				<div className={styles['header-title']}>
					<div className={styles['header-logo']} />
					<div className={styles['header-name']}>{shopName}</div>
					<div className={styles['header-time']}>{time}</div>
				</div>
				<div className={styles['header-tabs']}>
					<Tabs
						defaultActiveKey="today"
						activeKey={activeKey}
						animated
						tabPosition="top"
						onChange={this.tabChange}
					>
						<TabPane
							tab={formatMessage({ id: 'dashboard.search.today' })}
							key={ACTIVEKEY[0]}
							forceRender
						>
							<ShowTabContent time="today" activeKey={activeKey} />
						</TabPane>
						<TabPane
							tab={formatMessage({ id: 'dashboard.search.week' })}
							key={ACTIVEKEY[1]}
							forceRender
						>
							<ShowTabContent time="week" activeKey={activeKey} />
						</TabPane>
						<TabPane
							tab={formatMessage({ id: 'dashboard.search.month' })}
							key={ACTIVEKEY[2]}
							forceRender
						>
							<ShowTabContent time="month" activeKey={activeKey} />
						</TabPane>
					</Tabs>
				</div>
			</div>
		);
	}
}
