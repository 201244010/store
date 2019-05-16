import React from 'react';
import styles from './skeleton.less';

export const CustomSkeleton = props => {
    const { style = {} } = props;
    return <div className={styles['custom-skeleton']} style={{ ...style }} />;
};
