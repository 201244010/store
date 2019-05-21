import React from 'react';
import { notification, Button } from 'antd';

import { formatMessage } from 'umi/locale';

const closeNotification = sn => {
    const noSdcardKey = `noSdcard${sn}`;
    const successKey = `fotmatSuccess${sn}`;
    const formatKey = `formatSdcard${sn}`;
    const unknownKey = `unknown${sn}`;

    notification.close(noSdcardKey);
    notification.close(unknownKey);
    notification.close(successKey);
    notification.close(formatKey);
};

const warningNoSDCard = (sn, resetStatus) => {
    const title = formatMessage({ id: 'SDCard.noSDCard.title' });
    const content = formatMessage({ id: 'SDCard.noSDCard.content' });
    const okText = formatMessage({ id: 'SDCard.noSDCard.okText' });

    closeNotification(sn);

    const key = `noSdcard${sn}`;
    const btn = (
        <Button
            type="primary"
            onClick={() => {
                // console.log('no sdcard');
                notification.close(key);
            }}
        >
            {okText}
        </Button>
    );
    notification.info({
        duration: null,
        message: `IPC-${sn}-${title}`,
        description: content,
        btn,
        key,
        onClose: resetStatus(sn),
    });
};

const warningUnknownSDCard = (sn, resetStatus) => {
    const title = formatMessage({ id: 'SDCard.unknown.title' });
    const content = formatMessage({ id: 'SDCard.unknown.content' });
    const okText = formatMessage({ id: 'SDCard.unknown.okText' });

    closeNotification(sn);

    const key = `unknown${sn}`;
    const btn = (
        <Button
            type="primary"
            onClick={() => {
                notification.close(key);
            }}
        >
            {okText}
        </Button>
    );
    notification.warning({
        duration: null,
        message: `IPC-${sn}-${title}`,
        description: content,
        btn,
        key,
        onClose: resetStatus(sn),
    });
};

const formatFailed = (sn, resetformatResponse) => {
    const title = formatMessage({ id: 'SDCard.format.failed.title' });
    const content = formatMessage({ id: 'SDCard.format.failed.content' });

    closeNotification(sn);

    const key = `formatFailed${sn}`;
    const btn = (
        <Button
            type="primary"
            onClick={() => {
                notification.close(key);
            }}
        >
            确认
        </Button>
    );
    notification.error({
        duration: null,
        message: `IPC-${sn}-${title}`,
        description: content,
        btn,
        key,
        onClose: resetformatResponse(sn),
    });
};

class SDCardChild extends React.Component {
    componentDidUpdate() {
        const { sdcardItem, resetformatResponse, resetStatus } = this.props;
        const { sn } = sdcardItem;
        const { status, formatResponse } = sdcardItem;

        if (formatResponse) {
            if (status === 2) {
                this.formatSuccess(sn, resetformatResponse);
            } else {
                formatFailed(sn, resetformatResponse);
            }
        } else {
            switch (status) {
                case 0:
                    warningNoSDCard(sn, resetStatus);
                    break;
                case 1:
                    this.warningFormatSDCard(sn, resetStatus);
                    break;
                case 2:
                    // this.warningFormatSDCard(sn);
                    break;
                case 3:
                    warningUnknownSDCard(sn, resetStatus);
                    break;
                default:
            }
        }
    }

    formatSuccess = (sn, resetformatResponse) => {
        const title = formatMessage({ id: 'SDCard.format.success.title' });
        const content = formatMessage({ id: 'SDCard.format.success.content' });

        closeNotification(sn);

        const key = `fotmatSuccess${sn}`;
        notification.success({
            duration: null,
            message: `IPC-${sn}-${title}`,
            description: content,
            key,
            onClose: resetformatResponse(sn),
        });
    };

    warningFormatSDCard(sn, resetStatus) {
        const { formatSdCard } = this.props;
        const title = formatMessage({ id: 'SDCard.format.title' });
        const content = formatMessage({ id: 'SDCard.format.content' });
        const okText = formatMessage({ id: 'SDCard.format.okText' });

        const key = `formatSdcard${sn}`;
        closeNotification(sn);
        const btn = (
            <Button
                type="primary"
                onClick={() => {
                    formatSdCard(sn);
                    notification.close(key);
                }}
            >
                {okText}
            </Button>
        );

        notification.info({
            duration: null,
            message: `IPC-${sn}-${title}`,
            description: content,
            btn,
            key,
            onClose: resetStatus(sn),
        });
    }

    render() {
        const { children } = this.props;
        return <div className="sdcard-wrapper">{children}</div>;
    }
}

export default SDCardChild;
