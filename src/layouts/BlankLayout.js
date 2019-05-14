import React from 'react';
import DocumentTitle from 'react-document-title';
import styles from './BlankLayout.less';

export default props => {
    const { staticContext, computedMatch, ...rest } = props;
    return (
        <DocumentTitle title="Studio">
            <div {...rest} className={styles.content} />
        </DocumentTitle>
    );
};
