import React, { Component } from 'react';
import { Button, Col, Form, Input, Row, Select, DatePicker } from 'antd';
import { formatMessage } from 'umi/locale';
import { FORM_FORMAT, SEARCH_FORM_COL } from '@/constants/form';
import styles from './index.less';

const { RangePicker } = DatePicker;

@Form.create()
class SearchForm extends Component {
	changeFormValues = (inputType, fieldName, e) => {
		const { changeSearchFormValue } = this.props;
		changeSearchFormValue({
			options: {
				[fieldName]: inputType === 'input' ? e.target.value : e,
			},
		});
	};

	changeTimeRange = (dates) => {
		const { changeSearchFormValue } = this.props;
		changeSearchFormValue({
			options: {
				startTime: dates[0],
				endTime: dates[1]
			},
		});
	};

	search = () => {
		const { fetchCommunications } = this.props;
		fetchCommunications();
	};

	handleReset = async () => {
		const { form, clearSearch, fetchCommunications } = this.props;
		if (form) {
			form.resetFields();
		}
		await clearSearch();
		await fetchCommunications({
			options: {
				current: 1,
			},
		});
	};

	render() {
		const { searchFormValues }  = this.props;

		return (
			<div className={styles['search-bar']}>
				<Form layout="inline">
					<Row gutter={FORM_FORMAT.gutter}>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item label={formatMessage({ id: 'esl.device.esl.id' })}>
								<Input
									placeholder={formatMessage({
										id: 'esl.device.upload.device.version.input',
									})}
									maxLength={60}
									value={searchFormValues.keyword}
									onChange={e => this.changeFormValues('input', 'keyword', e)}
								/>
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item label={formatMessage({ id: 'esl.device.esl.comm.date' })}>
								<RangePicker
									format="YYYY-MM-DD"
									style={{ width: '100%' }}
									value={[searchFormValues.startTime, searchFormValues.endTime]}
									onChange={this.changeTimeRange}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={FORM_FORMAT.gutter}>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item label={formatMessage({ id: 'esl.device.esl.comm.reason' })}>
								<Select
									placeholder={formatMessage({ id: 'select.placeholder' })}
									value={searchFormValues.reason}
									onChange={val => this.changeFormValues('select', 'reason', val)}
								>
									<Select.Option value={-1}>
										{formatMessage({ id: 'select.all' })}
									</Select.Option>
									<Select.Option value={1}>
										{formatMessage({ id: 'esl.device.esl.comm.reason1' })}
									</Select.Option>
									<Select.Option value={2}>
										{formatMessage({ id: 'esl.device.esl.comm.reason2'})}
									</Select.Option>
									<Select.Option value={3}>
										{formatMessage({ id: 'esl.device.esl.comm.reason3' })}
									</Select.Option>
									<Select.Option value={4}>
										{formatMessage({ id: 'esl.device.esl.comm.reason4' })}
									</Select.Option>
									<Select.Option value={5}>
										{formatMessage({ id: 'esl.device.esl.comm.reason5' })}
									</Select.Option>
									<Select.Option value={6}>
										{formatMessage({ id: 'esl.device.esl.comm.reason6' })}
									</Select.Option>
									<Select.Option value={7}>
										{formatMessage({ id: 'esl.device.esl.comm.reason7' })}
									</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item label={formatMessage({ id: 'esl.device.esl.comm.result' })}>
								<Select
									placeholder={formatMessage({ id: 'select.placeholder' })}
									value={searchFormValues.result}
									onChange={val => this.changeFormValues('select', 'result', val)}
								>
									<Select.Option value={-1}>
										{formatMessage({ id: 'select.all' })}
									</Select.Option>
									<Select.Option value={0}>
										{formatMessage({ id: 'esl.device.esl.comm.result1' })}
									</Select.Option>
									<Select.Option value={1}>
										{formatMessage({ id: 'esl.device.esl.comm.result2' })}
									</Select.Option>
									<Select.Option value={2}>
										{formatMessage({ id: 'esl.device.esl.comm.result3' })}
									</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item>
								<Button type="primary" onClick={this.search}>
									{formatMessage({ id: 'btn.query' })}
								</Button>
								{
									/*
									 <a href="javascript:void(0)" style={{ marginLeft: '20px' }} onClick={this.handleReset}>
									 {formatMessage({ id: 'storeManagement.list.buttonReset' })}
								 </a>
									 */
								}
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}

export default SearchForm;
