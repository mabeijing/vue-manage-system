import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: '/table',
        method: 'get',
        params: query
    });
};

export const fetchUser = query => {
    return request({
        url: '/api/v1/user',
        method: 'post',
        data: query,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};