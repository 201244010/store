import React, { Component } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { formatMessage } from 'umi/locale';
import { FORM_FORMAT, SEARCH_FORM_COL } from '@/constants/form';
import styles from './index.less';

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

	search = () => {
		const { fetchElectricLabels, fetchDeviceOverview } = this.props;
		fetchElectricLabels();
		fetchDeviceOverview();
	};

	handleReset = async () => {
		const { form, clearSearch, fetchElectricLabels } = this.props;
		if (form) {
			form.resetFields();
		}
		await clearSearch();
		await fetchElectricLabels({
			options: {
				current: 1,
			},
		});
	};

	render() {
		const { searchFormValues } = this.props;

		return (
			<div className={styles['search-bar']}>
				<Form layout="inline">
					<Row gutter={FORM_FORMAT.gutter}>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item label={formatMessage({ id: 'esl.device.esl.search.info' })}>
								<Input
									placeholder={formatMessage({
										id: 'esl.device.esl.search.placeholder',
									})}
									maxLength={60}
									value={searchFormValues.keyword}
									onChange={e => this.changeFormValues('input', 'keyword', e)}
								/>
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item label={formatMessage({ id: 'esl.device.esl.status' })}>
								<Select
									placeholder={formatMessage({ id: 'select.placeholder' })}
									value={searchFormValues.status}
									onChange={val => this.changeFormValues('select', 'status', val)}
								>
									<Select.Option value={-1}>
										{formatMessage({ id: 'select.all' })}
									</Select.Option>
									<Select.Option value={1}>
										{formatMessage({ id: 'esl.device.esl.push.wait.bind' })}
									</Select.Option>
									<Select.Option value={2}>
										{formatMessage({ id: 'esl.device.esl.push.wait' })}
									</Select.Option>
									<Select.Option value={3}>
										{formatMessage({ id: 'esl.device.esl.push.success' })}
									</Select.Option>
									<Select.Option value={4}>
										{formatMessage({ id: 'esl.device.esl.push.fail' })}
									</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item className={styles['query-item']}>
								<Button type="primary" onClick={this.search}>
									{formatMessage({ id: 'btn.query' })}
								</Button>
								{/* <a */}
								{/* href="javascript:void(0)" */}
								{/* style={{ marginLeft: '20px' }} */}
								{/* onClick={this.handleReset} */}
								{/* > */}
								{/* {formatMessage({ id: 'storeManagement.list.buttonReset' })} */}
								{/* </a> */}
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}

export default SearchForm;
