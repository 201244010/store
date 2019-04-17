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

  getImageCode = async () => {
    const { getImageCode } = this.props;
    const response = await getImageCode();
    return response;
  };

  refreshCode = () => {
    this.setState({ value: '' }, () => this.getImageCode());
  };

  render() {
    const { value } = this.state;
    const { imgUrl, inputProps = {}, imgProps = {}, type = 'horizontal' } = this.props;

    return (
      <>
        {type === 'horizontal' ? (
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
        ) : (
          <>
            <div>
              <img src={imgUrl} alt="" onClick={this.refreshCode} {...imgProps} />
            </div>
            <div>
              <Input
                value={value}
                onChange={this.handleInputChange}
                onBlur={this.handleInputBlur}
                {...inputProps}
              />
            </div>
          </>
        )}
      </>
    );
  }
}

export default ImgCaptcha;
