import React, { Component } from 'react';
import { Col, Input, Row } from 'antd';

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
      this.getImpageCode();
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
      const { checkMethod = this.getImpageCode, refreshCheck } = this.props;
      const response = checkMethod();
      if (response) {
        const needRefresh = refreshCheck(response);
        if (needRefresh) {
          this.refreshCode();
        }
      }
    }
  };

  getImpageCode = async () => {
    const { getImageCode } = this.props;
    const response = await getImageCode();
    return response;
  };

  refreshCode = () => {
    this.setState({ value: '' }, () => this.getImpageCode());
  };

  render() {
    const { value } = this.state;
    const { imgUrl, inputProps = {}, imgProps = {} } = this.props;

    return (
      <Row gutter={16}>
        <Col span={16}>
          <Input
            value={value}
            onChange={this.handleInputChange}
            onBlur={this.handleInputBlur}
            {...inputProps}
          />
        </Col>
        <Col span={8}>
          <img src={imgUrl} alt="" onClick={this.refreshCode} {...imgProps} />
        </Col>
      </Row>
    );
  }
}

export default ImgCaptcha;
