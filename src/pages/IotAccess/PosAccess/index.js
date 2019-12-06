import React, {Component} from 'react';
import {Card, Col, Row} from 'antd';
import {connect} from 'dva';
import { formatMessage } from 'umi/locale';
// import SearchForm from './SearchForm';
import SearchResult from './SearchResult';
import * as styles from './index.less';

@connect(
	state => ({
		iot: state.iot,
	}),
	dispatch => ({
		changeSearchFormValue: payload => dispatch({ type: 'iot/changeSearchFormValue', payload }),
		clearSearch: () => dispatch({ type: 'iot/clearSearch' }),
		fetchPosList: payload => dispatch({ type: 'iot/fetchPosList', payload }),
	})
)
class PosAccess extends Component {
	componentDidMount() {
		const {fetchPosList} = this.props;
		fetchPosList();
	}

	render() {
		const {iot: {loading, data}} = this.props;

		return (
			<div>
				<div className={styles.overview}>
					<Row gutter={20}>
						<Col span={12}>
							<Card style={{ width: '100%', minHeight: '167px' }}>
								<h4 className={styles['card-title']}>
									{formatMessage({ id: 'iot.pos.status.active' })}
								</h4>
								<div className={styles['overview-count']}>
									{data.filter(item => item.active_status).length} <span className={styles.unit}>{formatMessage({id: 'iot.pos.unit'})}</span>
								</div>
							</Card>
						</Col>
						<Col span={12}>
							<Card style={{ width: '100%', minHeight: '167px' }}>
								<h4 className={`${styles['card-title']} ${styles.disabled}`}>
									{formatMessage({ id: 'iot.pos.status.disabled' })}
								</h4>
								<div className={styles['overview-count']}>
									{data.filter(item => !item.active_status).length} <span className={styles.unit}>{formatMessage({id: 'iot.pos.unit'})}</span>
								</div>
							</Card>
						</Col>
					</Row>
				</div>
				<Card bordered={false}>
					{/* <SearchForm */}
					{/* {...{ */}
					{/* searchFormValues: o => o, */}
					{/* changeSearchFormValue: o => o, */}
					{/* clearSearch: o => o, */}
					{/* fetchElectricLabels: o => o, */}
					{/* }} */}
					{/* /> */}
					<SearchResult loading={loading} data={data} />
				</Card>
			</div>
		);
	}
}

export default PosAccess;
