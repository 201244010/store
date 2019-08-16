import React, { Component } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import SearchResult from './SearchResult';

@connect(
	state => ({
		template: state.template,
	}),
	dispatch => ({
		changeSearchFormValue: payload =>
			dispatch({ type: 'template/changeSearchFormValue', payload }),
		fetchScreenTypes: payload => dispatch({ type: 'template/fetchScreenTypes', payload }),
		fetchColors: payload => dispatch({ type: 'template/fetchColors', payload }),
		createTemplate: payload => dispatch({ type: 'template/createTemplate', payload }),
		fetchTemplates: payload => dispatch({ type: 'template/fetchTemplates', payload }),
		deleteTemplate: payload => dispatch({ type: 'template/deleteTemplate', payload }),
		applyTemplate: payload => dispatch({ type: 'template/applyTemplate', payload }),
		cloneTemplate: payload => dispatch({ type: 'template/cloneTemplate', payload }),
	})
)
class Template extends Component {
	componentDidMount() {
		const { fetchScreenTypes, fetchColors, fetchTemplates, changeSearchFormValue } = this.props;

		changeSearchFormValue({
			keyword: '',
			status: -1,
			colour: -1,
			screen_type: -1,
		});
		fetchScreenTypes();
		fetchColors({ screen_type: -1 });
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
			changeSearchFormValue,
			fetchTemplates,
			createTemplate,
			deleteTemplate,
			applyTemplate,
			cloneTemplate,
			template: { searchFormValues, screenTypes, colors, loading, data, pagination },
		} = this.props;

		return (
			<Card bordered={false}>
				<SearchResult
					{...{
						searchFormValues,
						screenTypes,
						colors,
						loading,
						data,
						pagination,
						fetchColors,
						changeSearchFormValue,
						createTemplate,
						fetchTemplates,
						deleteTemplate,
						applyTemplate,
						cloneTemplate
					}}
				/>
			</Card>
		);
	}
}

export default Template;
