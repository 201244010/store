import React, {Component} from 'react';
import {Table, Badge} from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import styles from './index.less';

export default class SearchResult extends Component {
	toRouter = (record) => {
		router.push(`/iotAccess/posAccess/detail?sn=${record.sn}`);
	};

	render() {
		const columns = [
			{
				title: '',
				dataIndex: 'img',
				key: 'img_path',
				width: 60,
				render: (_, record) => (
					<img style={{width: 60}} src={record.img_path || require('@/assets/no-img.png')} alt="" />
				)
			},
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
				),
				filters: [{
					text: formatMessage({id: 'iot.pos.active.status.no'}),
					value: 0,
				}, {
					text: formatMessage({id: 'iot.pos.active.status.yes'}),
					value: 1,
				}],
				onFilter: (value, record) => record.active_status * 1 === value,
			},
			{
				title: formatMessage({ id: 'list.action.title' }),
				key: 'action',
				render: (_, record) => (
					<span>
						{
							record.active_status * 1 ?
								<a href="javascript: void (0);" onClick={() => this.toRouter(record)}>
									{formatMessage({id: 'iot.pos.view.detail'})}
								</a> :
								<a href="javascript: void (0);" style={{color: '#aaa', cursor: 'not-allowed'}}>
									{formatMessage({id: 'iot.pos.view.detail'})}
								</a>
						}
					</span>
				),
			},
		];
		const {loading, data} = this.props;

		return (
			<Table className={styles['pos-table']} columns={columns} loading={loading} dataSource={data} pagination={false} rowKey='sn' />
		);
	}
}
