import fetch from 'dva/fetch';
import { routerRedux } from 'dva/router';
import store from '../index';

import { build } from '../common/SystemParam';

let BASE_URL = ''
if (build === 'production') {
  // 远端
  BASE_URL = 'http://test.5izjb.com:8001';
  document.title ="众借帮--客户测试环境";
} else if (build === 'test') { 
  // 测试
  BASE_URL = 'http://192.168.1.59:8001';
  document.title ="众借帮--本地测试环境";
} else if (build === 'local') {
  /*开发配置*/
  BASE_URL = 'http://192.168.1.59:8001';
  document.title ="众借帮--本地测试环境"; 
} else if (build === 'ys') {
  BASE_URL = 'http://193.112.97.50:8001';
  document.title ="众借帮--演示测试环境"; 
}
const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};
function checkStatus(response) { 
  const { dispatch } = store;
  if (response.status === 288) {
    dispatch({ type: 'login/logout' });
    dispatch(routerRedux.push('/index/login'));
    throw {name: 288};
  }
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  // const error = new Error(errortext);
  // error.name = response.status;
  // error.response = response;
  // global.error = error;
  // throw error;
  return {code: 999,msg:  codeMessage[response.status] || response.statusText}
}

export const req = {
  get: (url, param) => {
    if (url.substring(0, 1) == '/') {
      url = BASE_URL + url;
    } else {
      url = BASE_URL + '/' + url;
    }

    // 判断上一次请求的时间
    let token = '';
    if (localStorage.getItem('accessTokenCompany')) {
      const webTokenObj = JSON.parse(localStorage.getItem('accessTokenCompany'));
      token = webTokenObj.webToken ? webTokenObj.webToken : '';
    }
    const Options = {
      credentials: 'include',
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'zjb-user-token': token,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, HEAD',
        Origin: '*',
      }
    };
    if (param) {
      url += '?' + serialize(param);
    }
    return fetch(url, Options)
      .then(checkStatus)
      .then((response) => {
        console.log(response);
        if (response.code === 999) {
          return response;
        }
        if (response.status === 204) {
          return response.text();
        }
        return response.json();
      })
  },
  post: (url, param) => {
    if (url.substring(0, 1) == '/') {
      url = BASE_URL + url;
    } else {
      url = BASE_URL + '/' + url;
    }
    // 判断上一次请求的时间
    let token = '';
    if (localStorage.getItem('accessTokenCompany')) {
      const webTokenObj = JSON.parse(localStorage.getItem('accessTokenCompany'));
      token = webTokenObj.webToken ? webTokenObj.webToken : '';
    }
    const newOptions = {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'zjb-user-token': token,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, HEAD',
        Origin: '*'
      },
      body: JSON.stringify(param)
    };
    return fetch(url, newOptions)
      .then(checkStatus)
      .then((response) => {
        console.log(response);
        if (response.code === 999) {
          return response;
        }
        if (response.status === 204) {
          return response.text();
        }
        return response.json();
      })
  }
}

function serialize(data) {
  if (!data) return '';
  var pairs = [];
  for (var name in data) {
    if (!data.hasOwnProperty(name)) continue;//排除嵌套对象
    if (typeof data[name] === 'function')
      continue;//排除操作数是函数 
    var value = data[name].toString();
    name = encodeURIComponent(name);
    value = encodeURIComponent(value);
    pairs.push(name + '=' + value);
  }
  return pairs.join('&');
}