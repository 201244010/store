import React, { Component } from 'react';
import { connect } from 'dva';
import SearchResult from './SearchResult';
import SearchForm from './SearchForm';
import * as styles from './index.less';

@connect(
    state => ({
        eslElectricLabel: state.eslElectricLabel,
        basicDataProduct: state.basicDataProduct,
    }),
    dispatch => ({
        changeSearchFormValue: payload =>
            dispatch({ type: 'eslElectricLabel/changeSearchFormValue', payload }),
        fetchElectricLabels: payload =>
            dispatch({ type: 'eslElectricLabel/fetchElectricLabels', payload }),
        fetchESLDetails: payload => dispatch({ type: 'eslElectricLabel/fetchESLDetails', payload }),
        fetchTemplatesByESLCode: payload =>
            dispatch({ type: 'eslElectricLabel/fetchTemplatesByESLCode', payload }),
        fetchProductList: payload =>
            dispatch({ type: 'basicDataProduct/fetchProductList', payload }),
        flushESL: payload => dispatch({ type: 'eslElectricLabel/flushESL', payload }),
        bindESL: payload => dispatch({ type: 'eslElectricLabel/bindESL', payload }),
        unbindESL: payload => dispatch({ type: 'eslElectricLabel/unbindESL', payload }),
        flashLed: payload => dispatch({ type: 'eslElectricLabel/flashLed', payload }),
        deleteESL: payload => dispatch({ type: 'eslElectricLabel/deleteESL', payload }),
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
            eslElectricLabel: {
                loading,
                searchFormValues,
                data,
                pagination,
                detailInfo,
                templates4ESL,
            },
            basicDataProduct: { data: products },
            changeSearchFormValue,
            fetchElectricLabels,
            fetchESLDetails,
            fetchTemplatesByESLCode,
            fetchProductList,
            flushESL,
            bindESL,
            unbindESL,
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
                        templates4ESL,
                        products,
                        fetchElectricLabels,
                        fetchESLDetails,
                        fetchTemplatesByESLCode,
                        fetchProductList,
                        bindESL,
                        flushESL,
                        unbindESL,
                        flashLed,
                        deleteESL,
                    }}
                />
            </div>
        );
    }
}

export default ElectricLabel;
