import React, { Component } from 'react';
import { Input, Select, InputNumber } from 'antd';

const InputGroup = Input.Group;

export default class PriceInput extends Component {
    render() {
        const {
            className, left, top,
            componentDetail: { width, height } = { width : 0, height: 0 }
        } = this.props;

        return (
            <div className={className} style={{ left, top, width, height }}>
                <InputGroup compact>
                    <Select defaultValue="cn" style={{ width: '30%' }}>
                        <Select.Option value="cn">￥</Select.Option>
                        <Select.Option value="an">$</Select.Option>
                    </Select>
                    <InputNumber style={{ width: '40%' }} defaultValue="99" />
                    <InputNumber defaultValue={0} style={{ width: '30%' }} />
                </InputGroup>
            </div>
        )
    }
}