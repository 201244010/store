import React, { Component } from 'react';
import { Table, Switch, Divider, Modal } from "antd";
import { formatMessage } from 'umi/locale';

const TEMPLATE_STATES = {
    0: formatMessage({ id: 'esl.device.template.status.draft' }),
    1: formatMessage({ id: 'esl.device.template.status.apply' }),
};

class SearchResult extends Component {
    onTableChange = pagination => {
        const { fetchTemplates } = this.props;

        fetchTemplates({
            options: {
                current: pagination.current,
                pageSize: pagination.pageSize,
            },
        });
    };

    editDetail = (record) => {
        window.open(`/studio?id=${record.id}&screen=${record.screen_type}`);
    };

    deleteTemplate = (record) => {
        const {deleteTemplate} = this.props;

        Modal.confirm({
            title: formatMessage({ id: 'esl.device.template.delete.confirm.title' }),
            content: formatMessage({ id: 'esl.device.template.delete.confirm.content' }),
            okText: formatMessage({ id: 'esl.device.template.delete.confirm.ok.text' }),
            okType: 'danger',
            cancelText: formatMessage({ id: 'esl.device.template.delete.confirm.cancel.text' }),
            onOk() {
                deleteTemplate({
                    template_id_list: [record.id]
                });
            }
        });
    };

    render() {
        const {
            loading,
            data,
            pagination,
        } = this.props;
        const columns = [
            {
                title: formatMessage({ id: 'esl.device.template.id' }),
                dataIndex: 'id',
            },
            {
                title: formatMessage({ id: 'esl.device.template.name' }),
                dataIndex: 'name',
            },
            {
                title: formatMessage({ id: 'esl.device.template.size' }),
                dataIndex: 'screen_type_name',
            },
            {
                title: formatMessage({ id: 'esl.device.template.color' }),
                dataIndex: 'colour_name',
            },
            {
                title: formatMessage({ id: 'esl.device.esl.status' }),
                dataIndex: 'status',
                render: text => <span>{TEMPLATE_STATES[text]}</span>,
            },
            {
                title: formatMessage({ id: 'esl.device.template.is.default' }),
                dataIndex: 'is_default',
                render: value => (
                    <div>
                        <Switch
                            checked={value === 0}
                            checkedChildren={formatMessage({ id: 'esl.device.template.is.default.yes' })}
                            unCheckedChildren={formatMessage({ id: 'esl.device.template.is.default.no' })}
                        />
                    </div>
                ),
            },
            {
                title: formatMessage({ id: 'list.action.title' }),
                key: 'action',
                render: (_, record) => (
                    <span>
                        <a href="javascript: void (0);" onClick={() => this.editDetail(record)}>
                            {formatMessage({ id: 'list.action.edit' })}
                        </a>
                        <Divider type="vertical" />
                        <a href="javascript: void (0);" onClick={() => this.deleteTemplate(record)}>
                            {formatMessage({ id: 'list.action.delete' })}
                        </a>
                    </span>
                ),
            },
        ];

        return (
            <div>
                <Table
                    rowKey="id"
                    loading={loading}
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        ...pagination,
                        showTotal: total =>
                            `${formatMessage({ id: 'esl.device.esl.all' })}${total}${formatMessage({
                                id: 'esl.device.esl.total',
                            })}`,
                    }}
                    onChange={this.onTableChange}
                />
            </div>
        );
    }
}

export default SearchResult;
