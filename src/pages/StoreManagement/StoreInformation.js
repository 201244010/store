import React from 'react';
import { Form, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
// import { storeInformation } from '@/services/storeManagement/storeList';
import styles from './StoreManagement.less';

class StoreInformation extends React.Component {
  state = {
    obj: {
      shopNo: '',
      shopName: '',
      typeOne: '',
      typeTwo: '',
      typeName: '',
      businessStatus: '',
      province: '',
      city: '',
      area: '',
      region: '',
      address: '',
      businessHours: '',
      contactTel: '',
      contactEmail: '',
      createdTime: '',
      modifiedTime: '',
    },
  };

  componentDidMount() {
    // 请求数据，并把数据放在state上进行展示
    // const data = storeInformation({
    //   shop_no: '1001' // 门店编号
    // });
    // if(data.code === 1) {
    //   const obj = data.data;
    //   // 对数据进行处理
    //   this.setState({obj});
    // }
  }

  handleSubmit = () => {
    window.location = '/storeManagement/alterStore';
  };

  handleCancel = () => {
    router.push('/storeManagement/list');
  };

  render() {
    const { obj } = this.state;

    return (
        <div className={styles.storeList}>
            <h3>{formatMessage({ id: 'storeManagement.info.title' })}</h3>
            <Form labelCol={{ span: 2 }} wrapperCol={{ span: 9 }}>
                <Form.Item label={formatMessage({ id: 'storeManagement.create.id' })}>
                    {obj.shopNo}
                </Form.Item>
                <Form.Item label={formatMessage({ id: 'storeManagement.create.nameLabel' })}>
                    {obj.shopName}
                </Form.Item>
                <Form.Item label={formatMessage({ id: 'storeManagement.create.typeLabel' })}>
                    {obj.typeOne}
                </Form.Item>
                <Form.Item label={formatMessage({ id: 'storeManagement.create.statusLabel' })}>
                    {obj.businessStatus}
                </Form.Item>
                <Form.Item label={formatMessage({ id: 'storeManagement.create.address' })}>
                    {obj.address}
                </Form.Item>
                {/* <Form.Item label={formatMessage({id: 'storeManagement.create.daysLabel'})}> */}
                {/**/}
                {/* </Form.Item> */}
                {/* <Form.Item label={formatMessage({id: 'storeManagement.create.pic'})}> */}

                {/* </Form.Item> */}
                <Form.Item label={formatMessage({ id: 'storeManagement.create.contactName' })} />
                <Form.Item label={formatMessage({ id: 'storeManagement.create.contactPhone' })}>
                    {obj.contactTel}
                </Form.Item>
                <Form.Item label={formatMessage({ id: 'storeManagement.create.contactMail' })}>
                    {obj.contactEmail}
                </Form.Item>
                <Form.Item label={formatMessage({ id: 'storeManagement.info.create' })}>
                    {obj.createdTime}
                </Form.Item>
                <Form.Item label={formatMessage({ id: 'storeManagement.info.update' })}>
                    {obj.modifiedTime}
                </Form.Item>
            </Form>
            <Button type="primary" onClick={this.handleSubmit}>
                {formatMessage({ id: 'storeManagement.info.modify' })}
            </Button>
            <Button type="default" onClick={this.handleCancel}>
                {formatMessage({ id: 'storeManagement.info.cancel' })}
            </Button>
        </div>
    );
  }
}

export default StoreInformation;
