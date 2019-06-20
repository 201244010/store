import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import SearchForm from './SearchForm';
import SearchResult from './SearchResult';

@connect(
	state => ({
		baseStation: state.eslBaseStation,
	}),
	dispatch => ({
		changeSearchFormValue: payload =>
			dispatch({ type: 'eslBaseStation/changeSearchFormValue', payload }),
		clearSearch: payload => dispatch({ type: 'eslBaseStation/clearSearch', payload }),
		fetchBaseStationState: payload =>
			dispatch({ type: 'eslBaseStation/fetchBaseStationState', payload }),
		fetchBaseStations: payload =>
			dispatch({ type: 'eslBaseStation/fetchBaseStations', payload }),
		getBaseStationDetail: payload =>
			dispatch({ type: 'eslBaseStation/getBaseStationDetail', payload }),
		deleteBaseStation: payload =>
			dispatch({ type: 'eslBaseStation/deleteBaseStation', payload }),
		restartBaseStation: payload =>
			dispatch({ type: 'eslBaseStation/restartBaseStation', payload }),
		changeBaseStationName: payload =>
			dispatch({ type: 'eslBaseStation/changeBaseStationName', payload }),
	})
)
class BaseStation extends Component {
	componentDidMount() {
		const { fetchBaseStationState, fetchBaseStations } = this.props;
		fetchBaseStations({
			options: { current: 1 },
		});

		fetchBaseStationState();
	}

	componentWillUnmount() {
		const { clearSearch } = this.props;
		clearSearch();
	}

	render() {
		const {
			baseStation: { loading, searchFormValues, data, stationInfo, pagination, states },
			fetchBaseStations,
			getBaseStationDetail,
			deleteBaseStation,
			restartBaseStation,
			changeBaseStationName,
			changeSearchFormValue,
			clearSearch,
		} = this.props;

		return (
			<Card bordered={false}>
				<SearchForm
					{...{
						states,
						searchFormValues,
						changeSearchFormValue,
						clearSearch,
						fetchBaseStations,
					}}
				/>
				<SearchResult
					{...{
						loading,
						data,
						stationInfo,
						pagination,
						fetchBaseStations,
						getBaseStationDetail,
						deleteBaseStation,
						restartBaseStation,
						changeBaseStationName,
					}}
				/>
			</Card>
		);
	}
}

export default BaseStation;
