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
    data: {},
  },
  effects: {
    *getMineLoan({payload}, {call, put}){
    },
  },
  reducers: {
    saveMineLoan(state, {payload}) {
    },
  },
}