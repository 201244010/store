import React from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, InputNumber, Switch } from 'antd';
// import {
//   FORM_FORMAT,
//   FORM_ITEM_LAYOUT,
//   FORM_ITEM_LAYOUT_COMMON,
// } from "@/constants/form";
import { formatMessage } from 'umi/locale';
import { mbStringLength } from '@/utils/utils';

import * as styles from './FaceidLibrary.less';


const FaceIdLibraryForm = Form.create({
	name: 'faceid-library-form',
	wrappedComponentRef: true,
	// mapPropsToFields(props) {
	// 	return {
	// 		name: Form.createFormField({
	// 			value: props.name,
	// 		}),
	// 		capacity: Form.createFormField({
	// 			value: props.capacity,
	// 		}),
	// 		remarks: Form.createFormField({
	// 			value: props.remarks,
	// 		}),
	// 		threshold: Form.createFormField({
	// 			value: props.threshold,
	// 		}),
	// 		period: Form.createFormField({
	// 			value: props.period,
	// 		})
	// 	};
	// }
});

class LibraryForm extends React.Component {
	constructor(props) {
		super(props);

		this.tipFlag = true;
	}

	render() {
		const { id, type, isEdit, restCapacity, libraries, amount, form } = this.props;
		const { name, capacity, remarks, threshold, period, warning } = this.props;
		const { getFieldDecorator } = form;

		const isDefault = type < 5;

		const maxCapacity = isEdit ? capacity + restCapacity : restCapacity;

		console.log(warning);

		return (
			<div className={styles['faceid-library-form']}>
				<Form
					className={styles['form-wrapper']}
					// title={formatMessage({id: 'faceid.createLibrary'})}
					labelCol={{span: 6}}
					wrapperCol={{span: 16}}
				>
					<Form.Item
						label={formatMessage({id: 'faceid.libraryName'})}
						extra={(() => {
							switch (type) {
								case 1:
									return formatMessage({id: 'faceid.strangerInfo'});
								case 2:
									return formatMessage({id: 'faceid.regularInfo'});
								case 3:
									return formatMessage({id: 'faceid.employeeInfo'});
								case 4:
									return formatMessage({id: 'faceid.blacklistInfo'});
								default:
									return '';
							}
						})()}
					>
						{
							getFieldDecorator('name', {
								initialValue: name,
								rules: [
									{
										required: true,
										message: formatMessage({
											id: 'faceid.libraryNameRequired',
										}),
									},
									{
										// max: 20,
										validator: (rule, value, callback) => {
											const len = mbStringLength(value);
											if (len <= 20) {
												callback();
											}else{
												callback(false);
											}
										},
										message: formatMessage({
											id: 'faceid.libraryNameFormat',
										}),
									},
									{
										pattern: /\s*\S+?/,
										message: formatMessage({
											id: 'faceid.libraryNameFormat',
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
												callback('library-name-confict');
											} else {
												callback();
											}
										},
										message: formatMessage({
											id: 'faceid.libraryNameRule',
										}),
									},
								],
							})(
								<Input
									disabled={isDefault}
									placeholder={formatMessage({
										id: 'faceid.libraryNameMsg',
									})}
								/>
							)
						}
					</Form.Item>

					<Form.Item
						label={formatMessage({id: 'faceid.photosAmountLimit'})}
						extra={
							`${formatMessage({id: 'faceid.photosAmountNote'}).replace('%min%', (amount || 1)).replace('%max%', maxCapacity).replace('%total%', maxCapacity) }`
						}
					>
						{
							getFieldDecorator('capacity', {
								initialValue: capacity,
								validateFirst: true,
								rules: [
									{
										required: true,
										message: formatMessage({id: 'faceid.photosAmountRequired'}),
									},{
										pattern: /^[0-9]*$/,
										message: formatMessage({id: 'faceid.integerMsg'})
									}, {
										validator: (rule, value, callback) => {
											// console.log(isEdit)
											if (value <= 0 || value < amount || value > maxCapacity) {
												callback('photo-amount-error');
											}else{
												callback();
											}
										},
										message: `${formatMessage({id: 'faceid.photosAmountNoteError'}).replace('%min%', (amount || 1)).replace('%max%', maxCapacity)}`,
									},
								],
							})(
								<Input
									placeholder={formatMessage({id: 'faceid.photosAmountPlaceHolder'})}
								/>
							)
						}
					</Form.Item>

					<Form.Item label={
						<span>
							<span>
								{formatMessage({id: 'faceid.remark'})}
							</span>
							<span className={styles.light}>
								{formatMessage({id: 'faceid.remarkNote'})}
							</span>
						</span>}
					>
						{
							getFieldDecorator('remarks', {
								initialValue: remarks,
								rules: [
									{
										max: 255,
										message: formatMessage({ id: 'faceid.remarksTooLong'})
									}
								]
							})(
								<Input.TextArea
									// disabled={isDefault}
									autosize={{ minRows: 2, maxRows: 6 }}
									placeholder={formatMessage(
										{ id: 'faceid.remarkMsg' },
									)}
								/>
							)
						}
					</Form.Item>

					{
						(() => {
							switch(type) {
								case 1:
									// 生客
									return (
										<Form.Item
											label={formatMessage({id: 'faceid.transferCondit' })}
										>
											<Form.Item className={`${styles.inline} ${styles.number}`}>
												{
													getFieldDecorator('period', {
														initialValue: period,
														validateFirst: true,
														rules: [{
															required: true,
															message: formatMessage({ id: 'faceid.periodMsg' })
														}, {
															type: 'integer',
															message: formatMessage({ id: 'faceid.integerMsg'})
														}, {
															validator: (rule, value, callback) => {
																if (value <= 0) {
																	callback(false);
																}else{
																	callback();
																}
															},
															message: formatMessage({ id: 'faceid.integerMsg' })
														}]
													})(
														<InputNumber
															className="period"
															min={1}
														/>
													)
												}
											</Form.Item>

											<div className={styles.inline}>
												{formatMessage({ id: 'faceid.transferConditSuf' })}
											</div>

											<Form.Item className={`${styles.inline} ${styles.number}`}>
												{
													getFieldDecorator('threshold', {
														initialValue: threshold,
														validateFirst: true,
														rules: [{
															required: true,
															message: formatMessage({ id: 'faceid.thresholdMsg' })
														}, {
															type: 'integer',
															message: formatMessage({ id: 'faceid.integerMsg'})
														}, {
															validator: (rule, value, callback) => {
																if (value <= 0) {
																	callback(false);
																}else{
																	callback();
																}
															},
															message: formatMessage({ id: 'faceid.integerMsg' })
														}],
													})(
														<InputNumber
															min={1}
															className="threshold"
														/>
													)
												}
											</Form.Item>
											<div className={styles.inline}>
												{formatMessage({ id: 'faceid.times' })}
											</div>

										</Form.Item>
									);
								case 4:
									return (
										<Form.Item
											label={formatMessage({id: 'faceid.warningPush'})}
										>
											{
												getFieldDecorator('warning', {
													initialValue: warning,
													valuePropName: 'checked'
												})(
													<Switch />
												)
											}
										</Form.Item>
									);
								default:
									return '';
							}

						})()
					}
				</Form>
			</div>
		);
	}
}

export default FaceIdLibraryForm(LibraryForm);