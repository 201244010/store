import React, { Component } from 'react';
import { connect } from 'dva';
import SearchForm from './SearchForm';
import SearchResult from './SearchResult';
import * as styles from './ProductManagement.less';

@connect(
    state => ({
        product: state.basicDataProduct,
    }),
    dispatch => ({
        fetchProductList: payload =>
            dispatch({ type: 'basicDataProduct/fetchProductList', payload }),
        changeSearchFormValue: payload =>
            dispatch({ type: 'basicDataProduct/changeSearchFormValue', payload }),
        getProductDetail: payload =>
            dispatch({ type: 'basicDataProduct/getProductDetail', payload }),
        deleteProduct: payload => dispatch({ type: 'basicDataProduct/deleteProduct', payload }),
    })
)
class ProductList extends Component {
    componentDidMount() {
        const { fetchProductList } = this.props;
        fetchProductList({
            current: 1,
            keyword: null,
        });
    }

    render() {
        const {
            product: { loading, searchFormValues, data, states, pagination },
            changeSearchFormValue,
            fetchProductList,
            deleteProduct,
        } = this.props;

        return (
            <div className={styles['content-container']}>
                <SearchForm
                    {...{
                        states,
                        values: searchFormValues,
                        changeSearchFormValue,
                        fetchProductList,
                    }}
                />
                <SearchResult
                    {...{
                        loading,
                        data,
                        pagination,
                        fetchProductList,
                        deleteProduct,
                    }}
                />
            </div>
        );
    }
}

export default ProductList;
