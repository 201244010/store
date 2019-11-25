import React from 'react';
import { Form, Row, Col, Select, Input, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import { SEARCH_FORM_COL, SEARCH_FORM_GUTTER } from '@/constants/form';

import global from '@/styles/common.less';

const { Option } = Select;

@Form.create({
	name:'face-log-bar',
	wrappedComponentRef:true,
})

class FaceLogBar extends React.Component {

	mapAgeSelectInfo = (ageRangeCode, range) => {
		let ageRange = '';
		switch(ageRangeCode) {
			case 18:
				ageRange = formatMessage({id: 'photoManagement.ageLessInfo'});
				break;
			case 8:
				ageRange = formatMessage({id: 'photoManagement.ageLargeInfo'});
				break;
			default:
				ageRange = range;
		}
		return ageRange;
	}

	render(){
		const { form, ageRangeList, faceLibraryList, handleLibraryName, searchHandler, resetHandler } = this.props;
		const { getFieldDecorator } = form;

		return(
			<div className={global['search-bar']}>
				<Form layout="inline">
					<Row gutter={SEARCH_FORM_GUTTER.NORMAL}>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								label={formatMessage({id: 'faceLog.gender'})}
							>
								{
									getFieldDecorator('gender', {
										initialValue: -1
									})(
										<Select
											dropdownMatchSelectWidth={false}
										>
											<Option value={-1}>
												{formatMessage({ id: 'faceLog.all' })}
											</Option>
											<Option value={1}>
												{formatMessage({id: 'faceLog.gender.male'})}
											</Option>
											<Option value={2}>
												{formatMessage({id: 'faceLog.gender.female'})}
											</Option>
										</Select>
									)
								}
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								label={formatMessage({id: 'faceLog.age'})}
							>
								{
									getFieldDecorator('age', {
										initialValue: -1,
									})(
										<Select>
											<Option value={-1}>
												{formatMessage({id: 'faceLog.all'})}
											</Option>
											{
												ageRangeList && ageRangeList.map((item,index)=> (
													<Option key={`age-range-selector${index}`} value={item.ageRangeCode}>
														{/* {item.ageRange} */}
														{this.mapAgeSelectInfo(item.ageRangeCode, item.ageRange)}
													</Option>
												))
											}
										</Select>
									)
								}
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								label={formatMessage({id: 'faceLog.faceGroup'})}
							>
								{
									getFieldDecorator('faceGroup', {
										initialValue: -1,
									})(
										<Select
											dropdownMatchSelectWidth={false}
										>
											<Option value={-1}>
												{formatMessage({id: 'faceLog.all'})}
											</Option>
											{
												faceLibraryList && faceLibraryList.map((item,index)=> (
													<Option key={`face-group-selector${index}`} value={item.groupId}>{handleLibraryName(item.groupName)}</Option>
												))
											}
										</Select>
									)
								}
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								label={formatMessage({id: 'faceLog.name'})}
							>
								{
									getFieldDecorator('name')(
										<Input placeholder={formatMessage({id: 'faceLog.name.input'})} />
									)
								}
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.OFFSET_ONE_THIRD}>
							<Form.Item
								className={global['query-item']}
							>
								<Button
									type="primary"
									onClick={searchHandler}
								>
									{formatMessage({id: 'faceLog.search'})}
								</Button>
								<Button
									className={global['btn-margin-left']}
									type="default"
									onClick={resetHandler}
								>
									{formatMessage({id: 'faceLog.reset'})}
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
		);
	}
}

export default FaceLogBar;