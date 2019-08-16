import React from 'react';
import { Table, Divider, Avatar } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';
import { DEFAULT_PAGE_LIST_SIZE, DEFAULT_PAGE_SIZE } from '@/constants';


import styles from './FaceLog.less';

class FaceLogTable extends React.Component{
	columns = [
		{
			title: formatMessage({id: 'faceLog.regFace'}),
			dataIndex: 'regFace',
			key: 'regFace',
			render: img => <div className={styles['img-wrapper']}>{img&&img !==''?<img className={styles['face-img']} src={img} />:<Avatar shape="square" size={50} icon="user" />}</div>,
		},
		{
			title: formatMessage({id: 'faceLog.name'}),
			dataIndex: 'name',
			key: 'name',
			render: name => <span>{name === ''? '--' : name}</span>
		},
		{
			title: formatMessage({id: 'faceLog.gender'}),
			dataIndex: 'gender',
			 key: 'gender',
			 render:(genderValue) => {
				switch (genderValue) {
					case 1:
						return <span>{formatMessage({id: 'faceLog.gender.male'})}</span>;
					case 2:
						return <span>{formatMessage({id: 'faceLog.gender.female'})}</span>;
					default:
						return <span>--</span>;
				}
			}
		},
		{
			title: formatMessage({id: 'faceLog.age'}),
			dataIndex: 'ageItem',
			key: 'ageItem',
			render:(ageItem) => {
				const { ageRangeCodeMap } = this.props;
				const { ageRangeCode, age } = ageItem;
				if(ageRangeCode === 0 && age === 0) return '--';
				return age||ageRangeCodeMap[ageRangeCode];
			}
		},
		{
			title:formatMessage({id: 'faceLog.face.group'}),
			dataIndex:'groupName',
			key:'groupName',
			render:(name) => {
				const { handleLibraryName } = this.props;
				return(
					<span>{handleLibraryName(name)}</span>
				);
			}
		},
		{
			title:formatMessage({id: 'faceLog.last.arrival.date'}),
			dataIndex:'lastArrivalTime',
			key:'lastArrivalTime',
			render:(time) => (
				<span>{time === 0?'--':moment.unix(time).format('YYYY.MM.DD HH:mm:ss')}</span>
			)
		},
		{
			title: formatMessage({id: 'faceLog.arrival.count'}),
			dataIndex:'arrivalCount',
			key:'arrivalCount'
		},
		{
			title: formatMessage({id: 'faceLog.action'}),
			key: 'action',
			render: (item) => {
				const { linkToDetailHandler, adjustGroupHandler } = this.props;
				return(
					<span>
						<a href="javascript:;" onClick={()=>linkToDetailHandler(item.faceId)}>{formatMessage({id: 'faceLog.watch.details'})}</a>
						<Divider type="vertical" />
						<a href="javascript:;" onClick={()=>adjustGroupHandler(item)}>{formatMessage({id: 'faceLog.adjust.group'})}</a>
					</span>
				);
			},
		},
	];

	render(){
		const { faceLogList, currentPage, total, pageSize, onShowSizeChange, onPaginationChange, loading } = this.props;
		return(
			<Table
				rowKey={record => record.faceId}
				loading={loading.effects['faceLog/readFaceLogList']}
				className={styles['face-log-table']}
				dataSource={faceLogList}
				columns={this.columns}
				pagination={
					{
						current: currentPage,
						total,
						pageSize,
						showSizeChanger: true,
						pageSizeOptions: DEFAULT_PAGE_LIST_SIZE,
						defaultPageSize: DEFAULT_PAGE_SIZE,
						onShowSizeChange,
						onChange:onPaginationChange
					}
				}
			/>
		);
	}
}

export default FaceLogTable;
