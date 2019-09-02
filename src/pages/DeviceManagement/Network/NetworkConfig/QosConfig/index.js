import React from 'react';
import { Table, Popconfirm, Divider, Button, message } from 'antd';

import { formatMessage } from 'umi/locale';
import { ERROR_OK } from '@/constants/errorCode';
import styles from '../NetworkConfig.less';

class QosConfig extends React.PureComponent {
	constructor(props) {
		super(props);
		this.columns = [
			{
				title: formatMessage({ id: 'network.deviceName' }),
				dataIndex: 'name',
			},
			{
				title: formatMessage({ id: 'network.qos.upBandwidth' }),
				dataIndex: 'upBandwidth',
				render: upBandwidth => `${parseInt(upBandwidth / 1024, 10)}Mbps`,
			},
			{
				title: formatMessage({ id: 'network.qos.downBandwidth' }),
				dataIndex: 'downBandwidth',
				render: downBandwidth => `${parseInt(downBandwidth / 1024, 10)}Mbps`,
			},
			{
				title: formatMessage({ id: 'network.bandwidth.allocation' }),
				render: (_, record) => {
					const { enable, sunmiWeight, whiteWeight, normalWeight } = record;

					return enable ? (
						<span>
							{sunmiWeight}%/{whiteWeight}%/{normalWeight}%
						</span>
					) : (
						formatMessage({ id: 'network.qos.unOpen' })
					);
				},
			},
			{
				title: formatMessage({ id: 'network.operation' }),
				render: (_, record) => (
					<div>
						<>
							<a onClick={() => this.editQos(record)}>
								{formatMessage({ id: 'btn.edit' })}
							</a>
							<Divider type="vertical" />
							<Popconfirm
								title={formatMessage({ id: 'network.sure.delete' })}
								onConfirm={() => this.deleteQos(record)}
							>
								<a>{formatMessage({ id: 'btn.delete' })}</a>
							</Popconfirm>
						</>
					</div>
				),
			},
		];
	}

	async componentDidMount() {
		const { getQosList } = this.props;
		await getQosList();
	}

	editQos = async record => {
		console.log(record);
		const { id } = record;
		const { changeTabType, getQosInfo } = this.props;
		const payload = {
			configId: id,
		};
		await getQosInfo(payload);
		await changeTabType({ type: 'qos', value: 'update' });
	};

	deleteQos = async record => {
		const { id } = record;
		const { deleteQos } = this.props;
		const payload = {
			configId: id,
		};
		const response = await deleteQos(payload);
		if (response && response.code === ERROR_OK) {
			message.success('删除成功');
		} else {
			message.error('删除失败');
		}
	};

	onTableChange = async pagination => {
		const { getQosList } = this.props;
		await getQosList({
			pageSize: pagination.pageSize,
			pageNum: pagination.current,
		});
	};

	render() {
		const {
			changeTabType,
			network: {
				qosList: { configList },
				pagination,
			},
		} = this.props;
		return (
			<div>
				<Table
					rowKey="id"
					pagination={pagination}
					columns={this.columns}
					dataSource={configList}
					onChange={this.onTableChange}
				/>
				<Button
					className={styles['create-qos']}
					icon="plus"
					onClick={() => changeTabType({ type: 'qos', value: 'create' })}
					type="primary"
				>
					{formatMessage({ id: 'network.qos.createConfig' })}
				</Button>
			</div>
		);
	}
}

export default QosConfig;
