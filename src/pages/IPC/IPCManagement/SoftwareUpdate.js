import React, { Component } from 'react';
import { Card, Button, Modal, Spin, Progress, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import moment from 'moment';

import styles from './SoftwareUpdate.less';



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
	checkVersion: (sn) => {
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
	setUpdatingStatus: (sn, status) => {
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
	}
});

@connect(mapStateToProps, mapDispatchToProps)
class SoftwareUpdate extends Component {
	state = {
		// version: 'V1.0.20',
		// isLatest: true,
		visible: false,
		percent: 0,
		deviceInfo: {}
		// proVisible: false,
		// isUpdate: false,
		// isCheck: false
	}

	interval = 0

	componentDidMount = async () => {
		const { load, sn, getDeviceInfo } = this.props;
		// console.log(sn);
		if(sn){
			const deviceInfo = await getDeviceInfo({ sn });
			this.setState({
				deviceInfo
			});
		}
		load(sn);
	}

	showModal = () => {
		const { checkVersion, sn } = this.props;
		checkVersion(sn);

		this.setState({
			visible: true
		});
	}


	updateSoftware = () => {
		const { update,  sn } = this.props;
		const { deviceInfo: { OTATime }} = this.state;
		update(sn);

		const time = OTATime;
		console.log(time);
		clearInterval(this.interval);
		this.interval = setInterval(() => {
			const { percent } = this.state;
			if (percent < 90) {
				this.setState({
					percent: percent+1
				});
			}
		}, time/100);

		setTimeout(() => {
			const { info: { updating } } = this.props;
			if (updating === 'loading') {
				this.setUpdatingStatus('failed');
			}
		}, 150*1000);

		// this.setState({
		// 	isCheck: false,
		// 	isUpdate: true
		// });
	}

	hideModal = () => {
		this.setState({
			visible: false
		});

		this.setUpdatingStatus('normal');
	}

	setUpdatingStatus = (status) => {
		const { setUpdatingStatus, sn } = this.props;
		setUpdatingStatus(sn, status);
	}

	// hideInfo = () => {
	// 	this.setState({
	// 		isCheck: false
	// 	});
	// }

	// showInfo = () => {
	// 	this.setState({
	// 		isCheck: true,
	// 		visible: false
	// 	});
	// }

	render() {
		const { info: { currentVersion, needUpdate, lastCheckTime, updating }, loading } = this.props;
		const { percent, visible } = this.state;

		const detecting = loading.effects['ipcSoftwareUpdate/detect'];

		return (
			<div>
				<Card
					bordered={false}
					className={styles['main-card']}
					title={formatMessage({ id: 'softwareUpdate.title' })}
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
					closable={updating !== 'loading'}
					maskClosable={false}
					footer={
						(() => {
							if (updating === 'success' || updating === 'failed') {
								clearInterval(this.interval);
								return (
									<Button
										type="primary"
										onClick={this.hideModal}
									>
										{formatMessage({ id: 'softwareUpdate.confirm' })}
									</Button>
								);
							}
							// console.log(lo)
							if (needUpdate && updating === 'normal') {
								return (
									<Button type="primary" onClick={this.updateSoftware}>
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
							if (detecting) {
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

							if (updating !== 'normal') {
								return (
									<div className={styles.info}>

										{
											updating === 'failed' ?
												'' :
												<Progress
													className={styles.progress}
													percent={updating === 'loading' ? percent : 100}
													status='active'
												/>
										}
										{
											(() => {
												// console.log(loading);
												let text = '';
												switch (updating) {
													case 'success':
														text = (
															<>
																{/* <h3>
																	<Icon className={`${styles.icon} ${styles.success}`} type='check-circle' />
																	<span className={styles.text}>{formatMessage({ id: 'softwareUpdate.updateSuccess' })}</span>
																</h3> */}

																<p>{formatMessage({ id: 'softwareUpdate.updateSuccessMsg' })}</p>
															</>

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
													case 'loading':
													default:
														text = (
															<p>{formatMessage({ id: 'softwareUpdate.updating' })}</p>
														);
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
									<div className={styles.info}>
										<h3>
											<Icon className={`${styles.icon} ${styles.warning}`} type="info-circle" />
											<span className={styles.text}>{formatMessage({ id: 'softwareUpdate.hasUpdate' })}</span>
										</h3>
										<p>
											{`${formatMessage({ id: 'softwareUpdate.checkDate' })}: ${moment.unix(lastCheckTime).format('YYYY-MM-DD')}`}
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
										{`${formatMessage({ id: 'softwareUpdate.checkDate' })}: ${moment.unix(lastCheckTime).format('YYYY-MM-DD')}`}
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