import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import styles from './DeviceUpgrade.less';

export default class PanelHeader extends Component {
	render() {
		const { model, version, type } = this.props;

		const groups = [
			{
				label: `${formatMessage({ id: 'esl.device.upgrade.model.group' })}:`,
				value: model || '',
			},
			{
				label: `${formatMessage({ id: 'esl.device.upgrade.version.last' })}:`,
				value: version || '',
			},
		];

		return (
			<div>
				<h3>
					{type === 'esl'
						? formatMessage({ id: 'esl.device.esl.title' })
						: formatMessage({ id: 'esl.device.ap.title' })}
					{formatMessage({ id: 'esl.device.upgrade.group.detail' })}
				</h3>
				<ul className={styles['panel-wrapper']}>
					{groups.map((group, index) => (
						<li key={index}>
							<span className="panel-label">{group.label}</span>
							<span className={styles['panel-value']}>{group.value}</span>
						</li>
					))}
				</ul>
			</div>
		);
	}
}
