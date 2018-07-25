/*
 * @Author: wfl 
 * @Date: 2018-07-05 09:44:19 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-24 15:24:34
 * 我的借款
 */
import {personal, mineloan} from '../services/api';
import {message} from 'antd';

let webToken = null;
if (localStorage.getItem('accessTokenCompany')) {
  const webTokenObj = JSON.parse(localStorage.getItem('accessTokenCompany'));
  webToken = webTokenObj.webToken ? webTokenObj.webToken : '';
}

export default {
  namespace: 'mineloan',
  state: {
    data: [],
    projectId: '',
    projectName: '',
    loading: false,
    gotoRealName: false,
  },
  effects: {
    *clearData({payload},{put}) {
      yield put({
        type: 'clearDataSave',
      });
    },
    *gotoRealName({payload},{put}){
      yield put({
        type: 'changeRealName',
        payload: payload
      });
    },
    *getMineLoan({payload}, {call, put}){
      try {
        yield put({
          type: 'changeLoad',
          payload: true
        })
        const response = yield call(mineloan.getMineLoan);
        if(response.code === 0){
            yield put({
                type: 'saveMineLoan',
                payload:{
                    data: response.data
                }
            })
        }else{
            message.error(response.msg);
            yield put({
              type: 'changeLoad',
              payload: false
            })
        }
      }catch(e){

     }
    },
  },
  reducers: {
    clearDataSave(state) {
      return {
        ...state,
        data: [],
        projectId: '',
        projectName: '',
        loading: false,
      }
    },
    changeRealName(state,{payload}){
      return {
        ...state,
        gotoRealName: true,
      }
    },
    saveMineLoan(state, {payload}) {
      return {
        ...state,
        data: payload.data,
        loading: false
      }
    },
    changeLoad(state, {payload}) {
      return {
        ...state,
        loading: payload
      }
    }
  },
}