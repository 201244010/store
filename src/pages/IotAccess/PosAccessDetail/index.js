import React, {Component} from 'react';
import {Card, Row, Col, Progress} from 'antd';
import {connect} from 'dva';
import { formatMessage } from 'umi/locale';
import { getLocationParam } from '@/utils/utils';
import styles from './index.less';

function UsedProgress(props) {
	const {percent, strokeColor} = props;

	return (
		<Progress
			{
			...{
				type: 'circle',
				width: 120,
				percent,
				strokeColor: percent >= 90 ? 'red' : strokeColor,
				format: p => `${p}%`
			}
			}
		/>
	);
}

@connect(
	state => ({
		iot: state.iot,
	}),
	dispatch => ({
		fetchPosDetail: payload => dispatch({ type: 'iot/fetchPosDetail', payload }),
		fetchWarrantyInfo: payload => dispatch({ type: 'iot/fetchWarrantyInfo', payload }),
	})
)
class PosAccessDetail extends Component {
	componentDidMount() {
		const {fetchPosDetail, fetchWarrantyInfo} = this.props;
		fetchPosDetail({
			options: {
				device_sn: getLocationParam('sn')
			}
		});
		fetchWarrantyInfo({
			options: {
				device_sn: getLocationParam('sn')
			}
		});
	}

	calculateUsedProgress = (used = '', total = '') => {
		const u = parseFloat(used);
		const t = parseFloat(total);
		let p = u / t * 100;
		if (used.toUpperCase().indexOf('M') > -1 && used.toUpperCase().indexOf('G') > -1) {
			p /= 1024;
		}
		return (p || 0).toFixed();
	};

