import React, { Component } from 'react';
import { Card, Form, Select, InputNumber, Button } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { FORM_FORMAT, HEAD_FORM_ITEM_LAYOUT_MIDDLE, BUTTON_FORM_ITEM_LAYOUT } from '@/constants/form';

@connect(
	state => ({
		eslElectricLabel: state.eslElectricLabel,
	}),
	dispatch => ({
		fetchFlashModes: payload => dispatch({ type: 'eslElectricLabel/fetchFlashModes', payload }),
		updateFlashLedConfig: payload => dispatch({ type: 'eslElectricLabel/updateFlashLedConfig', payload }),
	})
)
@Form.create()
class LedConfig extends Component {
	constructor(props) {
		super(props);

		this.flashColors = [{
			value: 1,
			color: formatMessage({id: 'esl.device.led.flash.color.white'})
		}, {
			value: 2,
			color: formatMessage({id: 'esl.device.led.flash.color.blue'})
		}, {
			value: 4,
			color: formatMessage({id: 'esl.device.led.flash.color.green'})
		}, {
			value: 8,
			color: formatMessage({id: 'esl.device.led.flash.color.red'})
		}, {
			value: 512,
			color: formatMessage({id: 'esl.device.led.flash.color.cyan'})
		}, {
			value: 1024,
			color: formatMessage({id: 'esl.device.led.flash.color.purple'})
		}, {
			value: 2048,
			color: formatMessage({id: 'esl.device.led.flash.color.yellow'})
		}];
		this.frequency = [{
			value: 50,
			text: formatMessage({id: 'esl.device.led.flash.frequency.quick'})
		}, {
			value: 100,
			text: formatMessage({id: 'esl.device.led.flash.frequency.middle'})
		}, {
			value: 200,
			text: formatMessage({id: 'esl.device.led.flash.frequency.slow'})
		}];
	}

	componentDidMount() {
		const { fetchFlashModes } = this.props;

		fetchFlashModes();
	}

	handleSave = () => {
		const { form: {validateFields}, eslElectricLabel: {flashModes}, updateFlashLedConfig } = this.props;

		validateFields((err, values) => {
			if (!err) {
				updateFlashLedConfig({
					options: {
						id: flashModes[0].id,
						...values
					}
				});
			}
		});
	};

	render() {
		const {form: {getFieldDecorator}, eslElectricLabel: {loading, flashModes}} = this.props;
		const flashMode = flashModes[0] || {};

		return (
			<Card
				title={formatMessage({id: 'esl.device.led.default.title'})}
				bordered={false}
				style={{ width: '100%' }}
			>
				<Form
					{...{
						...FORM_FORMAT,
						...HEAD_FORM_ITEM_LAYOUT_MIDDLE,
					}}
				>
					<Form.Item label={formatMessage({id: 'esl.device.led.color'})}>
						{getFieldDecorator('channel', {
							rules: [
								{
									required: true,
									message: formatMessage({id: 'esl.device.led.color.placeholder'}),
								},
							],
							initialValue: flashMode.channel
						})(
							<Select placeholder={formatMessage({id: 'esl.device.led.color.placeholder'})}>
								{
									this.flashColors.map(color => <Select.Option value={color.value} key={color.value}>{color.color}</Select.Option>)
								}
							</Select>
						)}
					</Form.Item>
					<Form.Item label={formatMessage({id: 'esl.device.led.frequency'})}>
						{getFieldDecorator('cycle', {
							rules: [
								{
									required: true,
									message: formatMessage({id: 'esl.device.led.frequency.placeholder'}),
								},
							],
							initialValue: flashMode.cycle
						})(
							<Select placeholder={formatMessage({id: 'esl.device.led.frequency.placeholder'})}>
								{
									this.frequency.map(item => <Select.Option value={item.value} key={item.value}>{item.text}</Select.Option>)
								}
							</Select>
						)}
					</Form.Item>
					<Form.Item label={formatMessage({id: 'esl.device.led.loop.time'})}>
						{getFieldDecorator('duration', {
							rules: [
								{
									required: true,
									message: formatMessage({id: 'esl.device.led.loop.time.placeholder'}),
								},
							],
							initialValue: flashMode.duration
						})(
							<InputNumber
								placeholder={formatMessage({id: 'esl.device.led.loop.time.placeholder'})}
								style={{width: '100%'}}
								min={1}
								max={99}
							/>
						)}
					</Form.Item>
					<Form.Item {...BUTTON_FORM_ITEM_LAYOUT}>
						<Button type="primary" loading={loading} onClick={this.handleSave}>{formatMessage({id: 'btn.save'})}</Button>
					</Form.Item>
				</Form>
			</Card>
		);
	}
}

export default LedConfig;
