import React from 'react';
import { Card, Table, Form, Row, Col, Select, Button, Icon } from 'antd';
import Pie from './Pie';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import { connect } from 'dva';
import { FORM_FORMAT, SEARCH_FORM_COL } from '@/constants/form';
import styles from './index.less';

const GUEST_OPTIONS = {
	TITLE: ['新老占比', '性别占比', '年龄占比'],
	COLOR_ARRAY: [
		['rgba(90, 151, 252, 1)', 'rgba(255, 128, 0, 1)'],
		['rgba(255, 102, 102, 1)', 'rgba(75, 122, 250, 1)'],
		[
			'rgba(75, 192, 250, 1)',
			'rgba(75, 133, 250, 1)',
			'rgba(122, 98, 245, 1)',
			'rgba(184, 122, 245, 1)',
			'rgba(255, 102, 128, 1)',
			'rgba(255, 136, 77, 1)'
		]
	]
};
const GROUP_BY = [
	[
		{label: '熟客', key: 'regularCount'}, {label: '新客', key: 'newCount'}],
	[
		{label: '女性', key: 'femaleCount'}, {label: '男性', key: 'maleCount'}],
	[
		{label: '18岁以下', key: ''},
		{label: '19-28岁', key: ''},
		{label: '29-35岁', key: ''},
		{label: '36-45岁', key: ''},
		{label: '46-55岁', key: ''},
		{label: '56岁以上', key: ''},
		]
]
const { Option } = Select;

