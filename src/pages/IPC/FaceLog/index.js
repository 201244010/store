import React from 'react';
import { Card, message } from 'antd';
import { formatMessage } from 'umi/locale';

import { connect } from 'dva';

import FaceLogBar from './FaceLogBar';
import FaceLogTable from './FaceLogTable';
import FaceIdLibraryMove from './FaceIdLibraryMove';

import styles from './FaceLog.less';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { ERROR_OK } from '@/constants/errorCode';


@connect((state) => {
	const { faceLog:{ageRangeList, faceLogList, total, faceLibraryList}, loading } = state;

	return {
		total,
		ageRangeList,
		faceLogList,
		faceLibraryList,
		loading
	};
},(dispatch) => ({
	readAgeRangeList:() => {
		dispatch({
			type:'faceLog/readAgeRangeList'
		});
	},
	readFaceLogList:({
		gender,
		age,
		ipc,
		groupId,
		name,
		currentPage,
		pageSize,
		pageNum
	}) => {
		dispatch({
			type:'faceLog/readFaceLogList',
			payload:{
				gender,
				age,
				ipc,
				groupId,
				name,
				currentPage,
				pageSize,
				pageNum
			}
		});
	},
	getFaceLibrary:() => {
		dispatch({
			type:'faceLog/getLibrary'
		});
	},
	navigateTo: (pathId, urlParams) => {
		dispatch({
			type: 'menu/goToPath',
			payload: {
				pathId,
				urlParams
			}
		});
	},
	move: payload =>
		(dispatch({
			type: 'faceLog/moveLibrary',
			payload
		}))
	,
}))

class FaceLog extends React.Component {

	state = {
		currentPage: 1,
		pageSize: DEFAULT_PAGE_SIZE,
		moveModalVisible: false,
		groupInfo: {},
		targetGroup: ''
	};

	componentDidMount(){
		const { readAgeRangeList, getFaceLibrary } = this.props;
		const { currentPage, pageSize } = this.state;
		readAgeRangeList();
		getFaceLibrary();
		this.getFaceLogList(currentPage, pageSize);
	}

	getFaceLogList = (currentPage, pageSize) => {
		const { readFaceLogList } = this.props;
		const {form} = this.searchForm.props;
		const gender = form.getFieldValue('gender') === -1 ? undefined : form.getFieldValue('gender');
		const age = form.getFieldValue('age') === -1 ? undefined : form.getFieldValue('age');
		const groupId = form.getFieldValue('faceGroup') === -1 ? undefined : form.getFieldValue('faceGroup');
		const name = form.getFieldValue('name') === '' ? undefined : form.getFieldValue('name');
		readFaceLogList({
			gender,
			age,
			groupId,
			name,
			currentPage,
			pageSize,
			pageNum:currentPage
		});
	}

	onShowSizeChange = (currentPage, pageSize) => {
		this.getFaceLogList(currentPage, pageSize);
		this.setState({
			currentPage,
			pageSize
		});
	}

	onPaginationChange = (currentPage, pageSize) => {
		this.getFaceLogList(currentPage, pageSize);

		this.setState({
			currentPage,
			pageSize
		});
	}

	linkToDetailHandler = (faceId) => {
		const { navigateTo } = this.props;
		navigateTo('entryDetail', {faceId});
	}

	adjustGroupHandler = async (groupInfo) => {
		this.setState({
			moveModalVisible: true,
			groupInfo
		});
	}

	moveModalHide = () => {
		this.setState({
			moveModalVisible: false
		});
	}

	moveLibraryHandler = async () => {
		const { move } = this.props;
		const { groupInfo, targetGroup, currentPage, pageSize  } = this.state;

		const { faceId, groupId } = groupInfo;
		if(targetGroup !== groupId){
			const result = await move({
				faceIdList: [faceId],
				targetGroupId: targetGroup,
				updateType: 1,
				sourceGroupId: groupId
			});
			if(result === ERROR_OK){
				message.success(formatMessage({id: 'faceLog.card.moveSuccess'}));
			}else{
				message.error(formatMessage({id: 'faceLog.card.moveFail'}));
			}

		}
		await this.getFaceLogList(currentPage, pageSize);
		this.setState({
			moveModalVisible: false
		});
	}

	groupValueChange = e => {
		this.setState({
			targetGroup: e.target.value
		});
	}

	handleLibraryName = groupName => {
		switch(groupName) {
			case 'stranger': return formatMessage({id: 'photoManagement.card.stranger'});
			case 'regular': return formatMessage({id: 'photoManagement.card.regular'});
			case 'employee': return formatMessage({id: 'photoManagement.card.employee'});
			case 'blacklist': return formatMessage({id: 'photoManagement.card.blacklist'});
			default: return groupName;
		}
	};


	searchHandler = () => {
		const { pageSize } = this.state;
		this.getFaceLogList(1, pageSize);
		this.setState({
			currentPage: 1
		});
	};

	resetHandler = () => {
		const { form } = this.searchForm.props;
		const { pageSize } = this.state;

		form.setFieldsValue({
			gender: -1,
			age: -1,
			faceGroup: -1,
			name: undefined
		});
		this.getFaceLogList(1, pageSize);

		this.setState({
			currentPage: 1
		});
	}

	render(){
		const { ageRangeList,faceLogList, total, loading, faceLibraryList } = this.props;
		const { currentPage, pageSize, moveModalVisible, groupInfo } = this.state;

		return(
			<div className={styles['face-log-container']}>
				<Card
					bordered={false}
					title={formatMessage({id: 'faceLog.faceLog'})}
				>
					<FaceLogBar
						wrappedComponentRef={ref => {
							this.searchForm = ref;
						}}
						ageRangeList={ageRangeList}
						faceLibraryList={faceLibraryList}
						handleLibraryName={this.handleLibraryName}
						searchHandler={this.searchHandler}
						resetHandler={this.resetHandler}
					/>
					<FaceLogTable
						faceLogList={faceLogList}
						total={total}
						loading={loading}
						currentPage={currentPage}
						pageSize={pageSize}
						onShowSizeChange={this.onShowSizeChange}
						onPaginationChange={this.onPaginationChange}
						linkToDetailHandler={this.linkToDetailHandler}
						adjustGroupHandler={this.adjustGroupHandler}
						handleLibraryName={this.handleLibraryName}
					/>
					<FaceIdLibraryMove
						moveModalVisible={moveModalVisible}
						faceLibraryList={faceLibraryList}
						moveLibraryHandler={this.moveLibraryHandler}
						groupInfo={groupInfo}
						moveModalHide={this.moveModalHide}
						handleLibraryName={this.handleLibraryName}
						groupValueChange={this.groupValueChange}
					/>
				</Card>
			</div>
		);
	}
}

export default FaceLog;