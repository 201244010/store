import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Card, List } from 'antd';
import { ChangePassword, ChangeMobile, ChangeMail } from '@/components/Modal';
import { maskPhone } from '@/utils/utils';
import * as styles from './Account.less';
import { ERROR_OK } from '@/constants/errorCode';

const RENDER_MODAL = {
    password: ChangePassword,
    mobile: ChangeMobile,
    mail: ChangeMail,
    default: () => <div />,
};

class Security extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showChangeModal: false,
            modalType: '',
        };
    }

    openChangeModal = type => {
        this.setState({
            showChangeModal: true,
            modalType: type,
        });
    };

    handleModalSubmit = async values => {
        const { modalType } = this.state;
        const { changePassword, updatePhone } = this.props;

        if (modalType === 'password') {
            const response = await changePassword({ options: values });
            if (response && response.code === ERROR_OK) {
                this.closeChangeModal();
            }
            return response;
        }

        if (modalType === 'mobile') {
            const response = await updatePhone({ options: values });
            if (response && response.code === ERROR_OK) {
                this.closeChangeModal();
            }
            return response;
        }

        return null;
    };

    closeChangeModal = () => {
        this.setState({
            showChangeModal: false,
            modalType: '',
        });
    };

    render() {
        const { showChangeModal, modalType } = this.state;
        const {
            user: { currentUser },
            sso,
            sendCode,
            checkUserExist,
        } = this.props;
        const RenderModal = RENDER_MODAL[modalType] || RENDER_MODAL.default;

        return (
            <>
                <Card style={{ marginTop: '15px' }}>
                    <h2>{formatMessage({ id: 'userCenter.security.title' })}</h2>
                    <List className={styles['list-wrapper']}>
                        <List.Item>
                            <div className={styles['list-item']}>
                                <div className={styles['title-wrapper-between']}>
                                    <h4>{formatMessage({ id: 'userCenter.security.password' })}</h4>
                                    <a
                                        href="javascript:void(0);"
                                        onClick={() => this.openChangeModal('password')}
                                    >
                                        {formatMessage({ id: 'btn.alter' })}
                                    </a>
                                </div>
                                <div>
                                    {formatMessage({
                                        id: 'userCenter.security.password.description',
                                    })}
                                </div>
                            </div>
                        </List.Item>
                        <List.Item>
                            <div className={styles['list-item']}>
                                <div className={styles['title-wrapper-between']}>
                                    <h4>{formatMessage({ id: 'userCenter.security.mobile' })}</h4>
                                    <a
                                        href="javascript:void(0);"
                                        onClick={() => this.openChangeModal('mobile')}
                                    >
                                        {currentUser.phone
                                            ? formatMessage({ id: 'btn.alter' })
                                            : formatMessage({ id: 'btn.bind' })}
                                    </a>
                                </div>
                                <div>
                                    {formatMessage({
                                        id: 'userCenter.security.mobile.description',
                                    })}
                                    <span>
                                        {maskPhone(currentUser.phone || '', {
                                            maskStart: 3,
                                            maskEnd: 6,
                                        }) || ''}
                                    </span>
                                </div>
                            </div>
                        </List.Item>
                        {/* TODO 暂时隐去邮箱找回功能 */}
                        {/* <List.Item> */}
                        {/* <div className={styles['list-item']}> */}
                        {/* <div className={styles['title-wrapper-between']}> */}
                        {/* <h4>{formatMessage({ id: 'userCenter.security.mail' })}</h4> */}
                        {/* <a */}
                        {/* href="javascript:void(0);" */}
                        {/* onClick={() => this.openChangeModal('mail')} */}
                        {/* > */}
                        {/* {currentUser.email */}
                        {/* ? formatMessage({ id: 'btn.alter' }) */}
                        {/* : formatMessage({ id: 'btn.bind' })} */}
                        {/* </a> */}
                        {/* </div> */}
                        {/* <div> */}
                        {/* {formatMessage({ id: 'userCenter.security.mail.description' })} */}
                        {/* </div> */}
                        {/* </div> */}
                        {/* </List.Item> */}
                    </List>
                </Card>
                <RenderModal
                    {...{
                        sso,
                        visible: showChangeModal,
                        mobileBinded: !!currentUser.phone,
                        mailBinded: !!currentUser.email,
                        onOk: this.handleModalSubmit,
                        onCancel: this.closeChangeModal,
                        sendCode,
                        checkUserExist,
                    }}
                />
            </>
        );
    }
}

export default Security;
