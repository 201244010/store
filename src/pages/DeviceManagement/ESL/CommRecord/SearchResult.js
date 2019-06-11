import React, { Component } from 'react';
import { Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { getLocationParam } from '@/utils/utils';

export default class SearchResult extends Component {
	onTableChange = pagination => {
		const { getESLGroupInfo, groupId } = this.props;
		getESLGroupInfo({
			group_id: groupId,
			pageSize: pagination.pageSize,
			current: pagination.current,
		});
	};

	render() {
		const { data, loading, pagination } = this.props;
		const upgraded = getLocationParam('upgraded');

		const columns = [
			{
				title: formatMessage({ id: 'esl.device.esl.id' }),
				dataIndex: 'esl_code',
				key: 'esl_code',
			},
			{
				title: formatMessage({ id: 'esl.device.esl.product.seq.num' }),
				dataIndex: 'bin_version',
				key: 'bin_version'
			},
			{
				title: formatMessage({ id: 'esl.device.esl.product.name' }),
				dataIndex: 'bin_version',
				key: 'bin_version'
			},
			{
				title: formatMessage({ id: 'esl.device.esl.template.name' }),
				dataIndex: 'bin_version',
				key: 'bin_version'
			},
			{
				title: formatMessage({ id: 'esl.device.esl.comm.cause' }),
				dataIndex: 'bin_version',
				key: 'bin_version'
			},
			{
				title: formatMessage({ id: 'esl.device.esl.comm.result' }),
				dataIndex: 'bin_version',
				key: 'bin_version'
			},
			{
				title: formatMessage({ id: 'esl.device.esl.comm.time' }),
				dataIndex: 'bin_version',
				key: 'bin_version'
			}
		];

		return (
			<div>
				<Table
					rowKey="esl_code"
					columns={columns}
					dataSource={data}
					loading={loading}
					pagination={{
						...pagination,
						showTotal: total =>
							`${formatMessage({
								id: 'esl.device.upgrade.updated.total',
							})}: ${upgraded}/${total}`,
					}}
					onChange={this.onTableChange}
				/>
			</div>
		);
	}
}
