import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import TopDataCard from '@/pages/DataBoard/Charts/TopDataCard/TopDataCard';

@connect(({ topview, loading }) => {
	const {
		deviceOverView,
		latestCustomerCount,
		earlyCustomerCount,
		latestOrderInfo,
		earlyOrderInfo,
	} = topview;
	return {
		deviceOverView,
		latestCustomerCount,
		earlyCustomerCount,
		latestOrderInfo,
		earlyOrderInfo,
		loading,
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
		} = this.props;

		const itemListData = [
			{
				label: 'totalPassengerCount',
				unit: '',
				count: latestCustomerCount,
				earlyCount: earlyCustomerCount,
				compareRate: false,
				toolTipText: 'toolTipText',
			},
			{
				label: 'totalAmount',
				unit: '',
				count: latestOrderInfo.latestOrderAmount,
				earlyCount: earlyOrderInfo.earlyOrderAmount,
				compareRate: false,
				toolTipText: 'toolTipText',
			},
			{
				label: 'totalCount',
				unit: '',
				count: latestOrderInfo.latestOrderCount,
				earlyCount: earlyOrderInfo.earlyOrderCount,
				compareRate: false,
				toolTipText: 'toolTipText',
			},
			{
				label: 'deviceCount',
				unit: '',
				count: deviceOverView.offline + deviceOverView.online,
				earlyCount: deviceOverView.offline,
				compareRate: false,
				toolTipText: 'toolTipText',
			},
		];

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
