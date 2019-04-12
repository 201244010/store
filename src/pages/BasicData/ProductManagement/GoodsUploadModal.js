import React from 'react';
import { Modal, Button, Row, Col, Table } from 'antd';

const UploadingInfo = () => <h3>上传中...</h3>;
const UploadError = ({ onCancel }) => (
  <div>
    <h3>上传失败，请重试</h3>
    <Button type="primary" onClick={onCancel}>
      知道了
    </Button>
  </div>
);
const ImportChecking = () => <h3>正在导入商品数据...</h3>;
const ImportFailed = ({ onCancel }) => (
  <div>
    <h3>导入失败，请检查表格数据</h3>
    <Button type="primary" onClick={onCancel}>
      知道了
    </Button>
  </div>
);
const ImportSuccess = ({ onCancel, importResult }) => {
  const {
    download_failed_file_address,
    failed_upload_product_list,
    total_num,
    failed_num,
  } = importResult;
  const errorList = failed_upload_product_list
    ? failed_upload_product_list.filter(item => item !== null)
    : [];

  const columns = [
    {
      title: '商品编号',
      dataIndex: 'seq_num',
      key: 'seq_num',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '商品条码',
      dataIndex: 'bar_code',
      key: 'bar_code',
    },
  ];

  return (
    <div>
      {errorList.length > 0 ? (
        <div>
          <h3>已导入{`${total_num || '-'}`}条商品数据</h3>
          <h3>共有{`${failed_num || '-'}`}行数据无法导入</h3>
          <div className="error-table">
            <Table
              rowKey="seq_num"
              columns={columns}
              dataSource={errorList}
              size="small"
              pagination={{
                hideOnSinglePage: true,
                pageSize: 10,
              }}
            />
          </div>
          <div className="download-wrapper">
            <Row type="flex" justify="start" align="middle">
              <Col span={12}>
                <div>全部错误数据请参考 Excel 表格</div>
              </Col>
              <Col span={4}>
                <Button
                  icon="cloud-download"
                  size="small"
                  target={download_failed_file_address}
                  href={download_failed_file_address}
                >
                  下载 Excel 表格
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        <h3>商品数据已成功导入</h3>
      )}
      <div className="bottom-wrapper">
        <Button type="primary" onClick={onCancel}>
          知道了
        </Button>
      </div>
    </div>
  );
};

const GoodsUploadModal = props => {
  const { status, visible, onCancel, importResult } = props;
  const statusComponent = {
    uploading: UploadingInfo,
    error: () => UploadError({ onCancel }),
    importChecking: ImportChecking,
    importSuccess: ImportSuccess,
    importFailed: ImportFailed,
  };
  const RenderComponent = statusComponent[status];

  return (
    <Modal
      maskClosable={false}
      title={null}
      closable={false}
      footer={null}
      visible={visible}
      onCancel={onCancel}
      width={650}
    >
      <div className="upload-content-wrapper">
        <RenderComponent onCancel={onCancel} importResult={importResult} />
      </div>
    </Modal>
  );
};

export default GoodsUploadModal;
