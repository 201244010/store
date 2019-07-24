import React from 'react';
import { Card, Form, Checkbox, Modal, Radio, Upload, Row, Col, Avatar, Select, Input, Icon, message } from 'antd';
// import PhotoForm from './PhotoForm';
import {formatMessage} from 'umi/locale';
import {connect} from 'dva';
import Button from 'antd/es/button';
import moment from 'moment';
import { handleResponse, handleUpload } from '../services/photoLibrary';
import styles from './PhotoManagement.less';



const RadioGroup = Radio.Group;
const border = {border:'0.5px solid red'};
const redStyle = { color: 'red' };
const {Option} = Select;
const { confirm } = Modal;

@Form.create()
@connect(
	state => ({
		photoLibrary: state.photoLibrary,
	}),
	dispatch => ({
		deletePhoto: payload =>
			dispatch({
				type: 'photoLibrary/deletePhoto',
				payload
			})
		,
		getPhotoList: filter =>
			dispatch({
				type: 'photoLibrary/getPhotoList',
				payload: filter
			})
		,
		check: payload =>
			dispatch({
				type: 'photoLibrary/checked',
				payload
			})
		,
		move: payload =>
			dispatch({
				type: 'photoLibrary/move',
				payload
			})
		,
		edit: payload =>
			dispatch({
				type: 'photoLibrary/edit',
				payload
			}),
		upload: payload =>
			dispatch({
				type: 'photoLibrary/saveFile',
				payload
			})
		,
	})
)
class PhotoCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			infoFormVisible: false,
			removeVisible: false,
			targetLibrary: '',
			isEdit: false,
			file: {},
			fileName: '',
			uploadFail: false,
			uploadSuccess: false,
			imageLoaded: false,
		};
	}
	
	componentDidMount () {
		const { image: src } = this.props;
		this.preloadImage(src);
	}
	
	componentWillReceiveProps(nextProps) {
		const { image: src } = nextProps;
		const { image } = this.props;
		if (src !== image) {
			this.preloadImage(src);
		}
	}
	
	preloadImage = (src) => {
		this.setState({
			imageLoaded: false
		});
		
		const image = new Image();
		image.src = src;
		image.addEventListener('load', () => {
			this.setState({
				imageLoaded: true
			});
		});

		image.addEventListener('error', () => {
			this.setState({
				imageLoaded: true
			});
		});
	};
	
	showInfo = () => {
		this.setState({
			infoFormVisible: true,
		});
	};
	
	hideInfo = () => {
		this.setState({ infoFormVisible: false, fileName: '' }, ()=> {
			this.setState({isEdit: false, file: {}, uploadSuccess: false, uploadFail: false});
		});
	};
	
	showRemove = () => {
		this.setState({
			removeVisible: true,
		});
	};
	
	hideRemove = () => {
		this.setState({
			removeVisible: false,
		});
	};
	
	showDelete = () => {
		confirm({
			title: formatMessage({id:'photoManagement.mention4'}),
			onCancel: this.hideDelete,
			onOk: this.handleDelete,
			content: formatMessage({id:'photoManagement.mention3'}),
			icon: <Icon type='close-circle' theme='filled' style={redStyle} />,
			okType: 'danger',
			okText: formatMessage({id: 'photoManagement.card.function3'}),
			cancelText: formatMessage({id: 'photoManagement.card.cancel'})
		});
	};
	
	hideDelete = () => {
	
	};
	
	// 处理保存编辑结果
	handleSubmit = () => {
		const { fileName, file} = this.state;
		const { form, id , edit, libraryId, upload, groupId, getList } = this.props;
		form.validateFields(async errors => {
			if (!errors) {
				const fields = form.getFieldsValue();
				const isEdit = await edit({
					faceId: id,
					name:fields.name,
					gender: fields.gender,
					sourceGroupId: libraryId,
					targetGroupId: fields.libraryName || libraryId,
					age: fields.age
				});
				
				let isUpload = true;
				
				if(fileName !== '' && file.response !== undefined && file.response.data.verifyResult === 1) {
					isUpload = await upload({
						groupId,
						faceImgList: [fileName]
					});
				}
				isEdit && isUpload ?
					message.success(formatMessage({id: 'photoManagement.card.editSuccess'}))
					:
					message.error(formatMessage({id: 'photoManagement.card.editError'}));
				getList();
				this.setState({infoFormVisible: false, isEdit: false, fileName: '', uploadFail: false, uploadSuccess: false});
			}
		});
	};
	
	// 处理移库
	handleRemove = async () => {
		const { id, move, groupId, getList } = this.props;
		const { targetLibrary } = this.state;
		await move({faceIdList: [id], targetGroupId: targetLibrary, updateType: 1, sourceGroupId: groupId});
		this.hideRemove();
		getList();
	};
	
	handleTarget = e => {
		this.setState({
			targetLibrary: e.target.value,
		});
	};
	
	// 确定删除照片
	handleDelete = async () => {
		const { deletePhoto, id, groupId, getList } = this.props;
		await deletePhoto({faceIdList: [id], groupId});
		getList();
		this.hideDelete();
	};
	
	handleEdit = () => {
		this.setState({
			isEdit: true
		});
	};
	
	handleCheckbox = (e) => {
		// 根据e.target.checked来设置加进checklist或者从checklist中删掉
		const { check, id } = this.props;
		check({isChecked: e.target.checked, checkList: [id]});
	};
	
	ageRange = () => {
		const { photoLibrary: {ageRange} , age } = this.props;
		let ageName = formatMessage({id: 'photoManagement.unKnown'});
		ageRange.forEach(item => {
			if(item.ageCode === age) {
				ageName = item.ageRange;
			}
		});
		return ageName;
	};
	
	upload = file => {
		file = handleResponse(file);
		const { file: { status }} = file;
		if (status === 'done') {
			const { file: { response }} = file;
			const { code, data: {verifyResult}} = response;
			if(verifyResult === 1 && code === 1 ) {
				message.success(formatMessage({id:'photoManagement.uploadSuccess'}));
				this.setState({fileName: response.data.fileName, uploadSuccess: true});
			} else {
				message.error(formatMessage({id:'photoManagement.uploadFail'}));
				this.setState({uploadFail: true});
			}
			
		} else if (status === 'error') {
			message.error(formatMessage({id:'photoManagement.uploadFail'}));
		}
		this.setState({
			file: file.file
		});
	};
	
	beforeUpload = file => {
		const isLt1M = file.size / 1024 / 1024 < 1;
		const isJPG = file.type === 'image/jpeg';
		const isPNG = file.type === 'image/png';
		const isPic = isJPG || isPNG;
		if (!(isLt1M && isPic)) {
			file.status = 'error';
		}
		return isLt1M && isPic;
	};
	
	handleInfo = type => {
		const { name, gender, latestDate, createDate, count, libraryName } = this.props;
		switch(type) {
			case 'name': return name === '' ? formatMessage({id: 'photoManagement.unKnown'}) : name;
			case 'gender':
				if(gender === 1) {
					return formatMessage({id: 'photoManagement.male'});
				}
				if(gender === 2) {
					return formatMessage({id: 'photoManagement.female'});
				}
				return formatMessage({id: 'photoManagement.unKnown'});
			case 'latestDate':
				return latestDate === 0 ? formatMessage({id: 'photoManagement.unKnown'}) : this.dateStrFormat(latestDate);
			case 'createDate':
				return createDate === 0 ? formatMessage({id: 'photoManagement.unKnown'}) : this.dateStrFormat(createDate);
			case 'count':
				return count === 0 ? formatMessage({id: 'photoManagement.unKnown'}) : count;
			case 'libraryName':
				return libraryName === '' ? formatMessage({id: 'photoManagement.unKnown'}) : libraryName;
			default: return 0;
		}
	};
	
	handleSelectInfo = type => {
		const { gender, age, photoLibrary: {ageRange} } = this.props;
		let ageName = '';
		switch (type) {
			case 'gender':
				if(gender === 1) {
					return 1;
				}
				if(gender === 2) {
					return 2;
				}
				return ageName;
			case 'age':
				ageRange.forEach(item => {
					if(item.ageCode === age) {
						ageName = item.ageCode;
					}
				});
				return ageName;
			default: return 0;
		}
	};
	
	handleLibraryName = value => {
		const { groupName } = value;
		switch(value.type) {
			case 1: return formatMessage({id: 'photoManagement.card.libraryName1'});
			case 2: return formatMessage({id: 'photoManagement.card.libraryName2'});
			case 3: return formatMessage({id: 'photoManagement.card.libraryName3'});
			case 4: return formatMessage({id: 'photoManagement.card.libraryName4'});
			default: return groupName;
		}
	};
	
	isUploaded = () => {
		const { file: { status, response } } = this.state;
		if(status === 'uploading' && status !== undefined) {
			return true;
		}
		if(status !== undefined ) {
			if(response !== undefined && response.code !== 1) {
				return true;
			}
		}
		return false;
	};
	
	dateStrFormat = (date, format = 'YYYY-MM-DD HH:mm:ss') =>
		date ? moment.unix(date).format(format) : undefined;
	
	
	render() {
		const {
			name,
			id,
			image,
			photoLibrary,
			form: {getFieldDecorator},
			photoLibrary: { ageRange },
			groupId
		} = this.props;
		const isChecked = photoLibrary.checkList.indexOf(id) >= 0;
		const { isEdit, uploadFail, infoFormVisible, removeVisible, file, uploadSuccess, imageLoaded } = this.state;
		
		return (
			<Card
				actions={[
					<a href="javascript:void(0);" onClick={this.showInfo}>
						{formatMessage({id:'photoManagement.card.function1'})}
					</a>,
					<a href="javascript:void(0);" onClick={this.showRemove}>
						{formatMessage({id:'photoManagement.card.function2'})}
					</a>,
					<a href="javascript:void(0);" onClick={this.showDelete}>
						{formatMessage({id:'photoManagement.card.function3'})}
					</a>,
				]}
				loading={!imageLoaded}
				className={styles['info-card']}
				bodyStyle={{padding: 0, height: 150}}
			>
				<div>
					<div className={styles['pic-col']}>
						<Avatar shape="square" size={150} icon='user' className={styles['pic-col']} src={image} />
					</div>
					<div className={styles['word-col']}>
						<span className={styles['info-card-span']} title={this.handleInfo('name')}>
							{`${formatMessage({id:'photoManagement.name'})} : ${this.handleInfo('name')}`}
						</span>
						<span className={styles['info-card-span']}>
							{`${formatMessage({id:'photoManagement.gender'})} : ${this.handleInfo('gender')}`}
						</span>
						<span className={styles['info-card-span']}>
							{formatMessage({id:'photoManagement.age'})} : {this.ageRange()}
						</span>
						<span className={styles['info-card-span']}>
							<span>{formatMessage({id:'photoManagement.card.latestTime'})} : </span>
							<span>{this.handleInfo('latestDate')}</span>
						</span>
						<Checkbox
							className={styles['card-checkbox']}
							checked={isChecked}
							onChange={this.handleCheckbox}
						/>
					</div>
				</div>
				
				<Modal
					visible={infoFormVisible}
					title={formatMessage({id:'photoManagement.card.detail'})}
					onCancel={this.hideInfo}
					onOk={isEdit?()=> this.handleSubmit():this.handleEdit}
					cancelText={formatMessage({id:'photoManagement.card.cancel'})}
					okText={isEdit ?
						formatMessage({id:'photoManagement.card.save'}) :
						formatMessage({id:'photoManagement.card.edit'})}
					className={styles['edit-modal']}
					width={840}
					maskClosable={false}
					okButtonProps={{disabled:this.isUploaded()}}
				>
					{
						isEdit ?
							<Row className={styles['edit-content-span']}>
								<Col span={10}>
									<Upload
										onChange={this.upload}
										beforeUpload={this.beforeUpload}
										className={styles['upload-card']}
										fileList={[file]}
										showUploadList={false}
										{...handleUpload(groupId)}
									>
										<div className={styles['upload-pic']}>
											{image !== '' &&
												<div
													style={{backgroundImage:`url(${image})`}}
													className={styles['edit-pic-col']}
												/>
											}
											<div
												className={styles['word-on-pic']}
												style={uploadFail?border:{}}
											>
												<Icon type="edit" />
												<p>{formatMessage({id:'photoManagement.card.changeImg'})}</p>
											</div>
										</div>
									</Upload>
									{
										uploadFail&&
										<div>
											<p>{formatMessage({id:'photoManagement.card.uploadFail'})}</p>
											<Button onClick={()=>this.setState({file:{},uploadFail:false})}>
												{formatMessage({id:'photoManagement.card.cancel'})}
											</Button>
										</div>
									}
									{
										uploadSuccess&&
										<div>
											<p>{formatMessage({id:'photoManagement.card.uploadSuccess'})}</p>
											<Button onClick={()=>this.setState({file:{},uploadSuccess:false})}>
												{formatMessage({id:'photoManagement.card.cancel'})}
											</Button>
										</div>
									}
								</Col>
								<Col span={14}>
									<div className={styles['edit-form']}>
										<Form
											className={styles['info-form']}
											  labelCol={{ lg: { span: 10 }}}
											  wrapperCol={{ lg: { span: 6 }}}
										>
											<Form.Item label={formatMessage({id:'photoManagement.name'})}>
												{getFieldDecorator('name', {
													rules: [
														{
															required: true,
															message: formatMessage({id:'photoManagement.card.alert1'})
														},
														{
															max: 20,
															message: formatMessage({id:'photoManagement.card.alert2'})
														},
													],
													initialValue: name
												})(<Input />)}
											</Form.Item>
											<Form.Item label="ID">
												<span>{id}</span>
											</Form.Item>
											<Form.Item label={formatMessage({id:'photoManagement.gender'})}>
												{getFieldDecorator('gender', {
													initialValue: this.handleSelectInfo('gender'),
													rules: [
														{
															required: true,
															message: formatMessage({id: 'photoManagement.card.genderMessage'})
														}
													]
												})(
													<Select>
														<Option value={1} key={1}>
															{formatMessage({id:'photoManagement.male'})}
														</Option>
														<Option value={2} key={2}>
															{formatMessage({id:'photoManagement.female'})}
														</Option>
													</Select>,
												)}
											</Form.Item>
											<Form.Item label={formatMessage({id:'photoManagement.card.libraryName'})}>
												{getFieldDecorator('libraryName', {
													initialValue: groupId
												})(
													<Select>
														{photoLibrary.faceList.map(item => (
															<Select.Option value={item.groupId} key={item.groupId}>
																{this.handleLibraryName(item)}
															</Select.Option>
														))}
													</Select>,
												)}
											</Form.Item>
											<Form.Item label={formatMessage({id:'photoManagement.age'})}>
												{getFieldDecorator('age', {
													initialValue: this.handleSelectInfo('age'),
													rules: [
														{
															required: true,
															message: formatMessage({id: 'photoManagement.card.ageMessage'})
														}
													]
												})(
													<Select>
														{
															ageRange.map(item=>
																<Option value={item.ageCode} key={item.ageCode}>
																	{item.ageRange}
																</Option>)
														}
													</Select>,
												)}
											</Form.Item>
											<Form.Item label={formatMessage({id:'photoManagement.card.frequency'})}>
												<span>{this.handleInfo('count')}</span>
											</Form.Item>
											<Form.Item label={formatMessage({id:'photoManagement.card.createTime'})}>
												<span>{this.handleInfo('createDate')}</span>
											</Form.Item>
											<Form.Item label={formatMessage({id:'photoManagement.card.latestTime'})}>
												<span>{this.handleInfo('latestDate')}</span>
											</Form.Item>
										</Form>
									</div>
								</Col>
							</Row>
							:
							<Row>
								<Col span={10}>
									<div className={styles['pic-col']}>
										<Avatar shape="square" size={300} icon='user' className={styles['pic-col']} src={image} />
									</div>
								</Col>
								
								<Col span={14}>
									<div className={styles['edit-form']}>
										<Form
											className={styles['info-form']}
											labelCol={{ lg: { span: 10 }}}
											wrapperCol={{ lg: { span: 6 }}}
										>
											<Form.Item label={formatMessage({id:'photoManagement.name'})}>
												{this.handleInfo('name')}
											</Form.Item>
											<Form.Item label="ID">
												{id}
											</Form.Item>
											<Form.Item label={formatMessage({id:'photoManagement.gender'})}>
												{this.handleInfo('gender')}
											</Form.Item>
											<Form.Item label={formatMessage({id:'photoManagement.card.libraryName'})}>
												{this.handleInfo('libraryName')}
											</Form.Item>
											<Form.Item label={formatMessage({id:'photoManagement.age'})}>
												{this.ageRange()}
											</Form.Item>
											<Form.Item label={formatMessage({id:'photoManagement.card.frequency'})}>
												{this.handleInfo('count')}
											</Form.Item>
											<Form.Item label={formatMessage({id:'photoManagement.card.createTime'})}>
												{this.handleInfo('createDate')}
											</Form.Item>
											<Form.Item label={formatMessage({id:'photoManagement.card.latestTime'})}>
												{this.handleInfo('latestDate')}
											</Form.Item>
										</Form>
									</div>
								</Col>
							</Row>
					}
				</Modal>
				<Modal
					visible={removeVisible}
					title={formatMessage({id:'photoManagement.move'})}
					onCancel={this.hideRemove}
					onOk={this.handleRemove}
					maskClosable={false}
					width={640}
				>
					<Row className={styles['move-modal']}>
						<Col span={8}>
							<div className={styles['pic-col']}>
								<Avatar shape="square" size={150} icon='user' className={styles['pic-col']} src={image} />
							</div>
						</Col>
						<Col span={16}>
							<span className={styles['content-span']}>
								{`${formatMessage({id:'photoManagement.name'})} : ${this.handleInfo('name')}`}
							</span>
							<span className={styles['content-span']}>
								{`${formatMessage({id:'photoManagement.gender'})} : ${this.handleInfo('gender')}`}
							</span>
							<span className={styles['content-span']}>
								{formatMessage({id:'photoManagement.age'})} : {this.ageRange()}
							</span>
							<Row className={styles['content-radio']}>
								<Col span={4} className={styles.move}> {formatMessage({id:'photoManagement.moveTo'})}</Col>
								<Col span={20} className={styles.radio}>
									<RadioGroup onChange={this.handleTarget}>
										{photoLibrary.faceList.map((item, index) => {
											const disabled = groupId === item.groupId;
											return(
												<Radio value={item.groupId} key={index} disabled={disabled}>
													{this.handleLibraryName(item)}
												</Radio>
											);
										})}
									</RadioGroup>
								</Col>
							</Row>
						</Col>
					</Row>
				</Modal>
			</Card>
		);
	}
}
export default PhotoCard;