import React, { Component } from 'react';
import { Input } from 'antd';

class EditableLabel extends Component {
  constructor(props) {
    super(props);
    const {
      labelProps: { label },
    } = props;
    this.state = {
      inEditing: false,
      labelValue: label,
    };
  }

  switchMode = (callback, ...rest) => {
    const { editable = true } = this.props;
    if (!editable) {
      return;
    }

    const { inEditing } = this.state;
    this.setState(
      {
        inEditing: !inEditing,
      },
      () => {
        if (callback) {
          callback(...rest);
        }
      }
    );
  };

  onChange = e => {
    const {
      labelProps: { onChange },
    } = this.props;
    this.setState({
      labelValue: e.target.value || '',
    });

    if (onChange) {
      onChange(e);
    }
  };

  onBlur = () => {
    const { labelValue } = this.state;
    const {
      labelProps: { onBlur },
    } = this.props;

    if (onBlur) {
      this.switchMode(onBlur, labelValue);
    } else {
      this.switchMode();
    }
  };

  render() {
    const { inEditing, labelValue } = this.state;
    const {
      labelProps: { label = '', inputProps = {}, style = {} },
    } = this.props;

    return (
      <>
        {inEditing ? (
          <Input
            value={labelValue}
            onChange={e => this.onChange(e)}
            onBlur={this.onBlur}
            {...inputProps}
          />
        ) : (
          <span style={style} onClick={this.switchMode}>
            {label}
          </span>
        )}
      </>
    );
  }
}

export default EditableLabel;
