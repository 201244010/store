import React from 'react';
import ResultInfo from '@/components/ResultInfo';
import { formatMessage } from 'umi/locale';

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
