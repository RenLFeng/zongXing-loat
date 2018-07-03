import { routerRedux } from 'dva/router';
import {userLogin} from '../services/api';
import {message} from 'antd';

export default {
  namespace: 'login',
  state: {
    status: localStorage.getItem('accessToken')? true: false,
    submitting: false,
    nickName: localStorage.getItem('accessToken')?JSON.parse(localStorage.getItem('accessToken')).nickName:"",
    baseData: { // 登录基础数据
      userSecurityCenter: {
        
      }
    },
    socketData: null, // 长连接对象
    hobbyList: [], // 兴趣
  },
  effects: {
    *hobby({ payload }, { call, put }) {
      yield put({
        type: 'saveHobby',
        payload: payload.hobbyList
      });
    },
    *login({ payload, passwordError }, { call, put }) {
      //开始请求之前，请求状态修改为正在请求
      yield put({
        type: 'changeSubmitting'
      });
      try {
        //向后台请求登录接口
        const response = yield call(userLogin, payload);
        //请求结束，请求状态修改为未请求状态
        //登录成功做的操作
        if (response.code === 0) {
          const access = {webToken:response.data.webToken,nickName: response.data.nickName};
          localStorage.setItem('accessToken', JSON.stringify(access));
          yield put(routerRedux.push('/'));
          yield put({
            type: 'changeLoginStatus',
            payload: {
              nickName: response.data.nickName,
              code: true
            },
          });
          yield put({
            type: 'saveLoginData',
            payload: {
              response: response.data
            },
          });
        } else if (response.code === -2) {
          // 用户输入密码错5次
          message.error(response.msg);
          passwordError(response.data);
          yield put({
            type: 'changeLoginStatus',
            payload: {
              code: false,
            },
          });
        } else {
          yield put({
            type: 'changeLoginStatus',
            payload: {
              code: false,
            },
          });
          message.error(response.msg);
        }
      } catch (e) {
        console.log(e);
        message.error('服务器繁忙，请稍后重试');
        yield put({
          type: 'changeLoginStatus',
          payload: {
            code: false,
          },
        });
      }
    },
    *saveLoadingDataAfter({response}, { put })  {
      yield put({
        type: 'saveLoginData',
        payload: {
          response
        },
      });
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          code: false, //退出登录修改登录状态为false
          nickName: ''
        },
      });
      localStorage.removeItem('accessToken');
      yield put(routerRedux.replace('/'));
    },
    *logoutData(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          code: false, //退出登录修改登录状态为false
          nickName: ''
        },
      });
      localStorage.removeItem('accessToken');
    },
    *changeNickName({payload}, { put }) {
      yield put({
        type: 'nickName',
        payload: payload.nickName
      })
    },
    *saveSocketData({socketData}, {put}) {
      yield put({
        type: 'saveSocket',
        socketData
      })
    }
  },
  reducers: {
    saveHobby(state, {payload}) {
      return {
        ...state,
        hobbyList: payload
      }
    },
    // 改变是否正在提交的状态，比如用户按下按钮等待请求发送的时间使用 submitting
    // 来判断是否正在请求 拒绝多次点击
    changeSubmitting(state) {
      return {
        ...state,
        submitting: true
      };
    },
    // 用来判断用户是否已登录的状态，之后可保存用户名之类的用户信息
    changeLoginStatus(state, {payload}) {
      return {
        ...state,
        status: payload.code,
        nickName: payload.nickName,
        submitting: false
      };
    },
    // 修改昵称名称
    nickName(state, {payload}) {
      return {
        ...state,
        nickName: payload
      }
    },
    // 保存登录数据
    saveLoginData(state, {payload}) {
      return {
        ...state,
        baseData: payload.response
      }
    },
    saveSocket(state, {socketData}) {
      console.log(socketData);
      return {
        ...state,
        socketData
      }
    }
  },
};
