export default {
    namespace: 'networkSetting',
    state: {},
    reducers: {
        readData: () => ({
            wifiId: '1',
            wifiName: 'TP_Link_166',
        }),
        updateData: () => {},
    },
    effects: {
        *read(action, { put }) {
            yield put({
                type: 'readData',
            });
        },
        // *update(action, { put, select }) {

        // },
        // *loadList(action, { put, select }){

        // },
        // *connect(action, { put, select }){

        // }
    },
};
