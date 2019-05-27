import React, { Component } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { FORM_ITEM_LAYOUT, FORM_LABEL_LEFT } from '@/constants/form';

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
			<Form {...{ ...FORM_ITEM_LAYOUT, ...FORM_LABEL_LEFT }}>
				<Row>
					<Col xl={9} lg={12} md={24}>
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
					<Col xl={4} lg={2} md={24}>
						<Form.Item>
							<Button type="primary" onClick={this.handleQuery}>
								{formatMessage({ id: 'btn.query' })}
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		);
	}
}

export default SearchForm;
