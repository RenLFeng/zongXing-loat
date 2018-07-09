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
    *getSafe({payload}, { call, put }) {
      //请求安全中心首页数据
      yield put({
        type: 'startSafeData'
      });
      try {
        const response = yield call(securityCentreService.getSafeData);
        console.log("safeData",response);
        if (response.code === 0) {
          if(payload){
            let resObj = response.data;
            if(!resObj.userSecurityCenter.fCertification){
              payload.jumpAuth();
            }else if(!resObj.userSecurityCenter.fThirdAccount){
              payload.jumpCreateAccount();  
            }
          }
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
        message.error('服务器繁忙，请稍后重试');
      }
    },
  },
  reducers: {
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
