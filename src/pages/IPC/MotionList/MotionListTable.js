import React from 'react';
import { Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';

import styles from './MotionList.less';


class MotionListTable extends React.Component {
	
	columns = [{
		title: formatMessage({id: 'motionList.ipcName'}),
		dataIndex: 'name',
		key: 'name'
	}, {
		title: formatMessage({id: 'motionList.detectedSource'}),
		dataIndex: 'detectedSource',
		key: 'detectedSource',
		render: (item) => {
			switch(item){
				case 1:
					return formatMessage({id: 'motionList.image'});
				case 2:
					return formatMessage({id: 'motionList.sound'});
				case 3:
					return formatMessage({id: 'motionList.soundAndImage'});
				default:
					return formatMessage({id: 'motionList.else'});
			}
		}
	}, {
		title: formatMessage({id: 'motionList.detectedTime'}),
		dataIndex: 'detectedTime',
		key: 'detectedTime',
	}, {
		title: formatMessage({id: 'motionList.action'}),
		dataIndex:'video',
		key: 'action',
		render: (item) => {
			const { watchVideoHandler } = this.props;
			return(
				<a href="javascript:void(0);" onClick={()=>watchVideoHandler(item)}>
					{formatMessage({id: 'motionList.watch'})}
				</a>
			);
		}
	}];

	render(){
		const { motionList, total, loading, currentPage, pageSize, onShowSizeChange, onPaginationChange } = this.props;
		return(
			<div className={styles['table-wrapper']}>
				<Table
					columns={this.columns}
					dataSource={motionList}
					loading={loading.effects['motionList/read']}
					pagination={
						{
							current: currentPage,
							total,
							pageSize,
							showQuickJumper: true,
							showSizeChanger: true,
							pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
							defaultPageSize: DEFAULT_PAGE_SIZE,
							onShowSizeChange,
							onChange:onPaginationChange
						}
					}
				/>
			</div>
		);
	}
}

export default MotionListTable;