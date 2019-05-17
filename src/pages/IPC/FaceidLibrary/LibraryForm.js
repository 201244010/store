import React from 'react';
// import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
// import {
//   FORM_FORMAT,
//   FORM_ITEM_LAYOUT,
//   FORM_ITEM_LAYOUT_COMMON,
// } from "@/constants/form";
import { FormattedMessage, formatMessage } from 'umi/locale';
import * as styles from './FaceidLibrary.less';

const FaceIdLibraryForm = Form.create({
	name: 'faceid-library-form',
	wrappedComponentRef: true,
	mapPropsToFields(props) {
		return {
			name: Form.createFormField({
				value: props.name,
			}),
			capacity: Form.createFormField({
				value: props.capacity,
			}),
			remarks: Form.createFormField({
				value: props.remarks,
			}),
			// threshold: Form.createFormField({
			// 	value: props.threshold,
			// }),
			// period: Form.createFormField({
			// 	value: props.period,
			// }),
		};
	},
	// onFieldsChange(props, changedFields) {
	// // 	const { id } = props;
	// // 	const fields = [];
	// // 	for (var name in changedFields){
	// // 		if (changedFields.hasOwnProperty(name)){
	// // 			props[name] = changedFields[name].value;

	// // 			fields.push({
	// // 				name: name,
	// // 				value: changedFields[name].value
	// // 			});
	// // 		}
	// // 	};
	// // 	props.changeFields(id, fields);

	// },
	// onValuesChange(props, changedValues, allValues) {
	// 	// console.log('change1',changedValues);
	// 	// console.log('change2',allValues);
	// 	// const { id } = props;
	// 	// props.changeFields(id, allValues);
	// },
});

class LibraryForm extends React.Component {
	constructor(props) {
		super(props);
		this.tipFlag = true;
	}

	render() {
		const { id, isDefault, restCapacity, libraries, amount, form } = this.props;

		const { getFieldDecorator } = form;

		// console.log('form')
		// console.log(this.props);
		return (
			<div className={styles["faceid-library-form"]}>
				<Form className={styles['form-wrapper']} title={<FormattedMessage id="faceid.createLibrary" />}>
					<Form.Item label={<FormattedMessage id="faceid.libraryName" />} extra={<FormattedMessage id="faceid.libraryNameFormat" />}>
						{getFieldDecorator("name", {
							rules: [
								{
									required: true,
									message: formatMessage({
										id: "faceid.libraryNameMsg",
									}),
								},
								{
									max: 20,
									message: formatMessage({
										id: "faceid.libraryNameFormat",
									}),
								},
								{
									validator: (rule, value, callback) => {
										let confictFlag = false;
										libraries.every(item => {
											if (item.id !== id) {
												if (item.name === value) {
													confictFlag = true;
													return false;
												}
												return true;
											}
											return true;
										});

										if (confictFlag) {
											callback("library-name-confict");
										} else {
											callback();
										}
									},
									message: formatMessage({
										id: "faceid.libraryNameRule",
									}),
								},
							],
						})(
							<Input 
								disabled={isDefault}
								placeholder={formatMessage({
									id: "faceid.libraryNameMsg",
								})}
							/>
						)}
					</Form.Item>

					<Form.Item
						label={<FormattedMessage id="faceid.photosAmountLimit" />}
						extra={
							<span>
								<FormattedMessage id="faceid.photosAmountNote-pre" />
								{restCapacity}
								<FormattedMessage id="faceid.photosAmountNote-mid" />
								{amount || 1}~{restCapacity}
								<FormattedMessage id="faceid.photosAmountNote-suf" />
							</span>
						}
					>
						{getFieldDecorator("capacity", {
							rules: [
								{
									required: true,
									message: formatMessage({
										id: "faceid.photosAmountMsg",
									}),
								},
								{
									validator: (rule, value, callback) => {
										if (value < amount || value > restCapacity) {
											callback("photo-amount-error");
										} else {
											callback();
										}
									},
									message:
										`${formatMessage({
											id: "faceid.photosAmountNote-error",
										}) 
										}${amount || 1}~${restCapacity}${ 
										formatMessage({
											id: "faceid.photosAmountNote-suf",
										})}`,
								},
							],
						})(<Input placeholder={formatMessage({
							id: "faceid.photosAmountMsg",
						})}
						/>)}
					</Form.Item>

					<Form.Item label={
						<span>
							<FormattedMessage id="faceid.remark" />
							<span className="light">
								<FormattedMessage id="faceid.remarkNote" />
							</span>
						</span>}
					>
						{
							getFieldDecorator("remarks")(
								<Input.TextArea 
									disabled={isDefault} 
									autosize={{ minRows: 2, maxRows: 6 }} 
									placeholder={formatMessage(
										{ id: "faceid.remarkMsg" },
									)}
								/>
							)
						}
					</Form.Item>

					{/* {!isDefault ? (
							''
						) : (
								<div>
									<Form.Item
									label={<FormattedMessage id="faceid.transferCondit" />}
									>
									<FormattedMessage id="faceid.transferConditPre" />
									{getFieldDecorator('threshold', {
												rules: [
													{
														required: true,
												message: formatMessage({
													id: 'faceid.transferConditMsg',
												}),
											},
											{
														type: 'number',
														min: 1,
												message: formatMessage({
													id: 'faceid.transferConditRule',
												}),
											},
										],
									})(<InputNumber className="threshold" />)}
									<FormattedMessage id="faceid.transferConditSuf" />
									</Form.Item>
								<Form.Item label="">
									{getFieldDecorator('period', {
												// initialValue: 7,
												rules: [
											{
												required: true,
												message: formatMessage({
													id: 'facied.periodMsg',
												}),
											},
												],
										getValueFromEvent: this.periodChange,
											})(
										<Radio.Group
											className="period"
											onChange={this.periodChange}
										>
											<Radio key="1" value="1">
												<FormattedMessage id="faceid.period.day" />
											</Radio>
											<Radio key="7" value="7">
												<FormattedMessage id="faceid.period.week" />
											</Radio>
											<Radio key="30" value="30">
												<FormattedMessage id="faceid.period.month" />
											</Radio>
										</Radio.Group>,
									)}
									</Form.Item>
								</div>
						)} */}
				</Form>
			</div>
		);
	}

	// periodChange(e) {
	// 	const target = e.target;
	// 	return target.value;
	// }
}

// LibraryForm.propTypes = {
// 	form: PropTypes.object,
// 	name: PropTypes.string.isRequired,
// 	isDefault: PropTypes.bool,
// 	remarks: PropTypes.string,
// 	// threshold: PropTypes.number,
// 	restCapacity: PropTypes.number.isRequired,
// 	// changeFields: PropTypes.func.isRequired,
// 	libraries: PropTypes.array.isRequired
// };

export default FaceIdLibraryForm(LibraryForm);