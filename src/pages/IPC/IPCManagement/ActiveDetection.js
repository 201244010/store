import React from 'react';
import moment from 'moment';
import { Card, Switch, Row, Col, Slider, Radio, TimePicker, Checkbox, Button, Form, Spin, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { FORM_ITEM_LAYOUT_MANAGEMENT, TAIL_FORM_ITEM_LAYOUT } from '@/constants/form';
// import { FORM_ITEM_LAYOUT } from './IPCManagement';
import styles from './ActiveDetection.less';

const RadioGroup = Radio.Group;
// const LAYOUT = {
// 	labelCol: {
// 		xs: { span: 24 },
// 		sm: { span: 8 },
// 	},
// 	wrapperCol: {
// 		xs: { span: 24 },
// 		sm: { span: 16 },
// 	},
// };

const mapStateToProps = (state) => {
	const { activeDetection } = state;
	return {
		activeDetection,
		// loading
	};
};
const mapDispatchToProps = (dispatch) => ({
	// init: (sn) => {
	// 	dispatch({
	// 		type: 'activeDetection/init',
	// 		payload: {
	// 			sn
	// 		}
	// 	});
	// },
	loadSetting: (sn) => {
		dispatch({
			type: 'activeDetection/read',
			payload: {
				sn
			}
		});
	},
	saveSetting: (sn, setting) => {
		// console.log(setting);
		dispatch({
			type: 'activeDetection/update',
			payload: {
				sn,
				...setting
			}
		});
	}
});

// var temp = {};
@connect(mapStateToProps, mapDispatchToProps)
@Form.create({
	name: 'active-detection-form',
	// mapPropsToFields(props) {
	// 	const { activeDetection } = props;
	// 	return {
	// 		isSound: Form.createFormField({
	// 			value: activeDetection.isSound
	// 		}),
	// 		sSensitivity: Form.createFormField({
	// 			value: activeDetection.sSensitivity
	// 		}),
	// 		isDynamic: Form.createFormField({
	// 			value: props.activeDetection.isDynamic
	// 		}),
	// 		mSensitivity: Form.createFormField({
	// 			value: activeDetection.mSensitivity
	// 		}),
	// 		isAuto: Form.createFormField({
	// 			value: activeDetection.isAuto
	// 		}),
	// 		startTime: Form.createFormField({
	// 			// value: moment(props.activeDetection.startTime,'HH:mm')
	// 			value: moment('1970-01-01').add(activeDetection.startTime, 's')
	// 		}),
	// 		endTime: Form.createFormField({
	// 			// value: moment(props.activeDetection.endTime,'HH:mm')
	// 			value: moment('1970-01-01').add(activeDetection.endTime, 's')
	// 		}),
	// 		days: Form.createFormField({
	// 			value: activeDetection.days
	// 		}),
	// 		all: Form.createFormField({
	// 			value: activeDetection.all
	// 		}),
	// 	};
	// },
	// onFieldsChange(props, fields) {

	// },
	// onValuesChange(props, values, allValues) {
	// }
})
class ActiveDetection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// changes: false,
			marks: {
				0: formatMessage({ id: 'activeDetection.levelLow' }),
				50: formatMessage({ id: 'activeDetection.levelMiddle' }),
				100: formatMessage({ id: 'activeDetection.levelHigh' }),
			},
			daysError: false,
		};
	}


	componentDidMount = async () => {
		const { loadSetting, /* init, */ sn } = this.props;
		// if (!sn) {
		// 	message.error('sn号获取失败');
		// }
		// console.log(sn);
		// init(sn);
		loadSetting(sn);
	};

	componentWillReceiveProps(props) {
		const { form, activeDetection } = props;
		const { getFieldValue, setFieldsValue } = form;
		const { daysError } = this.state;

		if (getFieldValue('isAuto') === 1 && getFieldValue('startTime') === null) {
			setFieldsValue({ startTime: moment('1970-01-01').add(activeDetection.startTime, 's') });
		}
		if (getFieldValue('isAuto') === 1 && getFieldValue('endTime') === null) {
			setFieldsValue({ endTime: moment('1970-01-01').add(activeDetection.endTime, 's') });
		}
		if (getFieldValue('days').length !== 0 && daysError === true) {
			this.setState({ daysError: false });
		}
	}

	componentDidUpdate() {
		const { activeDetection } = this.props;

		if (activeDetection.isSaving === 'success') {
			message.success(formatMessage({ id: 'ipcManagement.success'}));
		}else if (activeDetection.isSaving === 'failed') {
			message.error(formatMessage({ id: 'ipcManagement.failed'}));
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();
		const { form } = this.props;
		const { getFieldValue } = form;
		if (getFieldValue('isAuto') === 2 && getFieldValue('days').length === 0) {
			this.setState({ daysError: true }); // days为空，显示提示项
		} else if (getFieldValue('startTime') === null || getFieldValue('endTime') === null) {
			// 开始或者结束的时间任一为空
		} else {

			const { saveSetting, sn } = this.props;
			const values = form.getFieldsValue();

			const startTime = values.startTime.format('X') - moment('1970-01-01').format('X');
			const endTime = values.endTime.format('X') - moment('1970-01-01').format('X');
			const params = {
				...values,
				startTime,
				endTime
			};
			// console.log('params', params);
			saveSetting(sn, params);
		}
	};

	onAutoChange = (e) => {
		const { form } = this.props;

		if (e.target.value === 2) {
			const startTime = moment('1970-01-01').add(75600, 's');
			const endTime = moment('1970-01-01').add(32400, 's');

			form.setFieldsValue({
				'all': true,
				'days': ['1', '2', '3', '4', '5', '6', '7'],
				'startTime': startTime,
				'endTime': endTime
			});
		}

		return e.target.value;
	};

	dayControl = (arr) => {
		const { form } = this.props;
		// console.log(arr);
		// let index = arr.indexOf('0');
		// if(index > -1){
		// 	arr = ['0','1','2','3','4','5','6','7'];
		// }
		// if(arr.length !== 8 ){
		// 	let index = arr.indexOf('0')
		// 	arr.splice(index,1);
		// }
		if (arr.length === 7) {
			form.setFieldsValue({
				'all': true
			});
		} else {
			form.setFieldsValue({
				'all': false
			});
		}
		return arr;
	};

	onSelectAll = (e) => {
		const { form } = this.props;
		// console.log(this.props.form.getFieldValue('day'));
		// console.log(e);
		if (e.target.checked) {
			form.setFieldsValue({
				'days': ['1', '2', '3', '4', '5', '6', '7']
			});
		} else {
			form.setFieldsValue({
				'days': []
			});
		}
		return e.target.checked;
	};

	isNextDay = () => {
		const { form } = this.props;
		const { getFieldValue } = form;
		const startTime = getFieldValue('startTime');
		const endTime = getFieldValue('endTime');
		// console.log(startTime, endTime);
		if (startTime.isAfter(endTime) || startTime.isSame(endTime)){
			return `HH:mm ${formatMessage({id: 'activeDetection.nextDay'})}`;
		}
		return 'HH:mm';
	}

	// soundDetectSwitchChange = () => {
	// 	const { form: { getFieldValue } } = this.props;
	// 	const isSound = getFieldValue('isSound');
	// 	const sSensitivity = getFieldValue('sSensitivity');

	// 	console.log(isSound, sSensitivity);

	// 	// if (isSound == false) {
	// 	// 	sSensitivity =
	// 	// }

	// }


	render() {
		// const { status } = this.props.activeDetection;  //undefined意义不明
		// if(status === 'error'){
		// 	this.resetChange();
		// }
		// console.log(this.props);
		const { form, activeDetection /* , loading */ } = this.props;

		const { getFieldDecorator, getFieldValue } = form;
		const { isReading, isSaving, isSound, isDynamic, sSensitivity, mSensitivity, isAuto, startTime, endTime, all, days } = activeDetection;
		const { marks, daysError } = this.state;
		// const spinning = readFlag || updateFlag;

		return (
			<Spin spinning={isReading || isSaving === 'saving'}>
				<Card bordered={false} title={formatMessage({id: 'activeDetection.title' })}>
					<Form {...FORM_ITEM_LAYOUT_MANAGEMENT} onSubmit={this.handleSubmit} hideRequiredMark className={styles['main-form']}>
						<Form.Item
							label={formatMessage({id: 'activeDetection.soundDetection'})}
						>
							{
								getFieldDecorator('isSound', {
									valuePropName: 'checked',
									initialValue: isSound,
								})(
									// <Switch
									// 	// onChange={this.soundDetectSwitchChange}
									// 	checkedChildren={formatMessage({id: 'activeDetection.label.open' })}
									// 	unCheckedChildren={formatMessage({id:'activeDetection.label.close'})}
									// />
									<Switch />
								)
							}
						</Form.Item>

						<Form.Item
							label={formatMessage({id: 'activeDetection.sensitivity'})}
							className={getFieldValue('isSound') ? '' : styles.hidden}
						>
							{
								getFieldDecorator('sSensitivity', {
									initialValue: sSensitivity
								})(
									<Slider
										marks={marks}
										className={styles['form-slider']}
										step={null}
										tooltipVisible={false}
									/>
								)
							}
						</Form.Item>

						<Form.Item label={formatMessage({id: 'activeDetection.motionDetection' })}>
							{
								getFieldDecorator('isDynamic', {
									valuePropName: 'checked',
									initialValue: isDynamic,
								})(
									// <Switch
									// 	checkedChildren={formatMessage({id: 'activeDetection.label.open'})}
									// 	unCheckedChildren={formatMessage({id: 'activeDetection.label.close' })}
									// />
									<Switch />
								)
							}
						</Form.Item>

						<Form.Item
							label={formatMessage({id: 'activeDetection.sensitivity'})}
							className={getFieldValue('isDynamic') ? '' : styles.hidden}
						>
							{
								getFieldDecorator('mSensitivity', {
									initialValue: mSensitivity
								})(
									<Slider
										marks={marks}
										className={styles['form-slider']}
										step={null}
										tooltipVisible={false}
									/>
								)
							}
						</Form.Item>

						<Form.Item label={formatMessage({id: 'activeDetection.timeDetection' })}>
							{
								getFieldDecorator('isAuto', {
									getValueFromEvent: this.onAutoChange,
									initialValue: isAuto
								})(
									<RadioGroup onChange={this.onAutoChange}>
										<Radio value={1}>
											{formatMessage({id: 'activeDetection.auto' })}
										</Radio>
										<Radio value={2}>
											{formatMessage({id: 'activeDetection.custom' })}
										</Radio>
									</RadioGroup>
								)
							}
						</Form.Item>
						<Form.Item label={formatMessage({id: 'activeDetection.days'})}>
							{
								getFieldDecorator('all', {
									initialValue: all,
									valuePropName: 'checked',
									getValueFromEvent: this.onSelectAll,
								})(
									<Checkbox disabled={getFieldValue('isAuto') !== 2}>
										{formatMessage({id: 'activeDetection.all' })}
									</Checkbox>
								)
							}
						</Form.Item>
						<Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
							{
								getFieldDecorator('days', {
									initialValue: days,
									getValueFromEvent: this.dayControl,
								})(
									<Checkbox.Group className={styles['form-checkbox-group']} disabled={getFieldValue('isAuto') !== 2}>
										<Row gutter={8}>
											<Col span={3}>
												<Checkbox value="1">
													{formatMessage({id: 'activeDetection.mon'})}
												</Checkbox>
											</Col>
											<Col span={3}>
												<Checkbox value="2">
													{formatMessage({id: 'activeDetection.tue' })}
												</Checkbox>
											</Col>
											<Col span={3}>
												<Checkbox value="3">
													{formatMessage({id: 'activeDetection.wed' })}
												</Checkbox>
											</Col>
											<Col span={3}>
												<Checkbox value="4">
													{formatMessage({id: 'activeDetection.thu'})}
												</Checkbox>
											</Col>
											<Col span={3}>
												<Checkbox value="5">
													{formatMessage({id: 'activeDetection.fri' })}
												</Checkbox>
											</Col>
											<Col span={3}>
												<Checkbox value="6">
													{formatMessage({id: 'activeDetection.sat'})}
												</Checkbox>
											</Col>
											<Col span={3}>
												<Checkbox value="7">
													{formatMessage({id: 'activeDetection.sun'})}
												</Checkbox>
											</Col>
										</Row>
									</Checkbox.Group>
								)
							}
							{
								getFieldValue('days').length === 0 && getFieldValue('isAuto') === 2 && daysError ?
									// <p onClick={() => {
									// 	const { isFieldsTouched } = form;
									// 	const a = isFieldsTouched(["isSound"]);
									// 	// console.log(a);
									// }}>
									<p>
										{formatMessage({id: 'activeDetection.daysRule'})}
									</p> : ''
							}
						</Form.Item>
						<Form.Item label={formatMessage({id: 'activeDetection.open'})}>
							{
								getFieldDecorator('startTime', {
									// initialValue: moment('1970-01-01').add(0, 's'),
									initialValue: moment('1970-01-01').add(startTime, 's'),
									rules: [
										{
											required: true,
											message: formatMessage({
												id: 'activeDetection.startTimeMsg',
											}),
										},
									],
								})(
									<TimePicker
										disabled={getFieldValue('isAuto') !== 2}
										format="HH:mm"
										allowClear={getFieldValue('isAuto') === 2}
									/>
								)
							}
						</Form.Item>
						<Form.Item label={formatMessage({id: 'activeDetection.close'})}>
							{
								getFieldDecorator('endTime', {
									// initialValue: moment('1970-01-01').add(0, 's'),
									initialValue: moment('1970-01-01').add(endTime, 's'),
									rules: [
										{
											required: true,
											message: formatMessage({
												id: 'activeDetection.endTimeMsg',
											}),
										},
									],
								})(
									<TimePicker
										disabled={getFieldValue('isAuto') !== 2}
										format={this.isNextDay()}
										allowClear={getFieldValue('isAuto') === 2}
									/>
								)
							}
						</Form.Item>
						<Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
							{activeDetection.status ? '' : ''}
							<Button
								type="primary"
								htmlType="submit"
								loading={isSaving === 'saving'}
								disabled={!form.isFieldsTouched(
									[
										'isSound',
										'sSensitivity',
										'isDynamic',
										'mSensitivity',
										'isAuto',
										'startTime',
										'endTime',
										'all',
										'days',
									],
								)}
							>
								{formatMessage({id: 'activeDetection.save'})}
							</Button>
						</Form.Item>
					</Form>
				</Card>
			</Spin>
		);
	}
}
export default ActiveDetection;