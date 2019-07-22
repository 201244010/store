import React from 'react';
import { connect } from 'dva';
import ShowHeader from '@/components/ShowHeader';
import { DASHBOARD } from '@/pages/DashBoard/constants';

const {
	SEARCH_TYPE: { RANGE},
} = DASHBOARD;

@connect(
	state => ({
		loading: state.loading,
		showInfo: state.showInfo,
	}),
	dispatch => ({
		fetchAllData: ({ needLoading, range }) =>
			dispatch({ type: 'showInfo/fetchAllData', payload: { needLoading, range } }),
		clearSearch: () => dispatch({ type: 'showInfo/clearSearch' }),
	})
)
class ShowLayout extends React.Component {
	componentDidMount() {
		this.atuoRefresh(RANGE.WEEK);
		this.atuoRefresh(RANGE.TODAY);

		this.atuoRefresh(RANGE.MONTH);
		this.startAutoRefresh();
	}

	componentWillUnmount() {
		const { clearSearch } = this.props;
		clearTimeout(this.timer);
		clearSearch();
	}

	startAutoRefresh = () => {
		clearTimeout(this.timer);
		this.timer = setTimeout(async () => {
			this.atuoRefresh(RANGE.WEEK);
			this.atuoRefresh(RANGE.MONTH);
			this.atuoRefresh(RANGE.TODAY);
			this.startAutoRefresh();
		}, 1000 * 30);
	};

	atuoRefresh = type => {
		const { fetchAllData } = this.props;
		fetchAllData({ needLoading: false, range: type });
	};

	render() {
		const {
			showInfo: { today = {}, week = {}, month = {} } = {},
		} = this.props;
		return (
			<div
				style={{
					height: '1080px',
					width: '1920px',
					padding: '24px 48px 0',
					backgroundImage: 'linear-gradient(-180deg, #364366 0%, #14182E 100%)',
				}}
			>
				<ShowHeader
					{...{
						today,
						week,
						month,
					}}
				/>
			</div>
		);
	}
}
export default ShowLayout;
