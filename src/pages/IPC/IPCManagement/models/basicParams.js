// import { message } from 'antd';
export default {
	namespace: 'basicParams',
	state:{},
	reducers:{
		readData: (state, action) => {
			const { payload } = action;

			return {
				...payload
			};
		},
		// updateData: (state,action) => {

		// }
	},
	// effects:{
	// 	*read(action, { put, select }) {
			
	// 	},
	// 	*update(action, {put,select }){

	// 	}
	// }
};