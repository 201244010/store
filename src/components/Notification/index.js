import React from 'react';
import { Button } from 'antd';
import styles from './notification.less';

const Title = props => {
    const { title = '' } = props;
    return <div>{title}</div>;
};

const Description = props => {
    const { description = '', btnOptions = {} } = props;
    const { mainBtn = null, subBtn = null } = btnOptions;
    return (
        <div className={styles['description-wrapper']}>
            <div>{description}</div>
            {Object.keys(btnOptions).length > 0 && (
                <div className={styles['btn-wrapper']}>
                    {subBtn && <Button onClick={subBtn.action}>{subBtn.name}</Button>}
                    {mainBtn && (
                        <Button type="primary" onClick={mainBtn.action}>
                            {mainBtn.name}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default {
    Title,
    Description,
};
