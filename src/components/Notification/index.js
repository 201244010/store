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
        console.log(action);
    };
    const handleSubBtnAction = action => {
        console.log(action);
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
    const { data = {} } = props;
    const {
        title,
        description,
        template_type: templateType,
        major_button_name: majorButtonName,
        major_button_link: majorButtonLink,
        minor_button_name: minorButtonName,
        minor_button_link: minorButtonLink,
    } = data;

    const status = notificationType[templateType] || 'info';

    notification[status]({
        message: <Title {...{ title }} />,
        description: (
            <Description
                {...{
                    description,
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
