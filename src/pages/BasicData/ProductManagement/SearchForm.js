import React, { Component } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { FORM_FORMAT, TAIL_FORM_ITEM_LAYOUT } from '@/constants/form';

@Form.create()
class SearchForm extends Component {
  changeFormValues = (inputType, fieldName, e) => {
    const { changeGoodsSearchForm } = this.props;

    changeGoodsSearchForm({
      [fieldName]: inputType === 'input' ? e.target.value : e,
    });
  };

  search = () => {
    const { values, fetchGoodsList } = this.props;
    fetchGoodsList({
      ...values,
      current: 1,
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
                placeholder="请输入商品编号、名称或条码"
                value={values.keyword}
                maxLength={60}
                onChange={e => this.changeFormValues('input', 'keyword', e)}
              />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item {...TAIL_FORM_ITEM_LAYOUT}>
              <Button type="primary" onClick={this.search}>
                查询
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default SearchForm;
