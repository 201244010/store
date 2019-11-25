import React from 'react';
import { Row, Col, Card, Button } from 'antd';
import { formatMessage } from 'umi-plugin-locale';
import BindModal from './bindModal';
import styles from './CloudStorage.less';

// 1：一个月；2：半年； 3: 一年
const EXPIRE_TIME_TYPE = {
	ONE_MONTH: 1,
	HALF_A_YEAR: 2,
	ONE_YEAR: 3
};


const seventDaysServiceList = [
	{
		productNo:'YCC0001',
		price:'20',
		isFree:true,
		type:EXPIRE_TIME_TYPE.ONE_MONTH, 
	},
	{
		productNo:3,
		price:'119',
		isFree: false,
		type: EXPIRE_TIME_TYPE.ONE_YEAR,
		pricePerDay:0.32
	},
	{
		productNo:2,
		price:'69',
		isFree: false,
		type: EXPIRE_TIME_TYPE.HALF_A_YEAR,
		pricePerDay:0.38
	}
];

const thirtyDaysServiceList = [
	{
		productNo:5,
		price:'299',
		isFree: false,
		type: EXPIRE_TIME_TYPE.ONE_YEAR
	},
	{
		productNo:4,
		price: 159,
		isFree: false,
		type: EXPIRE_TIME_TYPE.HALF_A_YEAR
	}
];

