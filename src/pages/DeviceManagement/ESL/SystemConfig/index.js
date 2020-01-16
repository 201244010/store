import React, {Component} from 'react';
import {Card, Tabs} from 'antd';
import { formatMessage } from 'umi/locale';
import DisplayConfig from './DisplayConfig';
import DeviceConfig from './DeviceConfig';
import LedConfig from './LedConfig';

const {TabPane} = Tabs;

export default class SystemConfig extends Component {
	render() {
		return (
			<Card>
				<Tabs defaultActiveKey="2" animated={false}>
					<TabPane tab={formatMessage({id: 'esl.device.display.title'})} key="1">
						<DisplayConfig />
					</TabPane>
					<TabPane tab={formatMessage({id: 'esl.device.config.title'})} key="2">
						<DeviceConfig />
					</TabPane>
					<TabPane tab={formatMessage({id: 'esl.device.led.title'})} key="3">
						<LedConfig />
					</TabPane>
				</Tabs>
			</Card>
		);
	}
}
