import React from 'react';
import $ from 'jquery';
import LeftMenu from '../../components/leftmenu/leftMenu';
import SeeCoupon from './seeCoupon/seeCoupon';
import AlreadyCoupon from './alreadyCoupon/alreadyCoupon';
import UsedCoupon from './usedCoupon/usedCoupon';

import SendCoupons from './sendCoupon/sendCoupon';
import BarE from './useCoupons';
import PieE from './CouponIssuance';
import './myCoupon.scss';
import { Table,Pagination ,Tooltip,message } from 'antd';
import {CouponService,personal} from '../../services/api';
import moment from 'moment';
import Path from '../../common/PagePath';

export default class MyCoupon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag:'noUse',
      // flagCoupon:'noUse',
      showSeeCoupon:false,
      showAlreadyCoupon:false,
      showFailedCoupon:false,
      SendCouponShow:false,
      pageCurrent:1,
      pageSize:10,
      dataSource:[],    //未使用的优惠券数据
      dataSource_:[],    //已使用的优惠券数据
      dataSources:[],    //已失效的优惠券数据
      dataSourceNum:0,    //未使用总条数
      dataSourceNum_:0,    //已使用总条数
      dataSourceNums:0,    //已失效总条数
      chart:'bar',
      useStatistics:null,   //使用统计
      statistics:{},       //发放统计
      couponInfo:{},     //优惠券数据
      project:{},     //项目信息
      dataInfo:{},    //发优惠券的项目
    }
    this.close = this.close.bind(this)
    this.close_ = this.close_.bind(this)
  }
  componentDidMount() {
    this.getCoupon();
    this.getproject();
  }

  async getCoupon(){
    let param = {
      pageCurrent:this.state.pageCurrent,
      pageSize:this.state.pageSize
    }
    const response = await CouponService.getCouponInfo(param);
    if(response.code === 0){
      this.setState({
        dataSource:response.data.tableStatistical?response.data.tableStatistical.unUsed.infoList:[],
        dataSource_:response.data.tableStatistical?response.data.tableStatistical.used.infoList:[],
        dataSources:response.data.tableStatistical?response.data.tableStatistical.invalid.infoList:[],
        dataSourceNum:response.data.tableStatistical?response.data.tableStatistical.unUsed.totalNumber:0,
        dataSourceNum_:response.data.tableStatistical?response.data.tableStatistical.used.totalNumber:0,
        dataSourceNums:response.data.tableStatistical?response.data.tableStatistical.invalid.totalNumber:0,
        useStatistics:response.data.tableStatistical?response.data.companyCouponChartsVo.useStatistical:null,
        statistics:response.data.tableStatistical?response.data.companyCouponChartsVo.grantStatistical:{},
        project:response.data.projectInfo?response.data.projectInfo:{}
      })
    }
  }

  async getCouponDetail(id){
    const response = await CouponService.myCouponDetail(id);
    if(response.code === 0){
      this.setState({
        couponInfo:response.data
       })

    }
  }

  //翻页触发的事件
onchange = (page) => {
  this.setState({
      pageCurrent: page,
  },()=>{
  this.getCoupon();
  });
}

