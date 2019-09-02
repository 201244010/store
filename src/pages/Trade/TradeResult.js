import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Result } from 'ant-design-pro';
import { Card, Button } from 'antd';
import styles from './trade.less';

const RESULT_MESSAGE = {
	success: {
		title: formatMessage({ id: 'pay.success' }),
		description: formatMessage({ id: 'pay.success.info' }),
		action: ({ goToPath = null }) => (
			<div className={styles['result-action-wrapper']}>
				<Button type="primary" size="large" onClick={() => goToPath('trade')}>
					{formatMessage({ id: 'pay.back.order' })}
				</Button>
				<Button type="default" size="large" onClick={() => goToPath('trade')}>
					{formatMessage({ id: 'pay.back.service' })}
				</Button>
			</div>
		),
	},
	error: {
		title: formatMessage({ id: 'pay.failed' }),
		description: formatMessage({ id: 'pay.failed.info' }),
		action: ({ goToPath = null }) => (
			<div className={styles['result-action-wrapper']}>
				<Button type="primary" size="large" onClick={() => goToPath('trade')}>
					{formatMessage({ id: 'pay.check.detail' })}
				</Button>
			</div>
		),
	},
};

@connect(
	state => ({
		routing: state.routing,
	}),
	dispatch => ({
		goToPath: (pathId, urlParams = {}, linkType = null) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams, linkType } }),
	})
)
class TradeResult extends PureComponent {
	render() {
		const { routing: { location: { query = {} } = {} } = {}, goToPath } = this.props;
		const { status = 'error' } = query;
		const { title, description, action } = RESULT_MESSAGE[status] || RESULT_MESSAGE.error;

		return (
			<Card title={null}>
				<div className={styles['icon-wrapper']}>
					<Result
						className={styles['result-wrapper']}
						type={status}
						title={<div className={styles['result-title']}>{title}</div>}
						description={<div className={styles['result-content']}>{description}</div>}
						actions={action({ goToPath })}
					/>
				</div>
			</Card>
		);
	}
}

export default TradeResult;
