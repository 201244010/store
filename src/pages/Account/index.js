import React, { Component } from 'react';
import { connect } from 'dva';
import BasicInfo from './BasicInfo';
import Security from './Security';
import Store from './Store';
import * as styles from './Account.less';

@connect(
    state => ({
        user: state.user,
        sso: state.sso,
    }),
    dispatch => ({
        updateUsername: payload => dispatch({ type: 'user/updateUsername', payload }),
        changePassword: payload => dispatch({ type: 'user/changePassword', payload }),
        updatePhone: payload => dispatch({ type: 'user/updatePhone', payload }),
        updateIcon: payload => dispatch({ type: 'user/updateIcon', payload }),
        sendCode: payload => dispatch({ type: 'sso/sendCode', payload }),
    })
)
class UserCenter extends Component {
    render() {
        const {
            user,
            sso,
            updateUsername,
            changePassword,
            updatePhone,
            sendCode,
            updateIcon,
        } = this.props;

        return (
            <div className={styles['account-wrapper']}>
                <BasicInfo
                    {...{
                        user,
                        updateUsername,
                        updateIcon,
                    }}
                />
                <Security
                    {...{
                        user,
                        sso,
                        changePassword,
                        updatePhone,
                        sendCode,
                    }}
                />
                <Store />
            </div>
        );
    }
}

export default UserCenter;
