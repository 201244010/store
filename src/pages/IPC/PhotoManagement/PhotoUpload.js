import React from 'react';
import { Modal, Upload, Icon } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './PhotoManagement.less';



const mapStateToProps = (state) => {
	const { photoUpload: { fileList } } = state;
	return {
		fileList
	};
};
const mapDispatchToProps = (dispatch) => ({
	uploadFileList: (fileList, groupId) => {
		// console.log('uploadFileList');
		dispatch({
			type:'photoUpload/uploadFileList',
			payload: {
				fileList,
				groupId
			}
		});
	},
	removeFile: (uid) => {
		dispatch({
			type: 'photoUpload/removeFile',
			payload: {
				uid
			}
		});
	},
	clearFileList: () => {
		dispatch({
			type: 'photoUpload/clearFileList',
		});
	},
	setFileList: (fileList) => {
		dispatch({
			type: 'photoUpload/setFileList',
			payload: {
				fileList
			}
		});
	},

});
@connect(mapStateToProps, mapDispatchToProps)
class PhotoUpload extends React.Component {

	state = {
		fileList: []
	}

	componentWillReceiveProps = (nextProps) => {
		const { fileList } = nextProps;
		const { fileList: stateList } = this.state;
		const { canSave } = this.props;

		// console.log('componentWillReceiveProps', fileList, stateList);

		const list = [];
		fileList.forEach(item => {
			let tag = false;
			stateList.forEach(itemState => {
				if (item.uid === itemState.uid) {
					// console.log(1);
					tag = true;
					list.push({
						...itemState,
						...item
					});
				}
			});
			if (!tag) {
				list.push({
					...item
				});
			}
		});

		// console.log('list',list);
		this.setState({
			fileList: list
		});
		canSave(list);
	}


	uploadElement = () => {

		const {  /* photoUpload: { fileList }, */ uploadable } = this.props;
		const { fileList } = this.state;

		if (fileList.length === 0) {
			return (
				<div className={styles['upload-content']}>
					<Icon type="inbox" className={styles.inbox} />
					<span>{formatMessage({ id: 'photoManagement.mention1' })}</span>
				</div>
			);
		}

		if (fileList.length > 0) {
			return (
				<div>
					<Icon type="inbox" className={uploadable?styles['card-inbox']:styles['card-inbox-disabled']} />
					<p className="ant-upload-text">
						{formatMessage({ id: 'photoManagement.mention1' })}
					</p>
				</div>
			);
		}
		return null;

	}

	onRemove = (file) => {
		console.log('removed', file);
		const { removeFile } = this.props;
		removeFile(file.uid);
	}

	onUpload = ({ fileList }) => {

		// console.log('onUpload', fileList);
		const { groupRestCapacity, canSave, setFileList } = this.props;
		const capacity = groupRestCapacity();
		const limit = capacity < 20 ? capacity : 20;

		if(fileList.length >= limit){
			fileList.splice(limit, fileList.length);
		}

		fileList.forEach(item => {
			if(item.uploading){
				item.status = 'uploading';
				item.percent = 100;
			}
		});

		setFileList(fileList);
		this.setState({
			fileList
		});

		canSave(fileList);
	}

	beforeUpload = (file, fileList) => {
		const { groupRestCapacity, setFileList, uploadFileList, groupId } = this.props;

		const capacity = groupRestCapacity();
		const limit = capacity < 20 ? capacity : 20;

		if(fileList.length >= limit){
			fileList.splice(limit, fileList.length);
		}

		const isLt1M = file.size / 1024 / 1024 < 1;
		const isJPG = file.type === 'image/jpeg';
		const isPNG = file.type === 'image/png';
		const isPic = isJPG || isPNG;
		if(!(isLt1M && isPic)) {
			file.status = 'error';
			file.uploading = false;
		} else {
			file.status = 'uploading';
			file.uploading = true;
		}

		const last = fileList[fileList.length - 1];

		if(last === file) {
			const { fileList: stateFileList } = this.state;

			setFileList([
				...stateFileList,
				...fileList
			]);

			const uploadList = fileList.filter(item => item.uploading === true);
			uploadFileList(uploadList, groupId);
		}
		return false;
		// return isLt1M && isPic;

	}

	render() {
		const { saveBtnDisabled, uploadPhotoShown, handlePhotoSubmit, hideUpload, fileError, overAmount, uploadable } = this.props;
		const { fileList } = this.state;

		return(
			<Modal
				visible={uploadPhotoShown}
				title={formatMessage({ id: 'photoManagement.addPhoto' })}
				onCancel={hideUpload}
				onOk={() => {handlePhotoSubmit(fileList); }}
				width={800}
				maskClosable={false}
				okButtonProps={{ disabled: saveBtnDisabled }}
				destroyOnClose
			>
				<Upload
					listType="picture-card"
					fileList={fileList}
					onChange={this.onUpload}
					onRemove={this.onRemove}
					beforeUpload={this.beforeUpload}
					className={styles['upload-card']}
					showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
					disabled={!uploadable}
					multiple
				>
					{this.uploadElement()}
				</Upload>
				{
					(() => {
						if(fileError){
							return(<span className={styles['fail-info']}>{formatMessage({id: 'photoManagement.uploadFail'})}</span>);
						}
						if(overAmount){
							return <p>{formatMessage({ id: 'photoManagement.countOver2' })}</p>;
						}
						return <p>{formatMessage({ id: 'photoManagement.limitation' })}</p>;
					})()
				}
			</Modal>
		);
	}



}
export default PhotoUpload;