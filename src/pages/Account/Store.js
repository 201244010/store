import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Card, List, Button, Modal, Form, Tag } from 'antd';
import { connect } from 'dva';
import * as CookieUtil from '@/utils/cookies';
import { FORM_ITEM_LAYOUT_COMMON } from '@/constants/form';
import { formatEmpty, replaceTemplateWithValue } from '@/utils/utils';
import * as styles from './Account.less';

@connect(
	state => ({
		merchant: state.merchant,
	}),
	dispatch => ({
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
		switchCompany: ({ companyId }) =>
			dispatch({ type: 'merchant/switchCompany', payload: { companyId } }),
	})
)
class Store extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedCompany: {},
			visible: false,
			// viewCompanyModal: false,
		};
	}

	viewStore = company => {
		this.setState({
			selectedCompany: formatEmpty(company, '--'),
			visible: true,
		});
	};

	openChangeCompany = company => {
		const { switchCompany } = this.props;
		const { companyId, companyName } = company;

		Modal.confirm({
			title: replaceTemplateWithValue({
				messageId: 'merchant.change.confirm',
				valueList: [{ key: '##companyName##', value: companyName }],
			}),
			okText: formatMessage({ id: 'btn.confirm' }),
			cancelText: formatMessage({ id: 'btn.cancel' }),
			maskClosable: false,
			onOk: () => switchCompany({ companyId }),
		});
	};

	toPath = target => {
		const { goToPath } = this.props;
		const path = {
			update: {
				pathId: 'merchantModify',
				urlParams: {},
			},
			create: {
				pathId: 'userMerchant',
				urlParams: {
					from: 'accountCenter',
				},
			},
		};

		const { pathId, urlParams = {} } = path[target] || {};
		goToPath(pathId, urlParams);
		// router.push(path[target] || '/');
	};

	cancel = () => {
		this.setState({
			visible: false,
		});
	};

	render() {
		const {
			merchant: { companyList = [], currentCompanyId },
		} = this.props;

		const {
			visible,
			selectedCompany: { companyId, contactEmail, contactTel, companyName, contactPerson },
		} = this.state;

		const currentCompany =
			companyList.find(company => company.companyId === currentCompanyId) || {};

		const displayCompanyList =
			companyList.filter(company => company.companyId !== currentCompanyId) || [];

		displayCompanyList.unshift(currentCompany);

		return (
			<Card style={{ marginTop: '15px' }}>
				<h2>{formatMessage({ id: 'userCenter.store.title' })}</h2>
				<div>
					<Button type="dashed" icon="plus" block onClick={() => this.toPath('create')}>
						{formatMessage({ id: 'userCenter.store.create' })}
					</Button>
				</div>
				<List className={styles['list-wrapper']}>
					{displayCompanyList.map((company, index) => (
						<List.Item key={company.companyId}>
							<div className={styles['list-item']}>
								<div className={styles['title-wrapper-start']}>
									<div className={styles['title-wrapper-icon']}>
										<h4>{company.companyName}</h4>
										{index === 0 && (
											<Tag color="orange">
												{formatMessage({ id: 'merchant.current' })}
											</Tag>
										)}
									</div>
									<div>
										{index !== 0 && (
											<a
												className={styles['store-change']}
												href="javascript:void(0);"
												onClick={() => this.openChangeCompany(company)}
											>
												{formatMessage({ id: 'merchant.change' })}
											</a>
										)}
										<a
											href="javascript:void(0);"
											onClick={() => this.viewStore(company)}
										>
											{formatMessage({ id: 'list.action.detail' })}
										</a>
									</div>
								</div>
							</div>
						</List.Item>
					))}
				</List>
				<Modal
					visible={visible}
					title={formatMessage({ id: 'merchantManagement.merchant.merchantMessage' })}
					onCancel={this.cancel}
					footer={
						<div className={styles['button-style']}>
							<Button style={{ marginLeft: 20 }} onClick={this.cancel}>
								{formatMessage({ id: 'btn.back' })}
							</Button>
							{companyId === CookieUtil.getCookieByKey(CookieUtil.COMPANY_ID_KEY) && (
								<Button type="primary" onClick={() => this.toPath('update')}>
									{formatMessage({ id: 'btn.alter' })}
								</Button>
							)}
						</div>
					}
				>
					<Form {...FORM_ITEM_LAYOUT_COMMON}>
						<Form.Item
							className={styles['margin-clear']}
							label={formatMessage({ id: 'merchantManagement.merchant.number' })}
						>
							<span>{companyId}</span>
						</Form.Item>
						<Form.Item
							className={styles['margin-clear']}
							label={formatMessage({ id: 'merchantManagement.merchant.name' })}
						>
							<span>{companyName}</span>
						</Form.Item>
						<Form.Item
							className={styles['margin-clear']}
							label={formatMessage({
								id: 'merchantManagement.merchant.contactPerson',
							})}
						>
							<span>{contactPerson}</span>
						</Form.Item>
						<Form.Item
							className={styles['margin-clear']}
							label={formatMessage({
								id: 'merchantManagement.merchant.contactPhone',
							})}
						>
							<span>{contactTel}</span>
						</Form.Item>
						<Form.Item
							className={styles['margin-clear']}
							label={formatMessage({
								id: 'merchantManagement.merchant.contactEmail',
							})}
						>
							<span>{contactEmail}</span>
						</Form.Item>
					</Form>
				</Modal>
			</Card>
		);
	}
}

export default Store;
