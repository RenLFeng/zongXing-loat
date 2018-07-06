import React from 'react';
import $ from 'jquery';

import { Switch, Route, withRouter} from 'dva/router';
import {connect} from 'dva';
import {Button} from 'antd';

import '../view/ucenter/index'; 
import PersonAccount from '../view/personAccount/personAccount'; 
import RealName from '../view/ucenter/seccenter/realName/realName'
import LoginInfo from '../components/personal/loginInfo/loginInfo'; 
import OpenAccount from '../view/ucenter/seccenter/realName/openAccount/openAccount';
import BindCard from '../view/ucenter/seccenter/realName/bindCard/bindCard';
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
          {/* <LeftMenu/> */}
            <Switch>
                {/* 账户总览 */}
                <Route path={Path.PERSONAL_ACCOUNT} exact component={PersonAccount} />
                <Route path={Path.REALNAME_AUTHENTICATION} component={RealName} />
                <Route path={Path.OPEN_ACCOUNT} component={OpenAccount} />
                <Route path={Path.BINDCARD} component={BindCard} />
            </Switch>
        </div>
      </div>
    );
  }
}