//页码数改变触发的事件
onShowSizeChange = (current, pageSize) => {
  this.setState({
      pageSize: pageSize,
      pageCurrent: current,
  },()=>{
      this.getCoupon()
  });
}
  

  //切换页面
  changePage(flags){
    if( flags==='noUse'){
      this.setState({
       flag:'noUse',
       showAlreadyCoupon:false,
       showFailedCoupon:false,
      })
    }
    if( flags==='alreadyUse'){
      this.setState({
       flag:'alreadyUse',
       showSeeCoupon:false,
       showFailedCoupon:false,
      })
    }
    if( flags==='failed'){
      this.setState({
       flag:'failed',
       showSeeCoupon:false,
       showAlreadyCoupon:false,
      })
    }
  }

  changeChart(type){
    if(type === 'bar'){
      this.setState({
        chart: 'bar'
      })
    }
    if(type === 'pie'){
      this.setState({
        chart: 'pie'
      })
    }
  }

  //获取优惠券数据
  see(data,type){
    if(type === 'unUse' || type === 'effective' || type === 'wait'|| type === 'duihuanquan'){
      this.setState({
        showSeeCoupon:true,
       })
    }
    if(type === 'alreadyUse'){
      this.setState({
        showAlreadyCoupon:true,
       })
    }
    if(type === 'used'){
      this.setState({
        showFailedCoupon:true,
       })
    }
    this.setState({
      type
    })
     let param = {
      couponUserId:data.couponUserId
     }
     this.getCouponDetail(param)
  }

  //查看优惠券关闭
  close(type){
    if(type === 'unUse'|| type === 'effective' || type === 'wait'|| type === 'duihuanquan'){
      this.setState({
        showSeeCoupon:false,
       })
    }
    if(type === 'alreadyUse'){
      this.setState({
        showAlreadyCoupon:false,
       })
    }
    if(type === 'used'){
      this.setState({
        showFailedCoupon:false,
       })
    }
  }

  //发放优惠券关闭
  close_(){
    this.setState({
      SendCouponShow:false
    })
  }

 

  async getproject(){
    const response = await personal.couponGetProject();
    if(response.code === 0){
      if (response.data) {
        this.setState({
          dataInfo:response.data
        });
      }
    } else {
      response.msg && message.error(response.msg);
    }
  }


