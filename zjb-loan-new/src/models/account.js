import {getPersonAccount, getPersonAccountNew,getCompanylist} from '../services/api';
import {message} from 'antd';

// 开户状态 0: 未开户 1: 开户中 2: 开户失败 3: 开户成功

const NO_OPEN = 0;
const OPENING = 1;
const OPEN_FAIL = 2;
const OPEN_SUCCESS = 3;
let webToken = null;
if (localStorage.getItem('accessToken')) {
  const webTokenObj = JSON.parse(localStorage.getItem('accessToken'));
  webToken = webTokenObj.webToken ? webTokenObj.webToken : '';
}

export default {
  namespace: 'account',
  state: {
    message: '',
    openStatus: localStorage.getItem(webToken)?localStorage.getItem(webToken):0,
    personal: {
      accountDynamicVos: [],
      plan: [],
      totalAssets: {}
    },
    companyListStatus: false,
    companyList: [],
    company: [],
    personalStatus: false,
    companyStatus: false,
    num: 0,
    company_page : {
      accountDynamicVos: [],
      plan: {},
      totalAssets: {}
    }
  },
  effects: {
    *getCompanyNum({payload}){

    },
    *getPersonalAccount({payload}, {call, put}) {
      let webToken = '';
      const response = yield call(getPersonAccountNew, payload); 
      console.log(response);
      if (response.code === 0) {
        if (!response.data) {
          yield put({
            type: 'savePersonal',
            payload: {
              openStatus: NO_OPEN,
              data: {
                accountDynamicVos: [],
                plan: [],
                totalAssets: {}
              }
            }
          });
          saveOpenStatus(NO_OPEN);
          payload.jumpAuth()
        } else {
          if (response.data && response.data.fflag === 0) {
            yield put({
              type: 'savePersonal',
              payload: {
                openStatus: OPENING,
                data: {
                  accountDynamicVos: [],
                  plan: [],
                  totalAssets: {}
                }
              }
            });
            saveOpenStatus(OPENING);
          } else if (response.data && response.data.fflag === -1) {
            yield put({
              type: 'savePersonal',
              payload: {
                openStatus: OPEN_FAIL,
                data: {
                  accountDynamicVos: [],
                  plan: [],
                  totalAssets: {},
                },
                message: response.data.freturnMessage
              }
            });
            saveOpenStatus(OPEN_FAIL);
          } else {
            yield put({
              type: 'savePersonal',
              payload: {
                openStatus: OPEN_SUCCESS,
                data: response.data
              }
            });
            
          }
        }
      } else {
        message.error(response.msg);
      }
    },
    *getCompanyAccount({payload}, {call,put}) {
      const res = yield call(getPersonAccountNew, payload );
      console.log(res);
      if (res.code === 0) {
        yield put({
          type: 'saveCompany',
          payload: res.data
        });
      } else {
        message.error(res.msg);
      }
    },
    *getCompanyLists({payload}, {call,put}) {
      const resp = yield call(getCompanylist, payload );
      console.log(resp);
      if(resp.code ===0) {
        yield put({
          type: 'saveCompanyList',
          payload: resp.data
        });
      } else {
        message.error(resp.msg);
      }
    }
  },
  reducers: {
    savePersonal(state, {payload}) {
      saveOpenStatus(payload.openStatus);
      return {
        ...state,
        openStatus: payload.openStatus,
        personal: payload.data,
        message: payload.message
      }
    },
    saveCompany(state, {payload}) {
      return {
        ...state,
        companyStatus: true,
        company_page: payload
      };
    },
    saveCompanyList(state, {payload}) {
      return {
        ...state,
        companyListStatus: true,
        companyList: payload
      };
    }
  },
};


function saveOpenStatus(param) {
  console.log('保存开户状态', param);
  let webToken = '';
  if (localStorage.getItem('accessToken')) {
    const webTokenObj = JSON.parse(localStorage.getItem('accessToken'));
    webToken = webTokenObj.webToken ? webTokenObj.webToken : '';
  }
  if (webToken) {
    localStorage.setItem(webToken, param);
  }
}