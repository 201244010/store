import React from 'react';
import { Table, Form, Input, Row, Col, Switch, Button, message } from 'antd';
import { FORM_ITEM_LAYOUT_BUSINESS, FORM_ITEM_LAYOUT_INLINE } from '@/constants/form';
// import { ERROR_OK } from '@/constants/errorCode';
import { OPCODE } from '@/constants/mqttStore';
import { format } from '@konata9/milk-shake';
import { formatMessage } from 'umi/locale';
import styles from '../NetworkConfig.less';

@Form.create()
class QosCreate extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			selectedRowKeys: [],
		};
		this.checkTimer = null;
		this.columns = [
			{
				title: formatMessage({ id: 'network.deviceName' }),
				dataIndex: 'networkAlias',
				render: (_, record) => record.networkAlias || record.networkId,
			},
			{
				title: formatMessage({ id: 'network.belongNetwork' }),
				dataIndex: 'networkId',
			},
			{
				title: formatMessage({ id: 'network.onlineStatus' }),
				dataIndex: 'activeStatus',
				render: record =>
					parseInt(record, 10)
						? formatMessage({ id: 'network.online' })
						: formatMessage({ id: 'network.offline' }),
			},
			{
				title: formatMessage({ id: 'network.currentVersion' }),
				dataIndex: 'binVersion',
			},
		];
	}

	componentDidMount() {
		const { getListWithStatus } = this.props;
		getListWithStatus();
	}

	componentWillUnmount() {
		const { changeTabType } = this.props;
		changeTabType({ type: 'qos', value: 'init' });
	}

	validateBandWidth = (rule, value, callback) => {
		const number = /^\d+$/g;
		if (value && !number.test(value)) {
			callback(formatMessage({ id: 'network.qos.bandwidth.number' }));
		} else if (value && (value > 1000 || value < 1)) {
			callback(formatMessage({ id: 'network.qos.bandwidth.scape' }));
		} else {
			callback();
		}
	};

	validateBandRadio = (rule, value, callback) => {
		const {
			form: { getFieldValue },
		} = this.props;
		const number = /^\d+$/g;
		const sum =
			parseInt(getFieldValue('sunmi'), 10) +
			parseInt(getFieldValue('whitelist'), 10) +
			parseInt(getFieldValue('normal'), 10);
		if (value && !number.test(value)) {
			callback(formatMessage({ id: 'network.qos.bandwidth.number' }));
		} else if (value && (value > 100 || value < 1)) {
			callback(formatMessage({ id: 'network.qos.bandradio.scape' }));
		} else if (sum > 100) {
			callback(formatMessage({ id: 'network.qos.noEmpty.bandSum' }));
		} else {
			callback();
		}
	};

	checkMQTTClient = async () => {
		clearTimeout(this.checkTimer);
		const { checkClientExist, setAPHandler, generateTopic, subscribe } = this.props;
		const isClientExist = await checkClientExist();
		console.log(isClientExist);

		if (isClientExist) {
			const apInfoTopic = await generateTopic({ service: 'W1/response', action: 'sub' });
			await subscribe({ topic: [apInfoTopic] });
			await setAPHandler({ handler: this.apHandler });
		} else {
			this.checkTimer = setTimeout(() => this.checkMQTTClient(), 1000);
		}
	};

	apHandler = async payload => {
		const { clearMsg, getQosList } = this.props;
		const { msgId, opcode, errcode } = payload;
		if (opcode === '0x2022' && errcode === 0) {
			message.success(formatMessage({id: 'network.qos.setSuccess'}));
			await getQosList();
		}

		if (opcode === '0x2022' && errcode !== 0) {
			message.error(formatMessage({id: 'network.qos.setFail'}));
		}
		await clearMsg({ msgId });
	};

	submitConfig = async id => {
		const {
			form: { validateFields },
			createQos,
			updateQos,
			network: {
				tabType: { qos: qosType },
				deviceList: { networkDeviceList },
			},
			getQosList,
			getAPMessage,
		} = this.props;
		const { selectedRowKeys } = this.state;
		await this.checkMQTTClient();
		validateFields(async (err, values) => {
			if (!err) {
				const {
					ruleName,
					upBandwidth,
					downBandwidth,
					enable,
					sunmiWeight,
					whiteWeight,
					normalWeight,
				} = values;
				const qos = {
					enable,
					source: 'manual',
					operator: 'user',
					upBandwidth: `${upBandwidth * 1024}`,
					downBandwidth: `${downBandwidth * 1024}`,
					sunmiWeight,
					whiteWeight,
					normalWeight,
				};
				const payload = {
					name: ruleName,
					config: {
						qos,
					},
					configId: id,
				};
				qosType === 'create' && (await createQos(payload));
				qosType === 'update' && (await updateQos(payload));
				selectedRowKeys.forEach(async keyId => {
					const { networkId, sn } =
						networkDeviceList.filter(item => item.id === keyId)[0] || {};
					await getAPMessage({
						message: {
							opcode: OPCODE.QOS_SET,
							param: {
								network_id: networkId,
								sn,
								qos: format('toSnake')({ ...qos }),
							},
						},
					});
				});
				selectedRowKeys.length === 0 && await getQosList();
			}
		});
	};

	onSelectChange = selectedRowKeys => {
		console.log('selectedRowKeys changed: ', selectedRowKeys);
		this.setState({ selectedRowKeys });
	};

	render() {
		const {
			form: { getFieldDecorator },
			network: {
				qosInfo: {
					config: {
						qos: {
							enable,
							upBandwidth,
							downBandwidth,
							sunmiWeight,
							whiteWeight,
							normalWeight,
						} = {},
					} = {},
					name,
					id,
				} = {},
				deviceList: { networkDeviceList },
			},
			changeTabType,
		} = this.props;
		const rowSelection = {
			onChange: this.onSelectChange,
			getCheckboxProps: record => ({
				disabled: record.activeStatus === 0,
			}),
		};
		return (
			<div>
				<Form {...FORM_ITEM_LAYOUT_BUSINESS}>
					<Form.Item label={formatMessage({ id: 'network.ruleName' })}>
						<Row gutter={8}>
							<Col span={15}>
								{getFieldDecorator('ruleName', {
									initialValue: name,
									rules: [
										{
											required: true,
											message: formatMessage({
												id: 'network.qos.noEmpty.ruleName',
											}),
										},
									],
								})(<Input maxLength={30} />)}
							</Col>
							<Col span={9} />
						</Row>
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'network.qos.upBandwidth' })}>
						<Row gutter={8}>
							<Col span={15}>
								{getFieldDecorator('upBandwidth', {
									initialValue: upBandwidth && parseInt(upBandwidth / 1024, 10),
									rules: [
										{
											required: true,
											message: formatMessage({
												id: 'network.qos.noEmpty.upBandwidth',
											}),
										},
										{
											validator: this.validateBandWidth,
										},
									],
								})(<Input maxLength={30} />)}
							</Col>
							<Col span={9}>Mbps</Col>
						</Row>
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'network.qos.downBandwidth' })}>
						<Row gutter={8}>
							<Col span={15}>
								{getFieldDecorator('downBandwidth', {
									initialValue:
										downBandwidth && parseInt(downBandwidth / 1024, 10),
									rules: [
										{
											required: true,
											message: formatMessage({
												id: 'network.qos.noEmpty.downBandwidth',
											}),
										},
										{
											validator: this.validateBandWidth,
										},
									],
								})(<Input maxLength={30} />)}
							</Col>
							<Col span={9}>Mbps</Col>
						</Row>
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'network.qos.QoS' })}>
						{getFieldDecorator('enable', {
							valuePropName: 'checked',
							initialValue: enable || false,
						})(
							<Switch
								checkedChildren={formatMessage({ id: 'network.switchOn' })}
								unCheckedChildren={formatMessage({ id: 'network.switchOff' })}
							/>
						)}
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'network.bandwidth.allocation' })} />
				</Form>
				<Form {...FORM_ITEM_LAYOUT_INLINE} layout="inline">
					<Form.Item label={formatMessage({ id: 'network.qos.sunmi' })}>
						<Row gutter={8}>
							<Col span={15}>
								{getFieldDecorator('sunmiWeight', {
									initialValue: sunmiWeight,
									rules: [
										{
											required: true,
											message: formatMessage({
												id: 'network.qos.noEmpty.bandRadio',
											}),
										},
										{ validator: this.validateBandRadio },
									],
								})(<Input maxLength={3} />)}
							</Col>
							<Col span={9}>%</Col>
						</Row>
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'network.qos.whitelist' })}>
						<Row gutter={8}>
							<Col span={15}>
								{getFieldDecorator('whiteWeight', {
									initialValue: whiteWeight,
									rules: [
										{
											required: true,
											message: formatMessage({
												id: 'network.qos.noEmpty.bandRadio',
											}),
										},
										{ validator: this.validateBandRadio },
									],
								})(<Input maxLength={3} />)}
							</Col>
							<Col span={9}>%</Col>
						</Row>
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'network.qos.normal' })}>
						<Row gutter={8}>
							<Col span={15}>
								{getFieldDecorator('normalWeight', {
									initialValue: normalWeight,
									rules: [
										{
											required: true,
											message: formatMessage({
												id: 'network.qos.noEmpty.bandRadio',
											}),
										},
										{ validator: this.validateBandRadio },
									],
								})(<Input maxLength={3} />)}
							</Col>
							<Col span={9}>%</Col>
						</Row>
					</Form.Item>
				</Form>
				<div className={styles['qos-title']}>
					{formatMessage({ id: 'network.wirelessConfig.title' })}
				</div>
				<Table
					className={styles['qos-table']}
					rowKey="id"
					rowSelection={rowSelection}
					columns={this.columns}
					dataSource={networkDeviceList.filter(item => item.isMaster)}
					onChange={this.onTableChange}
				/>
				<Form {...FORM_ITEM_LAYOUT_BUSINESS}>
					<Form.Item label=" " colon={false}>
						<Button
							onClick={() => changeTabType({ type: 'qos', value: 'init' })}
							className={styles['network-operation']}
						>
							{formatMessage({ id: 'network.return' })}
						</Button>
						<Button type="primary" onClick={() => this.submitConfig(id)}>
							{formatMessage({ id: 'network.apply' })}
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

export default QosCreate;
