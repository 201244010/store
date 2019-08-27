import React from 'react';
import { Table, Form, Input, Row, Col, Switch, Button } from 'antd';
import { FORM_ITEM_LAYOUT_BUSINESS, FORM_ITEM_LAYOUT_INLINE } from '@/constants/form';
import { formatMessage } from 'umi/locale';
import styles from '../NetworkConfig.less';

@Form.create()
class QosCreate extends React.PureComponent {
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
			},
		];
	}

	validateBandWidth = (rule, value, callback) => {
		const number = /^\d+$/g;
		// console.log(value && !number.test(value), value, number.test(value));
		if (value && !number.test(value)) {
			callback('请输入数字');
		} else if (value && (value > 1000 || value < 1)) {
			callback('带宽范围在1-1000之间');
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
		// const sunmi = getFieldValue('sunmi');
		// const whitelist = getFieldValue('whitelist');
		// const normal = getFieldValue('normal');
		if (value && !number.test(value)) {
			callback('请输入数字');
		} else if (value && (value > 100 || value < 1)) {
			callback('数字范围1-100');
		} else if (sum > 100) {
			callback('和不超过100');
		} else {
			callback();
		}
	};

	render() {
		const {
			form: { getFieldDecorator },
			network: { qosInfo: { config: { qos: { enable } = {} } = {} } = {} },
			changeTabType,
		} = this.props;
		return (
			<div>
				<Form {...FORM_ITEM_LAYOUT_BUSINESS}>
					<Form.Item label={formatMessage({ id: 'network.ruleName' })}>
						<Row gutter={8}>
							<Col span={15}>
								{getFieldDecorator('ruleName', {
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
						{getFieldDecorator('switch', {
							valuePropName: 'checked',
							initialValue: enable,
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
								{getFieldDecorator('sunmi', {
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
								{getFieldDecorator('whitelist', {
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
								{getFieldDecorator('normal', {
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
				<Table
					rowKey="id"
					columns={this.columns}
					dataSource={[{}]}
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
						<Button type="primary" onClick={this.cancel}>
							{formatMessage({ id: 'network.apply' })}
						</Button>
					</Form.Item>
				</Form>
			</div>
		);
	}
}

export default QosCreate;
