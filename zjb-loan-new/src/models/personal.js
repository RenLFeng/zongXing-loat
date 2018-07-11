/*
 * @Author: wfl 
 * @Date: 2018-07-05 09:44:19 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-06 14:08:34
 * 账户总览中的数据
 */
import {personal, mineloan} from '../services/api';

export default {
  namespace: 'personal',
  state: {
    data: {
      currentBorrowAmount: {  // 当前借款金额

      },
      recentForRepanymentVo: {  //近期还款

      },
      myBorrowVo: {  // 我的借款

      },
      companyTotalAssetsVo: { // 账户总资产

      },
      accountDynamicVos: [] // 资金动态
    }
  },
  effects: {
    *getPersonalAccount({payload}, {call, put}){
      yield put({
        type: 'savePersonalAccount',
        payload: payload
      }) 
    },
  },
  reducers: {
    savePersonalAccount(state, {payload}) {
      return {
        ...state,
        data: payload
      }
    },
  },
}