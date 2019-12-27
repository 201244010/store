import React from 'react';
import {
	Card,
	Form,
	Select,
	Input,
	Button,
	Icon,
	Modal,
	Radio,
	Alert,
	Row,
	Col,
	Pagination,
	Checkbox,
	message,
	Empty,
	Spin,
} from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import PhotoCard from './PhotoCard';
import PhotoUpload from './PhotoUpload';
// import { handleResponse, handleUpload } from '../services/photoLibrary';
import { SEARCH_FORM_COL, SEARCH_FORM_GUTTER } from '@/constants/form';
import styles from './PhotoManagement.less';
import global from '@/styles/common.less';

const { Option } = Select;
const { confirm } = Modal;
const redStyle = { color: 'red' };

@connect(
	state => ({
		photoLibrary: state.photoLibrary,
		loading: state.loading,
	}),
	dispatch => ({
		getPhotoList: filter =>
			dispatch({
				type: 'photoLibrary/getPhotoList',
				payload: filter,
			}),
		getLibrary: () =>
			dispatch({
				type: 'photoLibrary/getLibrary',
			}),
		deletePhoto: payload =>
			dispatch({
				type: 'photoLibrary/deletePhoto',
				payload,
			}),
		movePhoto: payload =>
			dispatch({
				type: 'photoLibrary/move',
				payload,
			}),
		clear: () =>
			dispatch({
				type: 'photoLibrary/clearSelect',
			}),
		uploadFiles: (fileList, groupId) => {
			const result = dispatch({
				type:'photoLibrary/uploadFiles',
				payload: {
					fileList,
					groupId
				}
			});
			return result;
		},
		check: payload =>
			dispatch({
				type: 'photoLibrary/checked',
				payload,
			}),
		getRange: () =>
			dispatch({
				type: 'photoLibrary/getRange',
			}),
		saveFile: payload =>
			dispatch({
				type: 'photoLibrary/saveFile',
				payload,
			}),
		clearPhotoList: () =>
			dispatch({
				type: 'photoLibrary/clearPhotoList',
			}),
		clearFileList: () => {
			dispatch({
				type: 'photoUpload/clearFileList',
			});
		},
		setUploadHandler: (handler) =>
			dispatch({
				type: 'photoUpload/setUploadHandler',
				payload: {
					handler
				}
			}),
		checkClientExist: () =>
			dispatch({
				type: 'mqttStore/checkClientExist'
			}),
		unsubscribeTopic: () =>
			dispatch({
				type: 'photoUpload/unsubscribeTopic'
			}),
		changeFileList: (faceExtractList) => {
			dispatch({
				type: 'photoUpload/changeFileList',
				payload: {
					faceList: faceExtractList
				}
			});
		}
	})
)
@Form.create()
class PhotoManagement extends React.Component {

	isUpload = false;

	constructor(props) {
		super(props);
		this.state = {
			groupId: '',
			uploadPhotoShown: false,
			removeLibraryShown: false,
			overAmount: false,
			uploadable: true,
			fileError: false,
			saveBtnDisabled: true,
			removeRadioValue: 0,
			showFailedModal: false,
			failedList: [],
			filter: {
				pageNum: 1,
				pageSize: 9,
				name: '',
				age: 10,
				gender: -1,
			},

		};
	}



	componentDidMount () {
		const {
			getLibrary,
			getRange,
			location: {
				query: { groupId },
			},
		} = this.props;
		const id = parseInt(groupId, 10);
		this.setState({ groupId: id }, () => {
			this.getList();
		});
		getLibrary();
		getRange();
		this.checkMQTTClient();
	}

	componentWillUnmount() {
		const { clearPhotoList, clearFileList, unsubscribeTopic } = this.props;
		clearPhotoList();
		clearFileList();
		unsubscribeTopic();
	}

	// { handler: this.apHandler }

	// changeFileList = (faceExtractList) => {

	// 	const { changeFileList } = this.props;
	// 	changeFileList(faceExtractList);
	// }

