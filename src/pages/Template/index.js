import React, { Component } from 'react';
import { connect } from 'dva';
import SearchResult from './SearchResult';
import * as styles from './index.less';

@connect(
	state => ({
		template: state.template,
	}),
	dispatch => ({
		fetchScreenTypes: payload => dispatch({ type: 'template/fetchScreenTypes', payload }),
		fetchColors: payload => dispatch({ type: 'template/fetchColors', payload }),
		createTemplate: payload => dispatch({ type: 'template/createTemplate', payload }),
		fetchTemplates: payload => dispatch({ type: 'template/fetchTemplates', payload }),
		deleteTemplate: payload => dispatch({ type: 'template/deleteTemplate', payload }),
		applyTemplate: payload => dispatch({ type: 'template/applyTemplate', payload }),
	})
)
class Template extends Component {
	componentDidMount() {
		const { fetchScreenTypes, fetchTemplates } = this.props;

		fetchScreenTypes();
		fetchTemplates({
			options: {
				current: 1,
				screen_type: -1,
				colour: -1,
			},
		});
	}

	render() {
		const {
			fetchColors,
			fetchTemplates,
			createTemplate,
			deleteTemplate,
			applyTemplate,
			template: { screenTypes, colors, loading, data, pagination },
		} = this.props;

		return (
			<div className={styles['content-container']}>
				<SearchResult
					{...{
						screenTypes,
						colors,
						loading,
						data,
						pagination,
						fetchColors,
						createTemplate,
						fetchTemplates,
						deleteTemplate,
						applyTemplate,
					}}
				/>
			</div>
		);
	}
}

export default Template;
