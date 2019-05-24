import React, { Component } from 'react';
import { Divider, Table, Switch } from 'antd';
import { formatMessage } from 'umi/locale';
import FirmwareUploadModal from './FirmwareUploadModal';
import { ERROR_OK, ERR_FIRMWARE_VERSION_LOWER, ERR_FIRMWARE_EXIST } from '@/constants/errorCode';
import router from 'umi/router';
import { MENU_PREFIX } from '@/constants';

class SearchResult extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentRecord: {},
			firmwareUploadVisible: false,
			uploadStatus: 'init',
		};
	}

	toPath = record => {
		const { type } = this.props;
		router.push(
			`${MENU_PREFIX.DEVICE_UPGRADE}/device${type}?model=${record.model}&version=${
				record.bin_version
			}&groupId=${record.id}&upgraded=${record.upgraded_num}`
		);
	};

	autoUpdateChange = (checked, record) => {
		const { updateAutoUpgradeStatus } = this.props;
		updateAutoUpgradeStatus({
			group_id: record.id,
			is_auto_upgrade: checked ? 1 : 0,
		});
	};

	showFirmwareUploadModal = record => {
		this.setState({
			currentRecord: record,
			firmwareUploadVisible: true,
			uploadStatus: 'init',
		});
	};

	confirmUpload = async values => {
		const { firmwareUpload } = this.props;
		const { currentRecord } = this.state;
		this.uploadStatus('uploading');
		const response = await firmwareUpload({
			group_id: currentRecord.id,
			bin_version: values.version,
			file: values.firmware.file,
		});

		if (response && response.code === ERROR_OK) {
			this.uploadStatus('success');
		} else if (response.code === ERR_FIRMWARE_VERSION_LOWER) {
			this.uploadStatus('versionLower');
		} else if (response.code === ERR_FIRMWARE_EXIST) {
			this.uploadStatus('versionExist');
		} else {
			this.uploadStatus('commonError');
		}
	};

	cancelUpload = () => {
		this.setState({
			firmwareUploadVisible: false,
		});
	};

	uploadStatus = (status, visible = true) => {
		this.setState({
			uploadStatus: status,
			firmwareUploadVisible: visible,
		});
	};

	render() {
		const { data, loading, type } = this.props;
		const { firmwareUploadVisible, currentRecord, uploadStatus } = this.state;
		const columns = [
			{
				title: formatMessage({ id: 'esl.device.upgrade.model.group' }),
				dataIndex: 'model',
				key: 'model',
			},
			{
				title: formatMessage({ id: 'esl.device.upgrade.version.last' }),
				dataIndex: 'bin_version',
				key: 'bin_version',
			},
			{
				title: formatMessage({ id: 'esl.device.upgrade.updated.total' }),
				dataIndex: 'upgraded-total',
				key: 'upgraded-total',
				render: (_, record) => (
					<span>
						<span>
							{record.upgraded_num}/{record.total_num}
						</span>
					</span>
				),
			},
			{
				title: formatMessage({ id: 'esl.device.upgrade.auto.upgrade' }),
				dataIndex: 'is_auto_upgrade',
				key: 'is_auto_upgrade',
				render: (text, record) => (
					<Switch
						defaultChecked={!!text}
						onChange={checked => this.autoUpdateChange(checked, record)}
					/>
				),
			},
			{
				title: formatMessage({ id: 'list.action.title' }),
				key: 'action',
				render: (_, record) => (
					<span>
						<a href="javascript: void (0);" onClick={() => this.toPath(record)}>
							{formatMessage({ id: 'list.action.detail' })}
						</a>
						<Divider type="vertical" />
						<a
							href="javascript: void (0);"
							onClick={() => this.showFirmwareUploadModal(record)}
						>
							{formatMessage({ id: 'list.action.upload.firmware' })}
						</a>
					</span>
				),
			},
		];
		return (
			<div>
				<Table
					rowKey="id"
					columns={columns}
					dataSource={data}
					loading={loading}
					pagination={{
						pageSize: 999,
						hideOnSinglePage: true,
					}}
				/>
				<FirmwareUploadModal
					{...{
						type,
						status: uploadStatus,
						data: currentRecord,
						visible: firmwareUploadVisible,
						onCancel: this.cancelUpload,
						onOk: this.confirmUpload,
						uploadStatus: this.uploadStatus,
					}}
				/>
			</div>
		);
	}
}

export default SearchResult;
