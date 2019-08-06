import React from 'react';
import { Form, Button, Card } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { formatEmptyWithoutZero, getLocationParam, unixSecondToDate } from '@/utils/utils';
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

		getStoreDetail({ options: { shop_id: shopId } });
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
			shop_id = '--',
			shop_name = '--',
			type_name = '--',
			business_status = 0,
			region = '--',
			address = '--',
			business_hours = '--',
			business_area = '--',
			contact_person = '--',
			contact_tel = '--',
			created_time = '--',
			modified_time = '--',
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
						{shop_id}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.create.nameLabel' })}
					>
						{shop_name}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.create.typeLabel' })}
					>
						{type_name}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.create.statusLabel' })}
					>
						{business_status === 0
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
						{business_hours}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.create.area' })}
					>
						{parseInt(business_area, 10) === 0 || parseInt(business_area, 10) > 0
							? business_area
							: '--'}
						㎡
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.create.contactName' })}
					>
						{contact_person || '--'}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.create.contactPhone' })}
					>
						{contact_tel}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.info.create' })}
					>
						{unixSecondToDate(created_time)}
					</Form.Item>
					<Form.Item
						className={styles['clear-margin']}
						label={formatMessage({ id: 'storeManagement.info.update' })}
					>
						{unixSecondToDate(modified_time)}
					</Form.Item>
					<Form.Item className={styles['clear-margin']} label=" " colon={false}>
						<Button type="primary" onClick={() => this.toPath('edit')}>
							{formatMessage({ id: 'storeManagement.info.modify' })}
						</Button>
						<Button
							style={{ marginLeft: '20px' }}
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
