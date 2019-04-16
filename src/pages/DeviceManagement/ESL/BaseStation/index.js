import React, { Component } from 'react';
import { connect } from 'dva';
import SearchForm from './SearchForm';
import SearchResult from './SearchResult';
import * as styles from './BaseStation.less';

@connect(
  state => ({
    baseStation: state.eslBaseStation,
  }),
  dispatch => ({
    fetchBaseStationState: payload =>
      dispatch({ type: 'eslBaseStation/fetchBaseStationState', payload }),
    fetchBaseStations: payload => dispatch({ type: 'eslBaseStation/fetchBaseStations', payload }),
    changeSearchFormValue: payload =>
      dispatch({ type: 'eslBaseStation/changeSearchFormValue', payload }),
    getBaseStationDetail: payload =>
      dispatch({ type: 'eslBaseStation/getBaseStationDetail', payload }),
    deleteBaseStation: payload => dispatch({ type: 'eslBaseStation/deleteBaseStation', payload }),
  })
)
class BaseStation extends Component {
  componentDidMount() {
    const { fetchBaseStationState, fetchBaseStations, changeSearchFormValue } = this.props;

    changeSearchFormValue({
      keyword: '',
      status: -1,
    });

    fetchBaseStations({
      current: 1,
    });

    fetchBaseStationState();
  }

  render() {
    const {
      baseStation: { loading, searchFormValues, data, stationInfo, pagination, states },
      fetchBaseStations,
      getBaseStationDetail,
      deleteBaseStation,
      changeSearchFormValue,
    } = this.props;

    return (
      <div className={styles['content-container']}>
        <SearchForm
          {...{
            states,
            searchFormValues,
            changeSearchFormValue,
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
          }}
        />
      </div>
    );
  }
}

export default BaseStation;
