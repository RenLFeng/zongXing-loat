import React from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import Path from '../../common/PagePath';
import './leftmenu.scss' 
import { accountService } from '../../services/api';
import { message } from 'antd';

@connect(()=>({}))
export default class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fetchPersonalData();
  }

 // 借款用户 账户总览信息 数据获取 存入redux
 async fetchPersonalData() {
  const response = await accountService.getPersonalData();
  if (response.code === 0) {
    this.props.dispatch({
      type: 'personal/getPersonalAccount',
      payload: response.data
    })
    this.props.dispatch({
      type: 'personal/savePersonalStatus',
      payload: {
        openStatus: 1, // 开户成功 
        openFailMsg: ''
      }
    })
  } else if (response.code === -1 && response.msg === '该账户未开户') {
    this.props.dispatch({
      type: 'personal/savePersonalStatus',
      payload: {
        openStatus: -1, // 未开户 
        openFailMsg: ''
      }
    })
    this.props.param.history.push('/index/uCenter/openAccount');
  } else if (response.code === -1 && response.msg === '该账户正在开户中') {
    this.props.dispatch({
      type: 'personal/savePersonalStatus',
      payload: {
        openStatus: 2, // 开户中 
        openFailMsg: ''
      }
    })
    this.props.param.history.push('/index/uCenter/realName');
  } else if (response.code === -1 && response.msg === '该账户开户失败') {
    this.props.dispatch({
      type: 'personal/savePersonalStatus',
      payload: {
        openStatus: 0, // 开户失败 
        openFailMsg: response.data
      }
    })
    this.props.param.history.push('/index/uCenter/realName');
  } else {
    response.msg && message.error(response.msg);
  }
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
                    <li><Link className={path.indexOf(Path.REALNAME_AUTHENTICATION)===-1?'':'active'} to={Path.REALNAME_AUTHENTICATION}>开户中心</Link></li> 
                </ul>
             </li> 
          </ul> 
        </div>  
    );
  }
}
