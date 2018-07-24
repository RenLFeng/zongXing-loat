import {securityCentreService} from '../services/api';
import { message } from 'antd';
export default {
  namespace: 'safeCenter',
  state: {
    safeData: {
      userSecurityCenter: {}
    },
    safeDataLoading: false
  },
  effects: {
    *getSafe(_, { call, put }) {
      //请求安全中心首页数据
      yield put({
        type: 'startSafeData'
      });
      try {
        const response = yield call(securityCentreService.getSafeData);
        console.log("safeData",response);
        if (response.code === 0) {
          yield put({
            type: 'endSafeData',
            payload: response.data
          });
        } else {
          yield put({
            type: 'endSafeData',
            payload: {
              userSecurityCenter: {}
            }
          });
        }
      } catch (e) {
        yield put({
          type: 'endSafeData',
          payload: {
            userSecurityCenter: {}
          }
        });
        if (typeof e === 'object' && e.name === 288) {
          throw e;
        }
        console.log('服务器繁忙，请稍后重试');
      }
    },
    *clearData(_, {call, put}) {
      yield put({
        type: 'clearDataSave',
      });
    }
  },
  reducers: {
    clearDataSave(state) {
      return {
        ...state,
        safeData: {
          userSecurityCenter: {}
        },
        safeDataLoading: false
      }
    },
    startSafeData(state) {
      return {
        ...state,
        safeDataLoading: true
      };
    },
    endSafeData(state, {payload}) {
      return {
        ...state,
        safeDataLoading: false,
        safeData: payload
      };
    }
  },
};
