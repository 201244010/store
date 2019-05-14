import React, { createElement } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import config from './typeConfig';
import styles from './index.less';

class Exception extends React.PureComponent {
    static defaultProps = {
        backText: 'back to home',
        redirect: '/',
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            className,
            backText,
            linkElement = 'a',
            type,
            title,
            desc,
            img,
            actions,
            redirect,
            customStyle,
            ...rest
        } = this.props;
        const pageType = type in config ? type : '404';
        const clsString = classNames(styles.exception, className);
        return (
            <div className={clsString} {...rest}>
                <div className={styles.imgBlock}>
                    <div
                        className={styles.imgEle}
                        style={{ backgroundImage: `url(${img || config[pageType].img})` }}
                    />
                </div>
                <div className={styles.content}>
                    <h1 style={{ ...customStyle }}>{title || config[pageType].title}</h1>
                    <div className={styles.desc} style={{ ...customStyle }}>
                        {desc || config[pageType].desc}
                    </div>
                    <div className={styles.actions}>
                        {actions ||
                            createElement(
                                linkElement,
                                {
                                    to: redirect,
                                    href: redirect,
                                },
                                <Button type="primary">{backText}</Button>
                            )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Exception;
