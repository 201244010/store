import React, { PureComponent } from 'react';
import { Card, Pagination } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './Network.less';

const mockData = {
	errcode: '0',
	msg_id: '1',
	data: [
		{
			opcode: '0x2116',
			errcode: '0',
			result: {
				sonconnect: {
					devices: [
						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: '1',
						},

						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: 0,
						},

						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: 0,
						},

						{
							mac: '0C:25:76:35:D9:9D',
							routermac: '00:00:00:00:00:00',
							devid: 'W101D8BS00101',
							conn_mode: {
								wired: 0,
								w_2g: 0,
								w_5g: 0,
							},
							ip: '192.168.100.1',
							online: '1',
							location: 'W101D8BS00101',
							rssi: 0,
							role: 0,
						},
					],
				},
			},
		},
	],
};

class NetworkDetail extends PureComponent {
	render() {
		console.log(mockData);
		return (
			<Card title={formatMessage({ id: 'network.detail' })}>
				<div>1234</div>

				<div className={styles['footer-bar']}>
					<Pagination />
				</div>
			</Card>
		);
	}
}

export default NetworkDetail;
