import React, { Component } from 'react';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Form, Button, Select, Modal } from 'antd';
import { format } from '@konata9/milk-shake';
import { SDNM, KWYLS, ZZSY, HBB, ERROR_FILEDS } from './ERPImportItem';
import { FORM_FORMAT, HEAD_FORM_ITEM_LAYOUT, FORM_ITEM_LONGER } from '@/constants/form';
import { ERROR_OK } from '@/constants/errorCode';
import { MENU_PREFIX } from '@/constants';

import * as styles from './ProductManagement.less';

const MODE = {
	VIEW: 'view',
	MODIFY: 'modify',
};

const RenderFormItem = {
	'SAAS-KWYLS': props => <KWYLS {...props} />,
	'SAAS-SDNM': props => <SDNM {...props} />,
	'SAAS-ZZSY': props => <ZZSY {...props} />,
	'SAAS-HBB': props => <HBB {...props} />,
	default: () => <div />,
};

@connect(
	state => ({
		product: state.basicDataProduct,
	}),
	dispatch => ({
		getERPPlatformList: () => dispatch({ type: 'basicDataProduct/getERPPlatformList' }),
		erpAuthCheck: payload => dispatch({ type: 'basicDataProduct/erpAuthCheck', payload }),
		erpImport: payload => dispatch({ type: 'basicDataProduct/erpImport', payload }),
		getImportedErpInfo: () => dispatch({ type: 'store/getImportedErpInfo' }),
	})
)
@Form.create()
class ERPImport extends Component {
	constructor(props) {
		super(props);
		this.saasKey = null;
		this.state = {
			mode: MODE.MODIFY,
			erpSaasInfo: {},
			RenderItem: () => <div />,
		};
	}

	componentDidMount() {
		const { getERPPlatformList } = this.props;

		getERPPlatformList();
		this.dataInit();
	}

	dataInit = async () => {
		const { getImportedErpInfo } = this.props;
		const response = await getImportedErpInfo();
		if (response && response.code === ERROR_OK) {
			const { data = {} } = response;
			const saasInfo = format('toCamel')(data);
			const { saasId = null, saasName = null } = saasInfo;

			this.saasKey = parseInt(saasId, 10);
			// console.log(saasInfo);
			this.setState({
				erpSaasInfo: saasInfo,
				mode: MODE.VIEW,
				RenderItem: RenderFormItem[saasName] || RenderFormItem.default,
			});
		}
	};

	handlePlatformSelect = (value, options) => {
		this.saasKey = parseInt(options.key, 10);
		this.setState({
			RenderItem: RenderFormItem[value] || RenderFormItem.default,
		});
	};

	showErrorInfo = (response, errInfo) => {
		const {
			form: { getFieldValue, setFields },
		} = this.props;

		const { field = '', errMsg = {} } = errInfo;
		const msg = errMsg[`${response.code}`] || errMsg.default;
		setFields({
			[field]: { value: getFieldValue(field), errors: [new Error(msg)] },
		});
	};

	handleSubmit = () => {
		const {
			erpImport,
			erpAuthCheck,
			form: { validateFields, getFieldValue },
		} = this.props;

		const saasId = getFieldValue('saas_id');
		const errInfo = ERROR_FILEDS[saasId] || {};

		validateFields(async (err, values) => {
			if (!err) {
				const response = await erpAuthCheck({
					options: {
						...values,
						saas_id: this.saasKey,
						saas_info: JSON.stringify(values.saas_info),
					},
				});

				if (response && response.code === ERROR_OK) {
					const result = await erpImport({
						options: {
							...values,
							saas_id: this.saasKey,
							saas_info: JSON.stringify(values.saas_info),
						},
					});

					if (result && result.code === ERROR_OK) {
						this.dataInit();
					} else if (result && result.code !== ERROR_OK) {
						this.showErrorInfo(result, errInfo);
					}
				} else {
					this.showErrorInfo(response, errInfo);
				}
			}
		});
	};

	switchMode = () => {
		this.setState({
			mode: MODE.MODIFY,
		});
	};

	showConfirmModal = () => {
		Modal.confirm({
			icon: 'info-circle',
			title: formatMessage({ id: 'basicData.erp.confirm.title' }),
			content: formatMessage({ id: 'basicData.erp.confirm.content' }),
			okText: formatMessage({ id: 'btn.confirm' }),
			cancelText: formatMessage({ id: 'btn.cancel' }),
			onOk: this.handleSubmit,
		});
	};

	goBack = () => {
		const { mode, erpSaasInfo } = this.state;
		if (mode === MODE.VIEW) {
			router.push(`${MENU_PREFIX.PRODUCT}`);
		} else if (mode === MODE.MODIFY) {
			const { saasId } = erpSaasInfo;
			if (saasId) {
				this.saasKey = parseInt(saasId, 10);
				this.setState({
					mode: MODE.VIEW,
				});
			} else {
				router.push(`${MENU_PREFIX.PRODUCT}`);
			}
		}
	};

	render() {
		const {
			mode,
			erpSaasInfo,
			erpSaasInfo: { saasId = null, saasFullName = null, saasName = null },
			RenderItem,
		} = this.state;

		const {
			form: { getFieldDecorator },
			product: { sassInfoList, loading },
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
							{mode === MODE.VIEW ? (
								<span>{saasFullName}</span>
							) : (
								<>
									{getFieldDecorator('saas_id', { initialValue: saasName })(
										<Select onSelect={this.handlePlatformSelect}>
											{sassInfoList.map((platform, index) => (
												<Select.Option
													key={platform.id || index}
													value={platform.name}
												>
													{platform.full_name || ''}
												</Select.Option>
											))}
										</Select>
									)}
								</>
							)}
						</Form.Item>

						{this.saasKey === saasId ? (
							<RenderItem {...{ getFieldDecorator, mode, saasInfo: erpSaasInfo }} />
						) : (
							<RenderItem {...{ getFieldDecorator, mode }} />
						)}

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
								{mode === MODE.VIEW ? (
									<Button
										loading={loading}
										className={styles['form-btn']}
										type="primary"
										onClick={this.switchMode}
									>
										{formatMessage({ id: 'btn.alter' })}
									</Button>
								) : (
									<Button
										loading={loading}
										className={styles['form-btn']}
										type="primary"
										onClick={this.showConfirmModal}
									>
										{formatMessage({ id: 'btn.save' })}
									</Button>
								)}
								<Button className={styles['form-btn']} onClick={this.goBack}>
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
