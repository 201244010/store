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
        fetchElectricLabels: payload =>
            dispatch({ type: 'eslElectricLabel/fetchElectricLabels', payload }),
        changeSearchFormValue: payload =>
            dispatch({ type: 'eslElectricLabel/changeSearchFormValue', payload }),
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
            eslElectricLabel: { loading, searchFormValues, data, pagination },
            fetchElectricLabels,
            changeSearchFormValue,
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
                        fetchElectricLabels,
                    }}
                />
            </div>
        );
    }
}

export default ElectricLabel;
