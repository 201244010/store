import React from 'react';
import { Form, Button, Row, Col, Table, Card, Modal, Divider, message } from 'antd';
// import { Link } from 'dva/router';
import moment from 'moment';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { COL_THREE_NORMAL, FORM_FORMAT } from '@/constants/form';
import LibraryForm from './LibraryForm';

import styles from './FaceidLibrary.less';
import global from '@/styles/common.less';

class LibraryList extends React.Component {
	constructor(props) {
		super(props);

		// const { managePhotos} = this.props;

		this.state = {
			editFormShown: false,
			createFormShown: false,
			selectedRow: null,
		};

		this.columns = [
			{
				title: formatMessage({ id: 'faceid.libraryName' }),
				dataIndex: 'name',
				key: 'name',
				render: name => {
					switch (name) {
						case 'stranger':
							return formatMessage({ id: 'faceid.stranger' });
						case 'regular':
							return formatMessage({ id: 'faceid.regular' });
						case 'employee':
							return formatMessage({ id: 'faceid.employee' });
						case 'blacklist':
							return formatMessage({ id: 'faceid.blacklist' });
						default:
							return name;
					}
				},
			},
			{
				title: formatMessage({ id: 'faceid.rules' }),
				dataIndex: 'type',
				key: 'rules',
				render: type => {
					switch (type) {
						case 1:
							return formatMessage({ id: 'faceid.strangerInfo' });
						case 2:
							return formatMessage({ id: 'faceid.regularInfo' });
						case 3:
							return formatMessage({ id: 'faceid.employeeInfo' });
						case 4:
							return formatMessage({ id: 'faceid.blacklistInfo' });
						default:
							return '--';
					}
				},
			},
			{
				title: formatMessage({ id: 'faceid.remark' }),
				dataIndex: 'remarks',
				render: remark => {
					if (remark === '') {
						return '--';
					}
					return remark;
				},
			},
			{
				title: formatMessage({ id: 'faceid.photosAmount' }),
				dataIndex: 'amount',
				render: (amount, row) => `${amount}/${row.capacity}`,
			},
			{
				title: formatMessage({ id: 'faceid.updateTime' }),
				dataIndex: 'lastupdate',
				render: lastupdate => {
					if (!lastupdate) {
						return '--';
					}
					const d = moment(lastupdate * 1000);
					return d.format('YYYY-MM-DD HH:mm:ss');
				},
			},
			{
				title: formatMessage({ id: 'common.operation' }),
				dataIndex: 'type',
				render: (type, row) => (
					<div>
						<a
							className={styles['btn-operation']}
							href="javascript:void(0);"
							onClick={() => {
								this.managePhotos(row.id);
							}}
						>
							{formatMessage({ id: 'faceid.managePhoto' })}
						</a>
						<Divider type="veritcal" />
						<a
							className={styles['btn-operation']}
							href="javascript:void(0);"
							onClick={() => {
								this.showEditForm(row.id);
							}}
						>
							{formatMessage({ id: 'common.edit' })}
						</a>

						{type < 5 ? (
							''
						) : (
							<>
								<Divider type="veritcal" />
								<a
									className={styles['btn-operation']}
									href="javascript:void(0);"
									onClick={() => {
										// console.log(row);
										this.removeLibrary(row.id);
									}}
								>
									{formatMessage({ id: 'common.delete' })}
								</a>
							</>
						)}
					</div>
				),
			},
		];

		this.editingRow = {};

		this.maxLength = 10;

		// this.noCustomized = true;

		this.showEditForm = this.showEditForm.bind(this);
		this.closeEditForm = this.closeEditForm.bind(this);
		// this.editFieldChange = this.editFieldChange.bind(this);
		this.editLibrary = this.editLibrary.bind(this);
		// this.changeFields = this.changeFields.bind(this);
	}

	componentDidMount() {
		const { loadLibrary } = this.props;
		loadLibrary();
	}

	addFaceidLibraryHandler = (list, restCapacity) => {
		if (list.length >= this.maxLength) {
			Modal.info({
				title: formatMessage({ id: 'faceid.info' }),
				okText: formatMessage({ id: 'faceid.info.known' }),
				content: <div>{formatMessage({ id: 'faceid.list.length.max' })}</div>,
				onOk() {},
			});
			return;
		}

		if (restCapacity <= 0) {
			Modal.info({
				title: formatMessage({ id: 'faceid.info' }),
				okText: formatMessage({ id: 'faceid.info.known' }),
				content: <div>{formatMessage({ id: 'faceid.amount.max' })}</div>,
				onOk() {},
			});
			return;
		}

		this.setState({
			createFormShown: true,
		});
	};

	closeCreateForm = () => {
		this.setState({
			createFormShown: false,
		});
	};

	managePhotos = key => {
		const { navigateTo } = this.props;
		navigateTo('photoList', {
			groupId: key,
		});
	};
	// changeFields(id, fields) {
	// 	console.log(id, fields);
	// 	// const { libraryList } = this.state;