	checkMQTTClient = async () => {
		clearTimeout(this.checkTimer);
		const { checkClientExist, setUploadHandler, changeFileList } = this.props;
		const isClientExist = await checkClientExist();
		if(isClientExist) {
			setUploadHandler(changeFileList);
		} else {
			this.checkTimer = setTimeout(() => this.checkMQTTClient(), 1000);
		}
	}

	getList = () => {
		const { filter, groupId } = this.state;
		const { getPhotoList } = this.props;
		getPhotoList({ ...filter, groupId });
	};

	showUpload = () => {
		const rest = this.groupRestCapacity();
		// console.log('show',rest);
		if (rest <= 0) {
			Modal.info({
				title: formatMessage({ id:'photoManagement.countOver2'}),
				okText: formatMessage({ id: 'photoManagement.confirm'}),
			});
			this.setState({
				uploadPhotoShown: false,
				overAmount: false,
				uploadable: false,
				fileError: false,

			});
		} else {
			this.setState({
				uploadPhotoShown: true,
				overAmount: false,
				uploadable: true,
				fileError: false,
			});
		}
	};

	hideUpload = () => {
		const { clearFileList } = this.props;
		clearFileList();
		// const rest = this.groupRestCapacity();
		this.setState({ uploadPhotoShown: false });
	};

	showRemove = () => {
		this.setState({
			removeLibraryShown: true,
		});
	};

	hideRemove = () => {
		this.setState({
			removeLibraryShown: false,
			removeRadioValue: 0
		});
	};

	showDelete = () => {
		confirm({
			title: formatMessage({ id: 'photoManagement.mention2' }),
			onCancel: this.hideDelete,
			onOk: this.onDelete,
			content: formatMessage({ id: 'photoManagement.mention3' }),
			icon: <Icon type="close-circle" theme="filled" style={redStyle} />,
			okType: 'danger',
			okText: formatMessage({ id: 'photoManagement.card.function3' }),
			cancelText: formatMessage({ id: 'photoManagement.card.cancel' }),
		});
	};


	// 确认移库
	onRemove = async () => {
		const {
			movePhoto,
			photoLibrary: { checkList },
			getLibrary,
		} = this.props;
		const { removeRadioValue, groupId } = this.state;
		this.hideRemove();
		await movePhoto({
			faceIdList: checkList,
			targetGroupId: removeRadioValue,
			updateType: 1,
			sourceGroupId: groupId,
		});
		this.getList();
		getLibrary();
	};

	// 确认删除
	onDelete = async () => {
		const {
			photoLibrary: { checkList },
			deletePhoto,
			getLibrary,
		} = this.props;
		const { groupId } = this.state;
		await deletePhoto({ faceIdList: checkList, groupId });
		this.getList();
		getLibrary();
	};



	// 确认新增照片上传
	handlePhotoSubmit = async (fileList) => {
		const { groupId } = this.state;
		const { saveFile, getLibrary, clearFileList } = this.props;
		// let isUpload = false;
		const list = fileList.map(item => {
			const {
				// response: {
				// 	data: { verifyResult, fileName },
				// },
				response: { verifyResult, fileName }
			} = item;
			if (verifyResult === 1) {
				return fileName;
			}
			return false;
		});

		if(!this.isUpload) {
			if (fileList.length === 0) {
				message.error(formatMessage({ id: 'photoManagement.noPhotoAlert' }));
			} else if (list.filter(item => item !== false).length === list.length) {
				this.isUpload = true;
				const response = await saveFile({ groupId, faceImgList: list });
				// console.log('save', response);
				if (response === false) {
					message.error(formatMessage({ id: 'photoManagement.addFailTitle' }));
				} else if (!response.data.failureList || response.data.failureList.length === 0) {
					message.success(formatMessage({ id: 'photoManagement.card.saveSuccess' }));
					this.setState({ uploadPhotoShown: false }, () => {
						clearFileList();
						this.isUpload = false;
					});
					getLibrary();
					this.getList();
				} else {
					this.setState({
						showFailedModal: true,
						failedList: response.data.failureList,
						uploadPhotoShown: false,
					});
					this.isUpload = false;
					clearFileList();
				}
			} else {
				message.error(formatMessage({ id: 'photoManagement.card.saveFail' }));
			}
		}

		// this.hideUpload();
	};

