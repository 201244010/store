import React, { Component } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { FORM_FORMAT, HEAD_FORM_ITEM_LAYOUT, FORM_ITEM_LONGER } from '@/constants/form';
import * as styles from './ProductManagement.less';

const KMTK = props => {
    const { getFieldDecorator } = props;
    return (
        <Form.Item label={formatMessage({ id: 'basicData.erp.api.key' })}>
            {getFieldDecorator('key')(<Input />)}
        </Form.Item>
    );
};

const KEWUYOU = props => {
    const { getFieldDecorator } = props;
    return (
        <>
            <Form.Item label={formatMessage({ id: 'basicData.erp.api.store.num' })}>
                {getFieldDecorator('store_num')(<Input />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'basicData.erp.api.account' })}>
                {getFieldDecorator('store_account')(<Input />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'basicData.erp.api.password' })}>
                {getFieldDecorator('store_password')(<Input type="password" />)}
            </Form.Item>
        </>
    );
};

const RenderFormItem = {
    0: KMTK,
    1: KEWUYOU,
};

@connect(
    state => ({
        product: state.basicDataProduct,
    }),
    dispatch => ({
        getERPPlatformList: () => dispatch({ type: 'basicDataProduct/getERPPlatformList' }),
    })
)
@Form.create()
class ERPImport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            RenderItem: KMTK,
        };
    }

    componentDidMount() {
        const { getERPPlatformList } = this.props;
        getERPPlatformList();
    }

    handlePlatformChange = value => {
        console.log(value);
        this.setState({
            RenderItem: RenderFormItem[value],
        });
    };

    render() {
        const { RenderItem } = this.state;
        const {
            form: { getFieldDecorator },
            product: { erpPlatformList },
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
                                    {erpPlatformList.map(platform => (
                                        <Select.Option key={platform.id} value={platform.id}>
                                            {platform.name || ''}
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
