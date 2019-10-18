import React, { PureComponent } from 'react';
import { Chart, Geom, Axis, Label, View, Facet } from 'bizcharts';
import '@/components/Charts/Shape';

class FacetChart extends PureComponent {
	render() {
		const {
			height = 400,
			data = [],
			forceFit = true,
			scale = {},
			chartPadding = 0,
			animate = false,
			axis: {
				x: {
					name: xName = null,
					line: xLine = null,
					tickLine: xTickLine = null,
					visible: xVisible = true,
				},
				y: {
					name: yName = null,
					line: yLine = null,
					tickLine: yTickLine = null,
					visible: yVisible = true,
				},
				assist: {
					name: assistName = null,
					line: assistLine = null,
					tickLine: assistTickLine = null,
					visible: assistVisible = true,
				},
			} = {},
			facet: { padding = 50, fields = [] },
			geom: {
				position = null,
				size = 25,
				color = '#ffffff',
				label: { content = null } = {},
				tooltip = {},
			},
			assistGeom: { position: assistPosition = null, color: assistColor = '#f0f2f5' },
		} = this.props;

		return (
			<div>
				<Chart
					height={height}
					data={data}
					scale={scale}
					forceFit={forceFit}
					padding={chartPadding}
					animate={animate}
				>
					<Axis name={xName} line={xLine} tickLine={xTickLine} visible={xVisible} />
					<Axis name={yName} line={yLine} tickLine={yTickLine} visible={yVisible} />
					<Axis
						name={assistName}
						line={assistLine}
						tickLine={assistTickLine}
						visible={assistVisible}
					/>
					<Facet type="mirror" fields={fields} transpose padding={padding}>
						<View>
							<Geom
								size={size}
								type="interval"
								position={assistPosition}
								color={assistColor}
								tooltip={tooltip}
							/>
							<Geom
								size={size}
								type="interval"
								position={position}
								color={color}
							>
								<Label content={content} />
							</Geom>
						</View>
					</Facet>
				</Chart>
			</div>
		);
	}
}

export default FacetChart;
