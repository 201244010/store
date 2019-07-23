import React from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import ShowCards from '../ShowCards';
import ShowChart from '../ShowChart';
import ShowSaleList from '../ShowSaleList';
import ShowPayChart from '../ShowPayChart';
import { DASHBOARD } from '@/pages/DashBoard/constants';

const {
	SEARCH_TYPE: { RANGE },
} = DASHBOARD;

@connect(
	state => ({
		showInfo: state.showInfo,
	}),
	dispatch => ({
		fetchAllData: ({ range }) =>
			dispatch({ type: 'showInfo/fetchAllData', payload: { range } }),
		clearSearch: () => dispatch({ type: 'showInfo/clearSearch' }),
	})
)
class ShowTabContent extends React.Component {
	componentDidMount() {
		const { time = 'today' } = this.props;

		if (time === 'today') {
			this.atuoRefresh(RANGE.TODAY);
		}

		if (time === 'week') {
			this.atuoRefresh(RANGE.WEEK);
		}

		if (time === 'month') {
			this.atuoRefresh(RANGE.MONTH);
		}

		setTimeout(()=> {
			if (time === 'today') {
				this.atuoRefresh(RANGE.TODAY);
			}

			if (time === 'week') {
				this.atuoRefresh(RANGE.WEEK);
			}

			if (time === 'month') {
				this.atuoRefresh(RANGE.MONTH);
			}
			this.startAutoRefresh();
		}, 1000 * 30);
	}

	componentWillUnmount() {
		const { clearSearch } = this.props;
		clearTimeout(this.timer);
		clearSearch();
	}

	atuoRefresh = type => {
		const { fetchAllData } = this.props;
		fetchAllData({ range: type });
	};

	startAutoRefresh = () => {
		clearTimeout(this.timer);
		this.timer = setTimeout(async () => {
			const { time = 'today' } = this.props;
			if (time === 'today') {
				this.atuoRefresh(RANGE.TODAY);
			}

			if (time === 'week') {
				this.atuoRefresh(RANGE.WEEK);
			}

			if (time === 'month') {
				this.atuoRefresh(RANGE.MONTH);
			}
			this.startAutoRefresh();
		}, 1000 * 60);
	};

	render() {
		const { time = 'today' } = this.props;
		const {
			showInfo: {
				deviceOverView = {},
				ipcOverView = {},
				[time]: {
					totalAmount = {},
					totalCount = {},
					totalRefund = {},
					avgUnitSale = {},
					searchValue = {},
					orderList = [],
					skuRankList = [],
					purchaseInfo = {},
					range = '',
				} = {},
			},
		} = this.props;

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
							chartName={formatMessage({ id: 'dashboard.order.show.sales' })}
							saleType="amount"
							{...{
								searchValue,
								orderList,
								range,
							}}
						/>
						<ShowChart
							chartName={formatMessage({ id: 'dashboard.order.show.count' })}
							saleType="count"
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
							deviceOverView,
							ipcOverView,
						}}
					/>
				</div>
			</>
		);
	}
}

export default ShowTabContent;
