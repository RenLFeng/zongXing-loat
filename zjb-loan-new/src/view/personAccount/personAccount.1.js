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
  render() { 
    const lable = [
      {
        text:'借款申请',
        ffalg:1
      }
    ]
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
          <div className="recent-repany" >
              <p className='title'>近期应还 </p>
              <div className='repany-content '>
                 <span className='txt1'>2018/07/21</span>
                 <span className='txt2'>待还款</span>
                 <span className='txt3'>02/12期</span>
                 <span className='txt4'>|</span>
                 <span className='txt5'>￥26.25</span>
                 <span className='txt6'>本金：24</span>
                 <span className='txt7'>利息：2.25</span>
                 <span className='txt8'>逾期：50</span>
                 <a className='hand-repay'>手动还款</a>
              </div>
              <div className='sub-content'>
                <span className='txt1'>2018-07-23 10:10</span>
                <span className='txt2'>本笔还款已逾期</span>
                <span className='txt3'>{'{1}'}</span>
                <span className='txt2'>天，逾期费用</span>
                <span className='txt3'>{'{元}'}</span>
                <span className='txt2'>，为了不影响您的征信，请及时还款</span>  
              </div>
              <p className='chufa'><i className='zjb zjb-jinggao1'></i> 逾期处罚措施</p>
          </div>
        </div>

        <div className="per_account"> 
          <div className="ptit">
              <i>我的借款</i> 
          </div> 
          <div className="my-loan" >
          </div>  
        </div>

        {/* 
         <PieReact width='600px' height="200px"  option={this.state.pieOption}/>
        */}
      </div>

    );
  }
}
