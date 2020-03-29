import React from 'react';
import { Empty } from 'antd';
import storeIcon from '@/assets/left-bg.png';
import styles from './pageEmpty.less';

const PageEmpty = ({ description }) => (
	<Empty
		className={styles.emptyPage}
		image={storeIcon}
		description={description}
		imageStyle={{
			height: 300,
		}}
	/>
);

export default PageEmpty;
