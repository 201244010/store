import React, { Component } from 'react';
import { Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { getLocationParam, unixSecondToDate, compareVersion } from '@/utils/utils';

export default class SearchResult extends Component {
    onTableChange = pagination => {
        const { getESLGroupInfo, groupId } = this.props;
        getESLGroupInfo({
            group_id: groupId,
            pageSize: pagination.pageSize,
            current: pagination.current,
        });
    };

    render() {
        const { data, loading, pagination, version } = this.props;
        const upgraded = getLocationParam('upgraded');

        const columns = [
            {
                title: formatMessage({ id: 'esl.device.esl.id' }),
                dataIndex: 'esl_code',
                key: 'esl_code',
            },
            {
                title: formatMessage({ id: 'esl.device.esl.ware.version.now' }),
                dataIndex: 'bin_version',
                key: 'bin_version',
                render: text => (
                    <span className={`version-${compareVersion(version, text)}`}>{text}</span>
                ),
            },
            {
                title: formatMessage({ id: 'esl.device.esl.battery' }),
                dataIndex: 'battery',
                key: 'battery',
                render: text => <span>{text}%</span>,
            },
            {
                title: formatMessage({ id: 'esl.device.esl.last.comm.time' }),
                dataIndex: 'connect_time',
                key: 'connect_time',
                render: text => (
                    <span>
                        {text
                            ? unixSecondToDate(text)
                            : formatMessage({ id: 'esl.device.esl.inactivated' })}
                    </span>
                ),
            },
        ];

        return (
            <div>
                <Table
                    rowKey="esl_code"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showTotal: total =>
                            `${formatMessage({
                                id: 'esl.device.upgrade.updated.total',
                            })}: ${upgraded}/${total}`,
                    }}
                    onChange={this.onTableChange}
                />
            </div>
        );
    }
}
