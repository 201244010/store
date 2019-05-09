import React, { Component } from 'react';
import * as CookieUtil from '@/utils/cookies';
import router from 'umi/router';

function AuthorithCheck(WrappedComponent) {
    return class extends Component {
        authorityCheck = () => {
            const token = CookieUtil.getCookieByKey(CookieUtil.TOKEN_KEY);
            if (!token) {
                router.push('/user/login');
                return false;
            }
            return true;
        };

        render() {
            return (
                <WrappedComponent
                    {...{
                        authorityCheck: this.authorityCheck,
                        ...this.props,
                    }}
                />
            );
        }
    };
}

export default AuthorithCheck;
