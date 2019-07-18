import React, { Component } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { SEARCH_FORM_COL, FORM_FORMAT } from '@/constants/form';
import styles from './DeviceESL.less';

@Form.create()
class SearchForm extends Component {
	handleSearchValue = e => {
		const { updateSearchValue } = this.props;
		updateSearchValue({
			keyword: e.target.value,
		});
	};

	handleQuery = () => {
		const { getESLGroupInfo, groupId } = this.props;
		getESLGroupInfo({
			group_id: groupId,
		});
	};

	render() {
		const {
			form: { getFieldDecorator },
		} = this.props;

		return (
			<div className={styles['search-bar']}>
				<Form layout="inline">
					<Row gutter={FORM_FORMAT.gutter}>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item>
								{getFieldDecorator('keyword')(
									<Input
										placeholder={formatMessage({
											id: 'esl.device.upgrade.esl.query.input',
										})}
										onChange={this.handleSearchValue}
									/>
								)}
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD} />
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item className={styles['query-item']}>
								<Button type="primary" onClick={this.handleQuery}>
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
