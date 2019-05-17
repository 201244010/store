import React from 'react';
import { Card, Button, Row, Col,Spin } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';

import { FormattedMessage } from 'umi/locale';

import styles from './IPCList.less';




class IPCList extends React.Component {
	
	async componentWillMount() {
		
		const { loadList } = this.props;
		await loadList();
	}

	render() {
		const { ipcList, loading } = this.props;
		if (ipcList.length <= 4) {
			switch (ipcList.length) {
				case 1:
				case 3:
					ipcList.push({
						type: 'empty'
					});
					break;
				default:
					break;
			}
		} else {
			while (ipcList.length % 4 !== 0) {
				ipcList.push({
					type: 'empty'
				});
			}
		}
		return (
			<div className={styles.container}>
				{
					loading.effects['ipcList/getList'] ? <Spin /> : ''
				}
				{
					ipcList && ipcList.length !== 0 ? 
						<div>
							<Button type="dashed" block>{<FormattedMessage id='ipcList.addIPC' />}</Button>

							{/* 目前商家拥有设备是否小于或等于4，小于或等于4每行显示2个，大于4，显示4个一行 */}
							<Row gutter={8}>
								{ipcList.map((item, index) => {
									if (item.type !== 'empty'&&item.isOnline) {
										return (
											<div key={index}>
												<Col span={ipcList.length <= 4 ? 12 : 6} className={styles.col}>
													<Card
														className={styles.card}
														bodyStyle={{ padding: 0, margin: 0 }}
														cover={item.img && <img alt="example" src={item.img} />}
													/>
													{item.sn &&
														<Button
															className={styles['setting-btn']}
															size='small'
														>
															<Link to={`./ipcManagement?sn=${item.sn}`}>
																{<FormattedMessage id='ipcList.setting' />}
															</Link>
														</Button>
													}
													<Link to={`/live?sn=${item.sn}`}>
														<div className={styles.play} />
													</Link>
													
													<div
														className={styles['ipc-name-type']}
													>
														{item.name||<FormattedMessage id='ipcList.noIPCName' />} ({item.type||<FormattedMessage id='ipcList.noIPCType' />})
													</div>
												</Col>
											</div>
										);
									} 
									if(item.type !== 'empty'&&!item.isOnline) {	
										return(
											<div key={index}>
												<Col span={ipcList.length <= 4 ? 12 : 6} className={styles.col}>
													<Card
														className={styles['outline-card']}
														bodyStyle={{ padding: 0, margin: 0 }}
														cover={item.img&&<img alt="example" src={item.img} />}
													/>
													<div className={styles['outline-tips']}>
														<h3>{<FormattedMessage id='ipcList.devices.outline.tips' />}</h3>
													</div>
													<div
														className={styles['ipc-name-type']}
													>
														{item.name||<FormattedMessage id='ipcList.noIPCName' />} ({item.type||<FormattedMessage id='ipcList.noIPCType' />})
													</div>
												</Col>
											</div>
										);
									}
									return (
										<div key={index}>
											<Col span={ipcList.length <= 4 ? 12 : 6} className={styles.col}>
												<Card
													className={styles.empty}
													bodyStyle={{ padding: 0 }}
												/>
											</Col>
										</div>
									);
								})}
							</Row>
						</div> : 
						
						<div className={styles['no-device']}>
							<h2>{<FormattedMessage id='ipcList.noDevice.addIPC.tips' />}</h2>
							<div className={styles.tips}>
								<div className={styles['tips-item']}><span className={styles.num}>1</span>{<FormattedMessage id='ipcList.noDevice.addIPC.first.step' />}<span className={styles['blue-span']}>{<FormattedMessage id='ipcList.noDevice.addIPC.first.step.blue' />}</span></div>
								<div className={styles['tips-item']}><span className={styles.num}>2</span>{<FormattedMessage id='ipcList.noDevice.addIPC.second.step' />}</div>
							</div>
							<div className={styles['ipc-pic']} />
							<Button
								className={styles['device-link']}
								type="primary"
							>
								{<FormattedMessage id='ipcList.link.ipc' />}
							</Button>
						</div>
				}
			</div>
		);
	}
}


const mapStateToProps = (state) => {
	const { ipcList,loading  } = state;
	// console.log(state);
	return {
		ipcList,
		loading
	};
};

const mapDispatchToProps = (dispatch) => ({
		loadList: () => dispatch({
				type:'ipcList/getList'
			})
	});

export default connect(mapStateToProps, mapDispatchToProps)(IPCList);
