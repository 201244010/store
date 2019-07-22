import React from 'react';
import { Tabs } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import ShowCards from '../ShowCards';
import ShowChart from '../ShowChart';
import ShowSaleList from '../ShowSaleList';
import ShowPayChart from '../ShowPayChart';
import { SHOP_ID_KEY, SHOP_LIST_KEY, getCookieByKey } from '@/utils/cookies';

import styles from './index.less';

const { TabPane } = Tabs;
const ACTIVEKEY = ['today', 'week', 'month'];

export default class ShowHeader extends React.Component {
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
		const { today = {}, week = {}, month = {} } = this.props;
		const { time, activeKey } = this.state;

		const shopList = JSON.parse(localStorage.getItem(SHOP_LIST_KEY));
		const shopID = getCookieByKey(SHOP_ID_KEY);
		const shopName = shopList.find(item => item.shop_id === shopID).shop_name;

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
							tab={formatMessage({ id: 'dashBoard.search.today' })}
							key={ACTIVEKEY[0]}
							forceRender
						>
							<TabPaneContent
								{...{
									today,
								}}
								time="today"
							/>
						</TabPane>
						<TabPane
							tab={formatMessage({ id: 'dashBoard.search.week' })}
							key={ACTIVEKEY[1]}
							forceRender
						>
							<TabPaneContent
								{...{
									week,
								}}
								time="week"
							/>
						</TabPane>
						<TabPane
							tab={formatMessage({ id: 'dashBoard.search.month' })}
							key={ACTIVEKEY[2]}
							forceRender
						>
							<TabPaneContent
								{...{
									month,
								}}
								time="month"
							/>
						</TabPane>
					</Tabs>
				</div>
			</div>
		);
	}
}

const TabPaneContent = props => {
	const { time = 'today' } = props;
	const {
		[time]: {
			productOverview = {},
			deviceOverView = {},
			ipcOverView = {},

			totalAmount = {},
			totalCount = {},
			totalRefund = {},
			avgUnitSale = {},
			searchValue = {},
			orderList = [],
			skuRankList = [],
			purchaseInfo = {},
			range = '',
		},
	} = props;

	return (
		<>
			<ShowCards
				{...{
					searchValue,
					totalAmount,
					totalCount,
					totalRefund,
					avgUnitSale,
				}}
			/>
			<div style={{ paddingTop: 52, display: 'flex' }}>
				<div style={{ width: 841 }}>
					<ShowChart
						chartName={formatMessage({ id: 'dashBoard.order.show.sales' })}
						saleType="count"
						{...{
							searchValue,
							orderList,
							range,
						}}
					/>
					<ShowChart
						chartName={formatMessage({ id: 'dashBoard.order.show.count' })}
						saleType="amount"
						fillColor={['l(90) 0:#FFBC50 1:#FFBC50', 'l(90) 0:#B38F6B 1:#B37047']}
						shadowColor="#FF7750"
						{...{
							searchValue,
							orderList,
							range,
						}}
					/>
				</div>
				<ShowSaleList
					{...{
						skuRankList,
					}}
				/>
				<ShowPayChart
					{...{
						searchValue,
						purchaseInfo,
						productOverview,
						deviceOverView,
						ipcOverView,
					}}
				/>
			</div>
		</>
	);
};
