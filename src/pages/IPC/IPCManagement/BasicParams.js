import React, { Component } from 'react';
import { Card, Radio, Switch, Button,Form, message } from 'antd';

import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { FORM_ITEM_LAYOUT_MANAGEMENT, TAIL_FORM_ITEM_LAYOUT } from '@/constants/form';
// import {  FORM_ITEM_LAYOUT , TAIL_FORM_ITEM_LAYOUT } from './IPCManagement';
import styles from './BasicParams.less';

const RadioGroup = Radio.Group;



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
	saveSetting: ({ nightMode, indicator, rotation, sn, WDRMode }) => {
		dispatch({
			type: 'ipcBasicParams/update',
			payload: {
				sn,
				nightMode,
				indicator,
				rotation,
				WDRMode
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
	}
});

let btnDisabled = true;

@connect(mapStateToProps, mapDispatchToProps)
@Form.create({
	name:'basic-params-form',
	onValuesChange(){
		btnDisabled = false;
	}
})
class BasicParams extends Component {

	constructor(props) {
		super(props);
		this.state = {
			deviceInfo: {
				rotate: [{
					key: 0,
					value: 0
				},{
					key: 1,
					value: 180
				}]
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

	componentWillReceiveProps = (props) => {

		const { ipcBasicParams } = props;

		if (ipcBasicParams.isSaving === 'success') {
			btnDisabled = true;
			message.success(formatMessage({ id: 'ipcManagement.success'}));
		}else if (ipcBasicParams.isSaving === 'failed') {
			btnDisabled = false;
			message.error(formatMessage({ id: 'ipcManagement.failed'}));
		}
	}

	submit = async () => {
		const { form, sn, checkBind } = this.props;
		const values = form.getFieldsValue();
		const { saveSetting } = this.props;

		const { nightMode, indicator, rotation, WDRMode } = values;

		const isBind = await checkBind(sn);
		if(isBind) {
			saveSetting({
				nightMode, indicator, rotation, sn, WDRMode
			});
		} else {
			message.warning(formatMessage({ id: 'ipcList.noSetting'}));
		}
		// btnDisabled = true;

	}

	nightModeChange = (e) => {
		const { form } = this.props;
		if(e.target.value === 1) {
			form.setFieldsValue({
				'WDRMode': 0
			});
		}
	}

	render() {
		const { form, ipcBasicParams } = this.props;
		const { isSaving, nightMode, rotation, indicator , WDRMode } = ipcBasicParams;
		const { deviceInfo: { rotate }} = this.state;
		// console.log(ipcBasicParams);
		const { getFieldDecorator , getFieldValue } = form;
		return (
			<Card bordered={false} className={styles.card} title={formatMessage({id: 'basicParams.title'})}>
				<Form {...FORM_ITEM_LAYOUT_MANAGEMENT}>
					<Form.Item label={formatMessage({id: 'basicParams.nightMode'})}>
						{
							getFieldDecorator('nightMode',{
								initialValue: nightMode
							})(
								<RadioGroup onChange={this.nightModeChange}>
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

					<Form.Item label={formatMessage({ id: 'basicParams.wdr'})}>
						{
							getFieldDecorator('WDRMode',{
								initialValue: WDRMode,
							})(
								<RadioGroup disabled={getFieldValue('nightMode') === 1}>
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
							// disabled={!form.isFieldsTouched(['nightMode','indicator','rotation','WDRMode'])}
							disabled={btnDisabled}

							onClick={this.submit}

							loading={isSaving === 'saving'}
						>
							{formatMessage({id: 'basicParams.save'})}
						</Button>
					</Form.Item>
				</Form>
			</Card>
		);
	}
};
export default BasicParams;