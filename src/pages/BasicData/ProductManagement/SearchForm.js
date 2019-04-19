import React, { Component } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { FORM_FORMAT, TAIL_FORM_ITEM_LAYOUT } from '@/constants/form';

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

    render() {
        const { values } = this.props;

        return (
            <Form>
                <Row gutter={FORM_FORMAT.gutter}>
                    <Col span={8}>
                        <Form.Item>
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
                    <Col span={2}>
                        <Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
                            <Button type="primary" onClick={this.search}>
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
