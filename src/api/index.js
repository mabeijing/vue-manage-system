import request from '../utils/request';
import qs from 'qs';

export const fetchData = query => {
    return request({
        url: '/api/v1/demo',
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

// export const fetchUser = query => {
//     return request({
//         url: '/user/info',
//         method: 'post',
//         data: qs.stringify(query),
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     });
// };

export const fetchAllCase = () => {
    return request({
        url: '/api/v1/case',
        method: 'get'
    });
};
