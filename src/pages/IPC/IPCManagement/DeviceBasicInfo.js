import React from 'react';
import { Card, Icon, Button, Form, Input, Modal, Spin, /* Radio, */ message } from 'antd';
import { connect } from 'dva';
// import PropTypes from 'prop-types';
import { formatMessage } from 'umi/locale';
import defaultImage from '@/assets/imgs/default.jpeg';
import router from 'umi/router';

import { FORM_ITEM_LAYOUT, TAIL_FORM_ITEM_LAYOUT } from './IPCManagement';

import styles from './DeviceBasicInfo.less';

// const FORM_ITEM_LAYOUT = {
// 	labelCol: {
// 		span: 8
// 	},
// 	wrapperCol: {
// 		span: 12
// 	}
// };

// const TAIL_FORM_ITEM_LAYOUT = {
// 	wrapperCol: {
// 		span: 12,
// 		offset: 8
// 	}
// };

const mbStringLength = (s) => {
	let totalLength = 0;
	let i;
	let charCode;
	for (i = 0; i < s.length; i++) {
		charCode = s.charCodeAt(i);
		if (charCode < 0x007f) {
			totalLength += 1;
		} else if ((charCode >= 0x0080) && (charCode <= 0x07ff)) {
			totalLength += 2;
		} else if ((charCode >= 0x0800) && (charCode <= 0xffff)) {
			totalLength += 3;
		}
	}
	// alert(totalLength);
	return totalLength;
};


