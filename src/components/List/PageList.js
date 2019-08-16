import React, { useState, useEffect } from 'react';
import { Pagination, Spin } from 'antd';
import DataEmpty from '@/components/BigIcon/DataEmpty';
import styles from './list.less';

const calculateSlicePos = (pageNum = 1, pageSize = 10) => ({
	start: (pageNum - 1) * pageSize,
	end: (pageNum - 1) * pageSize + pageSize,
});

const PageList = ({
	data = [],
	loading = false,
	RenderComponent = () => <></>,
	pagination = {},
	onChange = null,
	dataEmpty,
}) => {
	const [pageConfig, setPageConfig] = useState({});
	const [displayData, setDisplayData] = useState([]);
	useEffect(
		() => {
			const { start: initStart, end: initEnd } = calculateSlicePos();
			const initData = data.slice(initStart, initEnd);
			setDisplayData(initData);
			setPageConfig({ current: 1, pageSize: 10, total: data.length, ...pagination });
		},
		[data]
	);

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
				<Spin spinning={loading}>
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
				</Spin>
			) : (
				<DataEmpty dataEmpty={dataEmpty} />
			)}
		</>
	);
};

export default PageList;
