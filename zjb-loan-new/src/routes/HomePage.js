import React from 'react';
import COS from 'cos-js-sdk-v5';

import {Link, Route,Switch, Redirect } from 'dva/router';

import { connect } from 'dva';
import { CommonService } from '../services/api';

import IndexPage from '../view/homePage/IndexPage';
import Header from '../components/header';
import Login from '../view/login/login';
import ForgetPassWord from '../view/forgetPassWord/forgetPassWord';


import '../assets/common/index';


export default class HomePage extends React.Component {

  componentDidMount() {
    if (!global.cos) {
      global.cos = new COS({
        getAuthorization: function (options, callback) {
          // 异步获取签名
          CommonService.getPicAuth({method: (options.Method || 'get').toLowerCase(),
            pathname: '/' + (options.Key || '')})
            .then((data) => {
              console.log(data);
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

  render() {
    const { match, dispatch } = this.props;
    return (
      <div>
        <Header  param={this.props}/>
        <Switch>
          <Route path={`${match.path}/`} exact render={() => (<Redirect to={`${match.path}/howLoan`}/>)} />
          {/* 首界面 */}
          <Route path={`${match.path}/howLoan`} exact component={IndexPage}/>
          //login
          <Route path={`${match.path}/login`} exact component={Login}/>
          //forgetpwd
           <Route path={`${match.path}/forgetPassWord`} component={ForgetPassWord} />
        </Switch>
      </div>  
    );
  }
}