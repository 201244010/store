import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Row, Col } from 'antd';
import TopDataCard from '@/pages/DataBoard/Charts/TopDataCard/TopDataCard';

@connect(({ topview, loading }) => {
	const {
		deviceOverView,
		latestCustomerCount,
		earlyCustomerCount,
		latestOrderInfo,
		earlyOrderInfo,
		hasCustomerData,
		hasOrderData,
		customerDistri,
	} = topview;
	return {
		deviceOverView,
		latestCustomerCount,
		earlyCustomerCount,
		latestOrderInfo,
		earlyOrderInfo,
		loading,
		hasCustomerData,
		hasOrderData,
		customerDistri,
	};
})
class OverViewBar extends Component {
	render() {
		// eslint-disable-next-line no-unused-vars
		const {
			timeType = 1,
			dataType = 1,
			deviceOverView,
			latestCustomerCount,
			earlyCustomerCount,
			latestOrderInfo,
			earlyOrderInfo,
			loading,
			customerDistri,
			hasCustomerData,
			hasOrderData,
		} = this.props;

		let itemListData = [];

		const totalPassengerCount = {
			label: 'totalPassengerCount',
			unit: '',
			count: latestCustomerCount,
			earlyCount: earlyCustomerCount,
			compareRate: false,
			toolTipText: formatMessage({ id: 'databoard.top.totalPassengerCount' }),
		};
		const strangerCount = {
			label: 'strangerCount',
			unit: '',
			count: customerDistri.currentStranger,
			earlyCount: customerDistri.earlyStranger,
			compareRate: false,
			toolTipText: formatMessage({ id: 'databoard.top.strangerCount' }),
		};
		const regularCount = {
			label: 'regularCount',
			unit: '',
			count: customerDistri.currentRegular,
			earlyCount: customerDistri.earlyRegular,
			compareRate: false,
			toolTipText: formatMessage({ id: 'databoard.top.regularCount' }),
		};
		// const regularCount = {
		// 	label: 'strangerCount',
		// 	unit: '',
		// 	count: latestCustomerCount,
		// 	earlyCount: earlyCustomerCount,
		// 	compareRate: false,
		// 	toolTipText: 'toolTipText',
		// };
		const totalAmount = {
			label: 'totalAmount',
			unit: '',
			count: latestOrderInfo.latestOrderAmount,
			earlyCount: earlyOrderInfo.earlyOrderAmount,
			compareRate: false,
			toolTipText: formatMessage({ id: 'databoard.top.totalAmount' }),
		};
		const totalCount = {
			label: 'totalCount',
			unit: '',
			count: latestOrderInfo.latestOrderCount,
			earlyCount: earlyOrderInfo.earlyOrderCount,
			compareRate: false,
			toolTipText: formatMessage({ id: 'databoard.top.totalCount' }),
		};
		const deviceCount = {
			label: 'deviceCount',
			unit: '',
			count: deviceOverView.offline + deviceOverView.online,
			earlyCount: deviceOverView.offline,
			compareRate: false,
			toolTipText: formatMessage({ id: 'databoard.top.deviceCount' }),
		};
		// if (!hasCustomerData && !hasOrderData) return;
		if (hasCustomerData && hasOrderData) {
			itemListData = [totalPassengerCount, totalAmount, totalCount, deviceCount];
		}
		if (!hasOrderData && hasCustomerData) {
			itemListData = [totalPassengerCount, strangerCount, regularCount];
		}
		if (!hasCustomerData && hasOrderData) {
			itemListData = [totalAmount, totalCount, deviceCount];
		}
		// const itemMock = {
		// 	label: '标题',
		// 	unit: 'percent',
		// 	count: 100,
		// 	earlyCount: 50,
		// 	compareRate: true,
		// 	toolTipText: 'toolTipText',
		// };
		// const itemListData = [1, 2, 3, 4].map(() => itemMock);
		console.log('--------OverView_Bar------:', itemListData);

		const CardTotal = itemListData.length;
		const rowGutter = 24;
		const colSpan = rowGutter / CardTotal;
		const listItems = itemListData.map((item, index) => (
			<Col span={colSpan} key={index}>
				<TopDataCard
					{...{
						data: item,
						timeType,
						dataType,
						loading: loading.effects['topview/getDeviceOverView'],
					}}
				/>
			</Col>
		));

		return (
			<Row gutter={24} className="overview-bar">
				{listItems}
			</Row>
		);
	}
}
export default OverViewBar;
