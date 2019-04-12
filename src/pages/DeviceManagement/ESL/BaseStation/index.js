import React, { Component } from 'react';
import { connect } from 'dva';
import SearchForm from './SearchForm';
import SearchResult from './SearchResult';

@connect(state => ({
  baseStation: state.eslBaseStation,
}))
class BaseStation extends Component {
  componentDidMount() {
    const {
      changeBreadcrumb,
      fetchBaseStations,
      fetchBaseStationState,
      changeSearchFormValue,
    } = this.props;
    changeBreadcrumb({
      data: [
        {
          key: 'system',
          title: '系统',
        },
        {
          key: 'baseStation',
          title: '基站管理',
        },
      ],
      config: {
        hasBack: false,
      },
    });
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
      <div className="content-container">
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
