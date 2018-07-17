import React from 'react';
import './sendCoupon.scss';
// import SendCoupon from '../../personal/mineLoan/mineLoanComm/sendCoupon';
import SendCoupon from './couPon';
import CouponSmall from '../../personal/mineLoan/mineLoanComm/sendCoupon.js';
import {Table} from 'antd';

export default class SendCoupons extends React.Component {

  render(){
   const columns = [{
      title: '借款金额',
      dataIndex: 'name',
      key: 'name',
      align:'center',
    }, {
      title: '借款期数',
      dataIndex: 'age',
      key: 'age',
      align:'center',
    }, {
      title: '借款利率',
      dataIndex: 'address',
      key: 'address',
      align:'center',
    }, {
      title: '创建时间',
      dataIndex: 'time',
      key: 'time',
      align:'center',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align:'center',
  }];

  const locale = {
    filterTitle: '筛选',
    filterConfirm: '确定',
    filterReset: '重置',
    emptyText: '暂无数据',
  }
  console.log('this.props',this.props)
    return(
      <div className="send-coupon">
        <a className="close" onClick={()=>{this.props.close()}}>x</a>
        <p className="tit">发优惠券</p>
        <div className="content-info">
          <div className="tit">
            <p>项目编号:<span>P18060006</span></p>
            <p>项目名称<span>海底捞火锅新店扩张</span></p>
          </div>
          <Table 
            // dataSource={dataSource} 
            columns={columns} 
            locale = {locale}
            bordered
          />
         
           <SendCoupon project={this.props.project}/>
         
        
        </div>
        
      </div>
    )
  }
}
