import React from 'react';
import { Card, Pagination, Spin, Table, message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { DEFAULT_PAGE_LIST_SIZE } from '@/constants/index';
import styles from './Network.less';

@connect(
	state => ({
		loading: state.loading,
	}),
	dispatch => ({
		getEventList: payload => dispatch({ type: 'network/getEventList', payload }),
	})
)
class EventList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			total: 0,
			pageSize: 10,
			pageNum: 1,
		};
		this.columns = [
			{
				title: formatMessage({ id: 'network.networkId' }),
				dataIndex: 'networkId',
				key: 'networkId',
			},
			{
				title: formatMessage({ id: 'network.deviceSN' }),
				dataIndex: 'sn',
				key: 'sn',
			},
			{
				title: formatMessage({ id: 'network.connect.eventType' }),
				dataIndex: 'eventType',
				key: 'eventType',
			},
			{
				title: formatMessage({ id: 'network.connect.time' }),
				dataIndex: 'reportTime',
				key: 'reportTime',
			},
		];
	}

	componentDidMount() {
		const { pageSize, pageNum } = this.state;
		this.getList(pageNum, pageSize);
	}

	getList = async (pageNum, pageSize) => {
		const { getEventList } = this.props;
		const arr = await getEventList({ pageNum, pageSize });
		const { code = -1 } = arr;

		if (code === 1) {
			const {
				data: { eventInfo, totalCount },
			} = arr;
			const total = totalCount > 50 * pageSize ? 50 * pageSize : totalCount;
			eventInfo.forEach((item, index) => {
				item.networkAlias !== '' ? (item.networkId = item.networkAlias) : '';
				item.index = index;
				item.reportTime = moment.unix(item.reportTime).format('YYYY-MM-DD HH:mm:ss');
				switch (item.eventType) {
					case 5:
						item.eventType = formatMessage({
							id: 'network.connect.deviceCpuOverwhelmed',
						});
						break;
					case 7:
						item.eventType = formatMessage({
							id: 'network.connect.deviceMemoryOverwhelmed',
						});
						break;
					case 11:
						item.eventType = formatMessage({ id: 'network.connect.deviceOnline' });
						break;
					case 12:
						item.eventType = formatMessage({ id: 'network.connect.deviceOffline' });
						break;
					default:
						item.eventType = formatMessage({ id: 'network.connect.eventType.unknown' });
						break;
				}
			});
			this.setState({ pageSize, pageNum, dataSource: eventInfo, total });
		} else {
			message.error(formatMessage({ id: 'network.routerEvent.requestFail' }));
		}
	};

	handleChange = (current, size) => {
		this.getList(current, size);
	};

	render() {
		const { dataSource, total } = this.state;
		const { loading } = this.props;

		return (
			<Card title={formatMessage({ id: 'network.routerEvent.title' })}>
				<Spin spinning={loading.effects['network/getEventList']}>
					<Table
						columns={this.columns}
						dataSource={dataSource}
						pagination={false}
						rowKey="index"
					/>
					{total > 0 ? (
						<Pagination
							total={total}
							showSizeChanger
							pageSizeOptions={DEFAULT_PAGE_LIST_SIZE}
							onChange={this.handleChange}
							onShowSizeChange={this.handleChange}
							className={styles['network-router-pagination']}
						/>
					) : (
						''
					)}
				</Spin>
			</Card>
		);
	}
}

export default EventList;
