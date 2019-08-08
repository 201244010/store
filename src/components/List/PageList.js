import React, { useState } from 'react';
import { Pagination } from 'antd';
import DataEmpty from '@/components/BigIcon/DataEmpty';
import styles from './list.less';

const PageList = ({
	data = [],
	RenderComponent = () => <></>,
	pagination = {},
	onChange = null,
}) => {
	const [pageConfig, setPageConfig] = useState({
		current: 1,
		pageSize: 10,
		total: data.length,
		...pagination,
	});
	const { current, pageSize } = pageConfig;
	const dispayStart = (current - 1) * pageSize;
	const [displayData, setDisplayData] = useState(data.slice(dispayStart, pageSize));

	const listPageChange = (page, size) => {
		setPageConfig({
			...pageConfig,
			current: page,
			pageSize: size,
		});

		const _dispayStart = (page - 1) * size;
		setDisplayData(data.slice(_dispayStart, size));

		if (onChange) {
			onChange(page);
		}
	};

	const listPageSizeChange = (_current, size) => {
		setPageConfig({
			...pageConfig,
			pageSize: size,
		});
	};

	return (
		<>
			{data.length > 0 ? (
				<div className={styles['list-wrapper']}>
					{displayData.map((_data, index) => (
						<RenderComponent key={index} data={_data} index={index} />
					))}
					<div className={styles['footer-bar']}>
						<Pagination
							{...pageConfig}
							showSizeChanger
							onChange={listPageChange}
							onShowSizeChange={listPageSizeChange}
						/>
					</div>
				</div>
			) : (
				<DataEmpty />
			)}
		</>
	);
};

export default PageList;
