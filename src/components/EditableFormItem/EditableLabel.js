import React, { Component } from 'react';
import { Input } from 'antd';

class EditableLabel extends Component {
    constructor(props) {
        super(props);
        const {
            labelProps: { name },
        } = props;
        this.state = {
            inEditing: false,
            labelName: name || '',
        };
    }

    switchMode = () => {
        const {
            labelProps: { editable = true },
        } = this.props;
        if (!editable) {
            return;
        }
        const { inEditing } = this.state;
        this.setState({
            inEditing: !inEditing,
        });
    };

    onChange = e => {
        const {
            labelProps: { onChange },
        } = this.props;
        this.setState({
            labelName: e.target.value || '',
        });

        if (onChange) {
            onChange(e);
        }
    };

    onBlur = () => {
        const { labelName, inEditing } = this.state;
        const {
            labelProps: { onBlur },
        } = this.props;

        if (onBlur) {
            this.setState(
                {
                    inEditing: !inEditing,
                },
                () => onBlur(labelName)
            );
        } else {
            this.setState({
                inEditing: !inEditing,
            });
        }
    };

    render() {
        const { inEditing, labelName } = this.state;
        const {
            labelProps: { inputProps = {}, style = {} },
        } = this.props;

        return (
            <>
                {inEditing ? (
                    <Input
                        id="1122"
                        value={labelName}
                        onChange={e => this.onChange(e)}
                        onBlur={this.onBlur}
                        {...inputProps}
                    />
                ) : (
                    <div
                        style={{
                            textAlign: 'right',
                            ...style,
                        }}
                        onClick={this.switchMode}
                    >
                        {labelName}：
                    </div>
                )}
            </>
        );
    }
}

export default EditableLabel;
