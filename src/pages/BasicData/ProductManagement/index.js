import React, { Component } from 'react';
import { connect } from 'dva';
import SearchForm from './SearchForm';
import SearchResult from './SearchResult';
import * as styles from './ProductManagement.less';

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

	// componentWillUnmount() {
	// 	const { clearSearch } = this.props;
	// 	clearSearch();
	// }

	render() {
		const {
			product: { loading, searchFormValues, data, states, pagination },
			store: { saasBindInfo },
			changeSearchFormValue,
			clearSearch,
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
					}}
				/>
			</div>
		);
	}
}

export default ProductList;
