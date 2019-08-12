import React, { useState } from 'react';
import { Pagination } from 'antd';
import DataEmpty from '@/components/BigIcon/DataEmpty';
import styles from './list.less';

const calculateSlicePos = (pageNum, pageSize) => ({
	start: (pageNum - 1) * pageSize,
	end: (pageNum - 1) * pageSize + pageSize,
});

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
	const { start: initStart, end: initEnd } = calculateSlicePos(current, pageSize);
	const [displayData, setDisplayData] = useState(data.slice(initStart, initEnd));

	const listPageChange = (page, size) => {
		setPageConfig({
			...pageConfig,
			current: page,
			pageSize: size,
		});

		const { start, end } = calculateSlicePos(page, size);
		setDisplayData(data.slice(start, end));

		if (onChange) {
			onChange(page);
		}
	};

	const listPageSizeChange = (_current, size) => {
		setPageConfig({
			...pageConfig,
			pageSize: size,
		});

		const { start, end } = calculateSlicePos(_current, size);
		setDisplayData(data.slice(start, end));
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
