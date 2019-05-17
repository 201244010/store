import React from 'react';
import { Button, Table, Card, Modal } from 'antd';
// import { Link } from 'dva/router';
import moment from 'moment';
import { connect } from 'dva';
import { injectIntl, FormattedMessage } from 'umi/locale';
import styles from './FaceidLibrary.less';
import LibraryForm from './LibraryForm';

class LibraryList extends React.Component {
    constructor(props) {
        super(props);

        const { intl, managePhotos } = this.props;

        this.state = {
            editFormShown: false,
            createFormShown: false,
            selectedRow: null,
        };

        this.columns = [
            {
                title: intl.formatMessage({ id: 'faceid.libraryName' }),
                dataIndex: 'name',
            },
            {
                title: intl.formatMessage({ id: 'facied.rules' }),
                dataIndex: 'rule',
                render: rules => {
                    if (!rules) {
                        return '--';
                    }
                    return rules;
                },
            },
            {
                title: intl.formatMessage({ id: 'faceid.remark' }),
                dataIndex: 'remarks',
                render: remark => {
                    if (!remark) {
                        return '--';
                    }
                    return remark;
                },
            },
            {
                title: intl.formatMessage({ id: 'faceid.photosAmount' }),
                dataIndex: 'amount',
                render: (amount, row) => `${amount}/${row.capacity}`,
            },
            {
                title: intl.formatMessage({ id: 'faceid.updateTime' }),
                dataIndex: 'lastupdate',
                render: lastupdate => {
                    if (!lastupdate) {
                        return '--';
                    }
                    const d = moment(lastupdate * 1000);
                    return d.format('YYYY-MM-DD h:mm:ss');
                },
            },
            {
                title: intl.formatMessage({ id: 'common.operation' }),
                dataIndex: 'isDefault',
                render: (isDefault, row) => (
                    <div>
                        <a
                            className={styles['btn-operation']}
                            href="javascript:void(0);"
                            onClick={() => {
                                managePhotos(row.id);
                            }}
                        >
                            <FormattedMessage id="faceid.managePhoto" />
                        </a>
                        <a
                            className={styles['btn-operation']}
                            href="javascript:void(0);"
                            onClick={() => {
                                this.showEditForm(row.id);
                            }}
                        >
                            <FormattedMessage id="common.edit" />
                        </a>
                        {isDefault ? (
                            ''
                        ) : (
                            <a
                                className={styles['btn-operation']}
                                href="javascript:void(0);"
                                onClick={() => {
                                    // console.log(row);
                                    this.removeLibrary(row.id);
                                }}
                            >
                                <FormattedMessage id="common.delete" />
                            </a>
                        )}
                    </div>
                ),
            },
        ];

        this.editingRow = {};

        this.maxLength = 10;

        this.noCustomized = true;

        this.showEditForm = this.showEditForm.bind(this);
        this.closeEditForm = this.closeEditForm.bind(this);
        // this.editFieldChange = this.editFieldChange.bind(this);
        this.editLibrary = this.editLibrary.bind(this);
        // this.changeFields = this.changeFields.bind(this);
    }

    componentDidMount() {
        const { loadLibrary } = this.props;
        loadLibrary();
    }

    showCreateForm = () => {
        this.setState({
            createFormShown: true,
        });
    };

    closeCreateForm = () => {
        this.setState({
            createFormShown: false,
        });
    };
    // changeFields(id, fields) {
    // 	console.log(id, fields);
    // 	// const { libraryList } = this.state;

    // 	// const list = libraryList.map(item => {
    // 	// 	let obj = {};
    // 	// 	if (item.id === id) {
    // 	// 		obj = { ...item };
    // 	// 		fields.forEach(field => {
    // 	// 			console.log(field);
    // 	// 			obj[field.name] = field.value;
    // 	// 		});
    // 	// 		return obj;
    // 	// 	}
    // 	// 	return item;
    // 	// });

    // 	// this.setState({
    // 	// 	libraryList: list,
    // 	// });
    // }
    // editFieldChange(id, fields) {
    // 	const row = this.state.selectedRow;
    // 	console.log(fields);
    // 	// fields.forEach((item) => {
    // 	// 	row[item.name] = item.value;
    // 	// });

    // 	// this.setState({
    // 	// 	selectedRow: row
    // 	// });
    // }

    // deleteLibrary(id) {
    // 	const { removeLibrary } = this.props;
    // 	Modal.confirm({
    // 		title: formatMessage({ id: 'facied.deleteLibrary' }),
    // 		context: formatMessage({ id: 'facied.deleteInfo' }),
    // 		okText: formatMessage({ id: 'facied.confirm' }),
    // 		cancelText: formatMessage({ id: 'faceid.cancel' }),
    // 		onOk: () => removeLibrary(id),
    // 	});
    // }

    createLibrary = () => {
        const { createLibrary } = this.props;
        const { form, id } = this.createForm.props;

        form.validateFields(errors => {
            if (!errors) {
                const fields = form.getFieldsValue();
                const capacity = parseInt(fields.capacity, 10);
                const params = {
                    ...fields,
                    capacity,
                };
                // console.log(params);
                createLibrary(Object.assign({}, params, { id }));
                this.closeCreateForm();
            }
        });
    };

