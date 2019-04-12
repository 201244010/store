import { customizeFetch } from '@/utils/fetch';

const fetchApi = customizeFetch('device/ap');

export const fetchBaseStations = options => {
  const opts = {
    method: 'POST',
    body: {
      keyword: options.keyword,
      status: options.status || -1,
      page_num: options.current,
      page_size: options.pageSize,
    },
  };

  return fetchApi('getList', opts).then(response => response.json());
};

export const getBaseStationDetail = options => {
  const opts = {
    method: 'POST',
    body: {
      ...options,
    },
  };

  return fetchApi('getInfo', opts).then(response => response.json());
};

export const deleteBaseStation = options => {
  const opts = {
    method: 'POST',
    body: {
      ...options,
    },
  };

  return fetchApi('delete', opts).then(response => response.json());
};
