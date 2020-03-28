import React from 'react';
import { connect } from 'dva';

@connect(({ topview }) => {
	const { latestCustomerByShop } = topview;
	return { latestCustomerByShop };
})
class CustomerRank extends React.Component {
	foramtTabelData = (data, dataType) => {
		const tabelData = data
			.map(item => {
				const { shopName } = item;
				let value;
				if (dataType) {
					if (dataType === 'order') {
						value = item.orderAmount;
					}
					if (dataType === 'customer') {
						value = item.totalCount;
					}
				} else {
					value = 0;
				}
				return {
					value,
					shopName,
				};
			})
			.sort((a, b) => b.value - a.value)
			.map((item, index) => {
				const { value, shopName } = item;
				return {
					rank: index + 1,
					key: index,
					shopName,
					value,
				};
			});

		return tabelData;
	};

	render() {
		const { latestCustomerByShop } = this.props;
		const columns = [
			{
				title: '排名',
				dataIndex: 'rank',
				sorter: (a, b) => a.value - b.value,
			},
			{
				title: '门店',
				dataIndex: 'shopName',
			},
			{ title: 'value', dataIndex: 'value' },
		];

		return (
			<Card title="客流量排行" className="tabel-wrapper">
				<Table
					dataSource={foramtTabelData(latestCustomerByShop, 'customer')}
					columns={columns}
					pagination={{
						pageSize: 5,
					}}
				/>
			</Card>
		);
	}
}
