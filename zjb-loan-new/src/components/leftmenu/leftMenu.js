import React from 'react';
import { Link } from 'dva/router';
import Path from '../../common/PagePath';
import './leftmenu.scss' 

export default class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {param} = this.props;
    const path = param.location.pathname;
    return (
        <div className="personal-left-menu" >
          <ul>
             <li>
                <span>
                  <i className="zjb zjb-zhanghu" ></i> 我的账户
                </span>
                <ul> 
                  <li><Link className={path.indexOf(Path.PERSONAL_ACCOUNT) ===-1?'':'active'} to={Path.PERSONAL_ACCOUNT}>账户总览</Link></li>    
                  <li><Link className={path.indexOf(Path.MINE_LOAN) ===-1?'':'active'} to={Path.MINE_LOAN}>我的借款</Link></li>    
                  <li><Link className={path.indexOf(Path.RECEIVE_PLAN) ===-1?'':'active'} to={Path.RECEIVE_PLAN}>还款计划</Link></li>    
                  <li><Link className={path.indexOf(Path.ACCOUNT_STATEMENT) ===-1?'':'active'} to={Path.ACCOUNT_STATEMENT}>资金流水</Link></li>
                  <li><Link className={path.indexOf(Path.MY_COUPON) ===-1?'':'active'} to={Path.MY_COUPON}>我的优惠券</Link></li>
                </ul>
             </li>
             <li>
                <span>
                  <i className="zjb zjb-49"></i>实名认证
                </span>
                <ul>
                    <li><Link className={path.indexOf(Path.REALNAME_AUTHENTICATION)===-1?'':'active'} to={Path.REALNAME_AUTHENTICATION}>企业开户</Link></li> 
                </ul>
             </li> 
          </ul> 
        </div>  
    );
  }
}
