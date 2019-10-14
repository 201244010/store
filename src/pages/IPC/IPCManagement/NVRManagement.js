import React, { Component } from 'react';
import { Card, message } from 'antd';
// import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import NVRTitle from './NVRTitle';

import styles from './NVRManagement.less';

const mapStateToProps = (state) => {
	const { nvrManagement: {nvrState, loadState} } = state;
	return {
		nvrState,
		loadState
	};
};
const mapDispatchToProps = (dispatch) => ({
	read: (sn) => {
		dispatch({
			type: 'nvrManagement/read',
			payload: {
				sn
			}
		});
	},
	setNVRState: (sn, nvrState) => {
		dispatch({
			type:'nvrManagement/setNVRState',
			payload:{
				sn,
				nvrState
			}
		});
	},
	checkBind: async (sn) => {
		const result = await dispatch({
			type: 'ipcList/checkBind',
			payload: {
				sn
			}
		});
		return result;
	}
});

@connect(mapStateToProps, mapDispatchToProps)
class NVRManagement extends Component {

	async componentDidMount(){
		const { read, sn } = this.props;
		await read(sn);
	}

	nvrCheckedHandler = async (checked) => {
		const { sn, setNVRState, checkBind } = this.props;
		const isBind = await checkBind(sn);
		if(isBind) {
			setNVRState(sn, checked);
		} else {
			message.warning(formatMessage({ id: 'ipcList.noSetting'}));
		}
	}

	render() {
		const { nvrState, loadState } = this.props;
		return (
			<>
				<Card
					bordered={false}
					className={styles['main-card']}
					title={<NVRTitle onChange={this.nvrCheckedHandler} checked={nvrState} loading={loadState} />}
				>
					{/* {checked&&
					<div className={styles['main-block']} />
					} */}
				</Card>
			</>
		);
	}
}

export default NVRManagement;
