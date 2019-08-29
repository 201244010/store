import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Result } from 'ant-design-pro';
import { Card } from 'antd';
import styles from './trade.less';

@connect()
class TradeResult extends PureComponent {
	render() {
		return (
			<Card title={null}>
				<div className={styles['icon-wrapper']}>
					<Result
						className={styles['result-wrapper']}
						type="success"
						title={
							<div className={styles['result-title']}>
								{formatMessage({ id: 'register.account' })}
								{formatMessage({ id: 'register.mail.success' })}
							</div>
						}
						description={
							<div className={styles['result-content']}>
								{formatMessage({ id: 'register.mail.notice' })}
							</div>
						}
						actions={null}
					/>
				</div>
			</Card>
		);
	}
}

export default TradeResult;
