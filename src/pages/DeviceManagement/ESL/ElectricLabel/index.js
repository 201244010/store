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
        changeTemplate: payload => dispatch({ type: 'eslElectricLabel/changeTemplate', payload }),
        fetchProductList: payload =>
            dispatch({ type: 'basicDataProduct/fetchProductList', payload }),
        fetchFlashModes: payload => dispatch({ type: 'eslElectricLabel/fetchFlashModes', payload }),
        flushESL: payload => dispatch({ type: 'eslElectricLabel/flushESL', payload }),
        bindESL: payload => dispatch({ type: 'eslElectricLabel/bindESL', payload }),
        unbindESL: payload => dispatch({ type: 'eslElectricLabel/unbindESL', payload }),
        flashLed: payload => dispatch({ type: 'eslElectricLabel/flashLed', payload }),
        deleteESL: payload => dispatch({ type: 'eslElectricLabel/deleteESL', payload }),
    })
)
class ElectricLabel extends Component {
    componentDidMount() {
        const { fetchElectricLabels, changeSearchFormValue, fetchFlashModes } = this.props;

        changeSearchFormValue({
            keyword: '',
            status: -1,
        });

        fetchElectricLabels({
            options: {
                current: 1,
            },
        });

        fetchFlashModes();
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
                flashModes,
            },
            basicDataProduct: { data: products, pagination: productPagination },
            changeSearchFormValue,
            fetchElectricLabels,
            fetchESLDetails,
            fetchTemplatesByESLCode,
            changeTemplate,
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
                        flashModes,
                        products,
                        productPagination,
                        fetchElectricLabels,
                        fetchESLDetails,
                        fetchTemplatesByESLCode,
                        changeTemplate,
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
