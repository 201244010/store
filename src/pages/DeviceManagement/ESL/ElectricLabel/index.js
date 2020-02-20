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
		fetchModelList: payload => dispatch({ type: 'eslElectricLabel/fetchModelList', payload }),
		batchDeleteESL: payload => dispatch({ type: 'eslElectricLabel/batchDeleteESL', payload }),
		batchUnbindESL: payload => dispatch({ type: 'eslElectricLabel/batchUnbindESL', payload }),
		batchFlushESL: payload => dispatch({ type: 'eslElectricLabel/batchFlushESL', payload }),
		batchChangeTemplate: payload => dispatch({ type: 'eslElectricLabel/batchChangeTemplate', payload }),
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
			fetchModelList
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
		fetchModelList({
			options: {
				model_type: 1
			}
		});
	}

	componentWillUnmount() {
		const { clearSearchValue } = this.props;
		clearSearchValue();
	}

	refreshFailed = async () => {
		const {
			refreshFailedImage,
			fetchProductOverview,
			fetchDeviceOverview,
			fetchElectricLabels
		} = this.props;
		await refreshFailedImage();
		await fetchProductOverview();
		await fetchDeviceOverview();
		await fetchElectricLabels();
	};

	getDeviceOverview = () => {
		const { fetchDeviceOverview } = this.props;
		setTimeout(() => {
			fetchDeviceOverview();
		}, 1000);
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
				modelList
			},
			basicDataProduct: {
				data: products,
				pagination: productPagination,
				overview: productOverview,
			},
			changeSearchFormValue,
			clearSearch,
			fetchProductOverview,
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
			switchScreen,
			batchDeleteESL,
			batchUnbindESL,
			batchFlushESL,
			batchChangeTemplate,
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
							modelList,
							searchFormValues,
							changeSearchFormValue,
							clearSearch,
							fetchElectricLabels,
							fetchProductOverview,
							fetchDeviceOverview: this.getDeviceOverview,
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
							fetchProductOverview,
							fetchDeviceOverview: this.getDeviceOverview,
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
							screenInfo,
							batchDeleteESL,
							batchUnbindESL,
							batchFlushESL,
							batchChangeTemplate
						}}
					/>
				</Card>
			</div>
		);
	}
}

export default ElectricLabel;
