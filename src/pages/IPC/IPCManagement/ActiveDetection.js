import React from 'react';
import moment from 'moment';
import { Card, Switch, Row, Col, Slider, Radio, TimePicker, Checkbox, Button, Form, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { FORM_ITEM_LAYOUT_MANAGEMENT, TAIL_FORM_ITEM_LAYOUT } from '@/constants/form';
// import { FORM_ITEM_LAYOUT } from './IPCManagement';
import styles from './ActiveDetection.less';

const RadioGroup = Radio.Group;

const mapStateToProps = (state) => {
	const { activeDetection } = state;
	return {
		activeDetection,
		// loading
	};
};
const mapDispatchToProps = (dispatch) => ({
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
	},
	checkBind: async (sn) => {
		const result = await dispatch({
			type: 'ipcList/checkBind',
			payload: {
				sn
			}
		});
		return result;
	},
	getDeviceInfo({ sn }) {
		return dispatch({
			type: 'ipcList/getDeviceInfo',
			payload: {
				sn
			}
		}).then(info => info);
	},
});

let btnDisabled = true;

@connect(mapStateToProps, mapDispatchToProps)
@Form.create({
	name: 'active-detection-form',
	onValuesChange() {
		btnDisabled = false;
	}
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
			hasFaceid: false,
		};
	}


	componentDidMount = async () => {
		const { loadSetting, sn, getDeviceInfo } = this.props;
		if(sn){
			loadSetting(sn);
			const { hasFaceid } = await getDeviceInfo({ sn });
			this.setState({
				hasFaceid
			});
		}

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
		if (activeDetection.isSaving === 'success') {
			btnDisabled = true;
			message.success(formatMessage({ id: 'ipcManagement.success'}));
		}else if (activeDetection.isSaving === 'failed') {
			btnDisabled = false;
			message.error(formatMessage({ id: 'ipcManagement.failed'}));
		}
	}

	handleSubmit = async (e) => {
		e.preventDefault();
		const { form } = this.props;
		const { getFieldValue } = form;
		if (getFieldValue('isAuto') === 2 && getFieldValue('days').length === 0) {
			this.setState({ daysError: true }); // days为空，显示提示项
		} else if (getFieldValue('startTime') === null || getFieldValue('endTime') === null) {
			// 开始或者结束的时间任一为空
		} else {

			const { saveSetting, sn, checkBind } = this.props;
			const values = form.getFieldsValue();
			const startTime = values.startTime.format('X') - moment('1970-01-01').format('X');
			const endTime = values.endTime.format('X') - moment('1970-01-01').format('X');
			const params = {
				...values,
				startTime,
				endTime
			};

			const isBind = await checkBind(sn);
			if(isBind) {
				saveSetting(sn, params);
			} else {
				message.warning(formatMessage({ id: 'ipcList.noSetting'}));
			}

			// btnDisabled = true;
		}
	};

	onTimeSelect = (time) => {
		let t = time;
		if(time) {
			const date = time.format('YYYY-MM-DD');
			// console.log(date);
			if(date !== '1970-01-01'){
				const deviation = time.format('X') - moment(date).format('X');
				t = moment('1970-01-01').add(deviation, 's');
			}
		}
		return t;
	}

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
		if (startTime && startTime.isAfter(endTime) || startTime && startTime.isSame(endTime)){
			return `HH:mm ${formatMessage({id: 'activeDetection.nextDay'})}`;
		}
		return 'HH:mm';
	}


	render() {
		const { form, activeDetection, isOnline  /* , loading */ } = this.props;

		const { getFieldDecorator, getFieldValue } = form;
		const { isSaving, isSound, isDynamic, sSensitivity, mSensitivity, isAuto, startTime, endTime, all, days, isCustomer, hasCustomer } = activeDetection;
		const { marks, daysError, hasFaceid } = this.state;



		return (
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
								<Switch disabled={!isOnline} />
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
									disabled={!isOnline}
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
								<Switch disabled={!isOnline} />
							)
						}
					</Form.Item>

					<Form.Item
						label={formatMessage({id: 'activeDetection.customerDetection' })}
						className={getFieldValue('isDynamic') && hasCustomer && hasFaceid ? '' : styles.hidden}
					>
						{
							getFieldDecorator('isCustomer', {
								valuePropName: 'checked',
								initialValue: isCustomer,
							})(
								<Checkbox disabled={!isOnline} />
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
									disabled={!isOnline || (hasCustomer && hasFaceid && getFieldValue('isCustomer'))}
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
								<RadioGroup onChange={this.onAutoChange} disabled={!isOnline}>
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
								<Checkbox disabled={getFieldValue('isAuto') !== 2 || !isOnline}>
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
								<Checkbox.Group className={styles['form-checkbox-group']} disabled={getFieldValue('isAuto') !== 2 || !isOnline}>
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
								getValueFromEvent: this.onTimeSelect,
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
									disabled={getFieldValue('isAuto') !== 2 || !isOnline}
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
								getValueFromEvent: this.onTimeSelect,
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
									disabled={getFieldValue('isAuto') !== 2 || !isOnline}
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
							// disabled={!form.isFieldsTouched(
							// 	[
							// 		'isSound',
							// 		'sSensitivity',
							// 		'isDynamic',
							// 		'mSensitivity',
							// 		'isAuto',
							// 		'startTime',
							// 		'endTime',
							// 		'all',
							// 		'days',
							// 	],
							// )}
							disabled={btnDisabled || !isOnline}
						>
							{formatMessage({id: 'activeDetection.save'})}
						</Button>
					</Form.Item>
				</Form>
			</Card>
		);
	}
}
export default ActiveDetection;