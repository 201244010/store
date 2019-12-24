import  React  from 'react';
import { Select, Button, Form, Row, Col, Input } from 'antd';
// import { formatMessage } from 'umi/locale';
import { SEARCH_FORM_GUTTER, SEARCH_FORM_COL } from '@/constants/form';
import global from '@/styles/common.less';
import styles from './Organization.less';

const { Option } = Select;

@Form.create({
	name:'motion-search-bar',
	wrappedComponentRef:true
})
class OrganizationSearchBar extends React.Component {

	render() {
		const { form : { getFieldDecorator }, handleReset, handleSearch } = this.props;
		return(
			<div className={`${global['search-bar']} ${styles['test-block']}`}>
				<Form layout="inline">
					<Row gutter={SEARCH_FORM_GUTTER.NORMAL}>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								label="组织"
							>
								{
									getFieldDecorator('keyword', {
										initialValue: ''
									})(
										<Input placeholder="编号/名称" />
									)
								}
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								label="属性"
							>
								{
									getFieldDecorator('orgTag', {
										initialValue: -1,
									})(
										<Select
											dropdownMatchSelectWidth={false}
											placeholder="请选择"
										>
											<Option value={-1}>
												全部
											</Option>
											<Option value={0}>
												门店
											</Option>
											<Option value={1}>
												部门
											</Option>
										</Select>
									)
								}
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.ONE_THIRD}>
							<Form.Item
								label="状态"
							>
								{
									getFieldDecorator('orgStatus', {
										initialValue: -1,
									})(
										<Select
											dropdownMatchSelectWidth={false}
											placeholder="请选择"
										>
											<Option value={-1}>
												全部
											</Option>
											<Option value={0}>
												使用中
											</Option>
											<Option value={1}>
												停用
											</Option>
										</Select>
									)
								}
							</Form.Item>
						</Col>
						<Col {...SEARCH_FORM_COL.OFFSET_TWO_THIRD}>
							<Form.Item className={global['query-item']}>
								<Button
									onClick={handleSearch}
									type="primary"
								>
									查询
								</Button>

								<Button
									onClick={handleReset}
									className={global['btn-margin-left']}
								>
									重置
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>

		);
	}
}

export default OrganizationSearchBar;