import React, { Component } from 'react';
import { Card, Radio, Switch, Button,Form } from 'antd';

import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';

import styles from './BasicParams.less';

const RadioGroup = Radio.Group;

const isChange = {
	nightMode:false,
	indicator:false,
	roration:false
};

let temp = {};
const mapStateToProps = (state) => {
	const { basicParams } = state;
	return {
		basicParams
	};
};
const mapDispatchToProps = (dispatch) => ({
	loadSetting: () => {
		dispatch({
			type: 'basicParams/read'
		});
	},
	saveSetting: (setting) => {
		dispatch({
			type: 'basicParams/update',
			payload: {
				...setting
			}
		});
	}
});
@connect(mapStateToProps, mapDispatchToProps)
@Form.create({
	name:'basic-params-form',
	mapPropsToFields(props) {
		return {
			nightMode: Form.createFormField({
				value: props.basicParams.nightMode
			}),
			indicator: Form.createFormField({
				value: props.basicParams.indicator
			}),
			roration: Form.createFormField({
				value: props.basicParams.roration
			})
		};
	},
	onValuesChange(props,values){
		// console.log(values);
		Object.keys(values).forEach(item => {
			const key = item;
			if (values[key] !== props.basicParams[key]) {
				isChange[key] = true;
			} else {
				isChange[key] = false;
			}
		}); 
	}
})
class BasicParams extends Component {

	componentDidMount = () =>{
		const { loadSetting } = this.props;
		loadSetting();
	}

	handleSubmit = () => {
		const { form } = this.props;
		const values = form.getFieldsValue();
		const { saveSetting } = this.props;
		saveSetting(values);
		temp = values;

		const list = Object.keys(isChange);
		list.forEach(name => {
			isChange[name] = false;
		});
	}

	resetChange = () => {
		const { basicParams: values } = this.props;
		
		const list = Object.keys(temp);
		list.forEach((name, i) => {
			if(temp[i] !== values[i]){
				isChange[i] = true;
			}
		});
	}

	render() {
		const { basicParams, form } = this.props;
		const { status } = basicParams;
		if( status === 'error'){
			this.resetChange();
		}

		let changes = false;
		Object.keys(isChange).forEach(item => {
			changes = changes || isChange[item];
		});

		const { getFieldDecorator } = form;
		return (
			<Card className={styles.card} title={<FormattedMessage id='basicParams.title' />}>
				<Form onSubmit={this.handleSubmit}>
					<Form.Item label={<FormattedMessage id='basicParams.nightMode' />}>
						{
							getFieldDecorator('nightMode',{
								getValueFromEvent: this.onAutoChange
							})(
								<RadioGroup inChange={this.onAutoChange}>
									<Radio value={1}><FormattedMessage id='basicParams.autoSwitch' /></Radio>
									<Radio value={2}><FormattedMessage id='basicParams.open' /></Radio>
									<Radio value={3}><FormattedMessage id='basicParams.close' /></Radio>
								</RadioGroup>
							)	
						}
					</Form.Item>
					<Form.Item label={<FormattedMessage id='basicParams.statusIndicator' />}>
						{
							getFieldDecorator('indicator',{
								valuePropName: 'checked',
								initialValue: true
							})(
								<Switch
									checkedChildren={<FormattedMessage id='basicParams.label.open' />}
									unCheckedChildren={<FormattedMessage id='basicParams.label.close' />}
								/>
							)
							
						}
					</Form.Item>
					<Form.Item label={<FormattedMessage id='basicParams.roration' />}>
						{
							getFieldDecorator('roration',{
								valuePropName: 'checked',
								initialValue: true
							})(
								<Switch
									checkedChildren={<FormattedMessage id='basicParams.label.open' />}
									unCheckedChildren={<FormattedMessage id='basicParams.label.close' />}
								/>
							)
							
						}
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' disabled={!changes}>
							<FormattedMessage id='basicParams.save' />
						</Button>
					</Form.Item>
				</Form>
			</Card>
		);
	}
};
export default BasicParams;