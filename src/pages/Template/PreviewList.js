import React, {Component} from 'react';
import { Row, Col, Card, Pagination } from 'antd';
import { formatMessage } from 'umi/locale';
import formatedMessage from '@/constants/templateNames';
import { SCREEN_TYPE } from '@/constants/studio';
import * as styles from './index.less';

export default class PreviewList extends Component {
	render() {
		const {data, loading, pagination, onPreview, onEdit, onApply, onClone, onDelete, onChange} = this.props;
		const sortedData = data.sort((a, b) => (a.screen_type - b.screen_type));
		const splitData = [sortedData.slice(0, 4), sortedData.slice(4, 8)];

		return (
			<Card bordered={false} loading={loading} className={styles['preview-list']}>
				{
					splitData.map((rowData, index) => (
						<Row gutter={16} key={index}>
							{
								rowData.map(({id, name, preview_addr: previewUrl, screen_type: screenType, screen_type_name: screenTypeName, colour_name: colourName, is_default: isDefault, esl_num: eslNum}) => {
									const screen = SCREEN_TYPE[screenType];
									return (
										<Col span={6} key={id} className={styles.mb20}>
											<h4>{name}</h4>
											<Card
												style={{ width: '100%' }}
												cover={
													<div className={styles['cover-wrapper']}>
														<img className={styles['cover-img']} src={require(`@/assets/studio/${screen}.png`)} alt="" />
														<img className={styles['cover-img-0']} src={previewUrl} alt=""  />
													</div>
												}
												actions={[
													<div onClick={() => onPreview({id, screen_type: screenType})}>{formatMessage({id: 'list.action.preview'})}</div>,
													<div onClick={() => onEdit({id, screen_type: screenType})}>{formatMessage({id: 'list.action.edit'})}</div>,
													<div onClick={() => onApply({id})}>{formatMessage({id: 'list.action.apply'})}</div>,
													<div onClick={() => onClone({id, screen_type_name: formatedMessage(screenTypeName), colour_name: formatedMessage(colourName), screen_type: screenType})}>{formatMessage({id: 'list.action.clone'})}</div>,
													<div>
														{isDefault === 1 || eslNum > 1 ? (
															<a href="javascript: void (0);" className={styles.disabled}>
																{formatMessage({ id: 'list.action.delete' })}
															</a>
														) : (
															<a href="javascript: void (0);" onClick={() => onDelete({id})}>
																{formatMessage({ id: 'list.action.delete' })}
															</a>
														)}
													</div>,
												]}
											/>
										</Col>
									);
								})
							}
						</Row>
					))
				}
				<Pagination
					showQuickJumper
					pageSize={8}
					total={pagination.total}
					current={pagination.current}
					showTotal={total => `${formatMessage({ id: 'esl.device.esl.all' })}${total}${formatMessage({id: 'esl.device.esl.total'})}`}
					onChange={pageNum => onChange({
						current: pageNum
					})}
				/>
			</Card>
		);
	}
}