render(){
  const columns = [{
          title: '优惠券编码',
          dataIndex: 'couponCode',
          key: 'couponCode',
          align:'center',
        }, {
          title: '面值',
          dataIndex: 'fullSubMoney',
          key: 'fullSubMoney',
          align:'center',
        }, {
          title: '使用规则',
          dataIndex: 'fullSubCondition',
          key: 'fullSubCondition',
          align:'center',
        },{
          title: '类型',
          dataIndex: 'couponType',
          key: 'couponType',
          align:'center',
          render:(text,val)=>{
            return (
              <span>{val.couponType === 1 ? '投资类' : '游客类'}</span>
            )     
          }
        }, {
          title: '发行日期',
          dataIndex: 'creatTime',
          key: 'creatTime',
          align:'center',
          render:(val) => {
            return   moment(val).format('YYYY-MM-DD HH:mm') 
          }
        }, {
          title: '失效日期',
          dataIndex: 'endTime',
          key: 'endTime',
          align:'center',
          render:(val) => {
              return   moment(val).format('YYYY-MM-DD HH:mm')
            }
        }, {
          title: '状态',
          dataIndex: 'couponState',
          key: 'couponState',
          align:'center',
          render:(val) => {
              switch (val) {
                case 0:
                    return <span>待生效</span>
                case 1:
                    return <span>待领取</span>
                case 2:
                    return <span style={{color:'#ed7d31'}}>·未使用</span>
                case 3:
                    return <span>兑换券(未使用)</span>
                case 4:
                    return <span style={{color:'#FD0018'}}>·已过期</span>
                case 5:
                    return <span style={{color:'#FD0018'}}>·流标</span>
                case 6:
                    return <span>已使用</span>
            }
          }
        }, {
          title: '操作',
          dataIndex: 'do',
          align:'center',
          render: (text,record) => {
            switch(record.couponState){
             case 0 :
             return <a style={{color:'#669bff'}} onClick={()=>{this.see(record,'effective')}}>查看</a>
             case 1 :
             return <a style={{color:'#669bff'}} onClick={()=>{this.see(record,'wait')}}>查看</a>
             case 2 :
             return <a style={{color:'#669bff'}} onClick={()=>{this.see(record,'unUse')}}>查看</a>
             case 3 :
             return <a style={{color:'#669bff'}} onClick={()=>{this.see(record,'duihuanquan')}}>查看</a>
            }
              // return(
              //   <div>
              //    {record.couponState === 0 ? 
              //    <a style={{color:'#669bff'}} onClick={()=>{this.see(record,'effective')}}>查看</a>
              //    : <a style={{color:'#669bff'}} onClick={()=>{this.see(record,'unUse')}}>查看</a>}
              //   </div>
               
              //  )  
          },
        },
  ];

  const columns_ = [{
        title: '使用日期',
        dataIndex: 'consumeTime',
        key: 'consumeTime',
        align:'center',
        render:(val) => {
          return   moment(val).format('YYYY-MM-DD HH:mm') 
        }
      }, {
        title: '面值',
        dataIndex: 'fullSubMoney',
        key: 'fullSubMoney',
        align:'center',
      }, {
        title: '使用规则',
        dataIndex: 'fullSubCondition',
        key: 'fullSubCondition',
        align:'center',
      },{
        title: '类型',
        dataIndex: 'couponType',
        key: 'couponType',
        align:'center',
        render:(text,val)=>{
          return (
            <span>{val.couponType === 1 ?'投资类' : '游客类'}</span>
          )     
        }
      }, {
        title: '优惠券编码',
        dataIndex: 'couponCode',
        key: 'couponCode',
        align:'center',
      }, {
        title: '状态',
        dataIndex: 'couponState',
        key: 'couponState',
        align:'center',
        render:(val) => {
          switch (val) {
            case 0:
                return <span>待生效</span>
            case 1:
                return <span>待领取</span>
            case 2:
                return <span style={{color:'#ed7d31'}}>·未使用</span>
            case 3:
                return <span>兑换券(未使用)</span>
            case 4:
                return <span style={{color:'#FD0018'}}>·已过期</span>
            case 5:
                return <span style={{color:'#FD0018'}}>·流标</span>
            case 6:
                return <span>已使用</span>
        }
      }
      }, {
        title: '操作',
        dataIndex: 'do',
        align:'center',
        render: (text,record) => {
          return(
            <a style={{color:'#669bff'}} onClick={()=>{this.see(record,'alreadyUse')}}>查看</a>
          )  
        },
      },
  ];

  const column = [{
      title: '失效日期',
      dataIndex: 'endTime',
      key: 'endTime',
      align:'center',
      render:(val) => {
        return   moment(val).format('YYYY-MM-DD HH:mm') 
      }
    }, {
      title: '面值',
      dataIndex: 'fullSubMoney',
      key: 'fullSubMoney',
      align:'center',
    }, {
      title: '使用规则',
      dataIndex: 'fullSubCondition',
      key: 'fullSubCondition',
      align:'center',
    },{
      title: '类型',
      dataIndex: 'couponType',
      key: 'couponType',
      align:'center',
      render:(text,val)=>{
        return (
          <span>{val.couponType === 1 ?'投资类' : '游客类'}</span>
        )     
      }
    }, {
      title: '优惠券编码',
      dataIndex: 'couponCode',
      key: 'couponCode',
      align:'center',
    }, {
      title: '状态',
      dataIndex: 'couponState',
      key: 'couponState',
      align:'center',
      render:(val) => {
        switch (val) {
          case 0:
              return <span>待生效</span>
          case 1:
              return <span>待领取</span>
          case 2:
              return <span style={{color:'#ed7d31'}}>·未使用</span>
          case 3:
              return <span>兑换券(未使用)</span>
          case 4:
              return <span style={{color:'#FD0018'}}>·已过期</span>
          case 5:
              return <span style={{color:'#FD0018'}}>·流标</span>
          case 6:
              return <span>已使用</span>
      }
    }
    }, {
      title: '操作',
      dataIndex: 'do',
      align:'center',
      render: (text,record) => {
        return(
          <a style={{color:'#669bff'}} onClick={()=>{this.see(record,'used')}}>查看</a>
        )  
      },
    },
  ];

  const locale = {
    filterTitle: '筛选',
    filterConfirm: '确定',
    filterReset: '重置',
    emptyText: '暂无数据',
  }
        return(
         <div>
              <LeftMenu param={this.props} />
              <div className="fr uc-rbody my-coupon " style={{padding: 0}}>
              {
                this.state.showSeeCoupon ? <SeeCoupon close={this.close} couponInfo={this.state.couponInfo} type={this.state.type}/> : null
              }
              {
                 this.state.showAlreadyCoupon ?   <Already-Coupon couponInfo={this.state.couponInfo} close={this.close}/> :null
              }
              {
                this.state.showFailedCoupon ? <UsedCoupon couponInfo={this.state.couponInfo} close={this.close}/> : null
              }
              {
                this.state.SendCouponShow ? <SendCoupons close={this.close_} project={this.state.project}  dataInfo={this.state.dataInfo}/> : null
              }
                
                
                  <div className="graph-box">
                  <div className="tit clearfix">
                    <p className="fl">
                      <span className={this.state.chart === 'bar' ? "act" : ''} onClick={()=>{this.changeChart('bar')}}>优惠券使用统计</span>
                      <span className={this.state.chart === 'pie' ? "act" : ''} onClick={()=>{this.changeChart('pie')}}>优惠券发放统计</span>
                    </p>

                    {
                      this.state.dataInfo.fflag === 9 ?  <p className="send fr" onClick={()=>{this.props.history.push(Path.MINE_LOAN)}} >发优惠券</p> : ( this.state.dataInfo.fflag === 15) ?  <p className="send fr" onClick={()=>{this.setState({ SendCouponShow:true})}} >发优惠券</p> : <Tooltip title="您还没有可以发放优惠券的项目" arrowPointAtCenter className="fr_" >发优惠券</Tooltip>
                    }

                  </div>
                  {
                    this.state.chart === 'bar'  ? 
                      <div className="graph">
                        <BarE useStatistics={this.state.useStatistics} />
                      </div> :
                      <div className="graph">
                        <PieE statistics={this.state.statistics}/>
                      </div>
                   }
                </div> 

                <div className="table-box">
                  <div className="tit">
                    <p className="t1">
                      <span className={ this.state.flag === 'noUse' ? "bord": ""} onClick={()=>{this.changePage('noUse')}}>未使用</span>
                      <span className={ this.state.flag === 'alreadyUse' ? "bord": ""} onClick={()=>{this.changePage('alreadyUse')}}>已使用</span>
                      <span className={ this.state.flag === 'failed' ? "bord": ""} onClick={()=>{this.changePage('failed')}}>已失效</span>
                    </p>
                  </div>
                  {
                    this.state.flag === 'noUse' ? 
                    <div className="tab">
                      <p className="nub">共<span>{this.state.dataSourceNum ? this.state.dataSourceNum : 0}</span>张</p>
                      <Table
                       columns={columns}
                       locale = {locale}
                       pagination={false}
                       dataSource={this.state.dataSource} 
                       bordered
                       size="small" 
                      />
                       {
                       Math.ceil(this.state.dataSourceNum/this.state.pageSize) > 1 ?  
                       <Pagination 
                        total={this.state.dataSourceNum }
                        current={this.state.pageCurrent}
                        pageSize={this.state.pageSize}
                        onChange={this.onchange}
                        onShowSizeChange={this.onShowSizeChange}
                        style={{marginTop:30,textAlign:'center'}}
                        /> :null
                      }
                    </div>
                    :
                      (this.state.flag === 'alreadyUse') ?
                      <div className="tab">
                        <p className="nub">共<span>{this.state.dataSourceNum_ ? this.state.dataSourceNum_ : 0}</span>张</p>
                        <Table
                          columns={columns_}
                          locale = {locale}
                          pagination={false}  
                          dataSource={this.state.dataSource_} 
                          bordered
                          size="small" 
                          style={{padding:'0 !important' }}
                        />
                         {
                       Math.ceil(this.state.dataSourceNum_/this.state.pageSize) > 1 ?  
                       <Pagination 
                        total={this.state.dataSourceNum_ }
                        current={this.state.pageCurrent}
                        pageSize={this.state.pageSize}
                        onChange={this.onchange}
                        onShowSizeChange={this.onShowSizeChange}
                        style={{marginTop:30,textAlign:'center'}}
                        /> :null
                      }
                      </div>
                     :
                      (this.state.flag === 'failed') ?
                      <div className="tab"> 
                        <p className="nub">共<span>{this.state.dataSourceNums ? this.state.dataSourceNums :0}</span>张</p>
                        <Table
                          columns={column}
                          locale = {locale}
                          pagination={false} 
                          dataSource={this.state.dataSources}  
                          bordered
                          size="small" 
                          style={{padding:'0 !important' }}
                        />
                         {
                       Math.ceil(this.state.dataSourceNums/this.state.pageSize) > 1 ?  
                       <Pagination 
                        total={this.state.dataSourceNums}
                        current={this.state.pageCurrent}
                        pageSize={this.state.pageSize}
                        onChange={this.onchange}
                        onShowSizeChange={this.onShowSizeChange}
                        style={{marginTop:30,textAlign:'center'}}
                        /> :null
                      }
                      </div>
                      : null
                  }
                  
                </div>
              </div>
         </div>
        )
    }
}
