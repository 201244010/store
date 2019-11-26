import React from 'react';

import { /* Button, */ Row, Spin, message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
// import { FormattedMessage } from 'umi/locale';

import NoIPCList from './NoIPCList';
import IPCItem from './IPCItem';
import styles from './IPCList.less';

@connect((state) => {
	const { ipcList,loading  } = state;
	return {
		ipcList,
		loading
	};
},(dispatch) => ({
	loadList: () => {
		dispatch({ type:'ipcList/read'});
	},
	navigateTo: (pathId, urlParams) => dispatch({
		type: 'menu/goToPath',
		payload: {
			pathId,
			urlParams
		}
	}),
	checkBind: async (sn) => {
		const result = await dispatch({
			type: 'ipcList/checkBind',
			payload: {
				sn
			}
		});
		return result;
	}
}))

class IPCList extends React.Component {

	componentDidMount() {
		const { loadList } = this.props;
		loadList();
	}

	onClickSetting = async (sn) => {
		const { checkBind } = this.props;
		const isBind = await checkBind(sn);
		if(isBind) {
			const { navigateTo } = this.props;
			navigateTo('ipcManagement', {sn});
		} else {
			message.warning(formatMessage({ id: 'ipcList.noSetting'}));
		}
	}

	onClickPlay = async  (sn) => {
		const { checkBind } = this.props;
		const isBind = await checkBind(sn);
		if(isBind) {
			const { navigateTo } = this.props;
			navigateTo('live', {sn});
		} else {
			message.warning(formatMessage({ id: 'ipcList.noLive'}));
		}
	}

	render() {
		const { ipcList: list, loading } = this.props;
		const ipcList = [
			...list
		];

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
				<Spin className={styles.loading} spinning={loading.effects['ipcList/read']}>
					{
						( () => {
							if(!loading.effects['ipcList/read']){
								return(
									ipcList.length === 0 ?
										<NoIPCList />:
										<div className="ipcList">
											{/* <Button type="dashed" block>{<FormattedMessage id='ipcList.addIPC' />}</Button> */}
											<Row gutter={8}>
												{ipcList.map((item, index) => (
													<IPCItem
														empty={item.type === 'empty'}
														isOnline={item.isOnline}
														img={item.img}
														sn={item.sn}
														key={index}
														type={item.type}
														name={item.name}
														listLength={ipcList.length}
														onClickPlay={this.onClickPlay}
														onClickSetting={this.onClickSetting}
													/>
												))}
											</Row>
										</div>
								);
							}
							return null;
						})()
					}
				</Spin>
			</div>
		);
	}
}

export default IPCList;
