import { format } from '@konata9/milk-shake';
import { message } from 'antd';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import * as Actions from '@/services/serviceManagement';
import { ERROR_OK } from '@/constants/errorCode';

const handleOpt = (opt, value) => {
	const { key, date, status } = value;
	if(key !== '' && key !== undefined) {
		opt.keyword = key;
	}
	if(date !== undefined && date.length !== 0) {
		opt.date = date;
		opt.startTime = moment(date[0]).unix();
		opt.startTime = moment.unix(opt.startTime).startOf('day').unix();
		opt.endTime = moment(date[1]).unix();
		opt.endTime = moment.unix(opt.endTime).endOf('day').unix();
	}
	if(status !== 0) {
		opt.status = status;
	}
};

export default {
	namespace: 'serviceManagement',
	state: {
		searchValue: {
			key: '',
			status: 0,
			date: [],
		},
		serviceList: {
			totalCount: 0,
			list: [],
		},
		serviceDetail: {
		
		}
	},
	effects: {
		*getServiceList({ payload }, { call, put, select }) {
			const { searchValue } = yield select(state => state.serviceManagement);
			const { search, pageNum, pageSize } = payload;
			let response;
			const opt = {
				pageSize,
				pageNum,
			};
			
			if(search === null) {
				handleOpt(opt, searchValue);
				response = yield call(Actions.getServiceList, opt);
			} else {
				handleOpt(opt, search);
				yield put({
					type: 'updateState',
					payload: {
						searchValue: search,
					},
				});
				response = yield call(Actions.getServiceList, opt);
			}
			
			if(response && response.code === ERROR_OK) {
				response = format('toCamel')(response);
				const { data: { serviceList, totalCount }} = response;
				yield put({
					type: 'updateState',
					payload: {
						serviceList: {
							list: serviceList,
							totalCount,
						},
					},
				});
			} else {
				message.error(formatMessage({id: 'serviceManagement.error.getList'}));
			}
		},
		*getServiceDetail({ payload }, { call, put}) {
			const { serviceNo } = payload;
			const response = yield call(Actions.getServiceDetail, { service_no: serviceNo});
			
			if(response && response.code === ERROR_OK) {
				const { data } = format('toCamel')(response);
				yield put({
					type: 'updateState',
					payload: {
						serviceDetail: data
					}
				});
			} else {
				yield put({
					type: 'updateState',
					payload: {
						serviceDetail: {}
					}
				});
				message.error(formatMessage({id: 'serviceManagement.error.getDetail'}));
			}
		},
	},
	reducers: {
		updateState(state, action) {
			return {
				...state,
				...action.payload,
			};
		},
	},
};