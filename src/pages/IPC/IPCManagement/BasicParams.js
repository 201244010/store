import React, { Component } from 'react';
import { Card, Radio, Switch, Button,Form, Spin, message } from 'antd';

import { formatMessage } from 'umi/locale';
import { connect } from 'dva';

import { FORM_ITEM_LAYOUT, TAIL_FORM_ITEM_LAYOUT } from '@/constants/form';

import styles from './BasicParams.less';

const RadioGroup = Radio.Group;

// const isChange = {
// 	nightMode:false,
// 	indicator:false,
// 	rotation:false
// };

// let temp = {};
const mapStateToProps = (state) => {
	const { ipcBasicParams } = state;
	return {
		ipcBasicParams
	};
};

const mapDispatchToProps = (dispatch) => ({
	loadSetting: (sn) => {
		dispatch({
			type: 'ipcBasicParams/read',
			payload: {
				sn
			}
		});
	},
	getDeviceInfo({ sn }) {
		return dispatch({
			type: 'ipcList/getDeviceInfo',
			payload: {
				sn
			}
		}).then(info => info);
	},
	saveSetting: ({ nightMode, indicator, rotation, sn }) => {
		dispatch({
			type: 'ipcBasicParams/update',
			payload: {
				sn,
				nightMode,
				indicator,
				rotation
			}
		});
	}
});

@connect(mapStateToProps, mapDispatchToProps)
@Form.create({
	name:'basic-params-form',
	// mapPropsToFields(props) {
	// 	return {
	// 		nightMode: Form.createFormField({
	// 			value: props.ipcBasicParams.nightMode
	// 		}),
	// 		indicator: Form.createFormField({
	// 			value: props.ipcBasicParams.indicator
	// 		}),
	// 		rotation: Form.createFormField({
	// 			value: props.ipcBasicParams.rotation
	// 		})
	// 	};
	// },
	// onValuesChange(props,values){
	// 	// console.log(values);
	// 	Object.keys(values).forEach(item => {
	// 		const key = item;
	// 		if (values[key] !== props.ipcBasicParams[key]) {
	// 			isChange[key] = true;
	// 		} else {
	// 			isChange[key] = false;
	// 		}
	// 	});
	// }
})
class BasicParams extends Component {

	constructor(props) {
		super(props);
		this.state = {
			deviceInfo: {
				rotate: []
			}
		};
	}

	componentDidMount = async () => {


		const { loadSetting, sn, getDeviceInfo } = this.props;

		if(sn) {
			const deviceInfo = await getDeviceInfo({ sn });
			this.setState({
				deviceInfo
			});
			loadSetting(sn);
		}

	}

	// componentWillReceiveProps = (props) => {
	// 	const { ipcBasicParams: ipcBasicParamsNew } = props;
	// 	const { ipcBasicParams: ipcBasicParamsOld } = this.props;

	// 	if (ipcBasicParamsOld.isSaving === 'saving'){
	// 		if (ipcBasicParamsNew.isSaving === 'suceess') {

	// 		} else if (ipcBasicParamsNew.isSaving === 'failed'){

	// 		}
	// 	}
	// }

	componentDidUpdate () {
		const { ipcBasicParams } = this.props;

		if (ipcBasicParams.isSaving === 'success') {
			message.success(formatMessage({ id: 'ipcManagement.success'}));
		}else if (ipcBasicParams.isSaving === 'failed') {
			message.error(formatMessage({ id: 'ipcManagement.failed'}));
		}
	}

	submit = () => {
		const { form, sn } = this.props;
		const values = form.getFieldsValue();
		const { saveSetting } = this.props;

		const { nightMode, indicator, rotation } = values;

		saveSetting({
			nightMode, indicator, rotation, sn
		});
		// temp = values;

		// const list = Object.keys(isChange);
		// list.forEach(name => {
		// 	isChange[name] = false;
		// });
	}

	// resetChange = () => {
	// 	const { basicParams: values } = this.props;

	// 	const list = Object.keys(temp);
	// 	list.forEach((name, i) => {
	// 		if(temp[i] !== values[i]){
	// 			isChange[i] = true;
	// 		}
	// 	});
	// }
	// onAutoChange = (e) => {
	// 	// console.log(e, e.target, value);
	// 	return e.target.value;
	// }

	render() {
		const { form, ipcBasicParams } = this.props;
		const { isReading, isSaving, nightMode, rotation, indicator } = ipcBasicParams;
		const { deviceInfo: { rotate }} = this.state;
		// const { status } = basicParams;
		// if( status === 'error'){
		//  	this.resetChange();
		// }

		// let changes = false;
		// Object.keys(isChange).forEach(item => {
		// 	changes = changes || isChange[item];
		// });
		// console.log(rotation);
		const { getFieldDecorator } = form;
		return (
			<Spin spinning={isReading || isSaving === 'saving'}>
				<Card bordered={false} className={styles.card} title={formatMessage({id: 'basicParams.title'})}>
					<Form {...FORM_ITEM_LAYOUT}>
						<Form.Item label={formatMessage({id: 'basicParams.nightMode'})}>
							{
								getFieldDecorator('nightMode',{
									initialValue: nightMode
								})(
									<RadioGroup>
										<Radio value={2}>
											{ formatMessage({id: 'basicParams.autoSwitch'}) }
										</Radio>
										<Radio value={1}>
											{ formatMessage({id: 'basicParams.open'}) }
										</Radio>
										<Radio value={0}>
											{ formatMessage({id: 'basicParams.close'}) }
										</Radio>
									</RadioGroup>
								)
							}
						</Form.Item>

						<Form.Item label={formatMessage({id: 'basicParams.rotation'})}>
							{
								getFieldDecorator('rotation',{
									initialValue: rotation
								})(
									// <Switch
									// 	checkedChildren={formatMessage({id: 'basicParams.label.open'})}
									// 	unCheckedChildren={formatMessage({id: 'basicParams.label.close'})}
									// />
									// <Switch />

									<RadioGroup>
										{
											rotate && rotate.map(item =>
												<Radio key={item.key} value={item.key}>{item.value}{ formatMessage({id: 'basicParams.degree'})}</Radio>
											)
										}
										{/* <Radio value={0}>0{ formatMessage({id: 'basicParams.degree'})}</Radio>
										<Radio value={1}>90{ formatMessage({id: 'basicParams.degree'})}</Radio>
										<Radio value={2}>180{ formatMessage({id: 'basicParams.degree'})}</Radio>
										<Radio value={3}>270{ formatMessage({id: 'basicParams.degree'})}</Radio> */}
									</RadioGroup>
								)
							}
						</Form.Item>

						<Form.Item label={formatMessage({id: 'basicParams.statusIndicator'})}>
							{
								getFieldDecorator('indicator',{
									valuePropName: 'checked',
									initialValue: indicator
								})(
									// <Switch
									// 	checkedChildren={formatMessage({id: 'basicParams.label.open'})}
									// 	unCheckedChildren={formatMessage({id: 'basicParams.label.close'})}
									// />
									<Switch />
								)

							}
						</Form.Item>



						<Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
							<Button
								type='primary'
								htmlType='submit'
								disabled={!form.isFieldsTouched(['nightMode','indicator','rotation'])}

								onClick={this.submit}

								loading={isSaving === 'saving'}
							>
								{formatMessage({id: 'basicParams.save'})}
							</Button>
						</Form.Item>
					</Form>
				</Card>
			</Spin>
		);
	}
};
export default BasicParams;
