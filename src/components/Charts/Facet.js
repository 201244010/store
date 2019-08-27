import React, { PureComponent } from 'react';
import { Chart, Geom, Axis, Tooltip, Label, View, Facet } from 'bizcharts';

class FacetChart extends PureComponent {
	render() {
		const {
			height = 400,
			data = [],
			forceFit = true,
			scale = {},
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
			tooltip = {},
			facet: { padding = 50, fields = [] },
			geom: { position = null, size = 15, color = '#ffffff', label: { content = null } = {} },
			assistGeom: { position: assistPosition = null, color: assistColor = '#ffffff' },
		} = this.props;

		return (
			<div>
				<Chart height={height} data={data} scale={scale} forceFit={forceFit}>
					<Tooltip {...tooltip} />
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
								type="intervalStack"
								position={assistPosition}
								color={assistColor}
							/>
							<Geom
								size={size}
								type="intervalStack"
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
