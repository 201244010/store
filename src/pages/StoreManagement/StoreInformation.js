import React from 'react';
import { Form, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import router from 'umi/router';
import { getLocationParam } from '@/utils/utils';
import styles from './StoreManagement.less';

@connect(
    state => ({
        info: state.store,
    }),
    dispatch => ({
        getStoreInformation: payload => dispatch({ type: 'store/getStoreInformation', payload }),
    })
)
class StoreInformation extends React.Component {
    componentDidMount() {
        this.initFetch();
    }

    initFetch = () => {
        const { getStoreInformation } = this.props;
        const shopId = getLocationParam('shopId');
        const payload = {
            options: {
                shop_id: shopId,
            },
        };
        getStoreInformation(payload);
    };

    handleSubmit = () => {
        const shopId = getLocationParam('shopId');
        router.push(`/storeManagement/alterStore?shopId=${shopId}`);
    };

    handleCancel = () => {
        router.push('/storeManagement/list');
    };

    render() {
        const {
            info: { alter },
        } = this.props;

        return (
            <div className={styles.storeList}>
                <h3 className={styles.informationText}>
                    {formatMessage({ id: 'storeManagement.info.title' })}
                </h3>
                <Form labelCol={{ span: 3 }} wrapperCol={{ span: 9 }}>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.id' })}>
                        {alter.shopId}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.nameLabel' })}>
                        {alter.name}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.typeLabel' })}>
                        {alter.type}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.statusLabel' })}>
                        {alter.status === 0
                            ? formatMessage({ id: 'storeManagement.create.statusValue1' })
                            : formatMessage({ id: 'storeManagement.create.statusValue2' })}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.address' })}>
                        {alter.address}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.daysLabel' })}>
                        {alter.time}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.contactName' })}>
                        {alter.contactPerson}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.contactPhone' })}>
                        {alter.contactPhone}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.info.create' })}>
                        {alter.createdTime}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.info.update' })}>
                        {alter.modifiedTime}
                    </Form.Item>
                </Form>
                <Button type="primary" onClick={this.handleSubmit} className={styles.submitButton}>
                    {formatMessage({ id: 'storeManagement.info.modify' })}
                </Button>
                <Button
                    type="default"
                    onClick={this.handleCancel}
                    className={styles.submitButton2}
                    style={{ marginBottom: 40 }}
                >
                    {formatMessage({ id: 'storeManagement.info.cancel' })}
                </Button>
            </div>
        );
    }
}

export default StoreInformation;
