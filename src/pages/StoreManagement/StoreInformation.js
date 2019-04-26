import React from 'react';
import { Form, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import router from 'umi/router';
import { formatEmpty, getLocationParam, unixSecondToDate } from '@/utils/utils';
import styles from './StoreManagement.less';
import { MENU_PREFIX } from '@/constants';

@connect(
    state => ({
        store: state.store,
    }),
    dispatch => ({
        getStoreDetail: payload => dispatch({ type: 'store/getStoreDetail', payload }),
    })
)
class StoreInformation extends React.Component {
    componentDidMount() {
        const shopId = getLocationParam('shopId');
        const { getStoreDetail } = this.props;

        getStoreDetail({ options: { shop_id: shopId } });
    }

    toPath = target => {
        const shopId = getLocationParam('shopId');
        const path = {
            edit: `${MENU_PREFIX.STORE}/createStore?shopId=${shopId}&action=edit`,
            back: `${MENU_PREFIX.STORE}/list`,
        };

        router.push(path[target] || path.back);
    };

    render() {
        const {
            store: { storeInfo },
        } = this.props;

        const {
            shop_id = '--',
            shop_name = '--',
            type_name = '--',
            business_status = '--',
            region,
            address = '--',
            business_hours = '--',
            contact_person = '--',
            contact_tel = '--',
            created_time = '--',
            modified_time = '--',
        } = formatEmpty(storeInfo, '--');

        return (
            <div className={styles.storeList}>
                <h3 className={styles.informationText}>
                    {formatMessage({ id: 'storeManagement.info.title' })}
                </h3>
                <Form labelCol={{ span: 3 }} wrapperCol={{ span: 9 }}>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.id' })}>
                        {shop_id}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.nameLabel' })}>
                        {shop_name}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.typeLabel' })}>
                        {type_name}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.statusLabel' })}>
                        {business_status === 0
                            ? formatMessage({ id: 'storeManagement.create.status.open' })
                            : formatMessage({ id: 'storeManagement.create.status.closed' })}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.address' })}>
                        {region.replace(/,/g, ' / ')}
                    </Form.Item>
                    <Form.Item label=" " colon={false}>
                        {address}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.daysLabel' })}>
                        {business_hours}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.contactName' })}>
                        {contact_person || '--'}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.create.contactPhone' })}>
                        {contact_tel}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.info.create' })}>
                        {unixSecondToDate(created_time)}
                    </Form.Item>
                    <Form.Item label={formatMessage({ id: 'storeManagement.info.update' })}>
                        {unixSecondToDate(modified_time)}
                    </Form.Item>
                    <Form.Item label=" " colon={false}>
                        <Button type="primary" onClick={() => this.toPath('edit')}>
                            {formatMessage({ id: 'storeManagement.info.modify' })}
                        </Button>
                        <Button
                            style={{ marginLeft: '20px' }}
                            type="default"
                            onClick={() => this.toPath('back')}
                        >
                            {formatMessage({ id: 'storeManagement.info.cancel' })}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default StoreInformation;
