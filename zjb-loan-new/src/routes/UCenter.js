import React from 'react';
import $ from 'jquery';

import { Switch, Route, withRouter} from 'dva/router';
import {connect} from 'dva';
import {Button} from 'antd';

import '../view/ucenter/index'; 
import PersonAccount from '../view/personAccount/personAccount'; 
import BindEmail from '../view/bindEmail/bindEmail';
import ChangeBindEmail from '../view/changeBindEmail/changeBindEmail';
import LoginInfo from '../view/loginInfo/loginInfo';  
import Path from '../common/PagePath'; 
import LeftMenu from '../view/leftmenu/leftMenu';

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
          {/* <LeftMenu/> */}
            <Switch>
                {/* 账户总览 */}
                <Route path={Path.PERSONAL_ACCOUNT} exact component={PersonAccount} />
                {/* 邮箱绑定 */}
                <Route path={Path.BIND_EMAIL} component={BindEmail} />    
                {/* 变更邮箱绑定 */}
                <Route path={Path.CHANGE_BINDEMAIL} component={ChangeBindEmail} />   
            </Switch>
        </div>
      </div>
    );
  }
}