	// 	// const list = libraryList.map(item => {
	// 	// 	let obj = {};
	// 	// 	if (item.id === id) {
	// 	// 		obj = { ...item };
	// 	// 		fields.forEach(field => {
	// 	// 			console.log(field);
	// 	// 			obj[field.name] = field.value;
	// 	// 		});
	// 	// 		return obj;
	// 	// 	}
	// 	// 	return item;
	// 	// });

	// 	// this.setState({
	// 	// 	libraryList: list,
	// 	// });
	// }
	// editFieldChange(id, fields) {
	// 	const row = this.state.selectedRow;
	// 	console.log(fields);
	// 	// fields.forEach((item) => {
	// 	// 	row[item.name] = item.value;
	// 	// });

	// 	// this.setState({
	// 	// 	selectedRow: row
	// 	// });
	// }

	// deleteLibrary(id) {
	// 	const { removeLibrary } = this.props;
	// 	Modal.confirm({
	// 		title: formatMessage({ id: 'faceid.deleteLibrary' }),
	// 		context: formatMessage({ id: 'faceid.deleteInfo' }),
	// 		okText: formatMessage({ id: 'faceid.confirm' }),
	// 		cancelText: formatMessage({ id: 'faceid.cancel' }),
	// 		onOk: () => removeLibrary(id),
	// 	});
	// }

	createLibrary = () => {
		const { createLibrary } = this.props;
		const { form, id } = this.createForm.props;

		form.validateFields(errors => {
			if (!errors) {
				const fields = form.getFieldsValue();
				const capacity = parseInt(fields.capacity, 10);
				const params = {
					...fields,
					capacity,
				};
				// console.log(params);
				createLibrary({
					...params,
					id,
				});

				this.closeCreateForm();
			}
		});
	};

	removeLibrary = id => {
		// console.log('remove',id);
		const { faceIdLibrary, removeLibrary } = this.props;
		const target = faceIdLibrary.filter(item => {
			if (item.id === id) {
				return true;
			}
			return false;
		});
		// console.log(target);
		if (target[0].amount !== 0) {
			Modal.error({
				title: formatMessage({ id: 'faceid.deleteError' }),
				content: formatMessage({ id: 'faceid.deleteErrorMsg' }),
			});
		} else {
			Modal.confirm({
				title: formatMessage({ id: 'faceid.deleteLibrary' }),
				// content: formatMessage({ id: 'faceid.deleteInfo' }),
				okText: formatMessage({ id: 'faceid.confirm' }),
				cancelText: formatMessage({ id: 'faceid.cancel' }),
				okType: 'danger',
				onOk: () => removeLibrary(id),
			});
		}
	};

	// showInfoHandler = (list,restCapacity) => {
	// 	// list.length >= this.maxLength || restCapacity <= 0;
	// 	if(list.length >= this.maxLength){
	// 		Modal.info({
	// 			title: formatMessage({ id: 'faceid.info' }),
	// 			okText: formatMessage({ id: 'faceid.info.known' }),
	// 			content: (
	// 				<div>
	// 					{formatMessage({ id: 'faceid.list.length.max' })}
	// 				</div>
	// 			),
	// 			onOk() {},
	// 		});
	// 	}else if(restCapacity <= 0){
	// 		Modal.info({
	// 			title: formatMessage({ id: 'faceid.info' }),
	// 			okText: formatMessage({ id: 'faceid.info.known' }),
	// 			content: (
	// 				<div>
	// 					{formatMessage({ id: 'faceid.amount.max' })}
	// 				</div>
	// 			),
	// 			onOk() {},
	// 		});
	// 	}

	// }

	editLibrary() {
		const { editLibrary } = this.props;
		const { selectedRow } = this.state;
		const { form } = this.editForm.props;

		form.validateFields(errors => {
			if (!errors) {
				const fields = form.getFieldsValue();
				// console.log('fields',fields);
				const capacity = parseInt(fields.capacity, 10);
				const params = {
					...fields,
					capacity,
				};
				// console.log('params',params);
				editLibrary({
					...selectedRow,
					...params,
				});

				this.closeEditForm();
			}
		});
	}

	showEditForm(id) {
		const { faceIdLibrary } = this.props;

		const row = faceIdLibrary.filter(item => {
			if (id === item.id) {
				return true;
			}
			return false;
		});

		this.setState({
			selectedRow: row[0],
			editFormShown: true,
		});
	}

	closeEditForm() {
		this.setState({
			editFormShown: false,
		});
	}

