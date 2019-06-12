import React, { Component } from 'react';
import { Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { unixSecondToDate } from '@/utils/utils';

export default class SearchResult extends Component {
	onTableChange = pagination => {
		const { fetchCommunications } = this.props;
		fetchCommunications({
			pageSize: pagination.pageSize,
			current: pagination.current,
		});
	};

	render() {
		const { data, loading, pagination, reasons, results } = this.props;

		const columns = [
			{
				title: formatMessage({ id: 'esl.device.esl.id' }),
				dataIndex: 'esl_code',
				key: 'esl_code',
			},
			{
				title: formatMessage({ id: 'esl.device.esl.product.seq.num' }),
				dataIndex: 'product_seq_num',
				key: 'product_seq_num'
			},
			{
				title: formatMessage({ id: 'esl.device.esl.product.name' }),
				dataIndex: 'product_name',
				key: 'product_name'
			},
			{
				title: formatMessage({ id: 'esl.device.esl.template.name' }),
				dataIndex: 'template_name',
				key: 'template_name'
			},
			{
				title: formatMessage({ id: 'esl.device.esl.comm.reason' }),
				dataIndex: 'reason',
				key: 'reason',
				render: text => <span>{reasons[text]}</span>,
			},
			{
				title: formatMessage({ id: 'esl.device.esl.comm.result' }),
				dataIndex: 'result',
				key: 'result',
				render: text => <span>{results[text]}</span>,
			},
			{
				title: formatMessage({ id: 'esl.device.esl.comm.time' }),
				dataIndex: 'transmission_time',
				key: 'transmission_time',
				render: text => (text !== 0 ? <span>{unixSecondToDate(text)}</span> : <noscript />),
			},
		];

		return (
			<div>
				<Table
					rowKey="transmission_time"
					columns={columns}
					dataSource={data}
					loading={loading}
					pagination={{
						...pagination,
						showTotal: total => `${formatMessage({ id: 'esl.device.esl.all' })}${total}${formatMessage({ id: 'esl.device.esl.comm.history.total', })}`,
					}}
					onChange={this.onTableChange}
				/>
			</div>
		);
	}
}
