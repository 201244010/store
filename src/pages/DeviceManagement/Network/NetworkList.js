import React from 'react';
import { Card, Divider, Badge, Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import { IconLink, IconEquipment, IconNetwork } from '@/components/IconSvg';
import styles from './Network.less';

// @connect(
// 	state => ({}),
// 	dispatch => ({})
// )
class NetworkList extends React.Component {
	// constructor(props) {
	// 	super(props);
	// }

	render() {
		return (
			<Card bordered={false}>
				<h1>{formatMessage({ id: 'network.shopNetwork' })}</h1>
				<Topology online />
				<Topology />
			</Card>
		);
	}
}

const Topology = props => {
	const { online, upSpeed, downSpeed } = props || {};
	return (
		<div className={styles['network-shop']}>
			<div className={styles['network-title']}>
				<div className={styles['network-Id']}>
					<span>{`${formatMessage({ id: 'network.networkId' })}: dada`}</span>
					<div className={styles['network-edit']} />
				</div>
				<div className={styles['network-speed']}>
					<div className={styles['network-upspeed']} />
					{`${formatMessage({ id: 'network.upSpeed' })}：`}
					<span>{upSpeed || '--'}</span>KB/s
					<Divider type="vertical" />
					<div className={styles['network-downspeed']} />
					{`${formatMessage({ id: 'network.downSpeed' })}：`}
					<span>{downSpeed || '--'}</span>KB/s
				</div>
			</div>
			<div className={styles[online ? 'network-topology' : 'network-topology-offline']}>
				<div className={styles['network-map']}>
					<ul>
						<li>
							{online
								? [
									<Icon component={() => <IconNetwork color="#303540" />} />,
									<Badge
										count={2}
										offset={[0, -2]}
										overflowCount={9999}
										style={{ backgroundColor: '#4B7AFA', fontSize: 14 }}
									>
										<Icon component={() => <IconLink color="#303540" />} />
									</Badge>,
									<Badge
										count={1030}
										offset={[0, -2]}
										overflowCount={9999}
										style={{ backgroundColor: '#4B7AFA', fontSize: 14 }}
									>
										<Icon
											component={() => <IconEquipment color="#303540" />}
										/>
									</Badge>,
								  ]
								: [
									<Icon component={() => <IconNetwork color="#A1A7B3" />} />,
									<Icon component={() => <IconLink color="#A1A7B3" />} />,
									<Icon
										component={() => <IconEquipment color="#A1A7B3" />}
									/>,
								  ]}
						</li>
						<li>
							{online
								? [
									<div className={styles['network-cicle-first']} />,
									<div className={styles['network-line']} />,
									<div className={styles['network-cicle']} />,
									<div className={styles['network-line']} />,
									<div className={styles['network-cicle-third']} />,
								  ]
								: [
									<div
										className={`${styles['network-cicle-first']} ${styles.offline}`}
									/>,
									<div className={styles['network-line-dash']} />,
									<div className={styles['network-cross']} />,
									<div className={styles['network-line-dash']} />,
									<div className={`${styles['network-cicle']} ${styles.offline}`} />,
									<div className={`${styles['network-line-offline']}`} />,
									<div
										className={`${styles['network-cicle-third']} ${styles.offline}`}
									/>,
								  ]}
						</li>
						<li>
							<div>{`${formatMessage({ id: 'network.Internet' })}`}</div>
							<div>
								{formatMessage({ id: 'network.router' })}
								{online && (
									<a href="javascript:void(0);" onClick={() => console.log('aa')}>
										（{formatMessage({ id: 'network.viewMore' })}）
									</a>
								)}
							</div>
							<div>{formatMessage({ id: 'network.client' })}</div>
						</li>
					</ul>
					<ul>
						<li />
					</ul>
				</div>
				<div className={styles['network-guest-wrapper']}>
					<Divider style={{ height: 80 }} type="vertical" />
					<div className={styles['network-guest']}>
						{formatMessage({ id: 'network.guestNumber' })}
						{online ? (
							<div>
								<span className={styles['network-guest-number']}>6</span>
								{formatMessage({ id: 'network.unit' })}
							</div>
						) : (
							<div className={styles['network-guest-number']}>--</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default NetworkList;