	render() {
		// console.log(this.props);
		const { createFormShown, editFormShown, selectedRow } = this.state;
		const { faceIdLibrary, loading } = this.props;
		const totalCapacity = 30000;
		// const noCustom = list.every((item) => {
		// 	return item.isDefault === true;
		// });

		const restCapacity =
			totalCapacity - faceIdLibrary.reduce((total, item) => total + item.capacity, 0);
		// console.log(this.props);
		const list = faceIdLibrary;
		// console.log(restCapacity);
		// console.log(list);

		return (
			<div className="faceid-library-list">
				<Card bordered={false}>
					<div className={global['search-bar']}>
						<Form layout="inline">
							<Row gutter={FORM_FORMAT.gutter}>
								<Col {...COL_THREE_NORMAL}>
									<Form.Item>
										<Button
											type="primary"
											// disabled={list.length >= this.maxLength || restCapacity <= 0}
											onClick={() =>
												this.addFaceidLibraryHandler(list, restCapacity)
											}
											icon="plus"
											loading={
												loading.effects['faceIdLibrary/create'] ||
												loading.effects['faceIdLibrary/read']
											}
										>
											{formatMessage({ id: 'common.create' })}
										</Button>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</div>

					<div>
						<Table
							loading={loading.effects['faceIdLibrary/read']}
							columns={this.columns}
							dataSource={list}
							rowKey="id"
							rowClassName={(record, index) => {
								if (index % 2 === 0) {
									return styles['table-row-light'];
								}
								return styles['table-row-dark'];
							}}
							// expandedRowRender={record => {
							// 	return <p>{record.remarks}</p>;
							// }}
							pagination={false}
							// expandIconAsCell={false}
							// expandIconColumnIndex={1}
						/>
					</div>
					{/* {!this.noCustomized ? (
						''
					) : (
						<p>
							<span>
								{formatMessage({ id: 'faceid.createNote' })}
							</span>
							<a href="javascript:void(0);" onClick={this.showCreateForm}>
								{formatMessage({ id: 'faceid.createLibrary' })}
							</a>
						</p>
					)} */}
				</Card>

				<Modal
					title={formatMessage({ id: 'faceid.createLibrary' })}
					maskClosable={false}
					destroyOnClose
					visible={createFormShown}
					onCancel={this.closeCreateForm}
					onOk={this.createLibrary}
					okButtonProps={{
						loading: loading.effects['faceIdLibrary/create'],
					}}
					width={680}
				>
					<LibraryForm
						restCapacity={restCapacity}
						libraries={list}
						// id={parseInt(Math.random() * 1000 * 1000, 10)}
						isDefault={false}
						isEdit={false}
						// name=''
						wrappedComponentRef={form => {
							this.createForm = form;
						}}
					/>
				</Modal>

				<Modal
					title={formatMessage({ id: 'faceid.editLibrary' })}
					maskClosable={false}
					destroyOnClose
					visible={editFormShown}
					onCancel={this.closeEditForm}
					onOk={this.editLibrary}
					okButtonProps={{
						loading: loading.effects['faceIdLibrary/update'],
					}}
					width={680}
				>
					<LibraryForm
						wrappedComponentRef={form => {
							this.editForm = form;
						}}
						isEdit
						{...selectedRow}
						libraries={list}
						restCapacity={restCapacity}
						// changeFields={this.changeFields}
					/>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = state => {
	const { faceIdLibrary, loading } = state;
	return {
		faceIdLibrary,
		loading,
	};
};

const mapDispatchToProps = dispatch => ({
	loadLibrary: () => {
		dispatch({
			type: 'faceIdLibrary/read',
		}).then(code => {
			switch (code) {
				case 1:
					break;
				default:
					message.error(formatMessage({ id: 'faceid.operateFailed' }));
					break;
			}
		});
	},
	createLibrary: form => {
		dispatch({
			type: 'faceIdLibrary/create',
			payload: {
				library: form,
			},
		}).then(code => {
			switch (code) {
				case 1:
					message.success(formatMessage({ id: 'faceid.createSuccess' }));
					break;

				case 5506: // 最大条目数
				default:
					message.error(formatMessage({ id: 'faceid.createFailed' }));
					break;
			}
		});
	},
	editLibrary: row => {
		dispatch({
			type: 'faceIdLibrary/update',
			payload: {
				library: row,
			},
		}).then(code => {
			switch (code) {
				case 1:
					message.success(formatMessage({ id: 'faceid.updateSuccess' }));
					break;
				default:
					message.error(formatMessage({ id: 'faceid.updateFailed' }));
					break;
			}
		});
	},
	removeLibrary: id => {
		dispatch({
			type: 'faceIdLibrary/delete',
			payload: {
				id,
			},
		}).then(code => {
			switch (code) {
				case 1:
					message.success(formatMessage({ id: 'faceid.deleteSuccess' }));
					break;
				default:
					message.error(formatMessage({ id: 'faceid.deleteFailed' }));
					break;
			}
		});
	},
	navigateTo: (pathId, urlParams) =>
		dispatch({
			type: 'menu/goToPath',
			payload: {
				pathId,
				urlParams,
			},
		}),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LibraryList);
