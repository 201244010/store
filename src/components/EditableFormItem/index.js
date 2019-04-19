import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon } from 'antd';
import EditableLabel from './EditableLabel';

const formItemLayout = {
    wrapperCol: { span: 24 },
};

class EditableFormItem extends Component {
    constructor(props) {
        super(props);
        this.count = 0;
        this.max = props.max || Infinity;
    }

    remove = k => {
        const {
            form: { getFieldValue, setFieldsValue },
            labelOption: { formKey = '' },
        } = this.props;
        const keys = getFieldValue(`__${formKey}__`);
        if (keys.length === 0) {
            return;
        }
        this.count -= 1;
        setFieldsValue({
            [`__${formKey}__`]: keys.filter(key => key !== k),
        });
    };

    addCustomFormItem = () => {
        const {
            form: { getFieldValue, setFieldsValue },
            labelOption: { formKey = '' },
        } = this.props;

        if (this.count < this.max) {
            this.count += 1;
            const keys = getFieldValue(`__${formKey}__`);
            const nextId = +new Date();
            const nextKeys = keys.concat(nextId);

            setFieldsValue({
                [`__${formKey}__`]: nextKeys,
            });
        }
    };

    renderCustomizeFormItem = () => {
        const {
            form: { getFieldDecorator, getFieldValue },
            labelOption = {},
            labelOption: { labelPrefix = '', formKey = '', span = 12 },
            itemOptions = {},
            wrapperItem = <Input />,
        } = this.props;

        getFieldDecorator(`__${formKey}__`, { initialValue: [] });
        const keys = getFieldValue(`__${formKey}__`);

        return keys.map((key, index) => {
            const labelName = `${labelPrefix}${index + 1}`;
            const labelProps = {
                ...labelOption,
                index,
                name: labelName,
            };
            return (
                <Col span={span} key={key}>
                    <Row>
                        <Col span={8}>
                            <Form.Item {...formItemLayout}>
                                {getFieldDecorator(`${formKey}.${index}.name`)(
                                    <EditableLabel {...{ labelProps }} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={14}>
                            <Form.Item {...formItemLayout}>
                                {getFieldDecorator(`${formKey}.${index}.context`, {
                                    ...itemOptions,
                                })(wrapperItem)}
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Form.Item {...formItemLayout}>
                                <Icon
                                    style={{ marginLeft: '20px' }}
                                    type="minus-circle-o"
                                    onClick={() => this.remove(key)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
            );
        });
    };

    render() {
        const {
            buttonProps = {},
            buttonProps: { span = 24, label = ' ', text = '' },
        } = this.props;
        return (
            <>
                <Row>
                    {this.renderCustomizeFormItem()}
                    <Col span={span}>
                        <Form.Item label={label} colon={false}>
                            <Button {...buttonProps} onClick={this.addCustomFormItem}>
                                {text}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </>
        );
    }
}

export default EditableFormItem;
