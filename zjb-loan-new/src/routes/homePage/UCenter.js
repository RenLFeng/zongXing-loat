import React from 'react';
import $ from 'jquery';

import { Switch, Route, withRouter} from 'dva/router';
import {connect} from 'dva';
import {Button} from 'antd';

import './UCenterscss/index';
// import LeftMenu from '../../components/UCenterComponent/leftMenu';
import PersonAccount from '../../components/personal/personAccount';
// import UserBasic from '../../components/UCenterComponent/userBasic';
// import ChangeLPwd from '../../components/UCenterComponent/changeLoginPwd';
// import ChangeBindEmail from '../../components/UCenterComponent/changeBindEmail';
// import BindEmail from '../../components/UCenterComponent/bindEmail';
// import OpenAccount from '../../components/UCenterComponent/openAccount';
// import SafeCenter from '../../components/UCenterComponent/safeCenter';
// import RealName from '../../components/UCenterComponent/realName';
// import Authentication from '../../components/UCenterComponent/authentication';
// import OpenQAccount from '../../components/UCenterComponent/openQAccount';
// import IpRecord from '../../components/UCenterComponent/IPRecord';
// import Voucher from '../../components/UCenterComponent/voucher';
// import PlatformNotice from '../../components/UCenterComponent/platformNotice';
// import SiteNotice from '../../components/UCenterComponent/siteNotice';
// import BindCard from '../../components/UCenterComponent/bindCard';
// import CompanyAccount from '../../components/UCenterComponent/companyAccount';
// import BankCard from '../../components/UCenterComponent/bankCard';
// import AccountRecharge from '../../components/UCenterComponent/accountRecharge';
// import AccountWithdrawals from '../../components/UCenterComponent/accountWithdrawals';
// import Message from '../../components/UCenterComponent/message';
// import NoticeList from '../../components/UCenterComponent/NoticeList';
// import InvestMent from '../../components/Account/investment';
// import receivePlan from '../../components/Account/receivePlan';
import LoginInfo from '../../components/personal/loginInfo';
// import IncomePlan from '../../components/UCenterComponent/IncomePlan';
// import AllInvest from '../../components/UCenterComponent/AllInvest';
// import Test from '../../components/UCenterComponent/test';
// import CompanyList from '../../components/UCenterComponent/companyList';
// import BindSuccess from '../../components/UCenterComponent/bindSuccess';

//我的优惠券
// import myCoupon from '../../components/UCenterComponent/mycoupon';
//项目收藏

// import projectCollection from '../../components/UCenterComponent/projectcollection'; 
import Path from '../../common/PagePath';
// import AccountStatement from "../../components/Account/accountstatement";



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
            <Switch>
                {/* 账户总览 */}
                <Route path={Path.PERSONAL_ACCOUNT} exact component={PersonAccount} />
            </Switch>
        </div>
      </div>
    );
  }
}
