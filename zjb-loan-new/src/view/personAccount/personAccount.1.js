import React from 'react';
import { Link } from 'dva/router';
import PieReact from '../../common/Echarts/PieReact';
import LineReact from '../../common/Echarts/LineReact';
import Path from '../../common/PagePath';
import {connect} from 'dva';
import moment from 'moment';
import LeftMenu from '../../components/leftmenu/leftMenu';
import { Modal, Button,Table,message, Pagination } from 'antd'; 
import './personal.scss';
import Statement from '../statement/Statement';
import {personal} from '../../services/api';
import {accountService, CouponService} from '../../services/api2';
import CouponSmall from '../couponsmall/CouponSmall';
 

export default class PersonAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       
      
    }; 
  }

  componentDidMount() {
   
    
  }
 
   

  componentWillReceiveProps(nextProps) {
    
  }
 
 
 
 

  render() { 
  
    return (
      <div>
        <LeftMenu param={this.props}/>  
        <div className="per_account">
          <div className="ptit">
            <i>当前借款金额</i>
            <span>￥153,113.42 </span>
            <em>单位：元</em>
          </div>
          <div className="sub-info">
              <i>累计利息支出</i>
              <span >153,113.42</span>
              <i>累计借款金额</i>
              <span >153,113.42</span>
              <div className='to-loan'>
                  <span></span> 申请借款
              </div>
          </div> 
        </div>
        <div className="per_account"> 
          <div className="ptit">
              <i>近期还款</i> 
          </div> 
          <div className="account-info" >
              <span className="sub-title">近期应还 </span>
            
          </div>
        </div>



        {/* 
         <PieReact width='600px' height="200px"  option={this.state.pieOption}/>
        */}
      </div>

    );
  }
}
