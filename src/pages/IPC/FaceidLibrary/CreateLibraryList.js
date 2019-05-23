import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Button, Divider, Card,  Form } from 'antd';
import { FormattedMessage } from 'umi/locale';
import LibraryForm from './LibraryForm';

import { FORM_ITEM_LAYOUT_COMMON } from '@/constants/form';


const generateDefaultLibrary = () => {
	const defaultLibrary = {
		id: parseInt(Math.random()*1000*1000, 10),
		name: '',
		isDefault: false,
		capacity: '',
		amount: '',
		remarks: ''
	};

	return defaultLibrary;
};

class CreateLibraryList extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			libraryList: [
				generateDefaultLibrary()
			]
		};

		this.snapshot = [];
		this.noCustomized = true;


		this.forms = [];

		this.addForm = this.addForm.bind(this);
		this.removeForm = this.removeForm.bind(this);
		this.submitForm = this.submitForm.bind(this);
		// this.changeFields = this.changeFields.bind(this);
	}

	componentDidMount() {
		const { loadLibrary } = this.props;

		loadLibrary();
	}

	addForm() {
		const form = generateDefaultLibrary();

		const { libraryList } = this.state;
		libraryList.push(form);

		this.setState({
			libraryList
		});
	}

	removeForm(id) {
		const { libraryList } = this.state;

		let target = 0;
		libraryList.every((item, index) => {
			if (item.id === id){
				target = index;
				return false;
			};
			return true;
		});

		libraryList.splice(target, 1);

		this.setState({
			libraryList
		});

	}

	// changeFields(id, fields) {
	// 	this.snapshot.every((item) => {
	// 		if (item.id === id){
	// 			fields.forEach((field) => {
	// 				item[field.name] = field.value;
	// 			});
	// 			return false;
	// 		}
	// 		return true;
	// 	});
	// }

	submitForm() {
		const { faceIdLibrary, createLibrary, updateLibrary } = this.props;

		const updateList = [];
		const createList = [];
		let noErrorflag = true;

		this.forms.forEach((component) => {
			if (!component){
				return;
			}

			const { form, id } = component.props;
			form.validateFields((errors) => {
				if (errors){
					noErrorflag = false;
				}else{
					const fields = form.getFieldsValue();
					let defaultFlag = false;	// 判断是否在默认库里面
					const pushFlag = faceIdLibrary.some((item) => {
						if (item.id === id){
							defaultFlag = true;
							let sameFlag = true;
							// for (const property in fields){
							// 	if (fields.hasOwnProperty(property)){
							// 		if (fields[property] !== item[property]){
							// 			sameFlag = false;
							// 		}
							// 	}
							// }

							const properties = Object.keys(fields);
							properties.forEach(property => {
								if (fields[property] !== item[property]){
									sameFlag = false;
								};
							});

							if (sameFlag){
								return false;
							}
							return true;
						}
						return false;
					});

					if (pushFlag){
						updateList.push(Object.assign({}, fields, { id }));
					}

					if (!defaultFlag){
						createList.push(Object.assign({}, fields, { id }));
					};
				};
			});


		});
		// console.log(createList);
		if (noErrorflag){
			createLibrary(createList);
			// console.log(createList);
			if (this.noCustomized){
				// console.log(updateList);
				updateLibrary(createList);
			};
		}
	}

	render() {
		const { faceIdLibrary, totalCapacity, loading, maxLength } = this.props;

		const { libraryList } = this.state;

		const restCapacity = totalCapacity - faceIdLibrary.reduce((total ,item) => {
			if (item.isDefault !== true){
				this.noCustomized = false;
			};

			return total + item.capacity;
		}, 0);

		if (this.noCustomized){
			this.snapshot = [...faceIdLibrary, ...libraryList];
		}else{
			this.snapshot = [...libraryList];
		};

		const list = this.snapshot;
		const totalList = [...faceIdLibrary, ...libraryList];

		return(
			<div className='create-library'>
				<Card bordered={false}>
					<div className='faceid-list'>
						{
							list.map((item, index) => (
								<div key={item.id} className='create-library-form-wrapper'>
									<LibraryForm wrappedComponentRef={(form) => { this.forms[index] = form; }} {...item} libraries={[...faceIdLibrary, ...libraryList]} restCapacity={restCapacity} />
									{/* changeFields={ this.changeFields } */}
									{
										item.isDefault || index === 0 ? 
											'' : 
											<Button 
												className='btn-create-library-remove'
												type='danger'
												shape='circle' 
												icon='delete' 
												onClick={() => {
													this.removeForm(item.id);
												}} 
											/>
									}
									{
										index >= list.length - 1 ? '' : <Divider />
									}
								</div>
							))
						}
					</div>
					<Form.Item {...FORM_ITEM_LAYOUT_COMMON}>
						<div className='button-container'>
							<Button className='submit-button' icon='plus' disabled={totalList.length >= maxLength} onClick={this.addForm}>
								<FormattedMessage id='faceid.addButton' />
							</Button>
							<Button className='submit-button' type='primary' loading={loading.effects['faceIdLibrary/create']} onClick={this.submitForm}>
								<FormattedMessage id='faceid.createButton' />
							</Button>
						</div>
					</Form.Item>
				</Card>
			</div>
		);
	}
}


CreateLibraryList.propTypes = {
	faceIdLibrary: PropTypes.array.isRequired,
	totalCapacity: PropTypes.number.isRequired,
	maxLength: PropTypes.number.isRequired
};

const mapStateToProps = (state) => {
	const { loading, faceIdLibrary } = state;

	return {
		faceIdLibrary,
		loading
	};
};

const mapDispatchToProps = (dispatch) => ({
	loadLibrary: () => {
		dispatch({
			type: 'faceIdLibrary/read'
		});
	},
	createLibrary: (list) => {
		dispatch({
			type: 'faceIdLibrary/create',
			payload: {
				faceidList: list
			}
		});
	},
	updateLibrary: (list) => {
		list.forEach(item => {
			dispatch({
				type: 'faceIdLibrary/update',
				payload: {
					library: item
				}
			});
		});
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateLibraryList);