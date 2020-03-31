import moment from 'moment';
import * as Actions from '@/services/headAnglePassenger';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'headAnglePassenger',
	state: {
		byFrequencyArray: [0, 0],
		byGenderArray: [0, 0],
		byAgeArray: [0, 0, 0, 0, 0, 0],
		earlyByFrequencyArray: [0, 0],
		earlyByAgeArray: [0, 0],
		shopList: [],
		shopListDataSource: [],
		shopPassengerData: [],
		passengerCount: 0,
		earlyPassengerCount: 0,
		passHeadCount: 0,
		earlyPassHeadCount: 0,
		mainGuestList: [],
		uniqCountTotal: 0,
	},
	effects: {
		*getHeadPassengerSurvey({ payload }, { put, call }) {
			const response = yield call(Actions.getHeadPassengerSurvey, payload);
			if (response && response.code === ERROR_OK) {
				const {
					data: {
						passengerCount = 0, // 进店客流数
						earlyPassengerCount = 0, // 前一日进店客流数
						passHeadCount = 1, // 路过人头数，因为需要计算进店率，分母不能为0
						earlyPassHeadCount = 1, // 前一日路过人头数，因为需要计算进店率，分母不能为0
					} = {},
				} = response;

				yield put({
					type: 'updateState',
					payload: {
						passengerCount,
						earlyPassengerCount,
						passHeadCount,
						earlyPassHeadCount,
					},
				});
			}
		},
		*getHeadPassengerByRegular({ payload }, { put, call }) {
			const { type } = payload;
			const earlyTime = {
				1: moment()
					.subtract(2, 'days')
					.format('YYYY-MM-DD'),
				2: moment()
					.subtract(1, 'weeks')
					.format('YYYY-MM-DD'),
				3: moment()
					.subtract(1, 'months')
					.format('YYYY-MM-DD'),
			};
			const response = yield call(Actions.getHeadPassengerByRegular, payload);
			if (response && response.code === ERROR_OK) {
				let regularGuest = 0;
				let newGuest = 0;
				const ageRangeGuest = [0, 0, 0, 0, 0, 0];
				const {
					data: { countList },
				} = response;

				countList.forEach(item => {
					const { strangerUniqCount, regularUniqCount, ageRangeCode } = item;
					regularGuest += regularUniqCount;
					newGuest += strangerUniqCount;

					// eslint-disable-next-line default-case
					switch (ageRangeCode) {
						case 1:
						case 2:
						case 3:
							ageRangeGuest[0] =
								ageRangeGuest[0] + strangerUniqCount + regularUniqCount;
					}

					if (ageRangeCode > 3) {
						const index = ageRangeCode - 3;
						ageRangeGuest[index] =
							ageRangeGuest[index] + strangerUniqCount + regularUniqCount;
					}
				});

				yield put({
					type: 'updateState',
					payload: {
						byFrequencyArray: [regularGuest, newGuest],
						byAgeArray: ageRangeGuest,
					},
				});
			}

			// 根据type来请求比较的数据，如：上面请求昨日的数据，下面请求前天的数据；上面请求本周的数据，下面请求上周的数据；
			const earlyResponse = yield call(Actions.getHeadPassengerByRegular, {
				startTime: earlyTime[type],
				type,
			});
			if (earlyResponse && earlyResponse.code === ERROR_OK) {
				let regularGuest = 0;
				let newGuest = 0;
				const ageRangeGuest = [0, 0, 0, 0, 0, 0];
				const {
					data: { countList },
				} = earlyResponse;

				countList.forEach(item => {
					const { strangerUniqCount, regularUniqCount, ageRangeCode } = item;
					regularGuest += regularUniqCount;
					newGuest += strangerUniqCount;

					// eslint-disable-next-line default-case
					switch (ageRangeCode) {
						case 1:
						case 2:
						case 3:
							ageRangeGuest[0] =
								ageRangeGuest[0] + strangerUniqCount + regularUniqCount;
					}

					if (ageRangeCode > 3) {
						const index = ageRangeCode - 3;
						ageRangeGuest[index] =
							ageRangeGuest[index] + strangerUniqCount + regularUniqCount;
					}
				});

				yield put({
					type: 'updateState',
					payload: {
						earlyByFrequencyArray: [regularGuest, newGuest],
						earlyByAgeArray: ageRangeGuest,
					},
				});
			}
		},
		*getHeadPassengerByGender({ payload }, { put, call }) {
			const response = yield call(Actions.getHeadPassengerByGender, payload);

			if (response && response.code === ERROR_OK) {
				let male = 0;
				let female = 0;
				const {
					data: { countList = [] },
				} = response;

				countList.forEach(item => {
					const { uniqCount, gender } = item;
					if (gender === 1) {
						male += uniqCount;
					} else if (gender === 2) {
						female += uniqCount;
					}
				});
				const uniqCountTotal = male + female;

				let uniqCount_male = 0;
				let uniqCount_female = 0;
				let regularUniqCount_male = 0;
				let regularUniqCount_female = 0;
				countList.map(item => {
					if(item.ageRangeCode <= 3) {
						if(item.gender === 1) {
							uniqCount_male += item.uniqCount;
							regularUniqCount_male += item.regularUniqCount;
						} else {
							uniqCount_female += item.uniqCount;
							regularUniqCount_female += item.regularUniqCount;
						}
					}
				});

				const mainGuestList = countList.filter(item => item.ageRangeCode > 3);
				mainGuestList.push(
					{
						ageRangeCode: 3,
						gender: 1,
						uniqCount: uniqCount_male,
						regularUniqCount: regularUniqCount_male,
					},
					{
						ageRangeCode: 3,
						gender: 2,
						uniqCount: uniqCount_female,
						regularUniqCount: regularUniqCount_female,
					}
				);
				const finalMainGuestList = mainGuestList.sort((a, b) => b.uniqCount - a.uniqCount).slice(0, 3).filter(item => item.uniqCount > 0);

				yield put({
					type: 'updateState',
					payload: {
						byGenderArray: [female, male],
						mainGuestList: finalMainGuestList,
						uniqCountTotal,
					},
				});
			}
		},
		*getHeadShopListByRegular({ payload }, { call, put }) {
			const response = yield call(Actions.getHeadShopListByRegular, payload);

			if (response && response.code === ERROR_OK) {
				const {
					data: { shopList },
				} = response;

				const shopArray = shopList.map(item => {
					const { shopName, shopId, countList } = item;
					let regularCount = 0;
					let newCount = 0;
					countList.forEach(i => {
						newCount += i.strangerUniqCount;
						regularCount += i.regularUniqCount;
					});

					return {
						shopName,
						shopId,
						newCount,
						regularCount,
					};
				});

				yield put({
					type: 'updateState',
					payload: {
						shopList: shopArray,
					},
				});
			}
		},
		*getHeadShopListByGender({ payload }, { call, put }) {
			const response = yield call(Actions.getHeadShopListByGender, payload);

			if (response && response.code === ERROR_OK) {
				const {
					data: { shopList },
				} = response;

				const shopArray = shopList.map(i => {
					const { shopName, shopId, countList } = i;
					let femaleCount = 0;
					let maleCount = 0;
					countList.forEach(item => {
						const { gender, uniqCount } = item;

						if (gender === 1) {
							maleCount += uniqCount;
						} else if (gender === 2) {
							femaleCount += uniqCount;
						}
					});

					return {
						shopName,
						shopId,
						femaleCount,
						maleCount,
					};
				});

				yield put({
					type: 'updateState',
					payload: {
						shopList: shopArray,
					},
				});

				console.log('shop', shopList);
			}
		},
		*getHeadShopListByAge({ payload }, { call, put }) {
			console.log('chosenGender');
			const response = yield call(Actions.getHeadShopListByRegular, payload);

			if (response && response.code === ERROR_OK) {
				const {
					data: { shopList },
				} = response;

				const shopArray = shopList.map(i => {
					const { shopName, shopId, countList } = i;
					const ageRangeArray = [0, 0, 0, 0, 0, 0];
					countList.forEach(item => {
						const { ageRangeCode, strangerUniqCount, regularUniqCount } = item;
						const total = strangerUniqCount + regularUniqCount;

						switch (ageRangeCode) {
							case 1:
							case 2:
							case 3:
								ageRangeArray[0] += total;
								break;
							case 4:
							case 5:
							case 6:
							case 7:
							case 8:
								ageRangeArray[ageRangeCode - 3] += total;
								break;
							default:
								break;
						}
					});
					const [
						ageRangeOne,
						ageRangeTwo,
						ageRangeThree,
						ageRangeFour,
						ageRangeFive,
						ageRangeSix,
					] = ageRangeArray;

					return {
						shopName,
						shopId,
						ageRangeOne,
						ageRangeTwo,
						ageRangeThree,
						ageRangeFour,
						ageRangeFive,
						ageRangeSix,
					};
				});

				yield put({
					type: 'updateState',
					payload: {
						shopList: shopArray,
					},
				});

				console.log('shop', shopList);
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
