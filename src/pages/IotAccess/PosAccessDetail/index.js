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
		return (
			<div className={styles['pos-detail']}>
				<Card title={formatMessage({id: 'iot.pos.detail.system.title'})} bordered={false}>
					<Col span={8}>
						<Progress type="circle" percent={50} width={120} strokeColor="#FF8B36" />
						<div className={styles['device-info-type']}>CPU</div>
						<div>{formatMessage({id: 'iot.pos.system.total.text'})}2.4GHZ</div>
					</Col>
					<Col span={8}>
						<Progress type="circle" percent={50} width={120} strokeColor="#51B1E8" />
						<div className={styles['device-info-type']}>{formatMessage({id: 'iot.pos.system.cache'})}</div>
						<div>{formatMessage({id: 'iot.pos.system.has.used'})}300M，{formatMessage({id: 'iot.pos.system.total.text'})}815M</div>
					</Col>
					<Col span={8}>
						<Progress type="circle" percent={50} width={120} strokeColor="#25C596" />
						<div className={styles['device-info-type']}>{formatMessage({id: 'iot.pos.system.storage'})}</div>
						<div>{formatMessage({id: 'iot.pos.system.has.used'})}500M，{formatMessage({id: 'iot.pos.system.total.text'})}2.4G</div>
					</Col>
				</Card>
				<Card title={formatMessage({id: 'iot.pos.detail.device.title'})} bordered={false}>
					<Row>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.model'})}：V2 pro
						</Col>
						<Col span={8}>
							SN：43215321432
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.system.version'})}：Android 8.0
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.system.version'})}：1.1.0
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.system.version'})}：60%
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.battery.temp'})}：27度
						</Col>
						<Col span={8}>
							IP{formatMessage({id: 'iot.pos.detail.address'})}：192.169.12.11
						</Col>
						<Col span={8}>
							MAC{formatMessage({id: 'iot.pos.detail.address'})}：0C:25:76:00:00:3B
						</Col>
						<Col span={8}>
							iIMEI{formatMessage({id: 'iot.pos.detail.address'})}：000000000000
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.resolution'})}：720*1280
						</Col>
						<Col span={8}>
							WIFI：未连接
						</Col>
						<Col span={8}>
							{formatMessage({id: 'iot.pos.detail.location'})}：上海市XX区XX路XX号
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
