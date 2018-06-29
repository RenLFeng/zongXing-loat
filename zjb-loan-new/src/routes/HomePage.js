import React from 'react';
import COS from 'cos-js-sdk-v5';

import {Link, Route,Switch } from 'dva/router';

import { connect } from 'dva';
import { CommonService } from '../services/api';

import IndexPage from './homePage/IndexPage';
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
        <span>123123</span>
        <Switch>
          {/* 首界面 */}
          <Route path={`${match.path}/`} exact component={IndexPage}/>
        </Switch>
      </div>  
    );
  }
}