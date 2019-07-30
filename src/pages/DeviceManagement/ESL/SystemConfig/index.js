import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, InputNumber, Tooltip, Icon, Button } from 'antd';
import { formatMessage } from 'umi/locale';

@connect(
	state => ({
		eslBaseStation: state.eslBaseStation,
		eslElectricLabel: state.eslElectricLabel,
	}),
	dispatch => ({
		getNetWorkIdList: () => dispatch({ type: 'eslBaseStation/getNetWorkIdList' }),
		setScanTime: payload => dispatch({ type: 'eslElectricLabel/setScanTime', payload }),
	})
)
class SystemConfig extends Component {
	constructor(props) {
		super(props);
		this.state = {
			time: 5,
		};
	}

	handleSetScanTime = () => {
		const { setScanTime } = this.props;
		const { time } = this.state;

		setScanTime({
			options: {
				time,
			},
		});
	};

	render() {
		const {
			eslElectricLabel: { loading },
		} = this.props;
		const { time } = this.state;

		return (
			<div>
				<Card title="价签配置" bordered={false} style={{ width: '100%' }}>
					<Row>
						<Row>
							<Col
								span={3}
								offset={6}
								style={{ lineHeight: '30px', textAlign: 'right' }}
							>
								{formatMessage({ id: 'esl.device.esl.scan.time' })}：
							</Col>
							<Col span={9}>
								<InputNumber
									min={5}
									max={60}
									value={time}
									onChange={value => {
										this.setState({
											time: value,
										});
									}}
								/>{' '}
								秒
								<Tooltip
									placement="right"
									title="扫描周期范围为5~60秒。扫描越快，图像更新越快，但电池寿命会减少。"
								>
									<Icon type="question-circle" style={{ marginLeft: 20 }} />
								</Tooltip>
							</Col>
						</Row>
						<Row style={{ marginTop: 40 }}>
							<Col span={8} offset={9}>
								<Button
									type="primary"
									onClick={this.handleSetScanTime}
									loading={loading}
								>
									{formatMessage({ id: 'btn.save' })}
								</Button>
							</Col>
						</Row>
					</Row>
				</Card>
			</div>
		);
	}
}

export default SystemConfig;
