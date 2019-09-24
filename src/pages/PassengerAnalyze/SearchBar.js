import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Radio } from 'antd';

import { DASHBOARD } from '@/pages/DashBoard/constants';
import styles from './passengerAnalyze.less';

const {
	SEARCH_TYPE: { RANGE, RANGE_VALUE, GROUP_RANGE },
} = DASHBOARD;

@connect(
	({ passengerAnalyze }) => ({ searchValue: passengerAnalyze.searchValue }),
	dispatch => ({
		getShopIdFromStorage: () => dispatch({ type: 'global/getShopIdFromStorage' }),
		getShopListFromStorage: () => dispatch({ type: 'global/getShopListFromStorage' }),
		refreshPage: () => dispatch({ type: 'passengerAnalyze/refreshPage' }),
		setSearchValue: ({ type, groupBy }) =>
			dispatch({ type: 'passengerAnalyze/setSearchValue', payload: { type, groupBy } }),
	})
)
class SearchBar extends PureComponent {
	constructor(props) {
		super(props);
		this.state = { currentShopName: null, tempSelected: RANGE.TODAY };
	}

	async componentDidMount() {
		const { getShopIdFromStorage, getShopListFromStorage } = this.props;
		const shopList = await getShopListFromStorage();
		const shopId = await getShopIdFromStorage();

		const currentShop = shopList.find(shop => shop.shop_id === shopId) || {};
		this.setState({
			currentShopName: currentShop.shop_name || null,
		});
	}

	handleRadioChange = async e => {
		const { target: { value = RANGE.TODAY } = {} } = e;
		const { setSearchValue, refreshPage } = this.props;
		this.setState({ tempSelected: value });

		await setSearchValue({
			type: RANGE_VALUE[value.toUpperCase()],
			groupBy: value === RANGE.TODAY ? GROUP_RANGE.HOUR : GROUP_RANGE.DAY,
		});
		await refreshPage();
	};

	render() {
		const { currentShopName, tempSelected } = this.state;

		return (
			<>
				<h2 className={styles['passengerAnalyze-title']}>{currentShopName}</h2>
				<div className={styles['search-bar']}>
					<div>
						<Radio.Group
							value={tempSelected}
							buttonStyle="solid"
							onChange={this.handleRadioChange}
						>
							<Radio.Button value={RANGE.TODAY}>
								{formatMessage({ id: 'dashboard.search.today' })}
							</Radio.Button>
							<Radio.Button value={RANGE.YESTERDAY}>
								{formatMessage({ id: 'dashboard.search.yesterday' })}
							</Radio.Button>
							<Radio.Button value={RANGE.WEEK}>
								{formatMessage({ id: 'dashboard.search.week' })}
							</Radio.Button>
							<Radio.Button value={RANGE.MONTH}>
								{formatMessage({ id: 'dashboard.search.month' })}
							</Radio.Button>
						</Radio.Group>
					</div>
				</div>
			</>
		);
	}
}

export default SearchBar;
