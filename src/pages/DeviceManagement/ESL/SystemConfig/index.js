import React, {Component} from 'react';
import {Card, Tabs} from 'antd';
import { formatMessage } from 'umi/locale';
import DisplayConfig from './DisplayConfig';
import DeviceConfig from './DeviceConfig';

const {TabPane} = Tabs;

export default class SystemConfig extends Component {
	render() {
		return (
			<Card>
				<Tabs defaultActiveKey="1" animated={false}>
					 <TabPane tab={formatMessage({id: 'esl.device.display.title'})} key="1">
						<DisplayConfig />
					 </TabPane>
					<TabPane tab={formatMessage({id: 'esl.device.config.title'})} key="2">
						<DeviceConfig />
					</TabPane>
				</Tabs>
			</Card>
		);
	}
}
