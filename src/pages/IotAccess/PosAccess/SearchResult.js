import React, {Component} from 'react';
import {Table, Badge} from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';

export default class SearchResult extends Component {
	toRouter = (record) => {
		router.push(`/iotAccess/posAccess/detail?sn=${record.sn}`);
	};

	render() {
		const columns = [
			{
				title: formatMessage({ id: 'iot.pos.model' }),
				dataIndex: 'model',
				key: 'model',
			},
			{
				title: 'SN',
				dataIndex: 'sn',
				key: 'sn',
			},
			{
				title: formatMessage({id: 'iot.pos.connect.status'}),
				dataIndex: 'active_status',
				key: 'active_status',
				render: (val) => (
					val * 1 === 1 ?
						<Badge status="success" text={formatMessage({id: 'iot.pos.active.status.yes'})} /> :
						<Badge status="default" text={formatMessage({id: 'iot.pos.active.status.no'})} />
				)
			},
			{
				title: formatMessage({ id: 'list.action.title' }),
				key: 'action',
				render: (_, record) => (
					<span>
						<a href="javascript: void (0);" onClick={() => this.toRouter(record)}>
							{formatMessage({id: 'iot.pos.view.detail'})}
						</a>
					</span>
				),
			},
		];
		const {loading, data} = this.props;

		return (
			<Table columns={columns} loading={loading} dataSource={data} />
		);
	}
}
