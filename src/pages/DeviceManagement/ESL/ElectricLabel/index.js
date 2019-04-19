import React, { Component } from 'react';
import { connect } from 'dva';
import SearchResult from './SearchResult';
import SearchForm from './SearchForm';
import * as styles from './index.less';

@connect(
    state => ({
        eslElectricLabel: state.eslElectricLabel,
    }),
    dispatch => ({
        changeSearchFormValue: payload =>
            dispatch({ type: 'eslElectricLabel/changeSearchFormValue', payload }),
        fetchElectricLabels: payload =>
            dispatch({ type: 'eslElectricLabel/fetchElectricLabels', payload }),
        fetchESLDetails: payload =>
            dispatch({ type: 'eslElectricLabel/fetchESLDetails', payload }),
        flashLed: payload =>
            dispatch({ type: 'eslElectricLabel/flashLed', payload }),
        deleteESL: payload =>
            dispatch({ type: 'eslElectricLabel/deleteESL', payload }),
    })
)
class ElectricLabel extends Component {
    componentDidMount() {
        const { fetchElectricLabels, changeSearchFormValue } = this.props;

        changeSearchFormValue({
            keyword: '',
            status: -1,
        });

        fetchElectricLabels({
            options: {
                current: 1,
            },
        });
    }

    render() {
        const {
            eslElectricLabel: { loading, searchFormValues, data, pagination, detailInfo },
            changeSearchFormValue,
            fetchElectricLabels,
            fetchESLDetails,
            flashLed,
            deleteESL,
        } = this.props;

        return (
            <div className={styles['content-container']}>
                <SearchForm
                    {...{
                        searchFormValues,
                        changeSearchFormValue,
                        fetchElectricLabels,
                    }}
                />
                <SearchResult
                    {...{
                        loading,
                        data,
                        pagination,
                        detailInfo,
                        fetchElectricLabels,
                        fetchESLDetails,
                        flashLed,
                        deleteESL,
                    }}
                />
            </div>
        );
    }
}

export default ElectricLabel;
