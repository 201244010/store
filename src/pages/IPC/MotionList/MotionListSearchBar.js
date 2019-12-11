import React from 'react';
import moment from 'moment';
import { Select, Button, Row, Col, Form,DatePicker } from 'antd';
import { formatMessage } from 'umi/locale';
import { SEARCH_FORM_COL, SEARCH_FORM_GUTTER } from '@/constants/form';

import styles from './MotionList.less';
import global from '@/styles/common.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

const SEARCH_FORM_BUTTON = {
	sm: 24,
	md: {
	 span: 6,
	 offset: 18
	}
};

@Form.create({
	name:'motion-search-bar',
	wrappedComponentRef:true
})
class MotionListSearchBar extends React.Component {
	
	disabledDate = (value) =>{
		if(!value) return false;
		return value.set({'hour': 0, 'minute': 0, 'second':0}).valueOf() > moment().valueOf();
	}

	
	
	render(){
		const { ipcList, loading, form, searchHandler, resetHandler } = this.props;

		const { getFieldDecorator } = form;
		const dateFormat = 'YYYY-MM-DD';
		return(
			<div className={global['search-bar']}>
				<Form layout="inline">
					<Row gutter={SEARCH_FORM_GUTTER.NORMAL}>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								className={styles['search-name']}
								label={formatMessage({id: 'motionList.ipcName'})}
							>
								{
									getFieldDecorator('ipcId', {
										initialValue: 0
									})(
										<Select
											dropdownMatchSelectWidth={false}
											placeholder={formatMessage({id: 'motionList.select.ipcName'})}
										>
											<Option value={0}>
												{formatMessage({ id: 'motionList.all' })}
											</Option>
											{
												ipcList && ipcList.map((item,index)=> (
													<Option key={`ipc-selector${index}`} value={item.deviceId}>{item.name}</Option>
												))
											}
										</Select>
									)
								}
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								className={styles['search-source']}
								label={formatMessage({id: 'motionList.detectedSource'})}
							>
								{
									getFieldDecorator('detectedSource', {
										initialValue: 0,
									})(
										<Select
											className='sfdf-1'
											dropdownMatchSelectWidth={false}
											placeholder={formatMessage({id: 'motionList.select.detectedSource'})}
										>
											<Option value={0}>
												{formatMessage({id: 'motionList.all'})}
											</Option>
											<Option value={1}>
												{formatMessage({id: 'motionList.image.detect'})}
											</Option>
											<Option value={2}>
												{formatMessage({id: 'motionList.sound.detect'})}
											</Option>
											<Option value={3}>
												{formatMessage({id: 'motionList.soundAndImage.detect'})}
											</Option>
										</Select>
									)
								}
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								className={styles['search-time']}
								label={formatMessage({id: 'motionList.time'})}
							>
								{
									getFieldDecorator('dateRange', {
										initialValue: [
											moment().subtract(7, 'days'),
											moment()
										]
									})(
										<RangePicker
											// style={{width:'100%'}}
											allowClear={false}
											disabledDate={this.disabledDate}
											format={dateFormat}
										/>
									)
								}
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_BUTTON}>
							<Form.Item
								className={global['query-item']}
							>
								<Button
									type="primary"
									onClick={searchHandler}
									loading={loading.effects['motionList/read']}
								>
									{formatMessage({id: 'motionList.search'})}
								</Button>
								<Button
									className={global['btn-margin-left']}
									type="default"
									onClick={resetHandler}
								>
									{formatMessage({id: 'motionList.reset'})}
								</Button>
							</Form.Item>
						</Col>
						{/* <Col {...SEARCH_FORM_COL.ONE_12TH}>
							<Form.Item>
								
							</Form.Item>
						</Col> */}
					</Row>
				</Form>
			</div>
		);
	}
}

export default MotionListSearchBar;