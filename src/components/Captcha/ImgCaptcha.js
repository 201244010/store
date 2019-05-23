import React, { Component } from 'react';
import { Input, Divider, Icon } from 'antd';
import styles from './captcha.less';

class ImgCaptcha extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
		};
	}

	componentDidMount() {
		const { initial = true } = this.props;
		if (initial) {
			this.getImageCode();
		}
	}

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
		const { onBlur, autoCheck = false } = this.props;
		if (onBlur) {
			onBlur(e.target.value);
		}
		if (autoCheck) {
			const { checkMethod = this.getImageCode, refreshCheck } = this.props;
			const response = checkMethod();
			if (response) {
				const needRefresh = refreshCheck(response);
				if (needRefresh) {
					this.refreshCode();
				}
			}
		}
	};

	handleInputFocus = e => {
		const { onFocus } = this.props;
		if (onFocus) {
			onFocus(e.target.value);
		}
	};

	handleImgClick = () => {
		const { refreshBtn = true } = this.props;
		if (!refreshBtn) {
			this.refreshCode();
		}
	};

	handleRefeshBtn = () => this.refreshCode();

	getImageCode = async () => {
		const { getImageCode } = this.props;
		if (getImageCode) {
			const response = await getImageCode();
			return response;
		}
		return null;
	};

	refreshCode = () => {
		const { refreshCode } = this.props;
		this.setState({ value: '' }, () => {
			if (refreshCode) {
				refreshCode();
			}
		});
	};

	render() {
		const { value = '' } = this.state;
		const { imgUrl, inputProps = {}, imgProps = {}, inputRef, refreshBtn = true } = this.props;

		return (
			<div className={styles['imgCaptcha-wrapper']}>
				<div className={styles['imgCaptcha-input']}>
					<Input
						ref={inputRef}
						value={value}
						onChange={this.handleInputChange}
						onBlur={this.handleInputBlur}
						onFocus={this.handleInputFocus}
						{...inputProps}
					/>
				</div>
				<div className={styles['imgCaptcha-img']}>
					<img
						className={styles['code-img']}
						src={imgUrl}
						alt=""
						onClick={this.handleImgClick}
						{...imgProps}
					/>
					{refreshBtn && (
						<>
							<Divider type="vertical" />
							<Icon
								onClick={this.handleRefeshBtn}
								type="reload"
								className={styles['refresh-btn']}
							/>
						</>
					)}
				</div>
			</div>
		);
	}
}

export default ImgCaptcha;
