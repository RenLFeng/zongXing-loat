import React from 'react';
import './sendCoupon.scss';
import SendCoupon from './couPon';
import CouponSmall from '../../personal/mineLoan/mineLoanComm/sendCoupon.js';
import {Table} from 'antd';
import { personal } from '../../../services/api';
import moment from 'moment'

export default class SendCoupons extends React.Component {
  constructor(props){
    super();
    this.state = {
      dataSource:[],
      projectNum:'',
      projectName:''
    }
  }


  render(){
   const columns = [{
      title: '借款金额',
      dataIndex: 'fcreditMoney',
      key: 'fcreditMoney',
      align:'center',
      render:val=> val === null ? "" : `${val}元`
    }, {
      title: '借款期数',
      dataIndex: 'fcreditMonth',
      key: 'fcreditMonth',
      align:'center',
      render:val=> val === null ? "" : `${val}月`
    }, {
      title: '借款利率',
      dataIndex: 'frateLast',
      key: 'frateLast',
      align:'center',
      render:val=> val === null ? "" : `${val}%`
    }, {
      title: '创建时间',
      dataIndex: 'fcreateTime',
      key: 'fcreateTime',
      align:'center',
    }, {
      title: '状态',
      dataIndex: 'fflag',
      key: 'fflag',
      align:'center',
      render:(val) => {
        switch (val) {
          case 0:
              return <span>待提交</span>
          case 1:
              return <span>待初审</span>
          case 2:
              return <span>待缴费</span>
          case 3:
              return <span>待大数据风控</span>
          case 4:
              return <span>待项目背调</span>
          case 5:
              return <span>待补充资料</span>
          case 6:
              return <span>待委员会审核</span>
          case 7:
              return <span>待委员会定价</span>
          case 8:
              return <span>待确认借款</span>
          case 9:
              return <span>待发放优惠券</span>
          case 10:
              return <span>待项目排版审核</span>
          case 11:
              return <span>待完善项目信息</span>
          case 12:
              return <span>待排期上线</span>
          case 13:
              return <span>筹款中</span>
          case 14:
              return <span>待放款</span>
          case 15:
              return <span>还款中</span>
          case 16:
              return <span>完成</span>
          case -1:
              return <span>流标</span>
          case -2:
              return <span>风控打回</span>
          case -3:
              return <span>终止</span>
          case -4:
              return <span>逾期</span>
          case -5:
              return <span>坏账</span>
        
      }
    }
  }];
  
  const dataSource = [
    {
      fcreditMoney:this.props.dataInfo.fflag < 14 ? this.props.dataInfo.fmoneyLast : this.props.dataInfo.fpracticalLoanMoney ,
      fcreditMonth:this.props.dataInfo.fmonthLast,
      frateLast:this.props.dataInfo.frateLast,
      fcreateTime:moment(this.props.dataInfo.fcreateTime).format('YYYY-MM-DD HH:mm'),
      fflag:this.props.dataInfo.fflag,
    }
   
  ]
  const locale = {
    filterTitle: '筛选',
    filterConfirm: '确定',
    filterReset: '重置',
    emptyText: '暂无数据',
  }

    return(
      <div className="send-coupon">
        <a className="close" onClick={()=>{this.props.close()}}>x</a>
        <p className="tit">发优惠券</p>
        <div className="content-info">
          <div className="tit">
            <p>项目编号:<span>{this.props.dataInfo.fprojectNo}</span></p>
            <p>项目名称<span>{this.props.dataInfo.fname}</span></p>
          </div>
          <Table 
            dataSource={dataSource} 
            columns={columns} 
            locale = {locale}
            bordered
            pagination={false}
            size="small"
            style={{marginTop:0}}
          />
           <SendCoupon project={this.props.dataInfo} projects={this.props.project} close={this.props.close}/>
        </div>
        
      </div>
    )
  }
}
