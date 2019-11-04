import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import Overview from './Overview';
import SearchResult from './SearchResult';
import SearchForm from './SearchForm';

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
		fetchSwitchScreenInfo: payload => dispatch({ type: 'eslElectricLabel/fetchSwitchScreenInfo', payload }),
		fetchScreenPushInfo: payload => dispatch({ type: 'eslElectricLabel/fetchScreenPushInfo', payload }),
		switchScreen: payload => dispatch({ type: 'eslElectricLabel/switchScreen', payload }),
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

	refreshFailed = async () => {
		const { refreshFailedImage, fetchDeviceOverview, fetchElectricLabels } = this.props;
		await refreshFailedImage();
		await fetchDeviceOverview();
		await fetchElectricLabels();
	};

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
				screenInfo,
				screenPushInfo,
			},
			basicDataProduct: {
				data: products,
				pagination: productPagination,
				overview: productOverview,
			},
			changeSearchFormValue,
			clearSearch,
			fetchDeviceOverview,
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
			fetchSwitchScreenInfo,
			fetchScreenPushInfo,
			switchScreen
		} = this.props;

		return (
			<div>
				<Overview
					deviceOverview={deviceOverview}
					productOverview={productOverview}
					refreshFailed={this.refreshFailed}
				/>
				<Card bordered={false}>
					<SearchForm
						{...{
							searchFormValues,
							changeSearchFormValue,
							clearSearch,
							fetchElectricLabels,
							fetchDeviceOverview,
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
							screenPushInfo,
							fetchDeviceOverview,
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
							fetchSwitchScreenInfo,
							fetchScreenPushInfo,
							switchScreen,
							screenInfo
						}}
					/>
				</Card>
			</div>
		);
	}
}

export default ElectricLabel;
