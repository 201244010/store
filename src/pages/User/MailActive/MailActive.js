import React from 'react';
import { formatMessage } from 'umi/locale';
import ResultInfo from '@/components/ResultInfo';

const MailActive = () => (
	<ResultInfo
		{...{
			title: `${formatMessage({ id: 'mail.active.title' })} xxxx@sunmi.com ${formatMessage({
				id: 'mail.active.success',
			})}`,
			description: formatMessage({ id: 'mail.active.notice' }),
			countInit: 3,
		}}
	/>
);

export default MailActive;
