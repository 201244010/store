import React, { Component } from 'react';
import { Divider, Modal, Table, Row, Col, Button, Upload, message } from 'antd';
import { idEncode, unixSecondToDate } from '@/utils/utils';
import Storage from '@konata9/storage.js';
import GoodsUploadModal from './GoodsUploadModal';
import { ERROR_OK, QUERY_INTERVAL } from '@/constants';

class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.completeTimer = null;
    this.progressTimer = null;
    this.modeDisplay = {
      0: '正常',
      1: '促销',
      2: '缺货',
    };
    this.state = {
      uploadStatus: 'uploading',
      uploadVisible: false,
      selectedRowKeys: [],
    };
  }

  componentWillUnmount() {
    clearTimeout(this.completeTimer);
    clearInterval(this.progressTimer);
  }

  onTableChange = pagination => {
    const { fetchGoodsList } = this.props;
    Storage.set('goodsPageSize', pagination.pageSize);
    fetchGoodsList({
      pageSize: pagination.pageSize,
      current: pagination.current,
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  toPath = (name, record = {}) => {
    const {
      history: { push },
    } = this.props;
    const encodeID = record.id ? idEncode(record.id) : null;
    const urlMap = {
      goodDetail: `/good/${encodeID}/detail`,
      createGoods: '/goodCreateOrUpdate/create',
      update: `/goodCreateOrUpdate/update?data=${encodeID}`,
    };

    push(urlMap[name]);
  };

  showAPIImport = () => {
    this.setState({});
  };

  deleteGoods = record => {
    const { deleteGoods } = this.props;

    Modal.confirm({
      iconType: 'info-circle',
      title: '请确认是否删除商品？',
      content: '商品删除后，与之绑定的价签不会更新图像。',
      okText: '删除',
      onOk() {
        deleteGoods({
          id: record.id,
        });
      },
    });
  };

  changeMode = mode => {
    const { changeMode } = this.props;
    const { selectedRowKeys } = this.state;
    Modal.confirm({
      iconType: 'exclamation-circle',
      title: `请确认是否将选中商品切换为${this.modeDisplay[mode]}模板`,
      content: '切换后，将立即向所有价签推送新的模板图像',
      onOk: () => changeMode({ mode, product_id_list: selectedRowKeys }),
    });
  };

  onCancel = () => {
    const { fetchGoodsList } = this.props;
    this.setState(
      {
        uploadVisible: false,
      },
      () => {
        fetchGoodsList();
      }
    );
  };

  customRequest = ({ file }) => {
    const { name } = file;
    const fileType = name.split('.').pop() || null;
    if (['xls', 'xlsx'].includes(fileType)) {
      this.handleUpload(file);
    } else {
      message.error('上传文件的格式不正确');
    }
  };

  beforeUpload = () => {
    this.updateUploadStatus('uploading');
  };

  handleUpload = async file => {
    const { uploadProducts } = this.props;
    const response = await uploadProducts({ file });
    if (response && response.code === ERROR_OK) {
      this.updateUploadStatus('importChecking');
      await this.checkImportStatus();
    } else {
      this.updateUploadStatus('error');
    }
  };

  updateUploadStatus = (status, visible = true) => {
    this.setState({
      uploadStatus: status,
      uploadVisible: visible,
    });
  };

  checkImportStatus = async () => {
    const { importFileCheck, filePath } = this.props;
    const response = await importFileCheck({
      file_path: filePath,
    });
    if (response && response.code === ERROR_OK) {
      this.updateUploadStatus('importSuccess');
    } else {
      this.updateUploadStatus('importFailed');
    }
  };

  apiImport = async options => {
    const { kewuyouFetchList } = this.props;
    const importPlatform = {
      kewuyou: kewuyouFetchList,
      default: () => message.error('对接平台出错'),
    };

    const importApi = importPlatform[options.platform];
    const response = await importApi(options.params);
    if (response && response.code === ERROR_OK) {
      const result = response.data || {};
      const { job_id } = result;
      this.progressQuery({
        job_id,
      });
    }
  };

  progressQuery = options => {
    const { kewuyouImportQuery } = this.props;
    clearTimeout(this.completeTimer);
    clearInterval(this.progressTimer);

    this.progressTimer = setInterval(async () => {
      const response = await kewuyouImportQuery(options);
      if (response && response.code === ERROR_OK) {
        const result = response.data || {};
        const { total_count, current_count } = result;

        if (current_count === total_count) {
          clearInterval(this.progressTimer);
          this.completeTimer = setTimeout(() => {
            this.onCancel();
          }, 500);
        }
      } else {
        clearTimeout(this.completeTimer);
        clearInterval(this.progressTimer);
      }
    }, QUERY_INTERVAL);
  };

  render() {
    const columns = [
      {
        title: '商品编号',
        dataIndex: 'seq_num',
      },
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品条码',
        dataIndex: 'bar_code',
      },
      {
        title: '价格',
        dataIndex: 'price',
      },
      {
        title: '最后修改时间',
        dataIndex: 'modified_time',
        render: text => <span>{unixSecondToDate(text)}</span>,
      },
      {
        title: '绑定价签数',
        key: 'bind_esl_num',
        dataIndex: 'bind_esl_num',
        render: text => text || 0,
      },
      {
        title: '操作',
        key: 'action',
        render: (_, record) => (
          <span>
            <a href="javascript: void (0);" onClick={() => this.toPath('goodDetail', record)}>
              详情
            </a>
            <Divider type="vertical" />
            <a href="javascript: void (0);" onClick={() => this.toPath('update', record)}>
              编辑
            </a>
            <Divider type="vertical" />
            <a href="javascript: void (0);" onClick={() => this.deleteGoods(record)}>
              删除
            </a>
          </span>
        ),
      },
    ];

    const { selectedRowKeys, uploadVisible, uploadStatus } = this.state;
    const { loading, data, pagination, importResult } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      onSelection: this.onSelection,
    };
    const uploadProps = {
      accept: '.xlsx',
      customRequest: this.customRequest,
      beforeUpload: this.beforeUpload,
      showUploadList: false,
    };

    return (
      <div>
        <div className="table-header">
          <Row type="flex" justify="space-between" align="center">
            <Col span={12}>
              <div className="left-bar-wrapper">
                <div className="btn-wrapper">
                  <Button
                    disabled={selectedRowKeys.length === 0}
                    onClick={() => this.changeMode(0)}
                  >
                    正常
                  </Button>
                </div>
                <div className="btn-wrapper">
                  <Button
                    disabled={selectedRowKeys.length === 0}
                    onClick={() => this.changeMode(1)}
                  >
                    促销
                  </Button>
                </div>
              </div>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <div className="right-bar-wrapper">
                <div className="btn-wrapper">
                  <Button type="primary" onClick={() => this.toPath('createGoods')}>
                    新建商品
                  </Button>
                </div>
                <div className="btn-wrapper">
                  <Button onClick={this.showAPIImport}>API对接</Button>
                </div>
                <div className="btn-wrapper">
                  <Upload {...uploadProps}>
                    <Button>上传导入</Button>
                  </Upload>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="table-content">
          <Table
            rowKey="id"
            loading={loading}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={data}
            pagination={{
              ...pagination,
              showTotal: total =>
                selectedRowKeys.length === 0
                  ? `共${total}种商品`
                  : `共${total}种商品，已选中${selectedRowKeys.length}种`,
            }}
            onChange={this.onTableChange}
          />
        </div>
        <GoodsUploadModal
          status={uploadStatus}
          visible={uploadVisible}
          onCancel={this.onCancel}
          onOk={this.checkImportStatus}
          importResult={importResult}
        />
      </div>
    );
  }
}

export default SearchResult;