	// 处理性别下拉框筛选事件
	handleGender = value => {
		const { filter } = this.state;
		this.setState({ filter: { ...filter, gender: value } });
	};

	// 处理年龄下拉框筛选事件
	handleAge = value => {
		const { filter } = this.state;
		this.setState({ filter: { ...filter, age: value } });
	};

	// 处理搜索框事件
	handleName = value => {
		const { filter } = this.state;
		this.setState({ filter: { ...filter, name: value } });
	};

	// 处理分页
	handlePage = (page, size) => {
		const { getPhotoList, clear } = this.props;
		const { filter, groupId } = this.state;

		getPhotoList({ ...filter, pageNum: page, pageSize: size, groupId });
		this.setState({ filter: { ...filter, pageNum: page, pageSize: size } });
		clear();
	};

	// 全选
	handleFullChoose = e => {
		const {
			check,
			photoLibrary: { photoList },
		} = this.props;
		const list = photoList.map(item => item.faceId);
		check({ isChecked: e.target.checked, checkList: list });
	};

	// 判断本页是否全选
	isFullChecked = () => {
		const {
			photoLibrary: { checkList, photoList },
		} = this.props;
		const photoIdList = photoList.map(item => item.faceId);
		const filtered = photoIdList.filter(item => checkList.indexOf(item) > -1);
		return filtered.length === photoIdList.length && filtered.length !== 0;
	};

	// 处理移库单选框值
	removeRadioChange = e => {
		this.setState({ removeRadioValue: e.target.value });
	};

	canSave = (fileList) => {
		// console.log(fileList);
		const capacity = this.groupRestCapacity();
		const limit = capacity < 20 ? capacity : 20;

		const list = fileList.filter(item => item.status !== 'removed');
		const overAmount = list.length >= capacity;
		let fileError = false;
		let successList = 0;

		list.forEach(item => {
			if (item.status === 'done') {
				successList++;
			}
			if(item.status === 'error') {
				fileError = true;
			}
		});
		let overLimit = false;
		if (list.length > limit) {
			overLimit = true;
			this.setState({
				overAmount,
				uploadable: false,
				fileError,
				saveBtnDisabled: !(list.length > 0 && successList === list.length && !overLimit)
			});

		} else if(list.length === limit) {
			this.setState({
				overAmount,
				uploadable: false,
				fileError,
				saveBtnDisabled: !(list.length > 0 && successList === list.length && !overLimit)
			});
		} else if (list.length < limit) {
			this.setState({
				uploadable: true,
				fileError,
				overAmount,
				saveBtnDisabled: !(list.length > 0 && successList === list.length && !overLimit)
			});
		}

		return list.length > 0 && successList === list.length && !overLimit;
	}


	handleLibraryName = value => {
		const { type, groupName } = value;
		switch(type) {
			case 1: return formatMessage({id: 'photoManagement.card.stranger'});
			case 2: return formatMessage({id: 'photoManagement.card.regular'});
			case 3: return formatMessage({id: 'photoManagement.card.employee'});
			case 4: return formatMessage({id: 'photoManagement.card.blacklist'});
			default: return groupName;
		}
	};

	groupName = () => {
		const { groupId } = this.state;
		const {
			photoLibrary: { faceList },
		} = this.props;
		let name = {};
		faceList.forEach(item => {
			if (item.groupId === groupId) {
				name = item;
			}
		});

		switch(name.type) {
			case 1: return formatMessage({id: 'photoManagement.card.stranger'});
			case 2: return formatMessage({id: 'photoManagement.card.regular'});
			case 3: return formatMessage({id: 'photoManagement.card.employee'});
			case 4: return formatMessage({id: 'photoManagement.card.blacklist'});
			default: return name.groupName;
		}
	};

	groupRestCapacity = () => {
		const { groupId } = this.state;
		const {
			photoLibrary: { faceList },
		} = this.props;
		let restCapacity = 0;
		// const faceList = await getLibrary();
		// console.log('get',faceList);
		faceList.forEach(item => {
			if (item.groupId === groupId) {
				restCapacity = item.capacity - item.count;
			}
		});

		return restCapacity;
	};