// const RadioGroup = Radio.Group;
const mapStateToProps = (state) => {
	const { ipcBasicInfo: basicInfo } = state;
	return {
		basicInfo,
		// loading
	};
};
const mapDispatchToProps = (dispatch) => ({
	getDeviceType(sn) {
		return dispatch({
			type: 'ipcList/getDeviceType',
			payload: sn
		});
	},
	update: (value, sn) => {
		const data = dispatch({
			type: 'ipcBasicInfo/update',
			payload: {
				name: value,
				sn
			}
		}).then((result) => {
			// console.log('result: ', result);
			if (result) {
				message.success(formatMessage({ id: 'ipcManagement.success'}));
			}else{
				message.error(formatMessage({ id: 'ipcManagement.failed'}));
			}
			return result;
		});

		return data;
	},
	loadInfo: (sn) => {
		dispatch({
			type: 'ipcBasicInfo/read',
			payload: {
				sn
			}
		});
	},
	deleteDevice: (sn) => {
		dispatch({
			type: 'ipcBasicInfo/delete',
			payload: {
				sn
			}
		}).then((response) => {
			// console.log('result: ', result);
			if (response) {
				message.success(formatMessage({ id: 'ipcManagement.deleteSuccess'}));

				setTimeout(() => {
					router.push('/devices/ipcList');
				}, 800);

			}else{
				message.error(formatMessage({ id: 'ipcManagement.deleteFailed'}));
			}
		});
	}
});
// let disabledControl = true;
@connect(mapStateToProps, mapDispatchToProps)
@Form.create({
	name: 'ipc-device-basic-info',
	mapPropsToFields: (props) => {
		const { basicInfo } = props;
		return {
			deviceName: Form.createFormField({
				value: basicInfo.name,
			})
		};
	}
})
class DeviceBasicInfo extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isEdit: false,
			saving: false
		};
	}

	componentDidMount = async () => {
		const { loadInfo, sn } = this.props;

		loadInfo(sn);
	}

	onSave = () => {
		const { update, sn, form } = this.props;

		const { getFieldValue, validateFields } = form;

		validateFields(async (errors) => {
			if (!errors){
				const name = getFieldValue('deviceName');
				this.setState({
					saving: true
				});

				const result = await update( name, sn );

				if (result) {
					this.setState({
						isEdit: false,
						saving: false
					});
				}
			}
		});

	}

	onShowModal = () => {
		const { deleteDevice, sn } = this.props;

		const modal = Modal.confirm({
			title: formatMessage({ id: 'deviceBasicInfo.delete' }),
			content: (
				<p>
					<span className={styles['warning-text']}>
						{ formatMessage({id: 'deviceBasicInfo.deleteConfirmPre'}) }
					</span>
					<span>
						{ formatMessage({id: 'deviceBasicInfo.deleteConfirmSuf'}) }
					</span>
				</p>
			),
			destroyOnClose: true,
			okText: formatMessage({ id: 'deviceBasicInfo.contine' }),
			cancelText: formatMessage({ id: 'deviceBasicInfo.cancel' }),

			okButtonProps: {
				loading: false
			},

			async onOk() {
				modal.update({
					okButtonProps:{
						loading: true
					}
				});

				await deleteDevice(sn);

				modal.update({
					okButtonProps:{
						loading: false
					}
				});
			}
		});
	}

	onClick = () => {
		this.setState({
			isEdit: true
		});

		setTimeout(() => {
			// this.input.select();
			this.input.focus();
		}, 0);

	}

	// onChange = (e) => {
	// 	const { form } = this.props;
	// 	form.setFieldsValue({
	// 		deviceName: e.target.value
	// 	});
	// 	// this.setState({
	// 	// 	name: e.target.value
	// 	// });
	// }

	// onPressEnter = () => {
	// 	// console.log(this.state.name);
	// 	// const { name } = this.state;
	// 	// const { deviceBasicInfo } = this.props;

	// 	// if (deviceBasicInfo.name !== name) {
	// 		// disabledControl = false;
	// 		// this.setState({
	// 		// 	isChange: true
	// 		// });
	// 	// } else {
	// 		// disabledControl = true;
	// 		// this.setState({
	// 		// 	isChange: false
	// 		// });
	// 	// }

	// 	this.setState({
	// 		isEdit: false
	// 	});
	// }

	// componentWillReceiveProps = (props) => {
	// 	const { basicInfo: { status } } = props;

	// 	if (status === 'success') {
	// 		this.setState({
	// 			isEdit: false
	// 		});
	// 	}
	// }

	// componentDidUpdate = () => {
	// 	const { basicInfo: { status } } = this.props;

	// 	if (status === 'success') {
	// 		message.success('修改成功！');
	// 	} else if (status === 'failed') {
	// 		message.error('修改失败！请检查网络或重新设置。');
	// 	}
	// }

	exitEditName = () => {
		const { form } = this.props;
		const { isFieldTouched } = form;

		if (!isFieldTouched('deviceName')) {
			this.setState({
				isEdit: false
			});
		}
	}

	render() {
		const { isEdit, saving } = this.state;
		const { basicInfo, form }  = this.props;
		const { name, type, sn, img, /* mode, */ status } = basicInfo;

		const { isFieldTouched, getFieldDecorator } = form;

		const image = img || defaultImage;

		return (
			<Spin spinning={status === 'loading'}>
				<Card
					bordered={false}
					title={formatMessage({id: 'deviceBasicInfo.title'})}
					className={styles['main-card']}
				>
					<img src={image} alt="镜头显示图" className={styles['main-image']} />
					<Form {...FORM_ITEM_LAYOUT} className={styles['info-form']}>

						<Form.Item
							className={!isEdit ? styles.hidden : ''}
							label={formatMessage({id: 'deviceBasicInfo.name'})}
						>
							{
								getFieldDecorator('deviceName', {
									rules: [
										{ required: true, message: formatMessage({id: 'deviceBasicInfo.enterName'}) },
										{
											validator: (rule, value, callback) => {
												const len = mbStringLength(value);
												if (len <= 36) {
													callback();
												}else{
													callback(false);
												}
											},
											message: formatMessage({ id: 'deviceBasicInfo.maxLength'})// '设备名称不可以超过36字节'
										}
									]
								})(
									<Input
										ref={input => this.input = input}
										// onPressEnter={this.onPressEnter}
										onBlur={this.exitEditName}
									/>
								)
							}
						</Form.Item>

						<Form.Item
							required='true'
							label={formatMessage({id: 'deviceBasicInfo.name'})}
							className={isEdit ? styles.hidden : ''}
						>
							<div>
								<span className={styles.text}>{ name }</span>
								<Icon type="edit" onClick={this.onClick} />
							</div>
						</Form.Item>


						<Form.Item label={formatMessage({id: 'deviceBasicInfo.type'})}>
							<span>{type}</span>
						</Form.Item>
						<Form.Item label={formatMessage({id: 'deviceBasicInfo.sn'})}>
							<span>{sn}</span>
						</Form.Item>

						{/* {type === 'SS1' ? (
							<Form.Item
								{...TAIL_FORM_ITEM_LAYOUT}
								className={styles['radio-item']}
							>
								<RadioGroup value={mode}>
									<Radio value={1}>
										{ formatMessage({id: 'deviceBasicInfo.directionForward'}) }

									</Radio>
									<Radio value={2}>
										{ formatMessage({id: 'deviceBasicInfo.directionBack'}) }
									</Radio>
								</RadioGroup>
							</Form.Item>
						) : (
							''
						)} */}

						<Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
							{status ? '' : ''}
							<div className={styles['btn-block']}>
								<Button
									type="primary"
									onClick={this.onSave}
									// disabled={disabledControl}
									disabled={!isFieldTouched('deviceName')}
									className={styles['save-btn']}

									// loading={loading.effects['ipcBasicInfo/update']}
									loading={saving}
								>
									{ formatMessage({id: 'deviceBasicInfo.save'}) }
								</Button>
								<Button
									type="danger"
									onClick={this.onShowModal}
									className={styles['delete-btn']}
								>
									{ formatMessage({id: 'deviceBasicInfo.delete'}) }
								</Button>
							</div>
						</Form.Item>
					</Form>

				</Card>
			</Spin>
		);
	}
}

export default DeviceBasicInfo;