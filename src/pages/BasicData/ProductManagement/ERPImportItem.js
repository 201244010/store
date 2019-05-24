import React from 'react';
import { Form, Input } from 'antd';
import { formatMessage } from 'umi/locale';

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
	const { getFieldDecorator } = props;
	return (
		<>
			<Form.Item label="appKey">
				{getFieldDecorator('saas_info.app_key', {
					validateTrigger: 'onBlur',
					rules: [
						{
							required: true,
							message: formatMessage({ id: 'basicData.erp.sdnm.key.isEmpty' }),
						},
					],
				})(<Input />)}
			</Form.Item>
			<Form.Item label="secret">
				{getFieldDecorator('saas_info.secret', {
					validateTrigger: 'onBlur',
					rules: [
						{
							required: true,
							message: formatMessage({ id: 'basicData.erp.sdnm.secret.isEmpty' }),
						},
					],
				})(<Input />)}
			</Form.Item>
		</>
	);
};

export const KWYLS = props => {
	const { getFieldDecorator } = props;
	return (
		<>
			<Form.Item label={formatMessage({ id: 'basicData.erp.api.store.num' })}>
				{getFieldDecorator('saas_info.mchid', {
					validateTrigger: 'onBlur',
					rules: [
						{
							required: true,
							message: formatMessage({ id: 'basicData.erp.kwyls.shopId.isEmpty' }),
						},
					],
				})(<Input />)}
			</Form.Item>
			<Form.Item label={formatMessage({ id: 'basicData.erp.api.account' })}>
				{getFieldDecorator('saas_info.account', {
					validateTrigger: 'onBlur',
					rules: [
						{
							required: true,
							message: formatMessage({ id: 'basicData.erp.kwyls.account.isEmpty' }),
						},
					],
				})(<Input />)}
			</Form.Item>
			<Form.Item label={formatMessage({ id: 'basicData.erp.api.password' })}>
				{getFieldDecorator('saas_info.password', {
					validateTrigger: 'onBlur',
					rules: [
						{
							required: true,
							message: formatMessage({ id: 'basicData.erp.kwyls.password.isEmpty' }),
						},
					],
				})(<Input type="password" />)}
			</Form.Item>
		</>
	);
};

export const ZZSY = props => {
	const { getFieldDecorator } = props;
	return (
		<>
			<Form.Item label="appid">
				{getFieldDecorator('saas_info.app_id', {
					validateTrigger: 'onBlur',
					rules: [
						{
							required: true,
							message: formatMessage({ id: 'basicData.erp.zzsy.id.isEmpty' }),
						},
					],
				})(<Input />)}
			</Form.Item>
			<Form.Item label="secret">
				{getFieldDecorator('saas_info.secret', {
					validateTrigger: 'onBlur',
					rules: [
						{
							required: true,
							message: formatMessage({ id: 'basicData.erp.sdnm.secret.isEmpty' }),
						},
					],
				})(<Input />)}
			</Form.Item>
		</>
	);
};
