import * as Actions from '@/services/headAnglePassenger';
import { ERROR_OK } from '@/constants/errorCode';

export default {
	namespace: 'headAnglePassenger',
	state: {
		byFrequencyArray: [0, 0],
		byGenderArray: [0, 0],
		byAgeArray: [0, 0, 0, 0, 0, 0],
		shopList: [],
		shopListDataSource: [],
		shopPassengerData: []
	},
	effects: {
		*getHeadPassengerByRegular({ payload }, { put, call }) {
			const response = yield call(Actions.getHeadPassengerByRegular, payload);
			
			if (response && response.code === ERROR_OK) {
				let regularGuest = 0, newGuest = 0;
				const ageRangeGuest = [0, 0, 0, 0, 0, 0];
				const { data: { countList } } = response;
				console.log('data', countList);
				
				countList.forEach(item => {
					const { strangerUniqCount, regularUniqCount, ageRangeCode } = item;
					regularGuest += regularUniqCount;
					newGuest += strangerUniqCount;
					
					switch (ageRangeCode) {
						case 1:
						case 2:
						case 3:
							ageRangeGuest[0] = ageRangeGuest[0] + strangerUniqCount + regularUniqCount;
					}
					
					if(ageRangeCode > 3) {
						const index = ageRangeCode - 3;
						ageRangeGuest[index] = ageRangeGuest[index] + strangerUniqCount + regularUniqCount;
					}
				});
				
				yield put({
					type: 'updateState',
					payload: {
						byFrequencyArray: [regularGuest, newGuest],
						byAgeArray: ageRangeGuest
					}
				})
			}
		},
		*getHeadPassengerByGender({ payload }, { put, call }) {
			const response = yield call(Actions.getHeadPassengerByGender, payload);
			
			if (response && response.code === ERROR_OK) {
				let male = 0, female = 0;
				const { data: { countList } } = response;
				console.log('data', countList);
				
				countList.forEach(item => {
					const { uniqCount, gender } = item;
					if(gender === 1) {
						male += uniqCount;
					} else if(gender === 2) {
						female += uniqCount;
					}
				});
				
				yield put({
					type: 'updateState',
					payload: {
						byGenderArray: [female, male]
					}
				})
			}
		},
		*getHeadShopListByRegular({ payload }, { call, put }) {
			const response = yield call(Actions.getHeadShopListByRegular, payload);
			
			if(response && response.code === ERROR_OK) {
				const { data: { shopList } } = response;
				
				const shopArray = shopList.map(item => {
					const { shopName, shopId, countList } = item;
					let regularCount = 0, newCount = 0;
					countList.forEach(item => {
						newCount += item.strangerUniqCount;
						regularCount += item.regularUniqCount;
					});
					
					return {
						shopName,
						shopId,
						newCount,
						regularCount
					}
				});
				
				yield put({
					type: 'updateState',
					payload: {
						shopList: shopArray
					}
				});
			}
		},
		*getHeadShopListByGender({ payload }, { call, put }) {
			console.log('chosenGender')
			const response = yield call(Actions.getHeadShopListByGender, payload);
			
			if(response && response.code === ERROR_OK) {
				const { data: { shopList } } = response;
				
				const shopArray = shopList.map(item => {
					const { shopName, shopId, countList } = item;
					let femaleCount = 0, maleCount = 0;
					countList.forEach(item => {
						const { gender, uniqCount } = item;
						
						if(gender === 1) {
							maleCount += uniqCount;
						} else if(gender === 2) {
							femaleCount += uniqCount;
						}
					});
					
					return {
						shopName,
						shopId,
						femaleCount,
						maleCount
					}
				});
				
				yield put({
					type: 'updateState',
					payload: {
						shopList: shopArray
					}
				});
				
				console.log('shop', shopList)
			}
		},
		*getHeadShopListByAge({ payload }, { call, put }) {
			console.log('chosenGender')
			const response = yield call(Actions.getHeadShopListByRegular, payload);
			
			if(response && response.code === ERROR_OK) {
				const { data: { shopList } } = response;
				
				const shopArray = shopList.map(item => {
					const { shopName, shopId, countList } = item;
					let ageRangeArray = [0, 0, 0, 0, 0, 0];
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
							default: break;
						}
					});
					const [ageRangeOne, ageRangeTwo, ageRangeThree, ageRangeFour, ageRangeFive, ageRangeSix] = ageRangeArray;
					
					
					return {
						shopName,
						shopId,
						ageRangeOne,
						ageRangeTwo,
						ageRangeThree,
						ageRangeFour,
						ageRangeFive,
						ageRangeSix
					}
				});
				
				yield put({
					type: 'updateState',
					payload: {
						shopList: shopArray
					}
				});
				
				console.log('shop', shopList)
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
	}
}