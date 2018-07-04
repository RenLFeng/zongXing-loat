import React from 'react';
import $ from 'jquery';

import { Switch, Route, withRouter} from 'dva/router';
import {connect} from 'dva';
import {Button} from 'antd';

import '../view/ucenter/index'; 
import PersonAccount from '../view/personAccount/personAccount'; 
import LoginInfo from '../components/personal/loginInfo/loginInfo';  
import Path from '../common/PagePath'; 
import LeftMenu from '../components/personal/leftmenu/leftMenu';

export default class UCenter extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    setTimeout(()=>{
      this.initPage();
    }, 200);
  }

  initPage() {
    $('.uc-lbody>.navbox').on('click', '.hd>a,.folder>a', function(){
      $(this).parent().toggleClass('hover');
    });
  };

  render() {
    const { match, nickName, showMask} = this.props;
 
    return (
      <div className="body2">
        <LoginInfo history={this.props.history}/> 
        <div className="w clearfix">
          <LeftMenu  param={this.props}/>
            <Switch>
                {/* 账户总览 */}
                <Route path={Path.PERSONAL_ACCOUNT} exact component={PersonAccount} />
            </Switch>
        </div>
      </div>
    );
  }
}
