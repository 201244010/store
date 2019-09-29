import React from 'react';
import { formatMessage } from 'umi/locale';
import { Progress } from 'antd';
import { replaceTemplateWithValue } from '@/utils/utils';
import styles from './passengerAnalyze.less';

const INFO_FOOTER_TYPE = {
	PERCENT: 'percent',
	PROGRESS: 'progress',
	RANK: 'rank',
	DEFAULT: 'default',
};

const mockList = [
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.comein' }),
		content: 560,
		footer: { type: INFO_FOOTER_TYPE.PERCENT, content: '-23%' },
	},
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.total.rate' }),
		content: '23%',
		footer: { type: INFO_FOOTER_TYPE.PROGRESS, content: 23, color: '#FF6633' },
	},
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.regular.rate' }),
		content: '70%',
		footer: { type: INFO_FOOTER_TYPE.PROGRESS, content: 70, color: '#25B347' },
	},
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.rebuy.rate' }),
		content: '35%',
		footer: { type: INFO_FOOTER_TYPE.PROGRESS, content: 35, color: '#25B347' },
	},
	// row 2
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.payment.count' }),
		content: 468,
		footer: { type: INFO_FOOTER_TYPE.PERCENT, content: '-13%' },
	},
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.payment.rate' }),
		content: '75%',
		footer: { type: INFO_FOOTER_TYPE.PROGRESS, content: 75, color: '#25B347' },
	},
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.salse.rate' }),
		content: '56%',
		footer: { type: INFO_FOOTER_TYPE.PROGRESS, content: 56, color: '#25B347' },
	},
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.unit.price' }),
		content: 22.9,
		footer: {
			type: INFO_FOOTER_TYPE.RANK,
			content: replaceTemplateWithValue({
				messageId: 'passengerAnalyze.detail.rank',
				valueList: [{ key: '##rank##', value: 1 }],
			}),
		},
	},
	// row 3
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.relate.type' }),
		content: (
			<div className={styles['info-list']}>
				{formatMessage({ id: 'salse.type.drink' })}23%
			</div>
		),
		footer: { content: <div>{formatMessage({ id: 'salse.type.tabaco' })}18%</div> },
	},
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.avg.salse.count' }),
		content: '75%',
		footer: {
			type: INFO_FOOTER_TYPE.RANK,
			content: replaceTemplateWithValue({
				messageId: 'passengerAnalyze.detail.rank',
				valueList: [{ key: '##rank##', value: 1 }],
			}),
		},
	},
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.top.time' }),
		content: '12:00',
		footer: {
			content: <>{formatMessage({ id: 'passengerAnalyze.detail.top.time.rate' })}45%</>,
		},
	},
	{
		title: formatMessage({ id: 'passengerAnalyze.detail.avg.time' }),
		content: '8\'23',
		footer: {
			type: INFO_FOOTER_TYPE.RANK,
			content: replaceTemplateWithValue({
				messageId: 'passengerAnalyze.detail.rank',
				valueList: [{ key: '##rank##', value: 1 }],
			}),
		},
	},
];

const DetailInfo = ({ title = null, content = null, footer = {} }) => {
	const { type, content: footerContent, color = '#0E8EE9' } = footer;
	const FooterContent = {
		[INFO_FOOTER_TYPE.PERCENT]: <span className={styles['precent-red']}>{footerContent}</span>,
		[INFO_FOOTER_TYPE.PROGRESS]: (
			<div className={styles['progress-footer']}>
				<Progress percent={footerContent} strokeColor={color} />
			</div>
		),
		[INFO_FOOTER_TYPE.RANK]: <span className={styles['rank-green']}>{footerContent}</span>,
		[INFO_FOOTER_TYPE.DEFAULT]: <div>{footerContent}</div>,
	};

	return (
		<div className={styles['info-wrapper']}>
			<div className={styles['info-title']}>{title}</div>
			<div className={styles['info-content']}>{content}</div>
			<div className={styles['info-footer']}>
				{FooterContent[type] || FooterContent[INFO_FOOTER_TYPE.DEFAULT]}
			</div>
		</div>
	);
};

const PassengerDetail = () => (
	<div className={styles['detail-wrapper']}>
		{mockList.map((item, index) => {
			const { title, content, footer } = item;
			return (
				<div className={styles['detail-info']} key={index}>
					<DetailInfo key={index} title={title} content={content} footer={footer} />
				</div>
			);
		})}
	</div>
);

export default PassengerDetail;