class CloudStorage extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			productNo: '',
			modalVisible: false,
			sn:''
		};
	}

	componentDidMount(){
		const { location } = this.props;
		const { query: { sn } } = location;
		this.setState({
			sn
		});
	}

	subscriptionHandler = (productNo) => {
		this.setState({
			productNo,
			modalVisible: true
		});
	}

	handleCancel = () => {
		this.setState({
			modalVisible: false
		});
	}

	render(){
		const { productNo, modalVisible, sn } = this.state;
		return(
			<div className={styles['cloud-storage-container']}>
				<div className={styles['page-title']}>{formatMessage({id: 'cloudStorage.title'})}</div>
				<div className={styles['adv-container']}>
					<Row gutter={24}>
						<Col span={6}>
							<Card className={styles['adv-card']} bordered={false}>
								<div className={styles.title}>
									<div className={styles['title-icon']} />
									<div className={styles['title-text']}>
										<span>{formatMessage({id: 'cloudStorage.adv.price'})}</span>
									</div>
								</div>
								<div className={styles['adv-detail']}>
									<p>{formatMessage({id: 'cloudStorage.price.detail'})}</p>
								</div>
								<div className={`${styles['bg-img']} ${styles.prince}`} />
							</Card>
						</Col>
						<Col span={6}>
							<Card className={styles['adv-card']} bordered={false}>
								<div className={styles.title}>
									<div className={styles['title-icon']} />
									<div className={styles['title-text']}>
										<span>{formatMessage({id: 'cloudStorage.adv.loss'})}</span>
									</div>
								</div>
								<div className={styles['adv-detail']}>
									<p>{formatMessage({id: 'cloudStorage.loss.detail'})}</p>
								</div>
								<div className={`${styles['bg-img']} ${styles.loss}`} />
							</Card>
						</Col>
						<Col span={6}>
							<Card className={styles['adv-card']} bordered={false}>
								<div className={styles.title}>
									<div className={styles['title-icon']} />
									<div className={styles['title-text']}>
										<span>{formatMessage({id: 'cloudStorage.adv.convenience'})}</span>
									</div>
								</div>
								<div className={styles['adv-detail']}>
									<p>{formatMessage({id: 'cloudStorage.convenience.detail'})}</p>
								</div>
								<div className={`${styles['bg-img']} ${styles.convenience}`} />
							</Card>
						</Col>
						<Col span={6}>
							<Card className={styles['adv-card']} bordered={false}>
								<div className={styles.title}>
									<div className={styles['title-icon']} />
									<div className={styles['title-text']}>
										<span>{formatMessage({id: 'cloudStorage.adv.safe'})}</span>
									</div>
								</div>
								<div className={styles['adv-detail']}>
									<p>{formatMessage({id: 'cloudStorage.safe.detail'})}</p>
								</div>
								<div className={`${styles['bg-img']} ${styles.safe}`} />
							</Card>
						</Col>
					</Row>
				</div>
				<Card className={styles['service-container']} bordered={false}>
					<div className={styles['service-wrapper']}>
						<div className={styles['sevent-day']}>
							<div className={styles.title}>
								<span className={styles['title-text']}>{formatMessage({id:'cloudStorage.seven.days.service'})}</span>
							</div>
							<div className={styles.services}>
								{seventDaysServiceList.map((item,index) => {
									
									if(item.isFree){
										return(
											<div className={styles['service-content']} key={`cloudStorage${index}`}>
												<div className={`${styles.price} ${styles['free-price']}`}>
													<span>¥0</span>
													<div className={styles.tag} />
													<div className={styles['init-price']}>
														<div className={styles['del-line']} />
														<div className={styles['init-price-content']}>¥{item.price}</div>
													</div>
												</div>
												<div className={styles['expire-time']}>
													<span>{formatMessage({id: 'cloudStorage.validity.one.month'})}</span>
												</div>
												<Button onClick={() => this.subscriptionHandler(item.productNo)} className={`${styles['sub-button']} ${styles.normal}`} type="primary">免费试用</Button>
											</div>
										);
									}
									return(
										<div className={styles['service-content']} key={`cloudStorage${index}`}>
											<div className={styles.price}>¥<span>{item.price}</span></div>
											<div className={styles['expire-time']}>
												{
													(() => {
														switch(item.type){
															case EXPIRE_TIME_TYPE.ONE_MONTH:
																return(
																	<span>{formatMessage({id: 'cloudStorage.validity.one.month'})}</span>
																);
															case EXPIRE_TIME_TYPE.HALF_A_YEAR:
																return(
																	<span>{formatMessage({id: 'cloudStorage.validity.half.year'})}</span>
																);
															case EXPIRE_TIME_TYPE.ONE_YEAR:
																return(
																	<span>{formatMessage({id:'cloudStorage.validity.one.year'})}</span>
																);
															default:
																return(
																	<span>{formatMessage({id: 'cloudStorage.unknown'})}</span>
																);
														}
													})()
												}
											</div>
											<Button className={`${styles['sub-button']} ${styles.disabled}`} type="primary" disabled>{formatMessage({id:'cloudStorage.coming.soon'})}</Button>
											{item.pricePerDay && <div className={styles.tips}>仅{item.pricePerDay}{formatMessage({id:'cloudStorage.money.per.day'})}</div>}
										</div>
									);
									
								})}
							</div>
						</div>
						<div className={styles['thirty-day']}>
							<div className={styles.title}>
								<span className={styles['title-text']}>{formatMessage({id:'cloudStorage.thirty.days.service'})}</span>
							</div>
							<div className={styles.services}>
								{thirtyDaysServiceList.map((item,index) => (
									<div className={styles['service-content']} key={`cloudStorage${index}`}>
										<div className={styles.price}>¥<span>{item.price}</span></div>
										<div className={styles['expire-time']}>
											{
												(() => {
													switch(item.type){
														case EXPIRE_TIME_TYPE.ONE_MONTH:
															return(
																<span>{formatMessage({id:'cloudStorage.validity.one.month'})}</span>
															);
														case EXPIRE_TIME_TYPE.HALF_A_YEAR:
															return(
																<span>{formatMessage({id: 'cloudStorage.validity.half.year'})}</span>
															);
														case EXPIRE_TIME_TYPE.ONE_YEAR:
															return(
																<span>{formatMessage({id: 'cloudStorage.validity.one.year'})}</span>
															);
														default:
															return(
																<span>{formatMessage({id: 'cloudStorage.unknown'})}</span>
															);
													}
												})()
											}
										</div>
										<Button className={`${styles['sub-button']} ${styles.disabled}`} type="primary" disabled>{formatMessage({id:'cloudStorage.coming.soon'})}</Button>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className={styles['service-tips']}>
						<p className={styles['service-tip']}>{formatMessage({id: 'cloudStorage.service.tips.first'})}</p>
						<p className={styles['service-tip']}>{formatMessage({id: 'cloudStorage.service.tips.second'})}</p>
						<p className={styles['service-tip']}>{formatMessage({id: 'cloudStorage.service.tips.third'})}</p>
						<p className={styles['service-tip']}>{formatMessage({id: 'cloudStorage.service.tips.fourth'})}</p>
					</div>
				</Card>
				{productNo !== '' && <BindModal productNo={productNo} visible={modalVisible} handleCancel={this.handleCancel} sn={sn} />}
			</div>
		);
	}
}

export default CloudStorage;