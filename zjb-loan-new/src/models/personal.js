/*
 * @Author: wfl 
 * @Date: 2018-07-05 09:44:19 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-06 14:08:34
 * 账户总览中的数据
 */
import {personal, mineloan} from '../services/api';

const OPEN_NO = -1; // 未开户
const OPEN_SUCCESS = 1; // 开户成功
const OPEN_WAITING = 2; // 开户中
const OPEN_FAIL = 0; // 开户失败


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
    },
    openStatus: OPEN_NO,  // 开户状态
    openFailMsg: '' // 开户失败原因
  },
  effects: {
    *getPersonalAccount({payload}, {call, put}){
      yield put({
        type: 'savePersonalAccount',
        payload: payload,
      }) 
    },
    *savePersonalStatus({payload}, {call, put}) {
      yield put({
        type: 'savePersonalStatusData',
        payload: payload
      })
    },
    *clearData({payload},{put}) {
      yield put({
        type: 'clearDataSave',
      });
    },
  },
  reducers: {
    clearDataSave(state) {
      return {
        ...state,
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
        },
        openStatus: OPEN_NO,  // 开户状态
        openFailMsg: '' // 开户失败原因
      }
    },
    savePersonalAccount(state, {payload}) {
      return {
        ...state,
        data: payload
      }
    },
    savePersonalStatusData(state, {payload}) {

      return {
        ...state,
        openStatus: payload.openStatus,
        openFailMsg: payload.openFailMsg
      }
    }
  },
}