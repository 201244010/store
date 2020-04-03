import React, { Component } from 'react';
import { Table } from 'antd';
import { formatMessage } from 'umi/locale';
import Tag from '@/components/Tag';
import { STATES } from '@/constants/mapping';
import { getLocationParam, compareVersion } from '@/utils/utils';

export default class SearchResult extends Component {
	onTableChange = pagination => {
		const { getAPGroupInfo, groupId } = this.props;
		getAPGroupInfo({
			group_id: groupId,
			pageSize: pagination.pageSize,
			current: pagination.current,
		});
	};

	render() {
		const { data, loading, pagination, version } = this.props;
		const upgraded = getLocationParam('upgraded');
		const columns = [
			{
				title: formatMessage({ id: 'esl.device.ap.sn' }),
				dataIndex: 'sn',
				key: 'sn',
			},
			{
				title: formatMessage({ id: 'esl.device.esl.ware.version.now' }),
				dataIndex: 'bin_version',
				key: 'bin_version',
				render: text => (
					<span className={`version-${compareVersion(version, text)}`}>{text}</span>
				),
			},
			{
				title: formatMessage({ id: 'esl.device.ap.status' }),
				dataIndex: 'status',
				key: 'status',
				render: status => <Tag status={status} template={STATES} />,
			},
		];

		return (
			<div>
				<Table
					rowKey="ap_code"
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
