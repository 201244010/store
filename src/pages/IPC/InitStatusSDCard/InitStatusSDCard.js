import React from 'react';
import { connect } from 'dva';
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

const warningNoSDCard = sn => {
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
    });
};

const warningUnknownSDCard = sn => {
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
    });
};

class InitStatusSDCard extends React.Component {
    async componentDidMount() {
        const { getSdStatus, sn } = this.props;
        const status = await getSdStatus(sn);
        // console.log(status);
        switch (status) {
            case 0:
                warningNoSDCard(sn);
                break;
            case 1:
                this.warningFormatSDCard(sn);
                break;
            case 2:
                // this.warningFormatSDCard(sn);
                break;
            case 3:
                warningUnknownSDCard(sn);
                break;
            default:
        }
    }

    warningFormatSDCard(sn) {
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
        });
    }

    render() {
        const { children } = this.props;
        return <div className="sdcard-wrapper">{children}</div>;
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    formatSdCard: sn => {
        dispatch({
            type: 'initStatusSDCard/formatSdCard',
            sn,
        });
    },
    getSdStatus: async sn => {
        const status = await dispatch({
            type: 'initStatusSDCard/getSdStatus',
            sn,
        });
        return status;
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InitStatusSDCard);
