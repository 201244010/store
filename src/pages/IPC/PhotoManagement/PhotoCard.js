import React from 'react';
import { Card, Form, Checkbox, Modal, Radio, Upload, Row, Col, Avatar, Select, Input, Icon, message, DatePicker } from 'antd';
import { formatMessage } from 'umi/locale';
import {connect} from 'dva';
import moment from 'moment';
import { mbStringLength } from '@/utils/utils';
import styles from './PhotoManagement.less';
import { spaceInput } from '@/constants/regexp';
import manImage from '@/assets/imgs/male.png';
import womanImage from '@/assets/imgs/female.png';


const RadioGroup = Radio.Group;
const border = {border:'0.5px solid red'};
const redStyle = { color: 'red' };
const {Option} = Select;
const { confirm } = Modal;

@Form.create()
@connect(
	state => ({
		photoLibrary: state.photoLibrary,
		fileList: state.photoUpload.fileList
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
		getLibrary: () =>
			dispatch({
				type: 'photoLibrary/getLibrary'
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
			}),
		editFile: (file, groupId ) => {
			// console.log(file);
			dispatch({
				// type: 'photoUpload/editFile',
				type: 'photoUpload/uploadFileList',
				payload: {
					fileList: [file],
					groupId
				}
			});
		},
		setFile: (file) => {
			dispatch({
				type: 'photoUpload/setFileList',
				payload: {
					fileList: [file]
				}
			});
		},
		clearFileList: () => {
			dispatch({
				type: 'photoUpload/clearFileList',
			});
		},
		navigateTo: (pathId, urlParams) => dispatch({
			type: 'menu/goToPath',
			payload: {
				pathId,
				urlParams
			}
		}),
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
			fileUrl:'',
			// uploadFail: false,
			// uploadSuccess: false,
			isUpload: 0,
			isMessage: false,
			imageLoaded: false,
			isPickerOpen: false,
		};
	}

	componentDidMount () {
		const { image: src } = this.props;
		this.preloadImage(src);
	}

	componentWillReceiveProps(nextProps) {
		const { image: src, fileList } = nextProps;
		const { image } = this.props;
		// console.log('will', fileList);
		const { isMessage } = this.state;
		if (src !== image) {
			this.preloadImage(src);
		}
		if(fileList && fileList.length !== 0){
			const file = fileList[0];
			// console.log('will',file);
			if(file.response && file.response.verifyResult !== undefined && isMessage){
				const { fileName, verifyResult } = file.response;
				let isUpload = 0;
				if(verifyResult === 1 ) {
					message.success(formatMessage({id:'photoManagement.uploadSuccess'}));
					isUpload = 1;
				} else {
					message.error(formatMessage({id:'photoManagement.uploadFail'}));
					isUpload = 2;
				}
				this.getBase64(file, imageUrl => {
					this.setState({
						fileUrl: imageUrl,
						fileName,
						isUpload,
						isMessage: false,
						file
					});
				});
			}

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
		const { clearFileList } = this.props;
		this.setState({ infoFormVisible: false, fileName: '' }, ()=> {
			this.setState({isEdit: false, file: {}, isUpload: 0, fileUrl: ''});
			clearFileList();
		});
	};

	showRemove = () => {
		this.setState({
			removeVisible: true,
		});
	};

	hideRemove = () => {
		this.setState({
			targetLibrary: '',
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
		const { form, id , edit, libraryId, upload, groupId, getList, clearFileList } = this.props;
		form.validateFields(async errors => {
			if (!errors) {

				let isUpload = true;

				if(fileName !== '' && file.response !== undefined && file.response.verifyResult === 1) {
					const response = await upload({
						groupId,
						faceImgList: [fileName],
						faceId: id
					});
					// console.log(response);
					if(response) {
						isUpload = !response.data.failureList || response.data.failureList.length === 0;
					} else {
						isUpload = false;
					}

				}

				const fields = form.getFieldsValue();
				const birthday = form.getFieldValue('age');
				const age = moment().diff(birthday, 'year');
				console.log('age', age);

				const isEdit = await edit({
					faceId: id,
					name:fields.name,
					gender: fields.gender,
					sourceGroupId: libraryId,
					targetGroupId: fields.libraryName || libraryId,
					age,
				});

				// console.log(isUpload);

				if(isEdit && isUpload) {
					message.success(formatMessage({id: 'photoManagement.card.editSuccess'}));
				} else {
					message.error(formatMessage({id: 'photoManagement.card.editError'}));
				}
				getList();
				this.setState({infoFormVisible: false, isEdit: false, fileName: '', isUpload: 0, fileUrl: ''});
				clearFileList();
			}
		});
	};

	// 处理移库
	handleRemove = async () => {
		const { id, move, groupId, getList, getLibrary } = this.props;
		const { targetLibrary } = this.state;
		await move({faceIdList: [id], targetGroupId: targetLibrary, updateType: 1, sourceGroupId: groupId});
		this.hideRemove();
		getLibrary();
		getList();
	};

	handleTarget = e => {
		this.setState({
			targetLibrary: e.target.value,
		});
	};

	// 确定删除照片
	handleDelete = async () => {
		const { deletePhoto, id, groupId, getList, getLibrary } = this.props;
		await deletePhoto({faceIdList: [id], groupId});
		getList();
		getLibrary();
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
		const { photoLibrary: { ageRange } , age, ageRangeCode } = this.props;
		let ageName = formatMessage({id: 'photoManagement.unKnown'});
		if(age) {
			ageName = age;
		} else {
			switch(ageRangeCode) {
				case 1:
				case 2:
				case 3:
				case 18:
					ageName = formatMessage({id: 'photoManagement.ageLessInfo'});
					break;
				case 8:
					ageName = formatMessage({ id: 'photoManagement.ageLargeInfo'});
					break;
				default:
					if(ageRange) {
						ageRange.forEach(item => {
							if(item.ageRangeCode === ageRangeCode) {
								ageName = item.ageRange;
							}
						});
					}
			}
		}

		// console.log('aaaaaaaaa',ageName);
		return ageName;
	};

	mapAgeSelectInfo = (ageRangeCode, range) => {
		let ageRange = '';
		switch(ageRangeCode) {
			case 18:
				ageRange = formatMessage({id: 'photoManagement.ageLessInfo'});
				break;
			case 8:
				ageRange = formatMessage({id: 'photoManagement.ageLargeInfo'});
				break;
			default:
				ageRange = range;
		}
		return ageRange;
	}

	getBase64 = (img, callback) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	};


	beforeUpload = file => {
		// console.log('before',file);
		const { editFile, groupId, setFile } = this.props;
		const isLt1M = file.size / 1024 / 1024 < 1;
		const isJPG = file.type === 'image/jpeg';
		const isPNG = file.type === 'image/png';
		const isPic = isJPG || isPNG;
		if (!(isLt1M && isPic)) {
			file.status = 'error';
			message.error(formatMessage({id:'photoManagement.FailforOver'}));
			this.setState({
				file,
				isUpload: 2
			});
		} else {
			file.status = 'uploading';
			// this.editFile(file);
			editFile(file, groupId);
			this.setState({
				file,
				isMessage: true
			});
		}
		setFile(file);
		return false;
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
				// return count === 0 ? formatMessage({id: 'photoManagement.unKnown'}) : count;
				return count;
			case 'libraryName':
				return libraryName === '' ? formatMessage({id: 'photoManagement.unKnown'}) : libraryName;
			default: return 0;
		}
	};

	handleSelectInfo = type => {
		const { gender, ageRangeCode, age } = this.props;
		let birthday = '';
		// console.log(ageRange);
		switch (type) {
			case 'gender':
				if(gender === 1) {
					return 1;
				}
				if(gender === 2) {
					return 2;
				}
				return '';
			case 'age':
				if (age) {
					birthday = moment().subtract(age, 'year');
				} else {
					switch(ageRangeCode) {
						case 1:
						case 2:
						case 3:
						case 18:
							birthday = moment().subtract(18, 'year');
							break;
						case 4:
							birthday = moment().subtract(19, 'year');
							break;
						case 5:
							birthday = moment().subtract(29, 'year');
							break;
						case 6:
							birthday = moment().subtract(36, 'year');
							break;
						case 7:
							birthday = moment().subtract(46, 'year');
							break;
						case 8:
							birthday = moment().subtract(56, 'year');
							break;
						default: return moment();
					}
				}
				return birthday;
			default: return 0;
		}
	};

	handleLibraryName = value => {
		const { groupName } = value;
		switch(value.type) {
			case 1: return formatMessage({id: 'photoManagement.card.stranger'});
			case 2: return formatMessage({id: 'photoManagement.card.regular'});
			case 3: return formatMessage({id: 'photoManagement.card.employee'});
			case 4: return formatMessage({id: 'photoManagement.card.blacklist'});
			default: return groupName;
		}
	};

	isUploaded = () => {
		const { file: { status, response } } = this.state;
		if((status === 'uploading' || status === 'error') && status !== undefined) {
			return true;
		}
		if(status !== undefined ) {
			if(response !== undefined && response.verifyResult!== 1) {
				return true;
			}
		}
		return false;
	};

	handlePickerOpen = (status) => {
		console.log('open status', status);
		if(status) {
			this.setState({
				isPickerOpen: true
			});
		} else {
			this.setState({
				isPickerOpen: false
			});
		}
	};

	handlePickerPanel = (value) => {
		console.log('pnael>>>>', value);

		const { form: { setFieldsValue } } = this.props;
		if (value < moment()) {
			this.setState({
				isPickerOpen: false
			});
			setFieldsValue({ age: value });
		}
	};

	handleDate = (time) => {
		if(!time) {
			return false;
		}
		return time < moment();
	}

	dateStrFormat = (date, format = 'YYYY-MM-DD HH:mm:ss') =>
		date ? moment.unix(date).format(format) : undefined;


	render() {
		const {
			name,
			id,
			image,
			photoLibrary,
			form: {getFieldDecorator},
			// photoLibrary: { ageRange },
			groupId,
			/* age, */
			// ageRangeCode,
			gender,
			// count,
			// navigateTo
		} = this.props;
		const isChecked = photoLibrary.checkList.indexOf(id) >= 0;
		const { isEdit, infoFormVisible, removeVisible, fileUrl, imageLoaded, isUpload, isPickerOpen } = this.state;
		const images = {
			0: manImage,
			1: manImage,
			2: womanImage
		};
		const src = image || images[gender];
		const imageUrl = fileUrl || src;
		// console.log('url',imageUrl);
		// console.log(id, age, gender);
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
						<Avatar shape="square" size={150} icon='user' className={styles['pic-col']} src={src} />
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
							{/* <span>{formatMessage({id:'photoManagement.card.latestTime'})} : </span>
							<span>{this.handleInfo('latestDate')}</span> */}
							<span>{formatMessage({id:'photoManagement.card.createTime'})} : </span>
							<span>{this.handleInfo('createDate')}</span>
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
					destroyOnClose
				>
					{
						isEdit ?
							<Row className={styles['edit-content-span']}>
								<Col span={10}>
									<Upload
										beforeUpload={this.beforeUpload}
										className={styles['upload-card']}
										// fileList={[file]}
										showUploadList={false}
									>
										<div className={styles['upload-pic']}>
											{src !== '' &&
												<div
													style={{backgroundImage:`url("${imageUrl}")`}}
													className={styles['edit-pic-col']}
												/>
											}
											<div
												className={styles['word-on-pic']}
												style={isUpload === 2 ?border:{}}
											>
												<Icon type="edit" />
												<p>{formatMessage({id:'photoManagement.card.changeImg'})}</p>
											</div>
										</div>
									</Upload>
									{
										isUpload === 2 &&
										<div>
											<p>{formatMessage({id:'photoManagement.card.uploadFail'})}</p>
											{/* <Button onClick={()=>this.setState({file:{},fileUrl:'',uploadFail:false})}>
												{formatMessage({id:'photoManagement.card.cancel'})}
											</Button> */}
										</div>
									}
									{/* {
										uploadSuccess&&
										<div>
											<p>{formatMessage({id:'photoManagement.card.uploadSuccess'})}</p>
											<Button onClick={()=>this.setState({file:{},fileUrl:'',uploadSuccess:false})}>
												{formatMessage({id:'photoManagement.card.cancel'})}
											</Button>
										</div>
									} */}
								</Col>
								<Col span={14}>
									<div className={styles['edit-form']}>
										<Form
											className={styles['info-form']}
											  labelCol={{ lg: { span: 10 }}}
											  wrapperCol={{ lg: { span: 10 }}}
										>
											<Form.Item label={formatMessage({id:'photoManagement.name'})}>
												{getFieldDecorator('name', {
													rules: [
														{
															required: true,
															message: formatMessage({id:'photoManagement.card.alert1'})
														},
														{
															pattern: spaceInput,
															message: formatMessage({id: 'photoManagement.firstInputFormat'})
														},
														{
															// max: 20,
															validator: (rule, value, callback) => {
																const len = mbStringLength(value);
																if(len <= 20) {
																	callback();
																} else {
																	callback(false);
																}
															},
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
													// initialValue: this.handleSelectInfo('gender'),
													initialValue: gender === 0? '': gender,
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
													<Select dropdownMatchSelectWidth={false}>
														{photoLibrary.faceList.map((item, index) => (
															<Select.Option value={item.groupId} key={index}>
																{this.handleLibraryName(item)}
															</Select.Option>
														))}
													</Select>,
												)}
											</Form.Item>
											<Form.Item label={formatMessage({id:'photoManagement.birthday'})}>
												{getFieldDecorator('age', {
													initialValue: this.handleSelectInfo('age'),
													// initialValue: moment('01-01-1998','MM-DD-YYYY'),
													rules: [
														{
															required: true,
															message: formatMessage({id: 'photoManagement.card.ageMessage'})
														}
													]
												})(
													// <Select>
													// 	{
													// 		ageRange.map((item, index)=>
													// 			<Option value={item.ageRangeCode} key={index}>
													// 				{/* {item.ageRange} */}
													// 				{this.mapAgeSelectInfo(item.ageRangeCode, item.ageRange)}
													// 			</Option>)
													// 	}
													// </Select>,
													<DatePicker mode='year' format='YYYY' open={isPickerOpen} onOpenChange={this.handlePickerOpen} onPanelChange={this.handlePickerPanel} disabledDate={this.handleDate} />
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
										<Avatar shape="square" size={300} icon='user' className={styles['pic-col']} src={src} />
									</div>
								</Col>

								<Col span={14}>
									<div className={styles['edit-form']}>
										<Form
											className={styles['info-form']}
											labelCol={{ lg: { span: 10 }}}
											wrapperCol={{ lg: { span: 14 }}}
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
												<span>{this.handleInfo('count')}</span>
												{/* {
													count?
														<span className={styles['frequency-label']} onClick={() => navigateTo('entryDetail',{ faceId: id })}>{this.handleInfo('count')}</span>
														:
														<span>{this.handleInfo('count')}</span>
												} */}

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
					destroyOnClose
				>
					<Row className={styles['move-modal']}>
						<Col span={8}>
							<div className={styles['pic-col']}>
								<Avatar shape="square" size={150} icon='user' className={styles['pic-col']} src={src} />
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