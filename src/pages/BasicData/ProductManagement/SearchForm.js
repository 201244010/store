import React, { Component } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { COL_THREE_NORMAL, FORM_FORMAT } from '@/constants/form';
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
			},
		});
	};

	render() {
		const { values } = this.props;

		return (
			<div className={styles['search-bar']}>
				<Form layout="inline">
					<Row gutter={FORM_FORMAT.gutter}>
						<Col {...COL_THREE_NORMAL}>
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
						<Col {...COL_THREE_NORMAL} />
						<Col {...COL_THREE_NORMAL}>
							<Form.Item className={styles['query-item']}>
								<Button type="primary" onClick={this.search}>
									{formatMessage({ id: 'btn.query' })}
								</Button>
								<Button style={{ marginLeft: '20px' }} onClick={this.handleReset}>
									{formatMessage({ id: 'storeManagement.list.buttonReset' })}
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
