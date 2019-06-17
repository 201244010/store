import React, { Component } from 'react';
import { connect } from 'dva';
import PanelHeader from '@/pages/DeviceManagement/ESL/DeviceUpgrade/PanelHeader';
import SearchForm from './SearchForm';
import SearchResult from './SearchResult';
import { getLocationParam } from '@/utils/utils';

@connect(
	state => ({
		deviceAP: state.deviceAP,
	}),
	dispatch => ({
		getAPGroupInfo: payload => dispatch({ type: 'deviceAP/getAPGroupInfo', payload }),
		updateSearchValue: payload => dispatch({ type: 'deviceAP/updateSearchValue', payload }),
		clearSearchValue: () => dispatch({ type: 'deviceAP/clearSearchValue' }),
	})
)
class DeviceAP extends Component {
	componentDidMount() {
		const { getAPGroupInfo } = this.props;
		const groupId = parseInt(getLocationParam('groupId'), 10);

		getAPGroupInfo({
			group_id: groupId,
		});
	}

	componentWillUnmount() {
		const { clearSearchValue } = this.props;
		clearSearchValue();
	}

	render() {
		const {
			deviceAP: { states, apInfoList, pagination, loading },
			getAPGroupInfo,
			updateSearchValue,
		} = this.props;
		const [model, version, groupId] = [
			getLocationParam('model'),
			getLocationParam('version'),
			parseInt(getLocationParam('groupId'), 10),
		];
		return (
			<div className="content-container">
				<PanelHeader model={model} type="station" version={version} />
				<SearchForm
					{...{
						states,
						groupId,
						updateSearchValue,
						getAPGroupInfo,
					}}
				/>
				<SearchResult
					{...{
						states,
						data: apInfoList,
						loading,
						pagination,
						version,
						groupId,
						getAPGroupInfo,
					}}
				/>
			</div>
		);
	}
}

export default DeviceAP;
