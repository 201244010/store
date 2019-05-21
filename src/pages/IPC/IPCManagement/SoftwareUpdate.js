import React, { Component } from 'react';
import { Card, Button, Modal, Spin, Progress, Icon } from 'antd';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva';

import styles from './SoftwareUpdate.less';

const mapStateToProps = state => {
    const { softwareUpdate } = state;
    return {
        softwareUpdate,
    };
};
const mapDispatchToProps = dispatch => ({
    load: () => {
        dispatch({
            type: 'softwareUpdate/read',
        });
    },
    checkVersion: () => {
        dispatch({
            type: 'softwareUpdate/check',
        });
    },
    update: () => {
        dispatch({
            type: 'softwareUpdate/update',
        });
    },
});

@connect(
    mapStateToProps,
    mapDispatchToProps
)
class SoftwareUpdate extends Component {
    state = {
        version: 'V1.0.20',
        // isLatest: true,
        visible: false,
        // proVisible: false,
        isUpdate: false,
        isCheck: false,
    };

    componentDidMount = () => {
        const { load } = this.props;
        load();
    };

    showModal = () => {
        const { checkVersion } = this.props;
        checkVersion();
        this.setState({
            visible: true,
        });
    };

    updateSoftware = () => {
        const { update } = this.props;
        update();
        this.setState({
            isCheck: false,
            isUpdate: true,
        });
    };

    hideModal = () => {
        this.setState({
            visible: false,
        });
    };

    hideInfo = () => {
        this.setState({
            isCheck: false,
        });
    };

    showInfo = () => {
        this.setState({
            isCheck: true,
            visible: false,
        });
    };

    render() {
        // const { version } = this.props;
        const { version, updateDate, checkDate, isCheck, percent, visible, isUpdate } = this.state;
        // this.showInfo();
        return (
            <div>
                <Card
                    className={styles['main-card']}
                    title={<FormattedMessage id="softwareUpdate.title" />}
                >
                    <div className={styles['main-block']}>
                        <span className={styles.tips}>
                            {<FormattedMessage id="softwareUpdate.currentVersion" />}
                            {version}
                        </span>
                        <Button type="default" onClick={this.showModal}>
                            <FormattedMessage id="softwareUpdate.check" />
                        </Button>
                    </div>
                </Card>

                <Modal
                    visible={visible}
                    // footer={null}
                    footer={null}
                    onCancel={this.hideModal}
                    destroyOnClose
                >
                    <h3>
                        <Spin />
                        <FormattedMessage id="softwareUpdate.checkWaitingMsg" />
                    </h3>
                    <span>
                        <FormattedMessage id="softwareUpdate.checkDate" />
                        {checkDate}
                    </span>
                </Modal>

                <Modal
                    visible={isCheck}
                    footer={
                        <Button type="primary" onClick={this.updateSoftware}>
                            <FormattedMessage id="softwareUpdate.update" />
                        </Button>
                    }
                    onCancel={this.hideInfo}
                    destroyOnClose
                >
                    <h3>
                        <Icon type="info-circle" />
                        <FormattedMessage id="softwareUpdate.checkMsg" />
                    </h3>
                    <span>
                        <FormattedMessage id="softwareUpdate.updateDate" />
                        {updateDate}
                    </span>
                </Modal>
                <Modal visible={isUpdate} footer={null} closable={false}>
                    <Progress percent={percent} />
                    {percent <= 66 ? <FormattedMessage id="softwareUpdate.downloadMsg" /> : ''}
                    {percent > 66 && percent < 100 ? (
                        <FormattedMessage id="softwareUpdate.verificationMsg" />
                    ) : (
                        ''
                    )}
                    {percent === 100 ? <FormattedMessage id="softwareUpdate.restartMsg" /> : ''}
                </Modal>
            </div>
        );
    }
}

export default SoftwareUpdate;
