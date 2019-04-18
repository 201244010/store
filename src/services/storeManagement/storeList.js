import { customizeFetch } from '@/utils/fetch';
// import {paramsDeserialization, paramsSerialization} from '@/utils/utils';

const fetchApi = customizeFetch('api/shop');

// 获得列表数据项
export const getList = (options = {}) => {
  const opt = {
    body: {
      ...options,
    },
  };
  fetchApi('getList', opt).then(response => {
    console.log(response);
  });
};

// 获得列表下拉框选项
export const getListSelectOption = (options = {}) => {
  const opt = {
    body: {
      ...options,
    },
  };
  fetchApi('getListSelection', opt).then(response => {
    console.log(response);
  });
};

// 提交新建门店接口
export const createStore = (options = {}) => {
  const opt = {
    body: {
      ...options,
    },
  };
  fetchApi('create', opt).then(response => {
    console.log(response);
  });
};

// 省市区下拉框的接口
export const createStoreSelection = (options = {}) => {
  const opt = {
    body: {
      ...options,
    },
  };
  fetchApi('selection', opt).then(response => {
    console.log(response);
  });
};

// 查看门店信息
export const storeInformation = (options = {}) => {
  const opt = {
    body: {
      ...options,
    },
  };
  fetchApi('getInfo', opt).then(response => {
    console.log(response);
  });
};
