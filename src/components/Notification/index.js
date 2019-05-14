import React from 'react';
import { Button, notification } from 'antd';
import styles from './notification.less';

export const Title = props => {
    const { title = '' } = props;
    return <div className={styles.title}>{title}</div>;
};

export const Description = props => {
    const { description = '', btnOptions = {} } = props;
    const {
        majorButtonName = null,
        majorButtonLink = null,
        minorButtonName = null,
        minorButtonLink = null,
    } = btnOptions;

    const handleMainBtnAction = action => {
        const { mainAction = null } = props;
        if (mainAction) {
            mainAction(action);
        }
    };
    const handleSubBtnAction = action => {
        const { subAction = null } = props;
        if (subAction) {
            subAction(action);
        }
    };

    return (
        <div className={styles['description-wrapper']}>
            <div>{description}</div>
            {Object.keys(btnOptions).length > 0 && (
                <div className={styles['btn-wrapper']}>
                    {minorButtonName && (
                        <Button onClick={() => handleSubBtnAction(minorButtonLink)}>
                            {minorButtonName}
                        </Button>
                    )}
                    {majorButtonName && (
                        <Button
                            style={{ marginLeft: '15px' }}
                            type="primary"
                            onClick={() => handleMainBtnAction(majorButtonLink)}
                        >
                            {majorButtonName}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

const notificationType = {
    0: 'success',
    1: 'info',
    2: 'warning',
    3: 'error',
};

export const displayNotification = props => {
    const { data = {}, mainAction, subAction } = props;
    const {
        title,
        description,
        level,
        major_button_name: majorButtonName,
        major_button_link: majorButtonLink,
        minor_button_name: minorButtonName,
        minor_button_link: minorButtonLink,
    } = data;

    const status = notificationType[level] || 'info';

    notification[status]({
        message: <Title {...{ title }} />,
        description: (
            <Description
                {...{
                    description,
                    mainAction,
                    subAction,
                    btnOptions: {
                        majorButtonName,
                        majorButtonLink,
                        minorButtonName,
                        minorButtonLink,
                    },
                }}
            />
        ),

        // 测试时用
        // duration: 0,
    });
};
