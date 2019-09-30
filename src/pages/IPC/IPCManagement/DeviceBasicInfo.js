import React from 'react';
import { Card, Icon, Button, Form, Input, Modal, /* Radio, */ message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { mbStringLength } from '@/utils/utils';
import { FORM_ITEM_LAYOUT_MANAGEMENT, TAIL_FORM_ITEM_LAYOUT } from '@/constants/form';
import { spaceInput, emojiInput } from '@/constants/regexp';
// import { FORM_ITEM_LAYOUT , TAIL_FORM_ITEM_LAYOUT } from './IPCManagement';

import defaultImage from '@/assets/imgs/default.jpeg';
import styles from './DeviceBasicInfo.less';

const mapStateToProps = (state) => {
	const { ipcBasicInfo: basicInfo, ipcList } = state;
	return {
		basicInfo,
		ipcList
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
	deleteDevice: (sn, callback) => {
		dispatch({
			type: 'ipcBasicInfo/delete',
			payload: {
				sn
			}
		}).then((response) => {
			if (response) {
				message.success(formatMessage({ id: 'ipcManagement.deleteSuccess'}));

				setTimeout(() => {
					callback();
				}, 800);

			}else{
				message.error(formatMessage({ id: 'ipcManagement.deleteFailed'}));
			}
		});
	},
	navigateTo: (pathId, urlParams) => dispatch({
		type: 'menu/goToPath',
		payload: {
			pathId,
			urlParams
		}
	}),
	getSdStatus: ({ sn }) => {
		const result = dispatch({
			type: 'sdcard/getSdStatus',
			sn
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

@connect(mapStateToProps, mapDispatchToProps)
@Form.create({
	name: 'ipc-device-basic-info',
	onValuesChange() {
		// btnDisabled = false;
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
		const { getDeviceInfo, loadInfo, sn, getSdStatus } = this.props;
		if(sn){
			const deviceInfo = await getDeviceInfo({ sn });
			const { hasFaceid } = deviceInfo;
			if(hasFaceid){
				const status = await getSdStatus({ sn });
				if(status === 0 && hasFaceid) {
					message.info(formatMessage({ id: 'deviceBasicInfo.nosdInfo' }));
				}
			}
			loadInfo(sn);
		}
	}

	componentWillReceiveProps(nextProps) {
		const { setLoadingState } = this.props;
		const { basicInfo:{ status }} = nextProps;
		if(status === 'loading'){
			setLoadingState({
				deviceBasicInfo: true
			});
		}else{
			setLoadingState({
				deviceBasicInfo: false
			});
		}
	}

	onSave = () => {
		const { update, sn, form } = this.props;

		const { getFieldValue, validateFields } = form;

		validateFields(async (errors) => {
			if (!errors){
				const name = getFieldValue('deviceName').trim();
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

	navigateTo = () => {
		const { navigateTo } = this.props;
		navigateTo('deviceList');
	}

	onShowModal = () => {
		const { deleteDevice, sn } = this.props;
		const _this = this;
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

				await deleteDevice(sn, _this.navigateTo);

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
			this.input.focus();
		}, 0);

	}

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
		const { basicInfo, form, ipcList }  = this.props;
		const { name, type, sn, img, /* mode, */ status } = basicInfo;

		const { /* isFieldTouched, */ getFieldDecorator } = form;

		const image = img || defaultImage;

		return (
			<Card
				bordered={false}
				title={formatMessage({id: 'deviceBasicInfo.title'})}
				className={styles['main-card']}
			>
				<img src={image} alt="main-camera" className={styles['main-image']} />
				<Form {...FORM_ITEM_LAYOUT_MANAGEMENT} className={styles['info-form']}>

					<Form.Item
						className={!isEdit ? styles.hidden : ''}
						label={formatMessage({id: 'deviceBasicInfo.name'})}
					>
						{
							getFieldDecorator('deviceName', {
								initialValue: name,
								rules: [
									{ required: true, message: formatMessage({id: 'deviceBasicInfo.enterName'}) },
									{
										pattern: spaceInput,
										message: formatMessage({id: 'deviceBasicInfo.firstInputFormat'})
									},
									{
										validator: (rule, value,callback) => {
											const invalidSymbol = emojiInput;
											if(invalidSymbol.test(value)) {
												callback(false);
											} else {
												callback();
											}
										},
										message: formatMessage({ id: 'deviceBasicInfo.invalidSymbol'})
									},
									{
										validator: (rule, value, callback) => {
											let confictFlag = false;
											ipcList.every(item => {
												if (item.sn !== sn) {
													if (item.name === value.trim()) {
														confictFlag = true;
														return false;
													}
													return true;
												}
												return false;
											});

											if (confictFlag) {
												callback('name-confict');
											} else {
												callback();
											}
										},
										message: formatMessage({
											id: 'deviceBasicInfo.deviceNameRule',
										}),
									},
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
									},
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
						<div className={styles['text-container']}>
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

					<Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
						{status ? '' : ''}
						<div className={styles['btn-block']}>
							<Button
								type="primary"
								onClick={this.onSave}
								// disabled={disabledControl}
								// disabled={!isFieldTouched('deviceName')}
								disabled={!isEdit}
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
		);
	}
}

export default DeviceBasicInfo;