import React from 'react';
import styles from './BlankLayout.less';

export default props => {
    const { staticContext, computedMatch, ...rest } = props;
    return <div {...rest} className={styles.content} />;
};
