import React, { Component } from 'react';
import { Button, Divider, message, Modal, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import BaseStationTag from './BaseStationTag';
import BaseStationDetail from './BaseStationDetail';
import BaseStationEdit from './BaseStationEdit';
import { DURATION_TIME } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';
import { STATION_STATES } from '@/constants/mapping';

class SearchResult extends Component {
	constructor(props) {
		super(props);
		this.state = {
			detailVisible: false,
			editVisible: false,
			selectedRecord: '',
		};
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

	render() {
		const { loading, data, pagination, stationInfo } = this.props;
		const { detailVisible, editVisible, selectedRecord } = this.state;

		const columns = [
			{
				title: formatMessage({ id: 'esl.device.ap.sn' }),
				dataIndex: 'sn',
			},
			{
				title: formatMessage({ id: 'esl.device.ap.name' }),
				dataIndex: 'name',
			},
			{
				title: formatMessage({ id: 'esl.device.ap.esl_num' }),
				dataIndex: 'esl_number',
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
							onClick={() => this.showDeleteStation(record)}
						>
							{formatMessage({ id: 'list.action.delete' })}
						</a>
					</span>
				),
			},
		];

		return (
			<div>
				<Table
					rowKey="id"
					loading={loading}
					columns={columns}
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
					onOk={() => this.closeModal('editVisible')}
					onCancel={() => this.closeModal('editVisible')}
					destroyOnClose
				>
					<BaseStationEdit record={selectedRecord} />
				</Modal>
			</div>
		);
	}
}

export default SearchResult;
