import React, { Component } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { SEARCH_FORM_COL, FORM_FORMAT } from '@/constants/form';
import styles from './ProductManagement.less';

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
		const { values, fetchProductList } = this.props;
		fetchProductList({
			options: {
				...values,
				current: 1,
			},
		});
	};

	handleReset = async () => {
		const { form, clearSearch, fetchProductList } = this.props;
		if (form) {
			form.resetFields();
		}
		await clearSearch();
		await fetchProductList({
			options: {
				current: 1,
				keyword: null,
			},
		});
	};

	render() {
		const { values } = this.props;

		return (
			<div className={styles['search-bar']}>
				<Form layout="inline">
					<Row gutter={FORM_FORMAT.gutter}>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								label={formatMessage({ id: 'basicData.product.search.product' })}
							>
								<Input
									placeholder={formatMessage({
										id: 'basicData.product.search.placeholder',
									})}
									value={values.keyword}
									maxLength={60}
									onChange={e => this.changeFormValues('input', 'keyword', e)}
								/>
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD} />
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item className={styles['query-item']}>
								<Button className={styles['btn-reset']} onClick={this.handleReset}>
									{formatMessage({ id: 'storeManagement.list.buttonReset' })}
								</Button>
								<Button className={styles['btn-save']} type="primary" onClick={this.search}>
									{formatMessage({ id: 'btn.query' })}
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}

export default SearchForm;
