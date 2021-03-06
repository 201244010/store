import React from 'react';
import { Form, Button, Card } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { formatEmptyWithoutZero, getLocationParam, unixSecondToDate } from '@/utils/utils';
import AuthKey from '@/pages/AuthKey';
import styles from './StoreManagement.less';

@connect(
	state => ({
		store: state.store,
	}),
	dispatch => ({
		getStoreDetail: payload => dispatch({ type: 'store/getStoreDetail', payload }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class StoreInformation extends React.Component {
	componentDidMount() {
		const shopId = getLocationParam('shopId');
		const { getStoreDetail } = this.props;

		getStoreDetail({ options: { shopId } });
	}

	toPath = target => {
		const { goToPath } = this.props;
		const shopId = getLocationParam('shopId');
		const path = {
			edit: {
				pathId: 'storeUpdate',
				urlParams: { shopId, action: 'edit' },
			},
			back: {
				pathId: 'storeList',
			},
		};

		const { pathId, urlParams = {} } = path[target] || {};
		goToPath(pathId, urlParams);
		// router.push(path[target] || path.back);
	};

	render() {
		const {
			store: { storeInfo },
		} = this.props;

		const {
			shopId: shopId = '--',
			sunmiShopNo: sunmiShopNo = '--',
			shopName: shopName = '--',
			typeName: typeName = '--',
			businessStatus: businessStatus = 0,
			region = '--',
			address = '--',
			businessHours: businessHours = '--',
			businessArea: businessArea = '--',
			contactPerson: contactPerson = '--',
			contactTel: contactTel = '--',
			createdTime: createdTime = '--',
			modifiedTime: modifiedTime = '--',
		} = formatEmptyWithoutZero(storeInfo, '--');

		return (
			<Card bordered={false}>
				<h3 className={styles.informationText}>
					{formatMessage({ id: 'storeManagement.info.title' })}
				</h3>
				<Form labelCol={{ span: 3 }} wrapperCol={{ span: 9 }}>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.create.id' })}
					>
						{sunmiShopNo}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.create.nameLabel' })}
					>
						{shopName}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.create.typeLabel' })}
					>
						{typeName}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.create.statusLabel' })}
					>
						{businessStatus === 0
							? formatMessage({ id: 'storeManagement.create.status.open' })
							: formatMessage({ id: 'storeManagement.create.status.closed' })}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.create.address' })}
					>
						{region === '--' && address === '--' ? (
							<span>--</span>
						) : (
							<>
								<span>{region !== '--' ? region.split(',').join(' ') : ''}</span>
								<span>{address !== '--' ? address : ''}</span>
							</>
						)}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.create.daysLabel' })}
					>
						{businessHours}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.create.area' })}
					>
						{businessArea || '--'}㎡
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.create.contactName' })}
					>
						{contactPerson || '--'}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.create.contactPhone' })}
					>
						{contactTel}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.info.create' })}
					>
						{unixSecondToDate(createdTime)}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.info.update' })}
					>
						{unixSecondToDate(modifiedTime)}
					</Form.Item>
					<Form.Item label={formatMessage({ id: 'store.auth' })}>
						<AuthKey type="link" shopId={shopId} />
					</Form.Item>
					<Form.Item className={styles['clear-margin']} label=" " colon={false}>
						<Button type="primary" onClick={() => this.toPath('edit')}>
							{formatMessage({ id: 'storeManagement.info.modify' })}
						</Button>
						<Button
							className={styles['btn-margin-left']}
							type="default"
							onClick={() => this.toPath('back')}
						>
							{formatMessage({ id: 'storeManagement.info.cancel' })}
						</Button>
					</Form.Item>
				</Form>
			</Card>
		);
	}
}

export default StoreInformation;
