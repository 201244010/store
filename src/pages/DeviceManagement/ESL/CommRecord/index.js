import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import SearchForm from './SearchForm';
import SearchResult from './SearchResult';

const REASONS = {
	1: formatMessage({ id: 'esl.device.esl.comm.reason1' }),
	2: formatMessage({ id: 'esl.device.esl.comm.reason2' }),
	3: formatMessage({ id: 'esl.device.esl.comm.reason3' }),
	4: formatMessage({ id: 'esl.device.esl.comm.reason4' }),
	5: formatMessage({ id: 'esl.device.esl.comm.reason5' }),
	6: formatMessage({ id: 'esl.device.esl.comm.reason6' }),
	7: formatMessage({ id: 'esl.device.esl.comm.reason7' }),
};
const RESULTS = {
	0: formatMessage({ id: 'esl.device.esl.comm.result1' }),
	1: formatMessage({ id: 'esl.device.esl.comm.result2' }),
	2: formatMessage({ id: 'esl.device.esl.comm.result3' }),
};

@connect(
	state => ({
		monitor: state.monitor,
	}),
	dispatch => ({
		fetchCommunications: payload => dispatch({ type: 'monitor/fetchCommunications', payload }),
		updateSearchValue: payload => dispatch({ type: 'monitor/updateSearchValue', payload }),
		changeSearchFormValue: payload => dispatch({ type: 'monitor/changeSearchFormValue', payload }),
		clearSearchValue: () => dispatch({ type: 'monitor/clearSearchValue' }),
	})
)
class DeviceESL extends Component {
	componentDidMount() {
		const { fetchCommunications } = this.props;
		fetchCommunications();
	}

	componentWillUnmount() {
		const { clearSearchValue } = this.props;
		clearSearchValue();
	}

	render() {
		const {
			monitor: { data, pagination, loading, searchFormValues },
			fetchCommunications,
			updateSearchValue,
			changeSearchFormValue
		} = this.props;

		return (
			<div className="content-container">
				<SearchForm
					{...{
						searchFormValues,
						updateSearchValue,
						changeSearchFormValue,
						fetchCommunications,
					}}
				/>
				<SearchResult
					{...{
						reasons: REASONS,
						results: RESULTS,
						data,
						loading,
						pagination,
						fetchCommunications,
					}}
				/>
			</div>
		);
	}
}

export default DeviceESL;
