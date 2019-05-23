import React from 'react';
import DocumentTitle from 'react-document-title';
import { message } from 'antd';
import styles from './BlankLayout.less';

message.config({
	maxCount: 1,
});

export default props => {
	const { staticContext, computedMatch, ...rest } = props;
	return (
		<DocumentTitle title="Studio">
			<div {...rest} className={styles.content} />
		</DocumentTitle>
	);
};
