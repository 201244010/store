import React, { Component } from 'react';
import { Input, InputNumber } from 'antd';

const InputGroup = Input.Group;

export default class PriceInput extends Component {
	render() {
		const {
			className,
			left,
			top,
			componentDetail: { width, height } = { width: 0, height: 0 },
		} = this.props;

		return (
			<div className={className} style={{ left, top, width, height }}>
				<InputGroup compact>
					<InputNumber style={{ width: '100%' }} defaultValue={99.0} />
				</InputGroup>
			</div>
		);
	}
}
