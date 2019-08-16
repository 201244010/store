import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PanelHeader from '@/pages/DeviceManagement/ESL/DeviceUpgrade/PanelHeader';
import SearchForm from './SearchForm';
import SearchResult from './SearchResult';
import { getLocationParam } from '@/utils/utils';

@connect(
	state => ({
		deviceESL: state.deviceESL,
	}),
	dispatch => ({
		getESLGroupInfo: payload => dispatch({ type: 'deviceESL/getESLGroupInfo', payload }),
		updateSearchValue: payload => dispatch({ type: 'deviceESL/updateSearchValue', payload }),
		clearSearchValue: () => dispatch({ type: 'deviceESL/clearSearchValue' }),
	})
)
class DeviceESL extends Component {
	componentDidMount() {
		const { getESLGroupInfo } = this.props;
		const groupId = parseInt(getLocationParam('groupId'), 10);

		getESLGroupInfo({
			group_id: groupId,
		});
	}

	componentWillUnmount() {
		const { clearSearchValue } = this.props;
		clearSearchValue();
	}

	render() {
		const {
			deviceESL: { states, eslInfoList, pagination, loading },
			getESLGroupInfo,
			updateSearchValue,
		} = this.props;
		const [model, version, groupId] = [
			getLocationParam('model'),
			getLocationParam('version'),
			parseInt(getLocationParam('groupId'), 10),
		];

		return (
			<Card bordered={false}>
				<PanelHeader model={model} type="esl" version={version} />
				<SearchForm
					{...{
						states,
						groupId,
						updateSearchValue,
						getESLGroupInfo,
					}}
				/>
				<SearchResult
					{...{
						states,
						data: eslInfoList,
						loading,
						pagination,
						version,
						groupId,
						getESLGroupInfo,
					}}
				/>
			</Card>
		);
	}
}

export default DeviceESL;
