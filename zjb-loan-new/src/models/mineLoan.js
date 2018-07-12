/*
 * @Author: wfl 
 * @Date: 2018-07-05 09:44:19 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-11 11:00:18
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
    projectId: '21531bab545349d3a391afa46d114901',
    projectName: 'dc-测试项目',
    loading: false,
  },
  effects: {
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