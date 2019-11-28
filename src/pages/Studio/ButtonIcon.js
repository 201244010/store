import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import * as styles from './index.less';

const nameMap = {
	save: formatMessage({ id: 'studio.action.save' }),
	check: formatMessage({ id: 'studio.action.check' }),
	preStep: formatMessage({ id: 'studio.action.preStep' }),
	nextStep: formatMessage({ id: 'studio.action.nextStep' }),
	wrapper: formatMessage({ id: 'studio.action.wrapper' }),
	view: formatMessage({ id: 'studio.action.view' }),
	history: formatMessage({ id: 'studio.action.history' }),
	download: formatMessage({ id: 'studio.action.download' }),
};

export default class ButtonIcon extends Component {
	render() {
		const { name, onClick } = this.props;

		return (
			<div className={styles['button-icon']} onClick={onClick}>
				<div className={styles['button-icon-img']}>
					<img src={require(`@/assets/studio/${name}.svg`)} alt="" />
				</div>
				<span className={styles.name}>{nameMap[name]}</span>
			</div>
		);
	}
}
