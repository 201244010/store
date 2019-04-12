import React, { Component } from 'react';
import { connect } from 'dva';
import SearchForm from './SearchForm';
import SearchResult from './SearchResult';

@connect(state => ({
  common: state.common,
  goods: state.goods,
  apiImport: state.apiImport,
}))
class ProductList extends Component {
  componentDidMount() {
    // const {
    //   changeBreadcrumb, fetchGoodsPushState, fetchGoodsList,
    // } = this.props;
    // fetchGoodsPushState();
    // fetchGoodsList({
    //   current: 1,
    //   keyword: null,
    // });
  }

  render() {
    const {
      goods: { loading, searchFormValues, data, states, pagination, filePath, importResult },
      apiImport: { loading: importLoading, percent, importStatus },
      changeGoodsSearchForm,
      fetchGoodsList,
      deleteGoods,
      updateGoods,
      bindEsl,
      changeMode,
      uploadProducts,
      importFileCheck,
      kewuyouFetchList,
      kewuyouImportQuery,
    } = this.props;

    return (
      <div className="content-container">
        <SearchForm
          {...{
            states,
            values: searchFormValues,
            changeGoodsSearchForm,
            fetchGoodsList,
          }}
        />
        <SearchResult
          {...{
            loading,
            data,
            pagination,
            filePath,
            importResult,
            importLoading,
            percent,
            importStatus,
            fetchGoodsList,
            deleteGoods,
            updateGoods,
            bindEsl,
            changeMode,
            uploadProducts,
            importFileCheck,
            kewuyouFetchList,
            kewuyouImportQuery,
          }}
        />
      </div>
    );
  }
}

export default ProductList;
