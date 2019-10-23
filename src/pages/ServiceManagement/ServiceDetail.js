import React from 'react';
import { Button, Modal, Row, Col, Form, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';

const LAY_OUT_OFFSET = {
	labelCol: {
		sm: { span: 10, offset: 2 },
	},
	wrapperCol:{
		sm: { span: 10 },
	}
};

const LAY_OUT = {
	labelCol: {
		sm: { span: 10 },
	},
	wrapperCol:{
		sm: { span: 10 },
	}
};

const STATUS = [
	formatMessage({id: 'serviceManagement.status.all'}),
	formatMessage({id: 'serviceManagement.status.unActivate'}),
	formatMessage({id: 'serviceManagement.status.activated'}),
	formatMessage({id: 'serviceManagement.status.disabled'})
];

@connect(
	state => ({
		detail: state.serviceManagement,
		loading: state.loading
	})
)
class ServiceDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	
	handleTime = time => {
		let hours = Math.floor( time / 3600);
		if(hours >= 24) {
			const days = Math.floor(hours / 24);
			hours %= 24;
			return days + formatMessage({id: 'day.unit'}) + hours + formatMessage({id: 'hour.unit'});
		}
		return hours + formatMessage({id: 'hour.unit'});
	};
	
	render() {
		const { loading, closeModal, detail: { serviceDetail: {
			serviceName, serviceNo, subscribeTime, serviceDuration, expireTime, status, orderNo, deviceName, deviceModel, deviceSn, validTime
		}}} = this.props;
		
		return (
			<Modal
				visible
				title={formatMessage({id: 'serviceManagement.detail'})}
				onCancel={closeModal}
				maskClosable={false}
				footer={[
					<Button onClick={closeModal} key='ok' type='primary'>{formatMessage({id: 'btn.confirm'})}</Button>
				]}
				width={800}
			>
				<Spin spinning={loading.effects['serviceManagement/getServiceDetail']}>
					<Row>
						<Col span={12}>
							<Form {...LAY_OUT_OFFSET}>
								<Form.Item label={formatMessage({id: 'serviceManagement.column.name'})}>
									{serviceName}
								</Form.Item>
								<Form.Item label={formatMessage({id: 'serviceManagement.label.subscribeTime'})}>
									{moment.unix(subscribeTime).format('YYYY-MM-DD')}
								</Form.Item>
								<Form.Item label={formatMessage({id: 'serviceManagement.label.expireTime'})}>
									{moment.unix(expireTime).format('YYYY-MM-DD')}
								</Form.Item>
								<Form.Item label={formatMessage({id: 'serviceManagement.label.status'})}>
									{STATUS[status]}
								</Form.Item>
								<Form.Item label={formatMessage({id: 'serviceManagement.label.deviceName'})}>
									{deviceName === '' ? formatMessage({id: 'serviceManagement.expired'}) : deviceName}
								</Form.Item>
								<Form.Item label={formatMessage({id: 'serviceManagement.label.deviceSn'})}>
									{deviceSn}
								</Form.Item>
							</Form>
						</Col>
						<Col span={12}>
							<Form {...LAY_OUT}>
								<Form.Item label={formatMessage({id: 'serviceManagement.column.no'})}>
									{serviceNo}
								</Form.Item>
								<Form.Item label={formatMessage({id: 'serviceManagement.label.serviceDuration'})}>
									{serviceDuration / 3600 / 24}{formatMessage({id: 'day.unit'})}
								</Form.Item>
								<Form.Item label={formatMessage({id: 'serviceManagement.column.validity'})}>
									{status === 2 ? this.handleTime(validTime) : formatMessage({id: 'serviceManagement.expired'})}
								</Form.Item>
								<Form.Item label={formatMessage({id: 'serviceManagement.label.orderNo'})}>
									{orderNo}
								</Form.Item>
								<Form.Item label={formatMessage({id: 'serviceManagement.label.deviceModel'})}>
									{deviceModel}
								</Form.Item>
							</Form>
						</Col>
					</Row>
				</Spin>
			</Modal>
		);
	}
}

export default ServiceDetail;