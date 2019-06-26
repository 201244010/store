import React from 'react';
import { Button, notification } from 'antd';
import { formatMessageTemplate } from '@/utils/utils';
import styles from './notification.less';

notification.config({
	top: 65,
});

export const Title = props => {
	const { title = '' } = props;
	return <div className={styles.title}>{title !== '' ? formatMessageTemplate(title) : ''}</div>;
};

export const Description = props => {
	const { description = '', btnOptions = {} } = props;
	const {
		majorButtonName = null,
		majorButtonLink = null,
		minorButtonName = null,
		minorButtonLink = null,
	} = btnOptions;

	const handleMainBtnAction = (action, paramsStr) => {
		const { mainAction = null } = props;
		if (mainAction) {
			mainAction(action, paramsStr);
		}
	};
	const handleSubBtnAction = (action, paramsStr) => {
		const { subAction = null } = props;
		if (subAction) {
			subAction(action, paramsStr);
		}
	};

	return (
		<div className={styles['description-wrapper']}>
			<div>{description !== '' ? formatMessageTemplate(description) : ''}</div>
			{Object.keys(btnOptions).length > 0 && (
				<div className={styles['btn-wrapper']}>
					{minorButtonName && (
						<Button
							onClick={() => handleSubBtnAction(minorButtonName, minorButtonLink)}
						>
							{formatMessageTemplate(minorButtonName)}
						</Button>
					)}
					{majorButtonName && (
						<Button
							style={{ marginLeft: '15px' }}
							type="primary"
							onClick={() => handleMainBtnAction(majorButtonName, majorButtonLink)}
						>
							{formatMessageTemplate(majorButtonName)}
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
	const { data = {}, key, mainAction, subAction, closeAction } = props;
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
		key,
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
		onClose: () => closeAction(key),

		// 测试时用
		// duration: 0,
	});
};
