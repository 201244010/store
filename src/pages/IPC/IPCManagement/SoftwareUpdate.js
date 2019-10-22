import React, { Component } from 'react';
import { Card, Button, Modal, Spin, Progress, Icon, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';
import AnchorWrapper from '@/components/Anchor';

import styles from './SoftwareUpdate.less';

const STATUS = {
	NORMAL: 'normal',
	DOWNLOAD: 'downloading',
	DOWNLOADFAIL: 'downloadFailed',
	AI: 'aiUpgrading',
	AIFIRMWARE: 'firmwaringAfterAI',
	FIRMWARE: 'firmwaring',
	RESTART: 'restarting',
	SUCCESS: 'success',
	FAIL: 'failed',
	BTNLOAD: 'btnLoading',
	NODOWNLOADRECEIVE: 'noDownloadReceive'
};

// const STATUS_PERCENT = {
// 	DOWNLOAD: 37,
// 	AI: 68,
// 	FIRMWARE: 83,
// 	RESTART : 95
// };

const mapStateToProps = (state) => {
	const { ipcSoftwareUpdate: info, loading } = state;
	return {
		info,
		loading
	};
};
const mapDispatchToProps = (dispatch) => ({
	load: (sn) => {
		dispatch({
			type: 'ipcSoftwareUpdate/load',
			payload: {
				sn
			}
		});
	},
	detect: (sn) => {
		dispatch({
			type: 'ipcSoftwareUpdate/detect',
			payload: {
				sn
			}
		});
	},
	update: (sn) => {
		dispatch({
			type: 'ipcSoftwareUpdate/update',
			payload: {
				sn
			}
		});
	},
	setUpdatingStatus: (sn,status) => {
		dispatch({
			type: 'ipcSoftwareUpdate/setUpdatingStatus',
			payload: {
				sn,
				status
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
	readIpcList(){
		dispatch({
			type: 'ipcList/read'
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

@AnchorWrapper
@connect(mapStateToProps, mapDispatchToProps)
class SoftwareUpdate extends Component {
	state = {
		visible: false,
		percent: 0,
		deviceInfo: {},
		showLoadingFlag: true,
		confirmBtnShowLoadingFlag: false
	}

	interval = 0

	componentDidMount = async () => {
		const { load, sn, getDeviceInfo, showModal } = this.props;

		if(sn){
			const deviceInfo = await getDeviceInfo({ sn });
			this.setState({
				deviceInfo
			});
		}
		await load(sn);
		if(showModal){
			this.showModal();
		}
	}

	componentWillReceiveProps(nextProps){
		const { info } = nextProps;
		const { info: lastInfo } = this.props;
		if(lastInfo.updating !== info.updating){
			this.addTimeoutHandler(info, lastInfo);
		}
	}


	showModal = async () => {
		const { detect, sn, load, checkBind } = this.props;
		const isBind = await checkBind(sn);
		if(isBind) {
			detect(sn);

			this.setState({
				visible: true
			});

			setTimeout(async () => {
				await load(sn);
				this.setState({
					showLoadingFlag:false
				});
			}, 2000);
		} else {
			message.warning(formatMessage({ id: 'ipcList.noSetting'}));
		}

	}

	updateSoftware = async () => {

		const { update,  sn } = this.props;
		const { deviceInfo: { OTATime: {
			totalTime,
			defaultDownloadTime,
			defaultFirmwareTime,
			defaultAIUpgradeTime,
			defaultRestartTime
		 },STATUS_PERCENT } } = this.state;
		let visible = true;

		await update(sn);

		clearInterval(this.interval);
		this.interval = setInterval(() => {
			let { percent } = this.state;
			const { info: { updating, OTATime:{
				downloadTime = defaultDownloadTime,
				firmwareTime = defaultFirmwareTime,
				aiUpgradeTime = defaultAIUpgradeTime,
				restartTime = defaultRestartTime
			} } } = this.props;

			switch(updating){
				case STATUS.DOWNLOAD:
					if(percent < STATUS_PERCENT.DOWNLOAD){
						const sections = STATUS_PERCENT.DOWNLOAD - 0;
						percent += Math.round(sections*totalTime/downloadTime/100);
						percent = percent > STATUS_PERCENT.DOWNLOAD ? STATUS_PERCENT.DOWNLOAD : percent;
					}
					break;
				case STATUS.AI:
					if(percent < STATUS_PERCENT.DOWNLOAD){
						percent = STATUS_PERCENT.DOWNLOAD;
					}
					if(percent >= STATUS_PERCENT.DOWNLOAD && percent < STATUS_PERCENT.AI){
						const sections = STATUS_PERCENT.AI - STATUS_PERCENT.DOWNLOAD;
						percent += Math.round(sections*totalTime/aiUpgradeTime/100);
						percent = percent > STATUS_PERCENT.AI ? STATUS_PERCENT.AI : percent;
					}
					break;
				case STATUS.AIFIRMWARE:
					if(percent < STATUS_PERCENT.AI){
						percent = STATUS_PERCENT.AI;
					}
					if(percent >= STATUS_PERCENT.AI && percent < STATUS_PERCENT.FIRMWARE){
						const sections = STATUS_PERCENT.FIRMWARE - STATUS_PERCENT.AI;
						percent += Math.round(sections*totalTime/firmwareTime/100);
						percent = percent > STATUS_PERCENT.FIRMWARE ? STATUS_PERCENT.FIRMWARE : percent;
					}
					break;
				case STATUS.FIRMWARE:
					if(percent < STATUS_PERCENT.DOWNLOAD){
						percent = STATUS_PERCENT.DOWNLOAD;
					}
					if(percent >= STATUS_PERCENT.DOWNLOAD && percent < STATUS_PERCENT.FIRMWARE){
						const sections = STATUS_PERCENT.FIRMWARE - STATUS_PERCENT.DOWNLOAD;
						percent += Math.round(sections*totalTime/firmwareTime/100);
						percent = percent > STATUS_PERCENT.FIRMWARE ? STATUS_PERCENT.FIRMWARE : percent;
					}
					break;
				case STATUS.RESTART:
					if(percent < STATUS_PERCENT.FIRMWARE){
						percent = STATUS_PERCENT.FIRMWARE;
					}
					if(percent >= STATUS_PERCENT.FIRMWARE && percent < STATUS_PERCENT.RESTART){
						const sections = STATUS_PERCENT.RESTART - STATUS_PERCENT.FIRMWARE;
						percent += Math.round(sections*totalTime/restartTime/100);
						percent = percent > STATUS_PERCENT.RESTART ? STATUS_PERCENT.RESTART : percent;
					}
					break;
				case STATUS.DOWNLOADFAIL:
					percent = 0;
					visible = false;
					message.error(formatMessage({ id: 'softwareUpdate.download.fail' }));
					clearInterval(this.interval);
					this.setUpdatingStatus(STATUS.NORMAL);
					break;
				// case STATUS.NODOWNLOADRECEIVE:
				// 	percent = 0;
				// 	visible = false;
				// 	message.info(formatMessage({ id: 'softwareUpdate.receive.fail' }));
				// 	clearInterval(this.interval);
				// 	this.setUpdatingStatus(STATUS.NORMAL);
				// 	break;
				default:
					break;
			}
			this.setState({
				percent,
				visible
			});
		}, totalTime/100);
	}

	hideModal = async() => {
		this.setState({
			confirmBtnShowLoadingFlag: true
		});
		const { readIpcList, getDeviceInfo, sn } = this.props;
		await readIpcList();
		const deviceInfo = await getDeviceInfo({ sn });
		await this.setState({
			visible: false,
			percent: 0,
			deviceInfo,
			confirmBtnShowLoadingFlag: false
		});
		this.setUpdatingStatus(STATUS.NORMAL);
	}

	setUpdatingStatus = (status) => {

		const {setUpdatingStatus, sn} = this.props;
		setUpdatingStatus(sn, status);
	}

	closeHanlder=()=>{
		this.setState({
			showLoadingFlag:true
		});
	}

	addTimeoutHandler(info, lastInfo){
		const { updating, OTATime } = info;
		const { updating: lastUpdating } = lastInfo;
		const { deviceInfo: { OTATime: {
			defaultDownloadTime,
			defaultFirmwareTime,
			defaultAIUpgradeTime,
			defaultRestartTime
		}}} = this.state;

		const {
			downloadTime = defaultDownloadTime,
			firmwareTime = defaultFirmwareTime,
			aiUpgradeTime = defaultAIUpgradeTime,
			restartTime = defaultRestartTime
		} = OTATime;

		if(lastUpdating === STATUS.NORMAL && updating === STATUS.BTNLOAD){
			setTimeout(() => {
				const { info: { updating: newUpdating } } = this.props;
				if (newUpdating === STATUS.BTNLOAD) {
					clearInterval(this.interval);
					this.setState({
						percent: 0,
						visible: false
					});
					message.error(formatMessage({ id: 'softwareUpdate.receive.fail' }));
					this.setUpdatingStatus(STATUS.NORMAL);
				}
			}, 10*1000);
		}

		if(lastUpdating === STATUS.BTNLOAD && updating === STATUS.DOWNLOAD){
			setTimeout(() => {
				const { info: { updating: newUpdating } } = this.props;
				if (newUpdating === STATUS.DOWNLOAD) {
					// clearInterval(this.interval);
					// this.setState({
					// 	percent: 0,
					// 	visible: false
					// });
					// message.error(formatMessage({ id: 'softwareUpdate.download.fail' }));
					this.setUpdatingStatus(STATUS.DOWNLOADFAIL);
				}
			}, downloadTime+15*1000);
		}
		if(lastUpdating === STATUS.DOWNLOAD && updating === STATUS.AI){
			setTimeout(() => {
				const { info: { updating: newUpdating } } = this.props;
				if (newUpdating === STATUS.AI) {
					this.setUpdatingStatus(STATUS.FAIL);
				}
			}, aiUpgradeTime+15*1000);
		}
		if(lastUpdating === STATUS.DOWNLOAD && updating === STATUS.FIRMWARE){

			setTimeout(() => {
				const { info: { updating: newUpdating } } = this.props;
				if (newUpdating === STATUS.FIRMWARE) {
					this.setUpdatingStatus(STATUS.RESTART);
				}
			}, firmwareTime);
		}
		if(lastUpdating === STATUS.AI && updating === STATUS.AIFIRMWARE){
			setTimeout(() => {
				const { info: { updating: newUpdating } } = this.props;
				if (newUpdating === STATUS.AIFIRMWARE) {
					this.setUpdatingStatus(STATUS.RESTART);
				}
			}, firmwareTime);
		}
		if(lastUpdating === STATUS.FIRMWARE && updating === STATUS.RESTART){
			setTimeout(() => {
				const { info: { updating: newUpdating } } = this.props;
				if (newUpdating === STATUS.RESTART) {
					this.setUpdatingStatus(STATUS.FAIL);

				}
			}, restartTime+15*1000);
		}
		if(lastUpdating === STATUS.AIFIRMWARE && updating === STATUS.RESTART){
			setTimeout(() => {
				const { info: { updating: newUpdating } } = this.props;
				if (newUpdating === STATUS.RESTART) {
					this.setUpdatingStatus(STATUS.FAIL);

				}
			}, restartTime+15*1000);
		}

	}

	render() {
		const { info: { currentVersion, needUpdate, lastCheckTime, updating, newTimeValue }, loading } = this.props;
		const { percent, visible, showLoadingFlag, deviceInfo:{ STATUS_PERCENT }, confirmBtnShowLoadingFlag } = this.state;
		const showLoading = loading.effects['ipcSoftwareUpdate/detect']||showLoadingFlag;
		return (
			<div>
				<Card
					bordered={false}
					className={styles['main-card']}
					title={formatMessage({ id: 'softwareUpdate.title' })}
					id="softwareUpdate"
				>
					<div className={styles['main-block']}>
						<p className={styles.tips}>
							{ `${formatMessage({ id: 'softwareUpdate.currentVersion' })}: ${currentVersion}` }
						</p>
						<p className={styles.center}>
							<Button type="default" onClick={this.showModal}>
								{formatMessage({ id: 'softwareUpdate.check' })}
							</Button>
						</p>

					</div>
				</Card>

				<Modal
					visible={visible}
					closable={updating === STATUS.NORMAL}
					maskClosable={false}
					afterClose={this.closeHanlder}
					footer={
						(() => {
							if (updating === STATUS.SUCCESS || updating === STATUS.FAIL) {
								clearInterval(this.interval);
								return (
									<Button
										type="primary"
										onClick={this.hideModal}
										loading={confirmBtnShowLoadingFlag}
									>
										{formatMessage({ id: 'softwareUpdate.confirm' })}
									</Button>
								);
							}
							if (needUpdate && (updating === STATUS.NORMAL || updating === STATUS.BTNLOAD) && !showLoading) {
								return (
									<Button type="primary" onClick={this.updateSoftware} loading={updating === STATUS.BTNLOAD}>
										{formatMessage({ id: 'softwareUpdate.update' })}
									</Button>
								);
							}
							return '';
						})()
					}
					onCancel={this.hideModal}
				>
					{
						(() => {
							if (showLoading) {
								return (
									<div className={styles.info}>
										<h3>
											<Spin className={styles.spin} />
											<span>{formatMessage({ id: 'softwareUpdate.checkWaitingMsg' })}</span>
										</h3>
										<p>
											{
												lastCheckTime === 0 ?
													`${formatMessage({ id: 'softwareUpdate.noCheck' })}` :
													`${formatMessage({ id: 'softwareUpdate.checkDate' })}: ${moment.unix(lastCheckTime).format('YYYY-MM-DD')}`
											}

										</p>
									</div>
								);
							}

							if (updating !== STATUS.NORMAL && updating !== STATUS.BTNLOAD && updating !== STATUS.SUCCESS && updating !== STATUS.FAIL && updating !== STATUS.NODOWNLOADRECEIVE) {
								return (
									<div className={styles.info}>
										<Progress
											className={styles.progress}
											percent={updating === STATUS.SUCCESS ? 100 : percent}
											status='active'
										/>
										{
											(() => {
												let text = '';
												if(percent >= 0 && percent <= STATUS_PERCENT.DOWNLOAD){
													text = (
														<p>{ formatMessage({ id: 'softwareUpdate.downloadTips' }) }</p>
													);
												}
												if(percent > STATUS_PERCENT.DOWNLOAD && percent <= STATUS_PERCENT.FIRMWARE){
													if(updating === STATUS.FIRMWARE){
														text = (
															<p>{ formatMessage({ id: 'softwareUpdate.upgradeTips' }) }</p>
														);
													}else if(updating === STATUS.AI || updating === STATUS.AIFIRMWARE){
														text = (
															<p>{ formatMessage({ id: 'softwareUpdate.upgradeWithAITips' }) }</p>
														);
													}else{
														text = (
															<p>{ formatMessage({ id: 'softwareUpdate.restartTips' }) }</p>
														);
													}

												}
												if(percent > STATUS_PERCENT.FIRMWARE && percent < 100){
													text = (
														<p>{ formatMessage({ id: 'softwareUpdate.restartTips' }) }</p>
													);
												}
												return text;
											})()
										}
									</div>
								);
							}

							if(updating === STATUS.SUCCESS || updating === STATUS.FAIL){
								return(
									<div className={`${styles['no-padding-bottom']} ${styles.info}`}>
										{
											updating === STATUS.FAIL ?
												'' :
												<Progress
													className={styles.progress}
													percent={updating === STATUS.SUCCESS ? 100 : percent}
													status='active'
												/>
										}
										{
											(() => {
												let text = '';
												switch (updating) {
													case STATUS.SUCCESS:
														text = (
															<p>{formatMessage({ id: 'softwareUpdate.updateSuccessMsg' })}</p>
														);
														break;
													case 'failed':
														text = (
															<>
																<h3>
																	<Icon className={`${styles.icon} ${styles.error}`} type='close-circle' />
																	<span className={styles.text}>{formatMessage({ id: 'softwareUpdate.updateFailed'})}</span>
																</h3>
																<p>{ formatMessage({ id: 'softwareUpdate.updateFailedMsg' }) }</p>
															</>
														);
														break;
													default:
														break;
												}
												return text;
											})()
										}
									</div>
								);
							}

							if (needUpdate) {
								return (
									<div className={`${styles['no-padding-bottom']} ${styles.info}`}>
										<h3>
											<Icon className={`${styles.icon} ${styles.warning}`} type="info-circle" />
											<span className={styles.text}>{formatMessage({ id: 'softwareUpdate.hasUpdate' })}</span>
										</h3>
										<p>
											{`${formatMessage({ id: 'softwareUpdate.checkDate' })}: ${moment.unix(newTimeValue).format('YYYY-MM-DD')}`}
										</p>
									</div>
								);
							}

							return (
								<div className={styles.info}>
									<h3>
										<Icon className={`${styles.icon} ${styles.success}`} type="check-circle" />
										<span className={styles.text}>{formatMessage({ id: 'softwareUpdate.noUpdate' })}</span>
									</h3>
									<p>
										{`${formatMessage({ id: 'softwareUpdate.checkDate' })}: ${moment.unix(newTimeValue).format('YYYY-MM-DD')}`}
									</p>
								</div>
							);

						})()

					}
				</Modal>

			</div>
		);
	}
}

export default SoftwareUpdate;