import React, { Component } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { FORM_FORMAT, HEAD_FORM_ITEM_LAYOUT, FORM_ITEM_LONGER } from '@/constants/form';
import * as styles from './ProductManagement.less';

const SDNM = props => {
    const { getFieldDecorator } = props;
    return (
        <Form.Item label={formatMessage({ id: 'basicData.erp.api.key' })}>
            {getFieldDecorator('saas_info.key')(<Input />)}
        </Form.Item>
    );
};

const KWYLS = props => {
    const { getFieldDecorator } = props;
    return (
        <>
            <Form.Item label={formatMessage({ id: 'basicData.erp.api.store.num' })}>
                {getFieldDecorator('saas_info.store_num')(<Input />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'basicData.erp.api.account' })}>
                {getFieldDecorator('saas_info.store_account')(<Input />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'basicData.erp.api.password' })}>
                {getFieldDecorator('saas_info.store_password')(<Input type="password" />)}
            </Form.Item>
        </>
    );
};

const RenderFormItem = {
    'SAAS-KWYLS': KWYLS,
    'SAAS-SDNM': SDNM,
};

@connect(
    state => ({
        product: state.basicDataProduct,
    }),
    dispatch => ({
        getERPPlatformList: () => dispatch({ type: 'basicDataProduct/getERPPlatformList' }),
        erpAuthCheck: payload => dispatch({ type: 'basicDataProduct/erpAuthCheck', payload }),
        erpImport: payload => dispatch({ type: 'basicDataProduct/erpImport', payload }),
    })
)
@Form.create()
class ERPImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            RenderItem: KWYLS,
        };
    }

    componentDidMount() {
        const { getERPPlatformList } = this.props;
        getERPPlatformList();
    }

    handlePlatformChange = value => {
        this.setState({
            RenderItem: RenderFormItem[value],
        });
    };

    render() {
        const { RenderItem } = this.state;
        const {
            form: { getFieldDecorator },
            product: { sassInfoList },
        } = this.props;

        return (
            <div className={styles['content-container']}>
                <h3>{formatMessage({ id: 'btn.erp.import' })}</h3>
                <div className={styles['form-wrapper']}>
                    <Form
                        {...{
                            ...FORM_FORMAT,
                            ...HEAD_FORM_ITEM_LAYOUT,
                        }}
                    >
                        <Form.Item label={formatMessage({ id: 'basicData.erp.platform' })}>
                            {getFieldDecorator('erp_platform')(
                                <Select onChange={this.handlePlatformChange}>
                                    {sassInfoList.map(platform => (
                                        <Select.Option key={platform.id} value={platform.name}>
                                            {platform.fullName || ''}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )}
                        </Form.Item>

                        <RenderItem {...{ getFieldDecorator }} />

                        <Form.Item
                            {...FORM_ITEM_LONGER}
                            label={formatMessage({ id: 'basicData.erp.description' })}
                        >
                            <ul className={styles['description-list']}>
                                <li className={styles['list-item']}>
                                    {formatMessage({ id: 'basicData.erp.description.list1' })}
                                </li>
                                <li className={styles['list-item']}>
                                    {formatMessage({ id: 'basicData.erp.description.list2' })}
                                </li>
                                <li className={styles['list-item']}>
                                    {formatMessage({ id: 'basicData.erp.description.list3' })}
                                </li>
                            </ul>
                        </Form.Item>
                        <Form.Item label=" " colon={false}>
                            <div className={styles['form-btn-wrapper']}>
                                <Button className={styles['form-btn']} type="primary">
                                    {formatMessage({ id: 'btn.save' })}
                                </Button>
                                <Button className={styles['form-btn']}>
                                    {formatMessage({ id: 'btn.cancel' })}
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}

export default ERPImport;
