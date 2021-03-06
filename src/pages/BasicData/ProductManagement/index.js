import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import SearchForm from './SearchForm';
import SearchResult from './SearchResult';

@connect(
	state => ({
		product: state.basicDataProduct,
		store: state.store,
	}),
	dispatch => ({
		changeSearchFormValue: payload =>
			dispatch({ type: 'basicDataProduct/changeSearchFormValue', payload }),
		clearSearch: payload => dispatch({ type: 'basicDataProduct/clearSearch', payload }),
		fetchProductList: payload =>
			dispatch({ type: 'basicDataProduct/fetchProductList', payload }),
		getProductDetail: payload =>
			dispatch({ type: 'basicDataProduct/getProductDetail', payload }),
		deleteProduct: payload => dispatch({ type: 'basicDataProduct/deleteProduct', payload }),
		getSaasBindInfo: () => dispatch({ type: 'store/getSaasBindInfo' }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class ProductList extends Component {
	componentDidMount() {
		const { fetchProductList, getSaasBindInfo } = this.props;
		fetchProductList({
			options: {
				current: 1,
				keyword: null,
			},
		});
		getSaasBindInfo();
	}

	componentWillUnmount() {
		const { clearSearch } = this.props;
		clearSearch();
	}

	render() {
		const {
			product: { loading, searchFormValues, data, states, pagination },
			store: { saasBindInfo },
			changeSearchFormValue,
			clearSearch,
			fetchProductList,
			deleteProduct,
			goToPath,
		} = this.props;

		return (
			<Card bordered={false}>
				<SearchForm
					{...{
						states,
						values: searchFormValues,
						changeSearchFormValue,
						clearSearch,
						fetchProductList,
					}}
				/>
				<SearchResult
					{...{
						loading,
						data,
						saasBindInfo,
						pagination,
						fetchProductList,
						deleteProduct,
						goToPath,
					}}
				/>
			</Card>
		);
	}
}

export default ProductList;
