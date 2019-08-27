import React from 'react';
import { Table, Popconfirm, Divider, Button } from 'antd';

import { formatMessage } from 'umi/locale';

class QosConfig extends React.PureComponent {
	constructor(props) {
		super(props);
		this.columns = [
			{
				title: formatMessage({ id: 'network.deviceName' }),
				dataIndex: 'networkAlias',
			},
			{
				title: formatMessage({ id: 'network.qos.upBandwidth' }),
				dataIndex: 'sn',
			},
			{
				title: formatMessage({ id: 'network.qos.downBandwidth' }),
				dataIndex: 'binVersion',
			},
			{
				title: formatMessage({ id: 'network.bandwidth.allocation' }),
				dataIndex: 'cpuPercent',
			},
			{
				title: formatMessage({ id: 'network.operation' }),
				render: () => {
					const { changeTabType } = this.props;
					return (
						<div>
							<>
								<a onClick={() => changeTabType({ type: 'qos', value: 'update' })}>
									{formatMessage({ id: 'btn.edit' })}
								</a>
								<Divider type="vertical" />
								<Popconfirm title={formatMessage({ id: 'network.sure.delete' })}>
									<a>{formatMessage({ id: 'btn.delete' })}</a>
								</Popconfirm>
							</>
						</div>
					);
				},
			},
		];
	}

	render() {
		const { changeTabType } = this.props;
		return (
			<div>
				<Table
					rowKey="id"
					columns={this.columns}
					dataSource={[{}]}
					onChange={this.onTableChange}
				/>
				<Button
					onClick={() => changeTabType({ type: 'qos', value: 'create' })}
					type="primary"
				>
					+新增配置
				</Button>
			</div>
		);
	}
}

export default QosConfig;
