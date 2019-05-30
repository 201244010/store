import React, { Component } from 'react';
import { connect } from 'dva';
import Overview from './Overview';
import SearchResult from './SearchResult';
import SearchForm from './SearchForm';
import * as styles from './index.less';

@connect(
	state => ({
		product: state.basicDataProduct,
		eslElectricLabel: state.eslElectricLabel,
		basicDataProduct: state.basicDataProduct,
	}),
	dispatch => ({
		changeSearchFormValue: payload =>
			dispatch({ type: 'eslElectricLabel/changeSearchFormValue', payload }),
		clearSearch: () => dispatch({ type: 'eslElectricLabel/clearSearch' }),
		fetchProductOverview: payload =>
			dispatch({ type: 'basicDataProduct/fetchProductOverview', payload }),
		fetchDeviceOverview: payload =>
			dispatch({ type: 'eslElectricLabel/fetchDeviceOverview', payload }),
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
		refreshFailedImage: () => dispatch({ type: 'eslElectricLabel/refreshFailedImage' }),
		clearSearchValue: () => dispatch({ type: 'eslElectricLabel/clearSearchValue' }),
	})
)
class ElectricLabel extends Component {
	componentDidMount() {
		const {
			fetchProductOverview,
			fetchDeviceOverview,
			fetchElectricLabels,
			changeSearchFormValue,
			fetchFlashModes,
		} = this.props;

		fetchProductOverview();
		fetchDeviceOverview();

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

	componentWillUnmount() {
		const { clearSearchValue } = this.props;
		clearSearchValue();
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
				overview: deviceOverview,
			},
			basicDataProduct: {
				data: products,
				pagination: productPagination,
				overview: productOverview,
			},
			changeSearchFormValue,
			clearSearch,
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
			refreshFailedImage,
		} = this.props;

		return (
			<div>
				<Overview
					deviceOverview={deviceOverview}
					productOverview={productOverview}
					refreshFailedImage={refreshFailedImage}
				/>
				<div className={styles['content-container']}>
					<SearchForm
						{...{
							searchFormValues,
							changeSearchFormValue,
							clearSearch,
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
			</div>
		);
	}
}

export default ElectricLabel;
