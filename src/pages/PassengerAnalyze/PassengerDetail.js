import React from 'react';
import { formatMessage } from 'umi/locale';
import { Progress } from 'antd';
import moment from 'moment';
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
	const { gender, genderRate, totalGender = 0 } = data;
	const { totalGender: lastTotalGender = 0 } = lastInfo;
	const { title = null, key = null } = column;

	const FooterContent = {
		[INFO_FOOTER_TYPE.PERCENT]: (content = '--') =>
			<span className={`${parseInt(content, 10) > 100 ? styles['precent-green'] : styles['precent-red']}`}>
				{`${parseInt(content, 10) > 100 || parseInt(content, 10) === 0 ? content : -1 * content}%`}
			</span>,
		[INFO_FOOTER_TYPE.PROGRESS]: (content = '--') => (
			<div className={styles['progress-footer']}>
				<Progress percent={content} strokeColor={parseInt(content, 10) > 30 ? '#25b347' : '#ff6633'} />
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
							lastTotalGender === 0
								? 0 : parseInt(totalGender / lastTotalGender * 100, 10)
						) || FooterContent[INFO_FOOTER_TYPE.DEFAULT]()
					}
				</div>
			</>
		),
		[INFO_CONTENT_TYPE.GENDER_RATE]: (
			<>
				<div className={styles['info-content']}>
					{genderRate}
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
					{data[`${gender}${key}`]}%
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
					{data[`${gender}${key}`] === -1 ? '--' : moment.unix(data[`${gender}${key}`]).format('HH:mm')}
				</div>
				<div className={styles['info-footer']}>
					{FooterContent[INFO_FOOTER_TYPE.DEFAULT]()}
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

const PassengerDetail = ({ data, lastData = [] }) => {
	const lastInfo = lastData.find(item => item.gender === data.gender && item.ageRangeCode === data.ageRangeCode) || {};
	return (
		<div className={styles['detail-wrapper']}>
			{columns.map((item, index) => (
				<div className={styles['detail-info']} key={index}>
					<DetailInfo key={index} column={item} data={data} lastInfo={lastInfo} />
				</div>
			))}
		</div>
	);
};

export default PassengerDetail;
