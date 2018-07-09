/*
 * @Author: wfl 
 * @Date: 2018-07-05 09:44:19 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-06 14:08:34
 * 我的借款
 */
import {personal, mineloan} from '../services/api';
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
      console.log('5555555')
      try {
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
        }
      }catch(e){

     }
    },
  },
  reducers: {
    saveMineLoan(state, {payload}) {
      console.log(payload,'payload')
      return {
        ...state,
        data: payload.data
      }
    },
  },
}