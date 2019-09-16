import React from 'react';
import { connect } from 'dva';
import { Chart, Geom, Axis, Tooltip, Coord, Guide, View } from 'bizcharts';
import DataSet from '@antv/data-set';
import { formatMessage } from 'umi/locale';
import PriceTagAndCamera from '../PriceTagAndCamera';
import { shape, COLORS } from './payShape';

import styles from './index.less';

const { DataView } = DataSet;
const { Html } = Guide;

@connect(
	state => ({
		showInfo: state.showInfo,
	}),
)
class ShowPayChart extends React.PureComponent {
	render() {
		const { time } = this.props;
		const {
			showInfo: {
				deviceOverView = {},
				ipcOverView = {},
				[time]: {
					purchaseInfo: {
						purchaseTypeList = [],
					},
				} = {},
			},
		} = this.props;

		let totalCount = 0;
		const maxItem = { item: '', count: 0 };
		const data = purchaseTypeList.map(item => {
			totalCount += item.count;
			if (item.count > maxItem.count) {
				maxItem.item = item.purchaseTypeName;
				maxItem.count = item.count;
			}
			return {
				item: item.purchaseTypeName,
				count: item.count,
			};
		});

		const dv = new DataView();
		dv.source(data).transform({
			type: 'percent',
			field: 'count',
			dimension: 'item',
			as: 'percent',
		});

		const dv2Data = [{ item: '1', count: 1 }];
		const dv2 = new DataView();
		dv2.source(dv2Data).transform({
			type: 'percent',
			field: 'count',
			dimension: 'item',
			as: 'percent',
		});

		shape(maxItem);

		return (
			<div className={styles['pay-chart']}>
				<div className={styles['pay-chart-title']}>
					{formatMessage({ id: 'dashboard.payment' })}
				</div>
				<div className={styles['pay-chart-lengend']}>
					{data.map(item => {
						const onLighter = maxItem.item === item.item;
						return (
							<div
								key={item.item}
								className={`${styles['lengend-oneList']} ${
									onLighter ? styles['oneList-lighter'] : ''
								}`}
							>
								<div className={styles['oneList-right']}>
									<span
										className={`${styles['oneList-point']} ${styles[COLORS.POINT_COLOR[item.item]]}`}
									/>
									{item.item}
								</div>
								<div className={styles['oneList-left']}>
									{(
										(parseFloat(item.count) /
											(totalCount === 0 ? 1 : totalCount)) *
										100
									).toFixed(2)}
									%
								</div>
							</div>
						);
					})}
				</div>
				<Chart width={438} height={208} data={dv} padding={[-20, -20, -20, -240]}>
					<Coord type="theta" radius={0.75} innerRadius={0.6} />
					<Axis name="percent" />
					<Tooltip />
					<Guide>
						<Html
							position={['50%', '50%']}
							html={`<span class='html-totalCount'>${totalCount}</span>`}
							alignX="middle"
							alignY="middle"
						/>
					</Guide>
					<Geom
						type="intervalStack"
						position="count"
						color={[
							'item*percent',
							item => COLORS.FILL_COLOR[item],
						]}
						style={[
							'item*percent',
							{
								lineWidth: 0,
								stroke: COLORS.STROKE,
								shadowBlur: 20,
								shadowOffsetX: 0,
								shadowOffsetY: 10,
								shadowColor: item =>
									maxItem.item === item ? COLORS.SHADOW_LIGHT : COLORS.SHADOW_NOR,
							},
						]}
						shape="sliceShape"
						tooltip={false}
					/>
					<View data={dv2}>
						<Coord type="theta" radius={0.83} innerRadius={0.46} />
						<Geom
							type="intervalStack"
							position="count"
							color={['item', [COLORS.GEOM_COLOR]]}
							tooltip={false}
						/>
					</View>
				</Chart>
				<PriceTagAndCamera
					{...{
						deviceOverView,
						ipcOverView,
					}}
				/>
			</div>
		);
	}
}
export default ShowPayChart;
