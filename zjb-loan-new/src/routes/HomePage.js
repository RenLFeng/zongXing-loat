import React from 'react';
import COS from 'cos-js-sdk-v5';

import {Link, Route,Switch, Redirect } from 'dva/router';

import { connect } from 'dva';
import { CommonService } from '../services/api';
import Path from '../common/PagePath';
import HowLoan from '../view/howLoan/HowLoan';
import Header from '../components/header';  
import Footer from '../components/footer'; 
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
          <Route path={`${match.path}/`} exact render={() => (<Redirect to={Path.HOWLOAN}/>)} />
          {/* 首界面 */}
          <Route path={Path.HOWLOAN} exact component={HowLoan}/>
        </Switch>
        <Footer/>
      </div>  
    );
  }
}