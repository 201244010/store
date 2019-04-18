import React, { Component } from 'react';
import { Table, Form, Input, Select, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import { getList } from '@/services/storeManagement/storeList';
// import { paramsDeserialization, paramsSerialization } from '@/utils/utils';
import styles from './StoreManagement.less';

const columns = [
  {
    title: formatMessage({ id: 'storeManagement.list.columnId' }),
    dataIndex: 'storeId',
    key: 'storeId',
  },
  {
    title: formatMessage({ id: 'storeManagement.list.columnName' }),
    dataIndex: 'storeName',
    key: 'storeName',
  },
  {
    title: formatMessage({ id: 'storeManagement.list.columnStatus' }),
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: formatMessage({ id: 'storeManagement.list.columnAddress' }),
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: formatMessage({ id: 'storeManagement.list.columnTypes' }),
    dataIndex: 'commodityProperty',
    key: 'commodityProperty',
  },
  {
    title: formatMessage({ id: 'storeManagement.list.columnContacts' }),
    dataIndex: 'contacts',
    key: 'contacts',
  },
  {
    title: formatMessage({ id: 'storeManagement.list.columnOperation' }),
    dataIndex: 'operation',
    key: 'operation',
    render: () => (
        <span>
            <a href="/storeManagement/storeInformation" className={styles.infoAnchor}>
                {formatMessage({ id: 'storeManagement.list.operation1' })}
            </a>
            <a href="/storeManagement/alterStore" className={styles.infoAnchor}>
                {formatMessage({ id: 'storeManagement.list.operation2' })}
            </a>
            <a>{formatMessage({ id: 'storeManagement.list.operation3' })}</a>
        </span>
    ),
  },
];

class StoreManagement extends Component {
  state = {
    currentPage: 1,
    totalData: 1,
    pageSize: 10,
    optionArray: ['全部品类'],
    dataSource: [
      {
        storeId: '1001',
        storeName: '星巴克',
        status: '停业',
        address: '上海市杨浦区',
        commodityProperty: '餐饮-饮料',
        contacts: '张三',
      },
      {
        storeId: '1001',
        storeName: '星巴克',
        status: '停业',
        address: '上海市杨浦区',
        commodityProperty: '餐饮-饮料',
        contacts: '张三',
      },
      {
        storeId: '1002',
        storeName: '星巴',
        status: '停业',
        address: '上海市杨浦区',
        commodityProperty: '餐饮-饮料',
        contacts: '张三',
      },
    ],
  };
  
  componentDidMount () {
  
  }
  
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
  };
  
  handleSubmit = e => {
    e.preventDefault();
    const { form: { getFieldsValue } } = this.props;
    const formValue = getFieldsValue();
    console.log(formValue);
    // let type;
    // if (formValue.types === '全部品类' || formValue.types === '') {
    //   type = '';
    // } else {
    //   type = formValue.types;
    // }
    // const requestObj = {
    //   companyNo: '1',
    //   keyword: formValue.storeName,
    //   typeOne: type,
    //   typeTwo: '',
    //   pageNum: currentPage,
    //   pageSize,
    // };
    
    // const data = getList(requestObj);
    // 拿到数据之后对数据进行处理
  };

  render() {
    const { form } = this.props;
    const { currentPage, pageSize, totalData, optionArray, dataSource } = this.state;
    const { getFieldDecorator } = form;
    const FormItem = Form.Item;
    const { Option } = Select;

    return (
        <div className={styles.storeList}>
            <div className={styles.top}>
                <Form layout="inline" onSubmit={this.handleSubmit}>
                    <FormItem label={formatMessage({ id: 'storeManagement.list.inputLabel' })}>
                        {getFieldDecorator('storeName', {
                initialValue: '',
              })(
                  <Input
                  placeholder={formatMessage({ id: 'storeManagement.list.inputPlaceHolder' })}
                  style={{ width: '220px' }}
                  />
              )}
                    </FormItem>
                    <FormItem label={formatMessage({ id: 'storeManagement.list.selectLabel' })}>
                        {getFieldDecorator('types', {
                initialValue: '全部品类',
              })(
                  <Select
                  placeholder={formatMessage({ id: 'storeManagement.list.selectPlaceHolder' })}
                  style={{ width: '220px' }}
                  >
                      {optionArray.map(value => (
                          <Option value={value} key={value}>
                              {value}
                          </Option>
                  ))}
                  </Select>
              )}
                    </FormItem>
                    <FormItem>
                        <Button htmlType="submit">
                            {formatMessage({ id: 'storeManagement.list.buttonSubmit' })}
                        </Button>
                    </FormItem>
                    <a onClick={this.handleReset}>
                        {formatMessage({ id: 'storeManagement.list.buttonReset' })}
                    </a>
                </Form>
            </div>
            <a href="/storeManagement/createStore" className={styles.link}>
                {formatMessage({ id: 'storeManagement.list.newBuiltStore' })}
            </a>
            <div className={styles.table}>
                <Table
            dataSource={dataSource}
            rowKey="uid"
            columns={columns}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              onChange: a => {
                this.setState({ currentPage: a });
              },
              onShowSizeChange: (a, b) => {
                this.setState({ currentPage: a, pageSize: b });
              },
            }}
                />
            </div>
            <p
          className={styles.pageText}
          onClick={() => {
            getList({ company_no: '1' });
          }}
            >
          共{totalData}条记录 第{currentPage}/
                {totalData % pageSize === 0
            ? totalData / pageSize
            : parseInt(totalData / pageSize + 1, 10)}
          页
            </p>
        </div>
    );
  }
}

const StoreManagementForm = Form.create({
  mapPropsToFields: () => ({
    storeName: Form.createFormField(''),
    types: Form.createFormField(''),
  }),
})(StoreManagement);
export default StoreManagementForm;