	onSearch = () => {
		const { clear } = this.props;
		const { filter } = this.state;
		filter.pageNum = 1;
		this.setState({ filter }, () => {
			this.getList();
			clear();
		});
	};

	reset = () => {
		const {
			clear,
			getPhotoList,
			form: { resetFields },
		} = this.props;
		const { groupId } = this.state;
		const header = {
			pageNum: 1,
			pageSize: 9,
			name: '',
			age: 10,
			gender: -1,
		};
		this.setState({ filter: header }, async () => {
			resetFields();
			await getPhotoList({ ...header, groupId });
			clear();
		});
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

	render() {
		const {
			form: { getFieldDecorator },
		} = this.props;
		const {
			removeRadioValue,
			groupId,
			uploadPhotoShown,
			removeLibraryShown,
			showFailedModal,
			failedList,
			overAmount,
			uploadable,
			fileError,
			saveBtnDisabled,
			filter: { gender, name, age, pageNum, pageSize },
		} = this.state;

		const {
			photoLibrary: { photoList, faceList, total, checkList, ageRange },
			clear,
			loading,
		} = this.props;
		const fullChosen = this.isFullChecked();
		// console.log(faceList);
		// const rest = this.groupRestCapacity();
		// console.log('photo',photoList);
		// console.log(fileError, uploadable);
		return (
			<Card className={styles['management-card']}>
				<h2>{this.groupName()}</h2>

				<div className={global['search-bar']}>
					<Form layout="inline">
						<Row gutter={SEARCH_FORM_GUTTER.NORMAL}>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item label={formatMessage({ id: 'photoManagement.gender' })}>
									{getFieldDecorator('gender', {
										initialValue: gender,
									})(
										<Select onChange={value => this.handleGender(value)}>
											<Option value={-1}>
												{formatMessage({ id: 'photoManagement.all' })}
											</Option>
											<Option value={1}>
												{formatMessage({ id: 'photoManagement.male' })}
											</Option>
											<Option value={2}>
												{formatMessage({ id: 'photoManagement.female' })}
											</Option>
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item label={formatMessage({ id: 'photoManagement.age' })}>
									{getFieldDecorator('age', {
										initialValue: age,
									})(
										<Select onChange={value => this.handleAge(value)}>
											<Option value={10}>
												{formatMessage({ id: 'photoManagement.all' })}
											</Option>
											{ageRange && ageRange.map((item, index) => (
												<Option value={item.ageRangeCode} key={index}>
													{/* {item.ageRange} */}
													{this.mapAgeSelectInfo(item.ageRangeCode, item.ageRange)}
												</Option>
											))}
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col {...SEARCH_FORM_COL.ONE_THIRD}>
								<Form.Item label={formatMessage({ id: 'photoManagement.keyword' })}>
									{getFieldDecorator('key', {
										initialValue: name,
									})(
										<Input
											placeholder={formatMessage({
												id: 'photoManagement.queryPlaceholder',
											})}
											className={styles['search-input']}
											onChange={e => this.handleName(e.target.value)}
										/>
									)}
								</Form.Item>
							</Col>
							<Col {...SEARCH_FORM_COL.OFFSET_TWO_THIRD}>
								<Form.Item className={global['query-item']}>
									<Button
										onClick={this.onSearch}
										type="primary"
										className={styles['reset-btn']}
									>
										{formatMessage({ id: 'photoManagement.buttonSearch' })}
									</Button>

									<Button
										onClick={this.reset}
										className={global['btn-margin-left']}
									>
										{formatMessage({ id: 'photoManagement.buttonReset' })}
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</div>

				<div>
					<Button
						type="primary"
						onClick={this.showUpload}
						className={styles['add-photo-btn']}
					>
						{formatMessage({ id: 'photoManagement.addPhoto' })}
					</Button>

					<Button
						className={styles['add-photo-btn']}
						onClick={this.showRemove}
						disabled={checkList.length === 0}
					>
						{formatMessage({ id: 'photoManagement.plentyMove' })}
					</Button>

					<Button onClick={this.showDelete} disabled={checkList.length === 0}>
						{formatMessage({ id: 'photoManagement.plentyDelete' })}
					</Button>
				</div>


				<Alert
					message={
						<div>
							<Checkbox checked={fullChosen} onChange={this.handleFullChoose}>
								{formatMessage({ id: 'photoManagement.allChoose' })}
							</Checkbox>
							{formatMessage({ id: 'photoManagement.alreadyChoose' })}
							{checkList.length}
							{formatMessage({ id: 'photoManagement.type' })}
							{checkList.length > 0 && (
								<a href="javascript:void(0);" onClick={clear}>
									{formatMessage({ id: 'photoManagement.clear' })}
								</a>
							)}
						</div>
					}
					type="info"
					showIcon={false}
					className={styles.alert}
				/>

				<Spin
					spinning={loading.effects['photoLibrary/getPhotoList']}
					size="large"
					wrapperClassName={styles.spin}
				>
					{photoList.length > 0 ? (
						<Row type="flex" gutter={{ sm: 16 }}>
							{photoList.map((item, key) => (
								<Col key={key} span={8}>
									<PhotoCard
										id={item.faceId}
										name={item.name}
										gender={item.gender}
										age={item.age}
										ageRangeCode={item.ageRangeCode}
										latestDate={item.lastArrivalTime}
										createDate={item.createTime}
										libraryName={this.groupName()}
										libraryId={item.groupId}
										count={item.arrivalCount}
										image={item.imgUrl}
										groupId={groupId}
										getList={this.getList}
									/>
								</Col>
							))}
						</Row>
					) : (
						<Empty className={styles.alert} />
					)}
				</Spin>

				{total > 0 && (
					<Pagination
						pageSizeOptions={['9', '18']}
						total={total}
						defaultPageSize={9}
						showQuickJumper
						showSizeChanger
						onShowSizeChange={(page, size) => this.handlePage(page, size)}
						onChange={(page, size) => this.handlePage(page, size)}
						className={styles.pagination}
						current={pageNum}
						pageSize={pageSize}
					/>
				)}

				<PhotoUpload
					uploadPhotoShown={uploadPhotoShown}
					handlePhotoSubmit={this.handlePhotoSubmit}
					hideUpload={this.hideUpload}
					groupRestCapacity={this.groupRestCapacity}
					groupId={groupId}
					overAmount={overAmount}
					uploadable={uploadable}
					fileError={fileError}
					canSave={this.canSave}
					saveBtnDisabled={saveBtnDisabled}
				/>

				<Modal
					visible={removeLibraryShown}
					title={formatMessage({ id: 'photoManagement.plentyMoveTo' })}
					onCancel={this.hideRemove}
					onOk={this.onRemove}
					maskClosable={false}
					width={640}
					destroyOnClose
				>
					<Row>
						<Col span={6}>{formatMessage({ id: 'photoManagement.plentyMoveTo' })}</Col>
						<Col span={18}>
							<Radio.Group
								defaultValue={null}
								value={removeRadioValue}
								onChange={this.removeRadioChange}
							>
								{faceList.map((item, index) => {
									const disabled = groupId === item.groupId;
									return (
										<Radio value={item.groupId} key={index} disabled={disabled}>
											{this.handleLibraryName(item)}
										</Radio>
									);
								})}
							</Radio.Group>
						</Col>
					</Row>
				</Modal>

				<Modal
					visible={showFailedModal}
					onCancel={() => this.setState({ showFailedModal: false })}
					title={formatMessage({ id: 'photoManagement.addFailTitle' })}
					footer={false}
					maskClosable={false}
					width={528}
				>
					<Alert
						message={formatMessage({ id: 'photoManagement.addFailContent' })}
						type="error"
					/>
					{failedList.map((item, index) => (
						<div
							className={styles['fail-list-modal']}
							style={{ backgroundImage: `url("${item.imgUrl}")` }}
							key={index}
						/>
					))}
				</Modal>
			</Card>
		);
	}
}

export default PhotoManagement;