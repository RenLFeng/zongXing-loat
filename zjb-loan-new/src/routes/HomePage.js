import React from 'react';
import COS from 'cos-js-sdk-v5';

import {Link, Route,Switch, Redirect } from 'dva/router';

import { connect } from 'dva';
import { CommonService, personal } from '../services/api';
 
import Path from '../common/PagePath';
import HowLoan from '../view/howLoan/HowLoan';  
import Header from '../components/header';
import Footer from '../components/footer';
import UCenter from './UCenter';

import Login from '../view/login/login';
import ForgetPassWord from '../view/forgetPassWord/forgetPassWord';
import Register from '../view/regiser/register';
 
import '../assets/common/index';
 
@connect((state) => ({
  login: state.login,
  userId: state.login.baseData.userId,
  socketData: state.login.socketData
}))
export default class HomePage extends React.Component {
  constructor(props){
    super(props)
  }

  componentDidMount() {
    // 判断有没有token请求获取用户基础数据
    if (localStorage.getItem('accessTokenCompany')) {
      this.getUserBaseData();
    }
    if (!global.cos) {
      global.cos = new COS({
        getAuthorization: function (options, callback) {
          // 异步获取签名
          CommonService.getPicAuth({method: (options.Method || 'get').toLowerCase(),
            pathname: '/' + (options.Key || '')})
            .then((data) => { 
              if (data.code === 0) {
                callback(data.data);
              }
            })
            .catch((e) => {
              callback('error');
            })
        }
      });
    }
  } 

  async getUserBaseData() {
    const response = await personal.getLoginData(); 
    if (response.code === 0) {
      this.props.dispatch({type: 'login/saveLoadingDataAfter', response: response.data})
    }
  }

  render() {
    const { match, dispatch } = this.props;
    return (
      <div>
        <Header  param={this.props}/>
        <Switch>
          <Route path={`${match.path}/`} exact render={() => (<Redirect to={Path.HOWLOAN}/>)} />
          {/* 首界面 */} 
          <Route path={Path.HOWLOAN} exact component={HowLoan}/> 
          {/* 个人中心 */}
          <Route path={`${match.path}/uCenter`} component={UCenter} />
					{/* login */}
          <Route path={`${match.path}/login`} exact component={Login}/>
          {/* forgetpwd */}
          <Route path={`${match.path}/forgetPassWord`} component={ForgetPassWord} />
          {/* register */}
          <Route path={`${match.path}/register`} component={Register} />
        </Switch>
        <Footer /> 
      </div>  
    );
  }
}