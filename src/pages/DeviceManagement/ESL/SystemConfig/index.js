import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './systemConfig.less';

@connect(
	state => ({
		loading: state.loading,
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

	componentDidMount() {
		const { getNetWorkIdList } = this.props;
		getNetWorkIdList();
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

	handleSelectChange = () => {};

	render() {
		const {
			loading,
			eslBaseStation: { newWorkIdList = [] },
		} = this.props;

		return (
			<Card
				title={formatMessage({ id: 'esl.device.config.title' })}
				bordered={false}
				style={{ width: '100%' }}
				loading={loading.effects['eslBaseStation/getNetWorkIdList']}
			>
				<Card title={formatMessage({ id: 'esl.device.config.info' })} bordered={false}>
					<div className={styles['display-content']}>
						<span>{formatMessage({ id: 'esl.device.config.networkId' })}:</span>

						<Select
							defaultValue={newWorkIdList[0] || null}
							onChange={this.handleSelectChange}
							style={{ minWidth: '200px' }}
						>
							{newWorkIdList.map(netWork => (
								<Select.Option value={netWork.networkId}>
									{netWork.networkId}
								</Select.Option>
							))}
						</Select>
					</div>
				</Card>
				<Card title={formatMessage({ id: 'esl.device.config.setting' })} bordered={false} />
				<Card
					title={formatMessage({ id: 'esl.device.config.boardcast' })}
					bordered={false}
				/>
			</Card>
		);
	}
}

export default SystemConfig;
