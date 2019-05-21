export default {
    namespace: 'cloudService',
    state: {},
    reducers: {
        readData: () => ({
            isOpen: true,
            expiredDate: '2019-12-30',
            isExpired: false,
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

        // }
    },
};
