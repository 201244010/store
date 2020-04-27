import React from 'react';
import { Select, Button, Form, DatePicker, Input, Row, Col } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale';

import { SEARCH_FORM_COL, SEARCH_FORM_GUTTER } from '@/constants/form';

import global from '@/styles/common.less';
import styles from './TradeVideos.less';

const { Option } = Select;
// const { Search } = Input;
const { RangePicker } = DatePicker;

@Form.create({
	name: 'video-search-form',
	wrappedComponentRef: true,
	// onFieldsChange(props, fields) {
	// 	const { searchHandler } = props;
	// 	// console.log(Object.keys(fields)[0]);
	// 	if(Object.keys(fields)[0] !== 'keywords') {
	// 		searchHandler();
	// 	}
	// }

})
class SearchBox extends React.Component{

	disabledDate = value => {
		if (!value) return false;
		return value.valueOf() > moment().endOf('day').valueOf();
	};

	render() {
		const { ipcList, form, paymentDeviceList, searchHandler, ipcSelectHandler, loading, resetHandler } = this.props;
		// console.log(ipcList);
		const { getFieldDecorator } = form;
		return(
			<div className={global['search-bar']}>
				<Form layout="inline">
					<Row gutter={SEARCH_FORM_GUTTER.SMALL}>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								className={styles['search-camera']}
								label={formatMessage({ id: 'tradeVideos.camera'})}
							>
								{getFieldDecorator('camera', {
									initialValue: 0
								})(
									<Select
										className={styles['input-item']}
										placeholder={
											formatMessage({
												id: 'tradeVideos.chooseCamera',
											})
										}
										onChange={(value) => {  ipcSelectHandler(value); }}
									>
										<Option value={0}>
											{formatMessage({ id: 'tradeVideos.all'})}
										</Option>
										{ipcList.map((item, index) => (
											<Option
												key={`ipc-selector-${index}`}
												value={`${item.deviceId}`}
											>
												{item.name}
											</Option>
										))}
									</Select>
								)}
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								className={styles['search-pos']}
								label={formatMessage({ id: 'tradeVideos.pos' })}
							>
								{getFieldDecorator('pos', {
									initialValue: 0,
								})(
									<Select
										className={styles['input-item']}
										placeholder={
											formatMessage({
												id: 'tradeVideos.choosePos'
											})
										}
									>
										<Option value={0}>
											{formatMessage({ id: 'tradeVideos.all'})}
										</Option>
										{paymentDeviceList &&
											paymentDeviceList.map((item, index) => (
												<Option
													key={`payment-selector-${index}`}
													value={`${item.sn}`}
												>
													{`${item.name}(${item.sn})` ||
														formatMessage({
															id: 'tradeVideos.unknownDevice',
														})}
												</Option>
											))}
									</Select>
								)}
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								label={formatMessage({ id: 'tradeVideos.tradeDate' })}
								// className={styles['search-time']}
							>
								{getFieldDecorator('tradeDate', {
									initialValue: [moment().subtract(30, 'days'), moment()]
								})(
									<RangePicker
										allowClear={false}
										className={styles['search-date-picker']}
										disabledDate={this.disabledDate}
										format="YYYY-MM-DD"
									/>
								)}
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								className={styles['search-keyword']}
								label={formatMessage({
									id: 'tradeVideos.keywords',
								})}
							>
								{getFieldDecorator('keywords')(
									<Input
										placeholder={
											formatMessage({
												id: 'tradeVideos.inputKeywords',
											})
										}
										className={styles['input-item']}
									/>
								)}
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.OFFSET_ONE_THIRD}>
							<Form.Item className={global['query-item']}>
								<Button
									type="primary"
									className={styles['input-item']}
									onClick={searchHandler}
									loading={loading}
								>
									{formatMessage({ id: 'tradeVideos.query' })}
								</Button>
								<Button
									type="default"
									className={global['btn-margin-left']}
									onClick={resetHandler}
									// loading={loading}
								>
									{formatMessage({ id: 'tradeVideos.reset' })}
								</Button>
							</Form.Item>
						</Col>
						{/* <Col {...SEARCH_FORM_COL.ONE_12TH}>
							<Form.Item>
								<Button
									type="default"
									className={styles['input-item']}
									onClick={resetHandler}
									// loading={loading}
								>
									{formatMessage({ id: 'tradeVideos.reset' })}
								</Button>
							</Form.Item>
						</Col> */}
					</Row>
				</Form>
			</div>
		);
	}
}
export default SearchBox;