import React from 'react';
import { formatMessage } from 'umi/locale';
import { Progress } from 'antd';
import styles from './passengerAnalyze.less';

const INFO_CONTENT_TYPE = {
	COUNT: 'Count',
	GENDER_RATE: 'GenderRate',
	REGULAR_RATE: 'RegularRate',
	RUSH_HOUR: 'RushHour',
	DEFAULT: 'default'
};

const INFO_FOOTER_TYPE = {
	PERCENT: 'percent',
	PROGRESS: 'progress',
	RANK: 'rank',
	DEFAULT: 'default',
};

const columns = [
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.comein' }),
		key: 'Count',
		footer: { type: INFO_FOOTER_TYPE.PERCENT },
	},
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.total.rate' }),
		key: 'GenderRate',
		footer: { type: INFO_FOOTER_TYPE.PROGRESS },
	},
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.regular.rate' }),
		key: 'RegularRate',
		footer: { type: INFO_FOOTER_TYPE.PROGRESS },
	},
	// {
	// 	title: formatMessage({ id: 'passengerAnalyze.detail.rebuy.rate' }),
	// 	key: '',
	// 	footer: { type: INFO_FOOTER_TYPE.PROGRESS },
	// },
	// row 2
	// {
	// 	title: formatMessage({ id: 'passengerAnalyze.detail.payment.count' }),
	// 	key: '',
	// 	footer: { type: INFO_FOOTER_TYPE.PERCENT },
	// },
	// {
	// 	title: formatMessage({ id: 'passengerAnalyze.detail.payment.rate' }),
	// 	key: '',
	// 	footer: { type: INFO_FOOTER_TYPE.PROGRESS },
	// },
	// {
	// 	title: formatMessage({ id: 'passengerAnalyze.detail.salse.rate' }),
	// 	key: '',
	// 	footer: { type: INFO_FOOTER_TYPE.PROGRESS },
	// },
	// {
	// 	title: formatMessage({ id: 'passengerAnalyze.detail.unit.price' }),
	// 	key: '',
	// 	footer: { type: INFO_FOOTER_TYPE.RANK },
	// },
	// row 3
	// {
	// 	title: formatMessage({ id: 'passengerAnalyze.detail.relate.type' }),
	// 	key: '',
	// },
	// {
	// 	title: formatMessage({ id: 'passengerAnalyze.detail.avg.salse.count' }),
	// 	key: '',
	// 	footer: { type: INFO_FOOTER_TYPE.RANK },
	// },
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.top.time' }),
		key: 'RushHour',
	},
	// {
	// 	title: formatMessage({ id: 'passengerAnalyze.detail.avg.time' }),
	// 	key: '',
	// 	footer: {},
	// },
];

const DetailInfo = ({ data = {}, column = {}, lastInfo = {} }) => {
	const { gender, genderRate} = data;
	const { title = null, key = null } = column;

	const nowCount = data[`${data.gender}Count`];
	const lastCount = lastInfo[`${lastInfo.gender}Count`];

	const FooterContent = {
		[INFO_FOOTER_TYPE.PERCENT]: (content = '--') =>
			<span className={`${parseInt(content, 10) > 0 ? styles['percent-green'] : parseInt(content, 10) < 0 ? styles['percent-red'] : styles['percent-gray']}`}>
				{`${parseInt(content, 10) > 0 ? `+${content}` : content}%`}
			</span>,
		[INFO_FOOTER_TYPE.PROGRESS]: (content = '--') => (
			<div className={styles['progress-footer']}>
				<Progress percent={Math.round(content * 1)} strokeColor={parseInt(content, 10) > 30 ? '#25b347' : '#ff6633'} />
			</div>
		),
		[INFO_FOOTER_TYPE.RANK]: (content = '--') => <span className={styles['rank-green']}>{content}</span>,
		[INFO_FOOTER_TYPE.DEFAULT]: (content = '--') => <div>{content}</div>,
	};

	const InfoContent = {
		[INFO_CONTENT_TYPE.COUNT]: (
			<>
				<div className={styles['info-content']}>
					{data[`${gender}${key}`]}
				</div>
				<div className={styles['info-footer']}>
					{
						FooterContent[INFO_FOOTER_TYPE.PERCENT](
							lastCount === 0 ? 0 : Math.round((nowCount - lastCount) / lastCount * 100)
						) || FooterContent[INFO_FOOTER_TYPE.DEFAULT]()
					}
				</div>
			</>
		),
		[INFO_CONTENT_TYPE.GENDER_RATE]: (
			<>
				<div className={styles['info-content']}>
					{Math.round(genderRate * 1)}%
				</div>
				<div className={styles['info-footer']}>
					{FooterContent[INFO_FOOTER_TYPE.PROGRESS](genderRate)
						|| FooterContent[INFO_FOOTER_TYPE.DEFAULT]()}
				</div>
			</>
		),
		[INFO_CONTENT_TYPE.REGULAR_RATE]: (
			<>
				<div className={styles['info-content']}>
					{Math.round(data[`${gender}${key}`] * 1)}%
				</div>
				<div className={styles['info-footer']}>
					{FooterContent[INFO_FOOTER_TYPE.PROGRESS](data[`${gender}${key}`])
						|| FooterContent[INFO_FOOTER_TYPE.DEFAULT]()}
				</div>
			</>
		),
		[INFO_CONTENT_TYPE.RUSH_HOUR]: (
			<>
				<div className={styles['info-content']}>
					{data[`${gender}${key}`] === -1 ? '--' : `${data[`${gender}${key}`]}:00`}
				</div>
			</>
		),
		[INFO_CONTENT_TYPE.DEFAULT]: (
			<>
				<div className={styles['info-content']}>{key ? data[`${gender}${key}`] : '--'}</div>
				{FooterContent[INFO_FOOTER_TYPE.DEFAULT]()}
			</>
		)
	};

	return (
		<div className={styles['info-wrapper']}>
			<div className={styles['info-title']}>{title || '--'}</div>
			{InfoContent[key] || InfoContent[INFO_CONTENT_TYPE.DEFAULT]}
		</div>
	);
};

const PassengerDetail = ({ data, lastData = [] }) => (
	<div className={styles['detail-wrapper']}>
		{columns.map((item, index) => (
			<div className={styles['detail-info']} key={index}>
				<DetailInfo key={index} column={item} data={data} lastInfo={lastData} />
			</div>
		))}
	</div>
);

export default PassengerDetail;
