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
};

const descriptionStyle = {
	height: 0,
	fontSize: '14px',
	color: '#777E8C',
	lineHeight: '22px',
};

const decriptionNumStyle = {
	marginLeft: '20px',
	fontSize: '16px',
	color: '#525866',
	textAlign: 'center',
};

const ExtraImage = ({ iconName }) => <img src={require(`@/assets/icon/${iconName}`)} />;

const Overview = props => {
	console.log(props);
	return (
		<div className={styles.overview}>
			<Row gutter={20}>
				<Col span={6}>
					<DisplayCard
						{...{
							cardStyle: overviewCardStyle,
							title: formatMessage({ id: 'esl.overview.product.total' }),
							infoContent: TEXT.TOTAL_INFO,
							content: priceFormat(1000),
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
							cardStyle: overviewCardStyle,
							title: formatMessage({ id: 'dashBoard.overview.esl.push' }),
							infoContent: TEXT.ESL_INFO,
							content: (
								<>
									<div>{priceFormat(180)}</div>
									<div style={descriptionStyle}>
										{formatMessage({
											id: 'dashBoard.overview.esl.push.failed',
										})}
										<span style={decriptionNumStyle}>9</span>
									</div>
								</>
							),
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
							cardStyle: overviewCardStyle,
							title: formatMessage({ id: 'dashBoard.overview.ap.online' }),
							infoContent: TEXT.AP_INFO,
							content: (
								<>
									<div>{priceFormat(4)}</div>
									<div style={descriptionStyle}>
										{formatMessage({
											id: 'dashBoard.overview.ap.offline',
										})}
										<span style={decriptionNumStyle}>0</span>
									</div>
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
							cardStyle: overviewCardStyle,
							title: formatMessage({ id: 'dashBoard.overview.ipc.online' }),
							infoContent: TEXT.IPC_INFO,
							content: (
								<>
									<div>{priceFormat(4)}</div>
									<div style={descriptionStyle}>
										{formatMessage({
											id: 'dashBoard.overview.ipc.offline',
										})}
										<span style={decriptionNumStyle}>2333</span>
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
