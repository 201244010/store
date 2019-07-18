import React, { Component } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { SEARCH_FORM_COL, FORM_FORMAT } from '@/constants/form';
import { formatMessage } from 'umi/locale';
import styles from './BaseStation.less';

const { Option } = Select;

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
		const { fetchBaseStations } = this.props;
		fetchBaseStations({});
	};

	handleReset = async () => {
		const { form, clearSearch, fetchBaseStations } = this.props;
		if (form) {
			form.resetFields();
		}
		await clearSearch();
		await fetchBaseStations({
			options: {
				current: 1,
			},
		});
	};

	render() {
		const { states, searchFormValues } = this.props;

		return (
			<div className={styles['search-bar']}>
				<Form layout="inline">
					<Row gutter={FORM_FORMAT.gutter}>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								label={formatMessage({ id: 'esl.device.ap.search.ap.info' })}
							>
								<Input
									placeholder={formatMessage({
										id: 'esl.device.ap.search.placeholder',
									})}
									maxLength={60}
									value={searchFormValues.keyword}
									onChange={e => this.changeFormValues('input', 'keyword', e)}
								/>
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item label={formatMessage({ id: 'esl.device.ap.status' })}>
								<Select
									placeholder={formatMessage({ id: 'select.placeholder' })}
									value={searchFormValues.status}
									onChange={value =>
										this.changeFormValues('select', 'status', value)
									}
								>
									<Option value={-1}>
										{formatMessage({ id: 'select.all' })}
									</Option>
									{states.map(s => (
										<Option key={s.status_code}>{s.status_desc}</Option>
									))}
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
