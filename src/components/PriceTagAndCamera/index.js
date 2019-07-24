import React from 'react';
import { formatMessage } from 'umi/locale';
import { priceFormat } from '@/utils/utils';

import styles from './index.less';

export default class PriceTagAndCamera extends React.Component {
	render() {
		const {
			deviceOverView: {
				eslTotalCount = '',
				eslPendingCount = '',
				eslFailedCount = '',
				apTotalCount = '',
			} = {},
			ipcOverView: { onLineCount = '', offLineCount = '' } = {},
		} = this.props;

		const priceTag = [
			{
				name: formatMessage({ id: 'dashboard.overview.esl.push.total' }),
				num: eslTotalCount === '' ? '--' : priceFormat(eslTotalCount),
			},
			{
				name: formatMessage({ id: 'dashboard.overview.ap.online' }),
				num: apTotalCount === '' ? '--' : apTotalCount,
			},
			{
				name: formatMessage({ id: 'dashboard.overview.esl.push' }),
				num: eslPendingCount === '' ? '--' : priceFormat(eslPendingCount),
			},
			{
				name: formatMessage({ id: 'dashboard.overview.esl.push.failed' }),
				num: eslFailedCount === '' ? '--' : eslFailedCount,
			},
		];

		const camera = [
			{
				name: formatMessage({ id: 'dashboard.overview.ipc.online' }),
				num: onLineCount === '' ? '--' : priceFormat(onLineCount),
			},
			{
				name: formatMessage({ id: 'dashboard.overview.ipc.offline' }),
				num: offLineCount === '' ? '--' : offLineCount,
			},
		];

		return (
			<div className={styles['price-tag-camera']}>
				<div>
					<div className={styles['price-title']}>
						{formatMessage({ id: 'dashboard.overview.esl.push.show.title' })}
					</div>
					{priceTag.map(item => <OneList key={item.name} name={item.name} num={item.num} />)}
				</div>
				<div>
					<div className={styles['price-title']}>
						{formatMessage({ id: 'dashboard.overview.ipc.show.title' })}
					</div>
					{camera.map(item => <OneList key={item.name} name={item.name} num={item.num} />)}
				</div>
			</div>
		);
	}
}

const OneList = props => {
	const { name, num } = props;
	return (
		<div className={styles.oneList}>
			<span className={styles['oneList-name']}>{name}</span>
			<span className={styles['oneList-num']}>{num}</span>
		</div>
	);
};
