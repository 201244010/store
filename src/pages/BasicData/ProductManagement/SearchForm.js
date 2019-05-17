import React, { Component } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import { FORM_FORMAT, FORM_ITEM_LAYOUT, FORM_LABEL_LEFT } from '@/constants/form';

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
            <Form {...{ ...FORM_ITEM_LAYOUT, ...FORM_LABEL_LEFT }}>
                <Row gutter={FORM_FORMAT.gutter}>
                    <Col xl={9} lg={12} md={24}>
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
                    <Col xl={6} lg={12} md={24}>
                        <Form.Item>
                            <Button onClick={this.search}>
                                {formatMessage({ id: 'btn.query' })}
                            </Button>
                            <a
                                href="javascript:void(0)"
                                style={{ marginLeft: '20px' }}
                                onClick={this.handleReset}
                            >
                                {formatMessage({ id: 'storeManagement.list.buttonReset' })}
                            </a>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default SearchForm;
