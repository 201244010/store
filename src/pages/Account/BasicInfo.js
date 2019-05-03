import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Card, Avatar, Input, Upload, Icon } from 'antd';
import * as styles from './Account.less';

class BasicInfo extends Component {
    constructor(props) {
        super(props);
        const {
            user: { currentUser },
        } = props;
        this.state = {
            nameEditing: false,
            username: currentUser.username,
        };
    }

    handleUserNameChange = e => {
        this.setState({
            username: e.target.value,
        });
    };

    saveUsernameChange = async () => {
        const { username } = this.state;
        const { updateUsername } = this.props;
        await updateUsername({ options: { username } });
        this.setState({
            nameEditing: false,
        });
    };

    editUsername = () => {
        this.setState({
            nameEditing: true,
        });
    };

    handleUpload = async file => {
        const { updateIcon } = this.props;
        const fileType =
            file.name
                .split('.')
                .reverse()[0]
                .toString() || 'png';
        const icon = new File([file], `i.${fileType}`);
        await updateIcon({
            options: {
                icon,
            },
        });
    };

    customRequest = ({ file }) => {
        this.handleUpload(file);
    };

    render() {
        const { nameEditing, username } = this.state;
        const {
            loading = false,
            user: {
                currentUser: { origin_icon },
            },
        } = this.props;
        const uploadProps = {
            customRequest: this.customRequest,
            showUploadList: false,
        };

        return (
            <Card loading={loading}>
                <h2>{formatMessage({ id: 'userCenter.basicInfo.title' })}</h2>
                <div className={styles['basicInfo-wrapper']}>
                    <div className={styles['avatar-wrapper']}>
                        <Avatar size={80} icon="user" src={origin_icon} />
                        <div className={styles['avatar-link']}>
                            <Upload {...uploadProps}>
                                <a href="javascript:void(0);">
                                    {formatMessage({ id: 'avatar.change' })}
                                </a>
                            </Upload>
                        </div>
                    </div>
                    <div className={styles['username-wrapper']}>
                        {nameEditing ? (
                            <Input
                                autoFocus="autofocus"
                                value={username}
                                onChange={this.handleUserNameChange}
                                onBlur={this.saveUsernameChange}
                            />
                        ) : (
                            <div>
                                <span>{username}</span>
                                <Icon
                                    className={styles['edit-icon']}
                                    type="edit"
                                    onClick={this.editUsername}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        );
    }
}

export default BasicInfo;
