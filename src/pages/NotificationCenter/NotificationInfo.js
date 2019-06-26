import React from 'react';
import { connect } from 'dva';
import { getLocationParam, unixSecondToDate, formatMessageTemplate } from '@/utils/utils';
import { Button, Divider, Card } from 'antd';
import VideoPlayComponent from '@/pages/IPC/component/VideoPlayComponent';
import styles from './Notification.less';
import { ACTION_MAP } from '@/constants/mqttActionMap';

@connect(
	state => ({
		notification: state.notification,
	}),
	dispatch => ({
		getNotificationInfo: payload =>
			dispatch({ type: 'notification/getNotificationInfo', payload }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class Notification extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isWatchVideo: false,
			videoUrl: '',
			ipcType: '',
		};
	}

	componentDidMount() {
		const msgId = getLocationParam('msgId');
		const { getNotificationInfo } = this.props;
		getNotificationInfo({
			msgId,
		});
	}

	watchVideoClose = () => {
		this.setState({
			videoUrl: '',
			isWatchVideo: false,
		});
	};

	handleAction = (action, paramsStr) => {
		const { goToPath } = this.props;
		if (action) {
			const handler = ACTION_MAP[action] || (() => null);
			const result = handler({ handlers: { goToPath }, params: paramsStr });

			const { action: resultAction = null, payload = {} } = result || {};
			if (resultAction === 'showMotionVideo') {
				const { url, ipcType } = payload;
				this.setState({
					isWatchVideo: true,
					videoUrl: url,
					ipcType,
				});
			}
		}
	};

	render() {
		const {
			notification: {
				notificationInfo: {
					title = '',
					content = '',
					receiveTime = null,
					majorButtonLink = null,
					majorButtonName = null,
					minorButtonLink = null,
					minorButtonName = null,
				} = {},
			} = {},
		} = this.props;
		const { isWatchVideo, videoUrl, ipcType } = this.state;

		return (
			<Card bordered={false}>
				<div className={styles['title-wrapper']}>
					<h1 className={styles['info-title']}>
						{title !== '' ? formatMessageTemplate(title) : ''}
					</h1>
					<div className={styles['info-time']}>
						{receiveTime ? unixSecondToDate(receiveTime) : null}
					</div>
				</div>
				<Divider />
				<div className={styles['content-wrapper']}>
					<p>{content ? formatMessageTemplate(content.toString()) : ''}</p>
				</div>
				<div className={styles['button-bar']}>
					{minorButtonName && (
						<Button onClick={() => this.handleAction(minorButtonName, minorButtonLink)}>
							{formatMessageTemplate(minorButtonName)}
						</Button>
					)}
					{majorButtonName && (
						<Button
							style={{ marginLeft: minorButtonName ? '20px' : '0' }}
							type="primary"
							onClick={() => this.handleAction(majorButtonName, majorButtonLink)}
						>
							{formatMessageTemplate(majorButtonName)}
						</Button>
					)}
				</div>

				<VideoPlayComponent
					playing={isWatchVideo}
					watchVideoClose={this.watchVideoClose}
					videoUrl={videoUrl}
					ipcType={ipcType}
				/>
			</Card>
		);
	}
}

export default Notification;