    removeLibrary = id => {
        const { intl } = this.props;
        // console.log('remove',id);
        const { faceIdLibrary, removeLibrary } = this.props;
        const target = faceIdLibrary.filter(item => {
            if (item.id === id) {
                return true;
            }
            return false;
        });
        // console.log(target);
        if (target[0].amount !== 0) {
            Modal.error({
                title: intl.formatMessage({ id: 'faceid.deleteError' }),
                content: intl.formatMessage({ id: 'faceid.deleteErrorMsg' }),
            });
        } else {
            Modal.confirm({
                title: intl.formatMessage({ id: 'faceid.deleteLibrary' }),
                content: intl.formatMessage({ id: 'faceid.deleteInfo' }),
                okText: intl.formatMessage({ id: 'faceid.confirm' }),
                cancelText: intl.formatMessage({ id: 'faceid.cancel' }),
                onOk: () => removeLibrary(id),
            });
        }
    };

    editLibrary() {
        const { editLibrary } = this.props;
        const { selectedRow } = this.state;
        const { form } = this.editForm.props;

        form.validateFields(errors => {
            if (!errors) {
                const fields = form.getFieldsValue();
                // console.log('fields',fields);
                const capacity = parseInt(fields.capacity, 10);
                const params = {
                    ...fields,
                    capacity,
                };
                // console.log('params',params);
                editLibrary(Object.assign({}, selectedRow, params));
                this.closeEditForm();
            }
        });
    }

    showEditForm(id) {
        const { faceIdLibrary } = this.props;

        const row = faceIdLibrary.filter(item => {
            if (id === item.id) {
                return true;
            }
            return false;
        });

        this.setState({
            selectedRow: row[0],
            editFormShown: true,
        });
    }

    closeEditForm() {
        this.setState({
            editFormShown: false,
        });
    }

    render() {
        // console.log(this.props);
        const { createFormShown, editFormShown, selectedRow } = this.state;
        const { faceIdLibrary } = this.props;
        const totalCapacity = 100000;
        // const noCustom = list.every((item) => {
        // 	return item.isDefault === true;
        // });

        const restCapacity =
            totalCapacity -
            faceIdLibrary.reduce((total, item) => {
                if (item.isDefault !== true) {
                    this.noCustomized = false;
                }
                // console.log(total, '+', item.capacity, '=', total + item.capacity);
                return total + item.capacity;
            }, 0);
        // console.log(this.props);
        const list = faceIdLibrary;
        // console.log(restCapacity);
        // console.log(list);
        return (
            <div className="faceid-library-list">
                <Card bordered={false}>
                    <div>
                        <Button
                            type="primary"
                            disabled={list.length >= this.maxLength}
                            onClick={this.showCreateForm}
                        >
                            {/* <Link to="./createLibrary"> */}
                            <FormattedMessage id="common.create" />
                            {/* </Link> */}
                        </Button>
                    </div>
                    <div>
                        <Table
                            columns={this.columns}
                            dataSource={list}
                            rowKey="id"
                            rowClassName={(record, index) => {
                                if (index % 2 === 0) {
                                    return styles['table-row-light'];
                                }
                                return styles['table-row-dark'];
                            }}
                            // expandedRowRender={record => {
                            // 	return <p>{record.remarks}</p>;
                            // }}
                            pagination={false}
                        />
                    </div>
                    {!this.noCustomized ? (
                        ''
                    ) : (
                        <p>
                            <span>
                                <FormattedMessage id="faceid.createNote" />
                            </span>
                            <a href="javascript:void(0);" onClick={this.showCreateForm}>
                                <FormattedMessage id="faceid.createLibrary" />
                            </a>
                        </p>
                    )}
                </Card>
                <Modal
                    title={<FormattedMessage id="faceid.createLibrary" />}
                    visible={createFormShown}
                    onCancel={this.closeCreateForm}
                    onOk={this.createLibrary}
                >
                    <LibraryForm
                        restCapacity={restCapacity}
                        libraries={list}
                        id={parseInt(Math.random() * 1000 * 1000, 10)}
                        isDefault={false}
                        name=""
                        wrappedComponentRef={form => {
                            this.createForm = form;
                        }}
                    />
                </Modal>

                <Modal
                    title={<FormattedMessage id="faceid.editLibrary" />}
                    maskClosable={false}
                    visible={editFormShown}
                    onCancel={this.closeEditForm}
                    onOk={this.editLibrary}
                >
                    <LibraryForm
                        wrappedComponentRef={form => {
                            this.editForm = form;
                        }}
                        {...selectedRow}
                        libraries={list}
                        restCapacity={restCapacity}
                    />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { faceIdLibrary } = state;
    return {
        faceIdLibrary,
    };
};

const mapDispatchToProps = dispatch => ({
    loadLibrary: () => {
        dispatch({
            type: 'faceIdLibrary/read',
        });
    },
    managePhotos: key => {
        // console.log('managePhotos', key);
        const temp = key;
        return temp;
    },
    createLibrary: form => {
        dispatch({
            type: 'faceIdLibrary/create',
            payload: {
                library: form,
            },
        });
    },
    editLibrary: row => {
        dispatch({
            type: 'faceIdLibrary/update',
            payload: {
                library: row,
            },
        });
    },
    removeLibrary: id => {
        dispatch({
            type: 'faceIdLibrary/delete',
            payload: {
                id,
            },
        });
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(LibraryList));
