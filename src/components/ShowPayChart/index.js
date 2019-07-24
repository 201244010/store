import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Guide, Shape, View } from 'bizcharts';
import DataSet from '@antv/data-set';
import { formatMessage } from 'umi/locale';
import PriceTagAndCamera from '../PriceTagAndCamera';
import { DASHBOARD } from '@/pages/DashBoard/constants';

import styles from './index.less';

const { PURCHASE_ORDER } = DASHBOARD;

export default class ShowPayChart extends React.Component {
	render() {
		const { purchaseInfo, deviceOverView, ipcOverView } = this.props;

		const { purchaseTypeList = [] } = purchaseInfo;

		const { DataView } = DataSet;
		const { Html } = Guide;

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

		Shape.registerShape('interval', 'sliceShape', {
			draw(cfg, container) {
				const {
					points,
					origin: { _origin },
					color,
				} = cfg;
				const origin = _origin;
				const xWidth = points[2].x - points[1].x;
				let path = [];
				path.push([
					'M',
					origin.item !== maxItem.item ? points[0].x : points[0].x - xWidth * 0.2,
					points[0].y,
				]);
				path.push([
					'L',
					origin.item !== maxItem.item ? points[1].x : points[1].x - xWidth * 0.2,
					points[1].y,
				]);
				path.push([
					'L',
					origin.item !== maxItem.item
						? points[0].x + xWidth
						: points[0].x + xWidth * 1.2,
					points[2].y,
				]);
				path.push([
					'L',
					origin.item !== maxItem.item
						? points[0].x + xWidth
						: points[0].x + xWidth * 1.2,
					points[3].y,
				]);
				path.push('Z');
				path = this.parsePath(path);
				return container.addShape('path', {
					attrs: {
						fill: color,
						path,
					},
				});
			},
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

		return (
			<div className={styles['pay-chart']}>
				<div className={styles['pay-chart-title']}>
					{formatMessage({ id: 'dashboard.payment' })}
				</div>
				<div className={styles['pay-chart-lengend']}>
					{data.map(item => {
						let color = '';
						switch (item.item) {
							case PURCHASE_ORDER[0]:
								color = '#2D59F4';
								break;
							case PURCHASE_ORDER[1]:
								color = '#2DE29A';
								break;
							case PURCHASE_ORDER[2]:
								color = '#FFDF66';
								break;
							case PURCHASE_ORDER[3]:
								color = '#FFC489';
								break;
							case PURCHASE_ORDER[4]:
								color = '#BB99FF';
								break;
							case PURCHASE_ORDER[5]:
								color = '#6666FF';
								break;
							default:
								color = '#6666FF';
						}
						return (
							<div key={item.item} className={styles['lengend-oneList']}>
								<div className={styles['oneList-right']}>
									<span
										style={{
											display: 'inline-block',
											width: 8,
											height: 8,
											borderRadius: '50%',
											background: color,
											marginRight: 16,
										}}
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
				<Chart width={438} height={208} data={dv} padding={[-20, -20, -20, -250]}>
					<Coord type="theta" radius={0.75} innerRadius={0.6} />
					<Axis name="percent" />
					<Tooltip />
					<Guide>
						<Html
							position={['50%', '50%']}
							html={`<span style="font-family: Gotham-Bold;font-size: 20px; color: #FFFFFF; text-align: center;">${totalCount}</span>`}
							alignX="middle"
							alignY="middle"
						/>
					</Guide>
					<Geom
						type="intervalStack"
						position="count"
						color={[
							'item*percent',
							item => {
								if (item === PURCHASE_ORDER[0]) {
									return 'l(45) 0:#6591F3 1:#5276E9 ';
								}
								if (item === PURCHASE_ORDER[1]) {
									return 'l(45) 0:#5EFFC9 1:#00FF99';
								}
								if (item === PURCHASE_ORDER[2]) {
									return 'l(45) 0:#FFE16B 1:#FFB366';
								}
								if (item === PURCHASE_ORDER[3]) {
									return 'l(45) 0:#FF9F82 1:#FF8989';
								}
								if (item === PURCHASE_ORDER[4]) {
									return 'l(45) 0:#CC99FF 1:#AA80FF';
								}
								return 'l(45) 0:#8095FF 1:#6666FF';
							},
						]}
						hide
						// tooltip={[
						//   "item*percent",
						//   (item, percent) => {
						//     percent = percent * 100 + "%";
						//     return {
						//       name: item,
						//       value: percent
						//     };
						//   }
						// ]}
						style={{
							lineWidth: 0,
							stroke: '#fff',
						}}
						shape="sliceShape"
					>
						{/* <Label
                  autoRotate={false}
                  // position="top"     //饼图中已失效
                  content="item"
                  formatter={(item) => {
                    return item;
                  }}
                  offset={-35}
                  // labelLine={{
                  //   lineWidth: 0,
                  // }}
                  textStyle={{
                    textAlign: 'end', // 文本对齐方向，可取值为： start middle end
                    fill: '#FFFFFF', // 文本的颜色
                    fontSize: '12', // 文本大小
                    textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
                  }}
                  // htmlTemplate={(text, item, index)=>{
                  //   var point = item.point;
                  //   return '<div style="color: #FFFFFF;font-size: 14px;text-align: center">'+point.item+'</div>'
                  // }}
                /> */}
					</Geom>
					<View data={dv2}>
						<Coord type="theta" radius={0.83} innerRadius={0.46} />
						<Geom
							type="intervalStack"
							position="count"
							color={['item', ['rgba(125,158,250,0.16)']]}
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
