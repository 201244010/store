import React, { Component } from 'react';
import { connect } from 'dva';
import SearchForm from './SearchForm';
import SearchResult from './SearchResult';
import * as styles from './ProductManagement.less';

@connect(
  state => ({
    goods: state.basicDataProduct,
  }),
  dispatch => ({
    fetchProductList: payload => dispatch({ type: 'fetchProductList', payload }),
    changeSearchFormValue: payload => dispatch({ type: 'changeSearchFormValue', payload }),
    getProductDetail: payload => dispatch({ type: 'getProductDetail', payload }),
    deleteProduct: payload => dispatch({ type: 'deleteProduct', payload }),
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
      goods: { loading, searchFormValues, data, states, pagination },
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
