import React, { Component } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { FORM_FORMAT, FORM_ITEM_LAYOUT } from '@/constants/form';
import { formatMessage } from 'umi/locale';

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

    render() {
        const { states, searchFormValues } = this.props;

        return (
            <Form {...FORM_ITEM_LAYOUT}>
                <Row gutter={FORM_FORMAT.gutter}>
                    <Col xl={10} lg={12} md={24}>
                        <Form.Item label={formatMessage({ id: 'esl.device.ap.search.ap.info' })}>
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
                    <Col xl={10} lg={12} md={24}>
                        <Form.Item label={formatMessage({ id: 'esl.device.ap.status' })}>
                            <Select
                                placeholder={formatMessage({ id: 'select.placeholder' })}
                                value={searchFormValues.status}
                                onChange={value => this.changeFormValues('select', 'status', value)}
                            >
                                <Option value={-1}>{formatMessage({ id: 'select.all' })}</Option>
                                {states.map(s => (
                                    <Option key={s.status_code}>{s.status_desc}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xl={4} lg={12} md={24}>
                        <Form.Item>
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
