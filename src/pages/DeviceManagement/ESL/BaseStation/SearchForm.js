import React, { Component } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { FORM_ITEM_LAYOUT, TAIL_FORM_ITEM_LAYOUT, FORM_FORMAT } from '@/constants/form';
import { formatMessage } from 'umi/locale';

const { Option } = Select;

@Form.create()
class SearchForm extends Component {
  changeFormValues = (inputType, fieldName, e) => {
    const { changeSearchFormValue } = this.props;
    changeSearchFormValue({
      [fieldName]: inputType === 'input' ? e.target.value : e,
    });
  };

  search = () => {
    const { fetchBaseStations } = this.props;
    fetchBaseStations();
  };

  render() {
    const { states, searchFormValues } = this.props;

    return (
      <Form>
        <Row gutter={FORM_FORMAT.gutter}>
          <Col span={6}>
            <Form.Item>
              <Input
                placeholder={formatMessage({ id: 'esl.device.ap.search.placeholder' })}
                maxLength={60}
                value={searchFormValues.keyword}
                onChange={e => this.changeFormValues('input', 'keyword', e)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item {...FORM_ITEM_LAYOUT} label={formatMessage({ id: 'esl.device.ap.status' })}>
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