@Form.create()
@connect(
	state => ({
		headPassenger: state.headAnglePassenger,
	}),
	dispatch => ({
		getHeadPassengerByRegular: payload => dispatch({ type: 'headAnglePassenger/getHeadPassengerByRegular', payload}),
		getHeadPassengerByGender: payload => dispatch({ type: 'headAnglePassenger/getHeadPassengerByGender', payload}),
		getHeadShopListByRegular: payload => dispatch({ type: 'headAnglePassenger/getHeadShopListByRegular', payload}),
		getHeadShopListByGender: payload => dispatch({ type: 'headAnglePassenger/getHeadShopListByGender', payload}),
	})
)
class BizchartDemo extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			chosenCard: 0,
			currentOptions: GROUP_BY[0],
			dataSource: []
		};
		this.columns = [
			{
				title: '排名',
				dataIndex: 'sortIndex',
				key: 'sortIndex',
				render: key => <span>{key}</span>,
			},
			{
				title: '门店',
				dataIndex: 'shopName',
				key: 'shopName',
			},
			{
				title: 'compareItem',
				dataIndex: 'compareItem',
			},
			{
				title: '操作',
				key: 'operation',
				render: operation => <a href={operation}>查看门店详情</a>,
			},
		];
		
		this.shopListOptions = JSON.parse(localStorage.getItem('__shop_list__'));
	}
	
	componentDidMount() {
		const { getHeadPassengerByRegular, getHeadPassengerByGender, getHeadShopListByGender, getHeadShopListByRegular } = this.props;
		getHeadPassengerByGender({ startTime: moment().format('YYYY-MM-DD'), type: 3 });
		getHeadPassengerByRegular({ startTime: moment().format('YYYY-MM-DD'), type: 3 });
		// getHeadShopListByGender({ startTime: moment().format('YYYY-MM-DD'), type: 3 });
		getHeadShopListByRegular({ startTime: moment().format('YYYY-MM-DD'), type: 3 });
	}
	
	handleChosenCardChange = index => {
		const { form: { setFieldsValue }, getHeadShopListByGender, getHeadShopListByRegular } = this.props;
		const { chosenCard } = this.state;
		
		if(index !== chosenCard) {
			switch(chosenCard) {
				case 0:
					getHeadShopListByRegular({ startTime: moment().format('YYYY-MM-DD'), type: 3 });
					break;
				case 1:
					getHeadShopListByGender({ startTime: moment().format('YYYY-MM-DD'), type: 3 });
					break;
			}
			this.setState({
				chosenCard: index,
				currentOptions: GROUP_BY[index],
			});
			setFieldsValue({
				shopId: -1,
				guest: GROUP_BY[index][0].label
			})
		}
	};
	
	
	handlePieDataSource = (index) => {
		const { headPassenger: { byFrequencyArray, byGenderArray, byAgeArray } } = this.props;
		const valueArray = [byFrequencyArray, byGenderArray, byAgeArray];
		const dataArray = valueArray[index].map((item, itemIndex) => ({
			name: GROUP_BY[index][itemIndex].label,
			value: item
		}));
		
		return dataArray;
	};
	
	handleTableDataSource = () => {
		const { form: { getFieldsValue }, headPassenger: { shopList } } = this.props;
		const { currentOptions } = this.state;
		
		let keyword = '';
		
		console.log('ss', getFieldsValue());
		const { shopId, guest } = getFieldsValue();
		let resultArray = shopList.map(item => Object.assign({}, item));
		
		currentOptions.forEach(item => {
			if(item.label === guest ) {
				keyword = item.key;
			}
		});
		
		if(shopId !== -1 && shopId !== undefined) resultArray = resultArray.filter(item => item.shopId === shopId);
		
		resultArray.sort((a, b) =>
			b[keyword] - a[keyword]
		);
		
		resultArray.forEach((item, index) => {
			item.sortIndex = index + 1;
		})
		
		console.log(resultArray, 'result')
		this.columns[2] = {
			title: guest,
			dataIndex: keyword
		};
		this.setState({ dataSource: resultArray });
	};
	
	handleSearch = () => {
		this.handleTableDataSource()
	};
	
	render() {
		// todo pie外面的卡片可以切出来作为组件
		const { headPassenger: { byFrequencyArray, byGenderArray, shopList }, form: { getFieldDecorator } } = this.props;
		const { chosenCard, currentOptions, dataSource } = this.state;
		console.log('ss', dataSource)
		
		return (
			<div>
				<div className={styles['overview-bar']}>
				</div>
				<Card title='客群分布'>
					<div className={styles.guest}>
						{
							GUEST_OPTIONS.TITLE.map((item, index) =>
								<div
									className={styles['pie-card']}
									key={index}
									style={chosenCard === index ? {border: '1px solid  rgba(255,129,51,1)'} : {}}
									onClick={() => {this.handleChosenCardChange(index)}}
								>
									<Pie
										data={this.handlePieDataSource(index)}
										colorArray={GUEST_OPTIONS.COLOR_ARRAY[index]}
									/>
								</div>
							)
						}
					</div>
					<div className={styles['search-bar']}>
						<Form layout="inline">
							<Row gutter={FORM_FORMAT.gutter}>
								<Col {...SEARCH_FORM_COL.ONE_THIRD}>
									<Form.Item label={'门店'}>
										{ getFieldDecorator('shopId', {
											initialValue: -1
										})(
											<Select>
												<Option value={-1} key={-1}>全部门店</Option>
												{
													this.shopListOptions.map(item =>(
														<Option value={item.shopId} key={item.shopId}>{item.shopName}</Option>
													))
												}
											</Select>
										)}
									</Form.Item>
								</Col>
								<Col {...SEARCH_FORM_COL.ONE_THIRD}>
									<Form.Item label={'客群'}>
										{
											getFieldDecorator('guest', {
											
											})(
												<Select>
													{
														currentOptions.map((item, index) =>(
															<Option value={item.label} key={index}>{item.label}</Option>
														))
													}
												</Select>
											)
										}
									</Form.Item>
								</Col>
								<Col {...SEARCH_FORM_COL.ONE_THIRD}>
									<Form.Item className={styles['query-item']}>
										<Button type="primary" onClick={this.handleSearch}>
											{formatMessage({ id: 'btn.query' })}
										</Button>
										<Button className={styles['btn-margin-left']} onClick={this.handleReset}>
											{formatMessage({ id: 'btn.reset' })}
										</Button>
									</Form.Item>
								</Col>
							</Row>
						</Form>
						<Button icon='download' type='primary'>EXCEL</Button>
					</div>
					<Table
						dataSource={dataSource}
						columns={this.columns}
						pagination={{
							pageSize: 5,
							hideOnSinglePage: true
						}}
					/>
				</Card>
			</div>
			
		);
	}
}


export default BizchartDemo;