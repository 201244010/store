import React, { Component } from 'react';
import { Button, Divider, message, Modal, Table, Tag } from 'antd';
import { formatMessage } from 'umi/locale';
import { DURATION_TIME } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';
import { STATION_STATES } from '@/constants/mapping';
import BaseStationTag from './BaseStationTag';
import BaseStationDetail from './BaseStationDetail';
import BaseStationEdit from './BaseStationEdit';

class SearchResult extends Component {
	constructor(props) {
		super(props);
		this.state = {
			detailVisible: false,
			editVisible: false,
			selectedRecord: '',
		};
		this.columns = [
			{
				title: formatMessage({ id: 'esl.device.ap.sn' }),
				dataIndex: 'sn',
				render: (text, record) => (
					<div>
						<span style={{marginRight: 10}}>{text}</span>
						{
							parseInt(record.is_master, 10) === 1 ?
								<Tag>{formatMessage({ id: 'esl.device.ap.sn.master' })}</Tag> :
								null
						}
					</div>
				)
			},
			{
				title: formatMessage({ id: 'esl.device.ap.name' }),
				dataIndex: 'name',
			},
			// {
			// 	title: formatMessage({ id: 'esl.device.ap.esl_num' }),
			// 	dataIndex: 'esl_number',
			// },
			{
				title: formatMessage({ id: 'esl.device.ap.mac' }),
				dataIndex: 'mac',
			},
			{
				title: formatMessage({ id: 'esl.device.ap.ip' }),
				dataIndex: 'ip',
			},
			{
				title: formatMessage({ id: 'esl.device.ap.network.id' }),
				dataIndex: 'network_id',
			},
			{
				title: formatMessage({ id: 'esl.device.ap.status' }),
				dataIndex: 'status',
				render: (_, record) => <BaseStationTag record={record} template={STATION_STATES} />,
			},
			{
				title: formatMessage({ id: 'list.action.title' }),
				key: 'action',
				render: (_, record) => (
					<span>
						<a
							href="javascript: void (0);"
							onClick={() => this.showDetailVisible(record)}
						>
							{formatMessage({ id: 'list.action.detail' })}
						</a>
						{`${record.status}` === '1' && (
							<>
								<Divider type="vertical" />
								<a
									href="javascript: void (0);"
									onClick={() => this.showRestartStation(record)}
								>
									{formatMessage({ id: 'list.action.restart' })}
								</a>
							</>
						)}
						<Divider type="vertical" />
						<a
							href="javascript: void (0);"
							onClick={() => this.showEditVisible(record)}
						>
							{formatMessage({ id: 'list.action.edit' })}
						</a>
						<Divider type="vertical" />
						<a
							href="javascript: void (0);"
							onClick={() => this.showDeleteStation(record)}
						>
							{formatMessage({ id: 'list.action.delete' })}
						</a>
					</span>
				),
			},
		];
	}

	onTableChange = pagination => {
		const { fetchBaseStations } = this.props;

		fetchBaseStations({
			current: pagination.current,
			pageSize: pagination.pageSize,
		});
	};

	showDetailVisible = async record => {
		const { detailVisible } = this.state;
		const { getBaseStationDetail } = this.props;
		const response = await getBaseStationDetail({
			options: { ap_id: record.id },
		});
		if (response && response.code === ERROR_OK) {
			this.setState({
				detailVisible: !detailVisible,
			});
		} else {
			message.error(formatMessage({ id: 'error.retry' }), DURATION_TIME);
		}
	};

	showEditVisible = record => {
		const { editVisible } = this.state;
		this.setState({
			selectedRecord: record,
			editVisible: !editVisible,
		});
	};

	saveStationName = () => {
		const { selectedRecord } = this.state;
		if (selectedRecord.name.length > 20) {
			message.warning(formatMessage({ id: 'esl.device.ap.name.limit' }));
			return;
		}
		const { changeBaseStationName } = this.props;
		changeBaseStationName({
			options: {
				ap_id: selectedRecord.id,
				name: selectedRecord.name,
			},
		});
		this.closeModal('editVisible');
	};

	closeModal = name => {
		const { [name]: modalStatus } = this.state;
		this.setState({
			[name]: !modalStatus,
		});
	};

	showDeleteStation = record => {
		const { deleteBaseStation } = this.props;
		const content = (
			<div>
				<div>{formatMessage({ id: 'esl.device.ap.delete.message1' })}</div>
				<div>{formatMessage({ id: 'esl.device.ap.delete.message2' })}</div>
			</div>
		);

		Modal.confirm({
			icon: 'info-circle',
			title: formatMessage({ id: 'esl.device.ap.delete.notice' }),
			content,
			okText: formatMessage({ id: 'btn.delete' }),
			cancelText: formatMessage({ id: 'btn.cancel' }),
			onOk() {
				deleteBaseStation({
					options: { ap_id: record.id },
				});
			},
		});
	};

	showRestartStation = record => {
		const { restartBaseStation } = this.props;

		Modal.confirm({
			icon: 'info-circle',
			title: formatMessage({ id: 'esl.device.ap.restart.notice' }),
			okText: formatMessage({ id: 'btn.restart' }),
			cancelText: formatMessage({ id: 'btn.cancel' }),
			onOk() {
				restartBaseStation({
					options: { ap_id: record.id },
				});
			},
		});
	};

	onChangeName = name => {
		if (name && name.length > 20) {
			message.warning(formatMessage({ id: 'esl.device.ap.name.limit' }));
		}
		const { selectedRecord } = this.state;
		this.setState({
			selectedRecord: {
				...selectedRecord,
				name,
			},
		});
	};

	render() {
		const { loading, data, pagination, stationInfo } = this.props;
		const { detailVisible, editVisible, selectedRecord } = this.state;

		return (
			<div>
				<Table
					rowKey="id"
					loading={loading}
					columns={this.columns}
					dataSource={data}
					pagination={{
						...pagination,
						showTotal: total =>
							`${formatMessage({ id: 'esl.device.ap.all' })}${total}${formatMessage({
								id: 'esl.device.ap.total',
							})}`,
					}}
					onChange={this.onTableChange}
				/>
				<Modal
					title={formatMessage({ id: 'esl.device.ap.detail' })}
					visible={detailVisible}
					width={650}
					onCancel={() => this.closeModal('detailVisible')}
					footer={[
						<Button
							key="submit"
							type="primary"
							onClick={() => this.closeModal('detailVisible')}
						>
							{formatMessage({ id: 'btn.confirm' })}
						</Button>,
					]}
				>
					<BaseStationDetail {...{ stationInfo }} />
				</Modal>
				<Modal
					title={formatMessage({ id: 'esl.device.ap.edit' })}
					visible={editVisible}
					confirmLoading={loading}
					onOk={() => this.saveStationName('editVisible')}
					onCancel={() => this.closeModal('editVisible')}
					destroyOnClose
				>
					<BaseStationEdit record={selectedRecord} onChange={this.onChangeName} />
				</Modal>
			</div>
		);
	}
}

export default SearchResult;
