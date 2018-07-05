/*
 * @Author: wfl 
 * @Date: 2018-07-05 09:44:19 
 * @Last Modified by:   wfl 
 * @Last Modified time: 2018-07-05 09:44:19 
 * 我的借款
 */
import {personal} from '../services/api';
import {message} from 'antd';

let webToken = null;
if (localStorage.getItem('accessToken')) {
  const webTokenObj = JSON.parse(localStorage.getItem('accessToken'));
  webToken = webTokenObj.webToken ? webTokenObj.webToken : '';
}

export default {
  namespace: 'mineloan',
  state: {
    data: [],
  },
  effects: {
    *getMineLoan({payload}, {call, put}){
        const response = yield call();
        if(response.code === 0){

            yield put({
                type: 'saveMineLoan',
                payload:{
                    data: response.data
                }
            })
        }else{
            message.error(response.msg);
        }
    },
  },
  reducers: {
    saveMineLoan(state, {payload}) {
      return {
        ...state,
        data: payload.data
      }
    },
  },
};