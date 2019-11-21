import React, {Component} from 'react';
import {Card, Row, Col, Progress} from 'antd';
import {connect} from 'dva';
import { formatMessage } from 'umi/locale';
import { getLocationParam } from '@/utils/utils';
import styles from './index.less';

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
		const {fetchPosDetail} = this.props;
		fetchPosDetail({
			options: {
				device_sn: getLocationParam('sn')
			}
		});
	}

	render() {
		const {iot: {deviceInfo, netInfo, runningInfo}} = this.props;

		return (
			<div className={styles['pos-detail']}>
				<Card title={formatMessage({id: 'iot.pos.detail.system.title'})} bordered={false}>
					<Col span={8}>
						<Progress type="circle" percent={parseFloat(runningInfo.used_cpu_percent)} width={120} strokeColor="#FF8B36" />
						<div className={styles['device-info-type']}>CPU</div>
						<div>{formatMessage({id: 'iot.pos.system.total.text'})}{runningInfo.cpu_frequency}</div>
					</Col>
					<Col span={8}>
						<Progress type="circle" percent={parseFloat(runningInfo.used_mem_percent)} width={120} strokeColor="#51B1E8" />
						<div className={styles['device-info-type']}>{formatMessage({id: 'iot.pos.system.cache'})}</div>
						<div>{formatMessage({id: 'iot.pos.system.has.used'})}300M，{formatMessage({id: 'iot.pos.system.total.text'})}{runningInfo.total_mem}</div>
					</Col>
					<Col span={8}>
						<Progress type="circle" percent={50} width={120} strokeColor="#25C596" />
						<div className={styles['device-info-type']}>{formatMessage({id: 'iot.pos.system.storage'})}</div>
						<div>{formatMessage({id: 'iot.pos.system.has.used'})}{runningInfo.used_sd}，{formatMessage({id: 'iot.pos.system.total.text'})}{runningInfo.total_sd}</div>
					</Col>
				</Card>
				<Card title={formatMessage({id: 'iot.pos.detail.device.title'})} bordered={false}>
					<Row>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.model'})}：{deviceInfo.model}
						</Col>
						<Col span={8}>
							SN：{deviceInfo.sn}
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.rom.version'})}：Android {deviceInfo.rom_version}
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.system.version'})}：{deviceInfo.system_version}
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.battery'})}：{runningInfo.battery_percent}
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.battery.temp'})}：{runningInfo.battery_temper}
						</Col>
						<Col span={8}>
							IP{formatMessage({id: 'iot.pos.detail.address'})}：{netInfo.ip}
						</Col>
						<Col span={8}>
							MAC{formatMessage({id: 'iot.pos.detail.address'})}：{netInfo.mac}
						</Col>
						<Col span={8}>
							iIMEI{formatMessage({id: 'iot.pos.detail.address'})}：{deviceInfo.imei}
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.resolution'})}：{deviceInfo.resolution}
						</Col>
						<Col span={8}>
							WIFI：{deviceInfo.use_wifi * 1 === 1 ? formatMessage({id: 'iot.pos.active.status.yes'}) : formatMessage({id: 'iot.pos.active.status.no'})}
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.location'})}：{deviceInfo.location}
						</Col>
					</Row>
				</Card>
				<Card title={formatMessage({id: 'iot.pos.detail.modify.title'})} bordered={false}>
					<Row>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.modify.status'})}：在保
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.modify.active.date'})}：2017年1月3日
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.modify.expire.date'})}：2018年8月1日
						</Col>
					</Row>
				</Card>
				<Card title={formatMessage({id: 'iot.pos.detail.app.title'})} bordered={false}>
					<Row>
						<Col span={4}>
							<img src={require('../../../assets/favicon.ico')} alt="" />
							<span className={styles['app-title']}>搜狗输入法</span>
						</Col>
						<Col span={4}>
							<img src={require('../../../assets/favicon.ico')} alt="" />
							<span className={styles['app-title']}>搜狗输入法</span>
						</Col>
						<Col span={4}>
							<img src={require('../../../assets/favicon.ico')} alt="" />
							<span className={styles['app-title']}>搜狗输入法</span>
						</Col>
						<Col span={4}>
							<img src={require('../../../assets/favicon.ico')} alt="" />
							<span className={styles['app-title']}>搜狗输入法</span>
						</Col>
						<Col span={4}>
							<img src={require('../../../assets/favicon.ico')} alt="" />
							<span className={styles['app-title']}>搜狗输入法</span>
						</Col>
						<Col span={4}>
							<img src={require('../../../assets/favicon.ico')} alt="" />
							<span className={styles['app-title']}>搜狗输入法</span>
						</Col>
						<Col span={4}>
							<img src={require('../../../assets/favicon.ico')} alt="" />
							<span className={styles['app-title']}>搜狗输入法</span>
						</Col>
						<Col span={4}>
							<img src={require('../../../assets/favicon.ico')} alt="" />
							<span className={styles['app-title']}>搜狗输入法</span>
						</Col>
					</Row>
				</Card>
			</div>
		);
	}
}

export default PosAccessDetail;
