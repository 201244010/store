import React from 'react';
import { Form, Input } from 'antd';
import { formatMessage } from 'umi/locale';

const MODE = {
	VIEW: 'view',
	MODIFY: 'modify',
};

const COMMON_ERROR = {
	5042: formatMessage({ id: 'basicData.erp.import.shop.conflict' }),
	5093: formatMessage({ id: 'basicData.erp.import.task.unfinished' }),
	default: formatMessage({ id: 'basicData.erp.import.task.failed' }),
};

export const ERROR_FILEDS = {
	'SAAS-SDNM': {
		field: 'saas_info.secret',
		errMsg: {
			...COMMON_ERROR,
			5020: formatMessage({ id: 'basicData.erp.common.key.existed' }),
			// default: formatMessage({ id: 'basicData.erp.common.key.error' }),
		},
	},
	'SAAS-KWYLS': {
		field: 'saas_info.password',
		errMsg: {
			...COMMON_ERROR,
			5020: formatMessage({ id: 'basicData.erp.kwyls.account.used' }),
			5021: formatMessage({ id: 'basicData.erp.kwyls.account.frequently' }),
			// default: formatMessage({ id: 'basicData.erp.kwyls.account.error' }),
		},
	},
	'SAAS-ZZSY': {
		field: 'saas_info.secret',
		errMsg: {
			...COMMON_ERROR,
			5020: formatMessage({ id: 'basicData.erp.zzsy.secret.existed' }),
			// TODO 等待 error code
			9999: formatMessage({ id: 'basicData.erp.zzsy.shop.error' }),
			// default: formatMessage({ id: 'basicData.erp.zzsy.secret.error' }),
		},
	},
	'SAAS-HBB': {
		field: 'saas_info.shop_number',
		errMsg: {
			...COMMON_ERROR,
			// default: formatMessage({ id: 'basicData.erp.hbb.error' }),
		},
	},
	'SAAS-HDQF': {
		field: 'saas_info.secret_key',
		errMsg: {
			...COMMON_ERROR,
			// default: formatMessage({ id: 'basicData.erp.hdqf.error' }),
		},
	},
	'SAAS-HJ': {
		field: '',
		errMsg: {
			...COMMON_ERROR,
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
	const { saasShopKey = null, saasExtraKey1 = null } = saasInfo;

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
			{/* 解决浏览器自动填充问题 */}
			<input type="password" style={{ display: 'none' }} />
			{mode === MODE.MODIFY && (
				<Form.Item label={formatMessage({ id: 'basicData.erp.api.password' })}>
					{getFieldDecorator('saas_info.password', {
						validateTrigger: 'onBlur',
						rules: [
							{
								required: true,
								message: formatMessage({
									id: 'basicData.erp.kwyls.password.isEmpty',
								}),
							},
						],
					})(<Input type="password" autoComplete="new-password" />)}
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

export const HBB = props => {
	const { getFieldDecorator, mode = MODE.MODIFY, saasInfo = {} } = props;
	const { saasCompanyKey = null, saasShopKey = null, saasExtraKey1 = null } = saasInfo;

	return (
		<>
			<Form.Item label={formatMessage({ id: 'basicData.erp.api.company.number' })}>
				{mode === MODE.VIEW ? (
					<span>{saasCompanyKey}</span>
				) : (
					<>
						{getFieldDecorator('saas_info.company_number', {
							initialValue: saasCompanyKey,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'basicData.erp.hbb.company.isEmpty',
									}),
								},
							],
						})(<Input />)}
					</>
				)}
			</Form.Item>
			<Form.Item label={formatMessage({ id: 'basicData.erp.api.user.number' })}>
				{mode === MODE.VIEW ? (
					<span>{saasExtraKey1}</span>
				) : (
					<>
						{getFieldDecorator('saas_info.user_number', {
							initialValue: saasExtraKey1,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'basicData.erp.hbb.user.isEmpty',
									}),
								},
							],
						})(<Input />)}
					</>
				)}
			</Form.Item>
			<Form.Item label={formatMessage({ id: 'basicData.erp.api.shop.number' })}>
				{mode === MODE.VIEW ? (
					<span>{saasShopKey}</span>
				) : (
					<>
						{getFieldDecorator('saas_info.shop_number', {
							initialValue: saasShopKey,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'basicData.erp.hbb.shop.isEmpty',
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

export const HDQF = props => {
	const { getFieldDecorator, mode = MODE.MODIFY, saasInfo = {} } = props;
	const { saasExtraKey1 = null, saasExtraKey2 = null } = saasInfo;
	return (
		<>
			<Form.Item label="app_id">
				{mode === MODE.VIEW ? (
					<span>{saasExtraKey1}</span>
				) : (
					<>
						{getFieldDecorator('saas_info.app_id', {
							initialValue: saasExtraKey1,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'basicData.erp.hdqf.key.isEmpty',
									}),
								},
							],
						})(<Input />)}
					</>
				)}
			</Form.Item>
			<Form.Item label="secret_key">
				{mode === MODE.VIEW ? (
					<span>{saasExtraKey2}</span>
				) : (
					<>
						{getFieldDecorator('saas_info.secret_key', {
							initialValue: saasExtraKey2,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'basicData.erp.hdqf.secret.isEmpty',
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

export const HJ = props => {
	const { getFieldDecorator, mode = MODE.MODIFY, saasInfo = {} } = props;
	const { saasExtraKey1 = null, saasExtraKey2 = null } = saasInfo;
	return (
		<>
			<Form.Item label="app_id">
				{mode === MODE.VIEW ? (
					<span>{saasExtraKey1}</span>
				) : (
					<>
						{getFieldDecorator('saas_info.app_id', {
							initialValue: saasExtraKey1,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'basicData.erp.hdqf.key.isEmpty',
									}),
								},
							],
						})(<Input />)}
					</>
				)}
			</Form.Item>
			<Form.Item label="secret_key">
				{mode === MODE.VIEW ? (
					<span>{saasExtraKey2}</span>
				) : (
					<>
						{getFieldDecorator('saas_info.secret_key', {
							initialValue: saasExtraKey2,
							validateTrigger: 'onBlur',
							rules: [
								{
									required: true,
									message: formatMessage({
										id: 'basicData.erp.hdqf.secret.isEmpty',
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
