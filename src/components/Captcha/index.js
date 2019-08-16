import React, { Component } from 'react';
import { Icon, Input } from 'antd';
import * as Regexp from '@/constants/regexp';
import styles from './captcha.less';

class Captcha extends Component {
	constructor(props) {
		super(props);
		const { countInit = 60, value = '' } = props;
		this.countDownTimer = null;
		this.state = {
			value,
			inCounting: false,
			count: countInit,
		};
	}

	componentWillReceiveProps(nextProps) {
		const { trigger } = nextProps;
		const { trigger: oldTrigger } = this.props;
		if (trigger && oldTrigger !== trigger) {
			this.countDown();
		}
	}

	componentWillUnmount() {
		clearInterval(this.countDownTimer);
	}

	countDown = () => {
		const { interval = 1000, countInit = 60 } = this.props;
		this.setState({
			inCounting: true,
			count: countInit,
		});

		clearInterval(this.countDownTimer);
		this.countDownTimer = setInterval(() => {
			const { count } = this.state;
			if (count <= 0) {
				this.setState({
					inCounting: false,
				});
			} else {
				this.setState({
					count: count - 1,
				});
			}
		}, interval);
	};

	handleInputChange = e => {
		const { onChange } = this.props;
		const value = e.target.value || '';
		this.setState({
			value,
		});
		if (onChange) {
			onChange(value);
		}
	};

	handleInputBlur = e => {
		const { onBlur } = this.props;
		if (onBlur) {
			onBlur(e.target.value);
		}
	};

	handleClick = () => {
		const { inCounting } = this.state;
		const { onClick, validateTarget = '' } = this.props;

		if (validateTarget && Regexp.cellphone.test(validateTarget)) {
			if (!inCounting) {
				if (onClick) {
					onClick();
				}
				this.countDown();
			}
		}
	};

	render() {
		const { inCounting, count, value } = this.state;
		const {
			buttonText: { initText, countText },
			inputProps = {},
		} = this.props;

		const StatusBtn = (
			<div className={styles['status-btn']} onClick={this.handleClick}>
				{inCounting ? `${count}${countText}` : initText}
			</div>
		);

		return (
			<Input
				value={value}
				onChange={this.handleInputChange}
				onBlur={this.handleInputBlur}
				prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
				suffix={StatusBtn}
				{...inputProps}
			/>
		);
	}
}

export default Captcha;