	render() {
		const {iot: {loading, deviceInfo, netInfo, runningInfo, warrantyInfo}} = this.props;
		const cpuPercent = parseFloat(runningInfo.used_cpu_percent);
		const memoryPercent = parseFloat(runningInfo.used_mem_percent);
		const sdPercent = this.calculateUsedProgress(runningInfo.used_sd, runningInfo.total_sd);
		const batteryPercent = parseFloat(runningInfo.battery_percent);
		const batteryColor = batteryPercent > 20 ? '#444' : (batteryPercent > 10 ? '#FE6600' : 'red');

		return (
			<div className={styles['pos-detail']}>
				<Card loading={loading} title={formatMessage({id: 'iot.pos.detail.system.title'})} bordered={false}>
					<Col span={8}>
						<UsedProgress percent={cpuPercent} strokeColor="#FF8B36" />
						<div className={styles['device-info-type']}>CPU</div>
						<div>{formatMessage({id: 'iot.pos.system.total.text'})}{runningInfo.cpu_frequency}</div>
					</Col>
					<Col span={8}>
						<UsedProgress percent={memoryPercent} strokeColor="#51B1E8" />
						<div className={styles['device-info-type']}>{formatMessage({id: 'iot.pos.system.cache'})}</div>
						<div>{formatMessage({id: 'iot.pos.system.has.used'})}{runningInfo.used_mem}，{formatMessage({id: 'iot.pos.system.total.text'})}{runningInfo.total_mem}</div>
					</Col>
					<Col span={8}>
						<UsedProgress percent={sdPercent} strokeColor="#25C596" />
						<div className={styles['device-info-type']}>{formatMessage({id: 'iot.pos.system.storage'})}</div>
						<div>{formatMessage({id: 'iot.pos.system.has.used'})}{runningInfo.used_sd}，{formatMessage({id: 'iot.pos.system.total.text'})}{runningInfo.total_sd}</div>
					</Col>
				</Card>
				<Card loading={loading} title={formatMessage({id: 'iot.pos.detail.device.title'})} bordered={false}>
					<Row>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.model'})}：{deviceInfo.model || '--'}
						</Col>
						<Col span={8}>
							SN：{deviceInfo.sn || '--'}
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.system.version'})}：{deviceInfo.system_version ? `Android ${deviceInfo.system_version}` : '--'}
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.rom.version'})}：{deviceInfo.rom_version || '--'}
						</Col>
						{
							runningInfo.battery_percent !== undefined ?
								<Col span={8}>
									{formatMessage({id: 'iot.pos.detail.battery'})}：<span style={{color: batteryColor}}>{runningInfo.battery_percent || <span style={{color: '#444'}}>--</span>}</span>
								</Col> :
								null
						}
						{
							runningInfo.battery_temper !== undefined ?
								<Col span={8}>
									{formatMessage({id: 'iot.pos.detail.battery.temp'})}：{runningInfo.battery_temper || '--'}
								</Col> :
								null
						}
						<Col span={8}>
							IP{formatMessage({id: 'iot.pos.detail.address'})}：{netInfo.ip || '--'}
						</Col>
						<Col span={8}>
							MAC{formatMessage({id: 'iot.pos.detail.address'})}：{netInfo.mac || '--'}
						</Col>
						<Col span={8}>
							IMEI：{deviceInfo.imei || '--'}
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.resolution'})}：{deviceInfo.resolution || '--'}
						</Col>
						<Col span={8}>
							WIFI：
							{
								netInfo.use_wifi * 1 === 1 ?
									formatMessage({id: 'iot.pos.active.status.yes'}) :
									(
										netInfo.use_wifi * 1 === 0 ?
											formatMessage({id: 'iot.pos.active.status.no'}) :
											'--'
									)
							}
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.location'})}：{deviceInfo.location || '--'}
						</Col>
					</Row>
				</Card>
				<Card loading={loading} title={formatMessage({id: 'iot.pos.detail.modify.title'})} bordered={false}>
					<Row>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.modify.status'})}：
							{
								warrantyInfo.status * 1 === 1 ?
									formatMessage({id: 'iot.pos.warranty.status.yes'}) :
									(
										warrantyInfo.status * 1 === 0 ?
											<span style={{color: 'red'}}>{formatMessage({id: 'iot.pos.warranty.status.no'})}</span> :
											'--'
									)
							}
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.modify.active.date'})}：{warrantyInfo.activated_time || '--'}
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.modify.expire.date'})}：{warrantyInfo.expire_time || '--'}
						</Col>
					</Row>
				</Card>
				{/* <Card title={formatMessage({id: 'iot.pos.detail.app.title'})} bordered={false}> */}
				{/* <Row> */}
				{/* <Col span={4}> */}
				{/* <img src={require('../../../assets/favicon.ico')} alt="" /> */}
				{/* <span className={styles['app-title']}>搜狗输入法</span> */}
				{/* </Col> */}
				{/* <Col span={4}> */}
				{/* <img src={require('../../../assets/favicon.ico')} alt="" /> */}
				{/* <span className={styles['app-title']}>搜狗输入法</span> */}
				{/* </Col> */}
				{/* <Col span={4}> */}
				{/* <img src={require('../../../assets/favicon.ico')} alt="" /> */}
				{/* <span className={styles['app-title']}>搜狗输入法</span> */}
				{/* </Col> */}
				{/* <Col span={4}> */}
				{/* <img src={require('../../../assets/favicon.ico')} alt="" /> */}
				{/* <span className={styles['app-title']}>搜狗输入法</span> */}
				{/* </Col> */}
				{/* <Col span={4}> */}
				{/* <img src={require('../../../assets/favicon.ico')} alt="" /> */}
				{/* <span className={styles['app-title']}>搜狗输入法</span> */}
				{/* </Col> */}
				{/* <Col span={4}> */}
				{/* <img src={require('../../../assets/favicon.ico')} alt="" /> */}
				{/* <span className={styles['app-title']}>搜狗输入法</span> */}
				{/* </Col> */}
				{/* <Col span={4}> */}
				{/* <img src={require('../../../assets/favicon.ico')} alt="" /> */}
				{/* <span className={styles['app-title']}>搜狗输入法</span> */}
				{/* </Col> */}
				{/* <Col span={4}> */}
				{/* <img src={require('../../../assets/favicon.ico')} alt="" /> */}
				{/* <span className={styles['app-title']}>搜狗输入法</span> */}
				{/* </Col> */}
				{/* </Row> */}
				{/* </Card> */}
			</div>
		);
	}
}

export default PosAccessDetail;
