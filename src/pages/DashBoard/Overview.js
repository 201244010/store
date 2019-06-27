import React from 'react';
import { Row, Col } from 'antd';
import { formatMessage } from 'umi/locale';
import DisplayCard from '@/components/DisplayCard';

import { priceFormat } from '@/utils/utils';

import styles from './DashBoard.less';

const TEXT = {
	TOTAL_INFO: formatMessage({ id: 'dashBoard.overview.product.total.info' }),
	ESL_INFO: formatMessage({ id: 'dashBoard.overview.esl.total.info' }),
	AP_INFO: formatMessage({ id: 'dashBoard.overview.ap.total.info' }),
	IPC_INFO: formatMessage({ id: 'dashBoard.overview.ipc.total.info' }),
};

const overviewCardStyle = {
	minHeight: '140px',
	cursor: 'pointer',
};

const descriptionStyle = {
	height: 0,
	fontSize: '14px',
	color: '#777E8C',
	lineHeight: '22px',
	zIndex: 10,
};

const decriptionNumStyle = {
	marginLeft: '12px',
	fontSize: '16px',
	color: '#525866',
	textAlign: 'center',
	zIndex: 10,
};

const ExtraImage = ({ iconName }) => <img src={require(`@/assets/icon/${iconName}`)} />;

const Overview = props => {
	const {
		// overviewProductLoading,
		overviewDeviceLoading,
		overviewIPCLoading,
		// productOverview: { totalCount = '' } = {},
		deviceOverView: {
			eslTotalCount = '',
			eslPendingCount = '',
			eslFailedCount = '',
			apTotalCount = '',
		} = {},
		ipcOverView: { onLineCount = '', offLineCount = '' } = {},
		goToPath,
	} = props;

	return (
		<div className={styles.overview}>
			<Row gutter={20}>
				{/* <Col span={6}>
					<DisplayCard
						{...{
							onClick: () => goToPath('productList'),
							loading: overviewProductLoading,
							cardStyle: overviewCardStyle,
							title: formatMessage({ id: 'dashBoard.overview.product' }),
							infoContent: TEXT.TOTAL_INFO,
							content: totalCount === '' ? '--' : priceFormat(totalCount),
							extra: (
								<div className={styles['card-extra-img']}>
									<ExtraImage iconName="PROD.png" />
								</div>
							),
						}}
					/>
				</Col> */}
				<Col span={6}>
					<DisplayCard
						{...{
							onClick: overviewDeviceLoading ? null : () => goToPath('electricLabel'),
							loading: overviewDeviceLoading,
							cardStyle: overviewCardStyle,
							title: formatMessage({ id: 'dashBoard.overview.esl.push' }),
							infoContent: TEXT.ESL_INFO,
							content: (
								<>
									<div>
										{eslPendingCount === ''
											? '--'
											: priceFormat(eslPendingCount)}
									</div>
									<div style={descriptionStyle}>
										{formatMessage({
											id: 'dashBoard.overview.esl.push.failed',
										})}
										<span style={decriptionNumStyle}>
											{eslFailedCount === '' ? '--' : eslFailedCount}
										</span>
									</div>
								</>
							),
							extra: (
								<div className={styles['card-extra-img']}>
									<ExtraImage iconName="PROD.png" />
								</div>
							),
						}}
					/>
				</Col>
				<Col span={6}>
					<DisplayCard
						{...{
							onClick: overviewDeviceLoading ? null : () => goToPath('electricLabel'),
							loading: overviewDeviceLoading,
							cardStyle: overviewCardStyle,
							title: formatMessage({ id: 'dashBoard.overview.esl.push.total' }),
							infoContent: TEXT.ESL_INFO,
							content: eslTotalCount === '' ? '--' : priceFormat(eslTotalCount),
							extra: (
								<div className={styles['card-extra-img']}>
									<ExtraImage iconName="ESL.png" />
								</div>
							),
						}}
					/>
				</Col>
				<Col span={6}>
					<DisplayCard
						{...{
							onClick: overviewDeviceLoading ? null : () => goToPath('baseStation'),
							loading: overviewDeviceLoading,
							cardStyle: overviewCardStyle,
							title: formatMessage({ id: 'dashBoard.overview.ap.online' }),
							infoContent: TEXT.AP_INFO,
							content: (
								<>
									<div>{apTotalCount === '' ? '--' : apTotalCount}</div>
									{/* <div style={descriptionStyle}>
										{formatMessage({
											id: 'dashBoard.overview.ap.offline',
										})}
										<span style={decriptionNumStyle}>0</span>
									</div> */}
								</>
							),
							extra: (
								<div className={styles['card-extra-img']}>
									<ExtraImage iconName="AP.png" />
								</div>
							),
						}}
					/>
				</Col>
				<Col span={6}>
					<DisplayCard
						{...{
							onClick: overviewIPCLoading ? null : () => goToPath('deviceList'),
							loading: overviewIPCLoading,
							cardStyle: overviewCardStyle,
							title: formatMessage({ id: 'dashBoard.overview.ipc.online' }),
							infoContent: TEXT.IPC_INFO,
							content: (
								<>
									<div>
										{onLineCount === '' ? '--' : priceFormat(onLineCount)}
									</div>
									<div style={descriptionStyle}>
										{formatMessage({
											id: 'dashBoard.overview.ipc.offline',
										})}
										<span style={decriptionNumStyle}>
											{offLineCount === '' ? '--' : offLineCount}
										</span>
									</div>
								</>
							),
							extra: (
								<div className={styles['card-extra-img']}>
									<ExtraImage iconName="IPC.png" />
								</div>
							),
						}}
					/>
				</Col>
			</Row>
		</div>
	);
};

export default Overview;
