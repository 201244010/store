import React from 'react';
import { Form, Input } from 'antd';
import { formatMessage } from 'umi/locale';

const MODE = {
	VIEW: 'view',
	MODIFY: 'modify',
};

export const ERROR_FILEDS = {
	'SAAS-SDNM': {
		field: 'saas_info.secret',
		errMsg: {
			5020: formatMessage({ id: 'basicData.erp.common.key.existed' }),
			default: formatMessage({ id: 'basicData.erp.common.key.error' }),
		},
	},
	'SAAS-KWYLS': {
		field: 'saas_info.password',
		errMsg: {
			5020: formatMessage({ id: 'basicData.erp.kwyls.account.used' }),
			5021: formatMessage({ id: 'basicData.erp.kwyls.account.frequently' }),
			default: formatMessage({ id: 'basicData.erp.kwyls.account.error' }),
		},
	},
	'SAAS-ZZSY': {
		field: 'saas_info.secret',
		errMsg: {
			5020: formatMessage({ id: 'basicData.erp.zzsy.secret.existed' }),
			default: formatMessage({ id: 'basicData.erp.zzsy.secret.error' }),
		},
	},
};

export const SDNM = props => {
	const { getFieldDecorator, mode = MODE.MODIFY, saasInfo = {} } = props;
	const { saasShopKey = null, saasExtraKey1 = null } = saasInfo;
	return (
		<>
			<Form.Item label="appKey">
				{mode === MODE.VIEW ? (
					<span>{saasShopKey}</span>
				) : (
					<>
						{getFieldDecorator('saas_info.app_key', {
							initialValue: saasShopKey,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'basicData.erp.sdnm.key.isEmpty',
									}),
								},
							],
						})(<Input />)}
					</>
				)}
			</Form.Item>
			<Form.Item label="secret">
				{mode === MODE.VIEW ? (
					<span>{saasExtraKey1}</span>
				) : (
					<>
						{getFieldDecorator('saas_info.secret', {
							initialValue: saasExtraKey1,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'basicData.erp.sdnm.secret.isEmpty',
									}),
								},
							],
						})(<Input />)}
					</>
				)}
			</Form.Item>
		</>
	);
};

export const KWYLS = props => {
	const { getFieldDecorator, mode = MODE.MODIFY, saasInfo = {} } = props;
	const { saasShopKey = null, saasExtraKey1 = null, saasExtraKey2 = null } = saasInfo;

	return (
		<>
			<Form.Item label={formatMessage({ id: 'basicData.erp.api.store.num' })}>
				{mode === MODE.VIEW ? (
					<span>{saasShopKey}</span>
				) : (
					<>
						{getFieldDecorator('saas_info.mchid', {
							initialValue: saasShopKey,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'basicData.erp.kwyls.shopId.isEmpty',
									}),
								},
							],
						})(<Input />)}
					</>
				)}
			</Form.Item>
			<Form.Item label={formatMessage({ id: 'basicData.erp.api.account' })}>
				{mode === MODE.VIEW ? (
					<span>{saasExtraKey1}</span>
				) : (
					<>
						{getFieldDecorator('saas_info.account', {
							initialValue: saasExtraKey1,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'basicData.erp.kwyls.account.isEmpty',
									}),
								},
							],
						})(<Input />)}
					</>
				)}
			</Form.Item>
			{mode === MODE.MODIFY && (
				<Form.Item label={formatMessage({ id: 'basicData.erp.api.password' })}>
					{getFieldDecorator('saas_info.password', {
						initialValue: saasExtraKey2,
						validateTrigger: 'onBlur',
						rules: [
							{
								required: true,
								message: formatMessage({
									id: 'basicData.erp.kwyls.password.isEmpty',
								}),
							},
						],
					})(<Input type="password" />)}
				</Form.Item>
			)}
		</>
	);
};

export const ZZSY = props => {
	const { getFieldDecorator, mode = MODE.MODIFY, saasInfo = {} } = props;
	const { saasShopKey = null, saasExtraKey1 = null } = saasInfo;
	return (
		<>
			<Form.Item label="appid">
				{mode === MODE.VIEW ? (
					<span>{saasShopKey}</span>
				) : (
					<>
						{getFieldDecorator('saas_info.app_id', {
							initialValue: saasShopKey,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({ id: 'basicData.erp.zzsy.id.isEmpty' }),
								},
							],
						})(<Input />)}
					</>
				)}
			</Form.Item>
			<Form.Item label="secret">
				{mode === MODE.VIEW ? (
					<span>{saasExtraKey1}</span>
				) : (
					<>
						{getFieldDecorator('saas_info.secret', {
							initialValue: saasExtraKey1,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'basicData.erp.sdnm.secret.isEmpty',
									}),
								},
							],
						})(<Input />)}
					</>
				)}
			</Form.Item>
		</>
	);
};
