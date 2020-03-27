import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import PageEmpty from '@/components/BigIcon/PageEmpty';

export default class TopViewPassengerAnalyze extends Component {
	render() {
		return (
			<div>
				<h1>TopViewPassengerAnalyze</h1>
				<PageEmpty description={formatMessage({ id: 'dashboard.emptydata' })} />
			</div>
		);
	}
}
