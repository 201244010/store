import React from 'react';
import styles from './DeviceBasicInfo.less';
import { Card, Icon, Button, Form, Input, Modal, Spin, Radio } from 'antd';
import { connect } from 'dva';
// import PropTypes from 'prop-types';
import { FormattedMessage, formatMessage } from 'umi/locale';
import defaultImage from '@/assets/imgs/default.jpeg';
import { FORM_ITEM_LAYOUT, TAIL_FORM_ITEM_LAYOUT } from '@/constants/form';

const RadioGroup = Radio.Group;
const mapStateToProps = (state) => {
	const { deviceBasicInfo, loading } = state;
	return {
		deviceBasicInfo,
		loading
	};
};
const mapDispatchToProps = (dispatch) => ({
		getDeviceType(sn) {
			return dispatch({
				type: 'ipcList/getDeviceType',
				payload: sn
			});
		},
		save: (value) => {
			dispatch({
				type: 'deviceBasicInfo/update',
				payload: {
					name: value
				}
			});
		},
		loadInfo: (sn) => {
			dispatch({
				type: 'deviceBasicInfo/read',
				payload: sn
			});
		},
		deleteDevice: () => {
			dispatch({
				type: 'deviceBasicInfo/delete'
			});
		}
	});
let disabledControl = true;

@connect(mapStateToProps, mapDispatchToProps)
class DeviceBasicInfo extends React.Component {
	constructor(props) {
		super(props);

		const { deviceBasicInfo } = props;
		this.state = {
			name: deviceBasicInfo.name,
			isEdit: false,
			// isChange: false,
		};
		// console.log(this.state);
	}

	componentDidMount = async () => {
		const { loadInfo, sn } = this.props;
		loadInfo(sn);
	}

	onSave = () => {
		const { save } = this.props;
		const { name } = this.state;
		save(name);
		disabledControl = true;
		// const { status } = this.props.deviceBasicInfo;
    	/*
		if (status === 'success') {
			message.success('修改成功');
		} else if (status === 'error') {
			message.error('修改失败，请检查网络或重新设置');
		}
		*/
	}

	onShowModal = () => {
		const ref = this;
		Modal.confirm({
			title: formatMessage({ id: 'deviceBasicInfo.delete' }),
			content: (
				<p>
					<span className={styles['warning-text']}><FormattedMessage id='deviceBasicInfo.deleteConfirmPre' /></span>
					<span><FormattedMessage id='deviceBasicInfo.deleteConfirmSuf' /></span>
				</p>),
			okText: formatMessage({ id: 'deviceBasicInfo.contine' }),
			cancelText: formatMessage({ id: 'deviceBasicInfo.cancel' }),
			onOk() {
				// console.log(this)
				const { deleteDevice } = ref.props;
				deleteDevice();
			}
		});
	}
	
	onClick = () => {
		this.setState({
			isEdit: true
		});
	}

	onChange = (e) => {
		this.setState({
			name: e.target.value
		});
	}

	onPressEnter = () => {
		// console.log(this.state.name);
		const { name } = this.state;
		const { deviceBasicInfo } = this.props;

		if (deviceBasicInfo.name !== name) {
			disabledControl = false;
			// this.setState({
			// 	isChange: true
			// });
		} else {
			disabledControl = true;
			// this.setState({
			// 	isChange: false
			// });
		}

		this.setState({
			isEdit: false
		});
	}

	render() {
		const { isEdit, name: nameState } = this.state;
		const { deviceBasicInfo }  = this.props;
		const { name, type, sn, img, mode, status } = deviceBasicInfo;

		if (status === 'error') {
			disabledControl = false;
		}
		const { loading } = this.props;
		const image = img || defaultImage;

		return (
			<Spin spinning={loading.effects['deviceBasicInfo/read']}>
				<Card
					title={<FormattedMessage id="deviceBasicInfo.title" />}
					className={styles['main-card']}
				>
					<img src={image} alt="镜头显示图" className={styles['main-image']} />
					<Form {...FORM_ITEM_LAYOUT} className={styles['info-form']}>
						<Form.Item label={<FormattedMessage id="deviceBasicInfo.name" />}>
							{!isEdit ? (
								<span>
									{nameState || name}
									<Icon type="edit" onClick={this.onClick} />
								</span>
							) : (
								<Input
									onPressEnter={this.onPressEnter}
									value={nameState}
									className={styles['name-input']}
									onChange={this.onChange}
								/>
							)}
						</Form.Item>
						<Form.Item label={<FormattedMessage id="deviceBasicInfo.type" />}>
							<span>{type}</span>
						</Form.Item>
						<Form.Item label={<FormattedMessage id="deviceBasicInfo.sn" />}>
							<span>{sn}</span>
						</Form.Item>
						{type === 'FS1' ? (
							<Form.Item
								{...TAIL_FORM_ITEM_LAYOUT}
								className={styles['radio-item']}
							>
								<RadioGroup value={mode}>
									<Radio value={1}>
										<FormattedMessage id="deviceBasicInfo.directionForward" />
									</Radio>
									<Radio value={2}>
										<FormattedMessage id="deviceBasicInfo.directionBack" />
									</Radio>
								</RadioGroup>
							</Form.Item>
						) : (
							''
						)}
						<Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
							{deviceBasicInfo.status ? '' : ''}
							<div className={styles['btn-block']}>
								<Button
									type="primary"
									onClick={this.onSave}
									disabled={disabledControl}
									className={styles['save-btn']}
								>
									<FormattedMessage id="deviceBasicInfo.save" />
								</Button>
								<Button
									type="danger"
									onClick={this.onShowModal}
									className={styles['delete-btn']}
								>
									<FormattedMessage id="deviceBasicInfo.delete" />
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