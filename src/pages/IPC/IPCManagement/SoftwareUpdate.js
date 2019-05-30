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
	}
});

@connect(mapStateToProps, mapDispatchToProps)
class SoftwareUpdate extends Component {
	state = {
		// version: 'V1.0.20',
		// isLatest: true,
		visible: false,
		percent: 0,
		// proVisible: false,
		// isUpdate: false,
		// isCheck: false
	}

	interval = 0

	componentDidMount = () => {
		const { load, sn } = this.props;
		// console.log(sn);
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
		const { update, sn } = this.props;
		update(sn);

		const time = 60*1000;

		clearInterval(this.interval);
		this.interval = setInterval(() => {

			const { percent } = this.state;
			if (percent < 90) {
				this.setState({
					percent: percent+1
				});
			}
		}, time/100);

		// this.setState({
		// 	isCheck: false,
		// 	isUpdate: true
		// });
	}

	hideModal = () => {
		this.setState({
			visible: false
		});
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
		const { info: { currentVersion, needUpdate, updating }, loading } = this.props;
		const { updateDate, checkDate, percent, visible } = this.state;

		const detecting = loading.effects['ipcSoftwareUpdate/detect'];

		return (
			<div>
				<Card
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
					closable={!updating}
					footer={

						detecting || updating || !needUpdate ?
							'' :
							<Button type="primary" onClick={this.updateSoftware}>
								{formatMessage({ id: 'softwareUpdate.update' })}
							</Button>

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
											{`${formatMessage({ id: 'softwareUpdate.checkDate' })}: ${checkDate}`}
										</p>
									</div>
								);
							}

							if (updating) {
								return (
									<div className={styles.info}>
										<Progress className={styles.progress} percent={percent} status='active' />
										<p>
											{ formatMessage({ id: 'softwareUpdate.updating' }) }
											{/* {percent <= 66 ? (
												formatMessage({ id: 'softwareUpdate.downloadMsg' })
											) : (
												''
											)}
											{percent > 66 && percent < 100 ? (
												formatMessage({ id: 'softwareUpdate.verificationMsg' })
											) : (
												''
											)}
											{percent === 100 ? (
												formatMessage({id: 'softwareUpdate.restartMsg'})
											) : (
												''
											)} */}
										</p>
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
											{`${formatMessage({ id: 'softwareUpdate.updateDate' })}: ${updateDate}`}
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
										{`${formatMessage({ id: 'softwareUpdate.updateDate' })}: ${moment().format('YYYY-MM-DD')}`}
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