import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import TopDataCard from './TopDataCard';

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
				label: '总客流量',
				unit: '',
				count: latestCustomerCount,
				earlyCount: earlyCustomerCount,
				compareRate: false,
				toolTipText: 'toolTipText',
			},
			{
				label: '总销售额',
				unit: '',
				count: latestOrderInfo.latestOrderAmount,
				earlyCount: earlyOrderInfo.earlyOrderAmount,
				compareRate: false,
				toolTipText: 'toolTipText',
			},
			{
				label: '总交易笔数',
				unit: '',
				count: latestOrderInfo.latestOrderCount,
				earlyCount: earlyOrderInfo.earlyOrderAmount,
				compareRate: false,
				toolTipText: 'toolTipText',
			},
			{
				label: '总设备数',
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
