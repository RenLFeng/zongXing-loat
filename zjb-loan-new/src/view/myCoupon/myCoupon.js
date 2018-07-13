import React from 'react';
import $ from 'jquery';
import LeftMenu from '../../components/leftmenu/leftMenu';
import SeeCoupon from './seeCoupon/seeCoupon';
import SendCoupon from './sendCoupon/sendCoupon.js';
import BarE from './useCoupons';
import PieE from './CouponIssuance';
import './myCoupon.scss';
import { Table,Pagination } from 'antd';
import {CouponService} from '../../services/api';
import moment from 'moment';


export default class MyCoupon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag:'noUse',
      // flagCoupon:'noUse',
      showSeeCoupon:false,
      showAlreadyCoupon:false,
      showFailedCoupon:false,
      pageCurrent:1,
      pageSize:3,
      dataSource:[],    //未使用的优惠券数据
      dataSource_:[],    //已使用的优惠券数据
      dataSources:[],    //已失效的优惠券数据
      dataSourceNum:0,    //未使用总条数
      dataSourceNum_:0,    //已使用总条数
      dataSourceNums:0,    //已失效总条数
      chart:'bar',
      useStatistics:null,   //使用统计
      statistics:{},       //发放统计
      couponInfo:{}    //优惠券数据
    }
    this.close = this.close.bind(this)
  }
  componentDidMount() {
  //  $(".see").on("click",function(){
  //    $(".see-box").removeClass("none");
  //  })
    $(".send").on("click",function(){
      $(".send-coupon").removeClass("none");
    })
    $(".close").on("click",function(){
      $(".see-box,.send-coupon").addClass("none");
    })

    this.getCoupon();
  }

  async getCoupon(){
    let param = {
      pageCurrent:this.state.pageCurrent,
      pageSize:this.state.pageSize
    }
    const response = await CouponService.getCouponInfo(param);
    console.log('response====',response);
    if(response.code === 0){
      this.setState({
        dataSource:response.data.tableStatistical.unUsed.infoList,
        dataSource_:response.data.tableStatistical.used.infoList,
        dataSources:response.data.tableStatistical.invalid.infoList,
        dataSourceNum:response.data.tableStatistical.unUsed.totalNumber,
        dataSourceNum_:response.data.tableStatistical.used.totalNumber,
        dataSourceNums:response.data.tableStatistical.invalid.totalNumber,
        useStatistics:response.data.companyCouponChartsVo.useStatistical,
        statistics:response.data.companyCouponChartsVo.grantStatistical,
      })

    }
  }

  async getCouponDetail(id){
    const response = await CouponService.myCouponDetail(id);
    console.log('reskkkkkk',response);
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
       flag:'noUse'
      })
    }
    if( flags==='alreadyUse'){
      this.setState({
       flag:'alreadyUse'
      })
    }
    if( flags==='failed'){
      this.setState({
       flag:'failed'
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
  see(data){
    console.log('5555555',data)
    this.setState({
      showSeeCoupon:true,
     })
     let param = {
      couponUserId:data.couponUserId
     }
     this.getCouponDetail(param)
  }

  close(){
    this.setState({
      showSeeCoupon:false,
     })
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
              <span>{val === 1 ?'投资类' : '游客类'}</span>
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
          dataIndex: ' couponState',
          key: 'couponState',
          align:'center',

        },
        , {
          title: '操作',
          dataIndex: 'do',
          align:'center',
          render: (text,record) => {
            return(
              <a style={{color:'#669bff'}} >查看</a>
              // <a style={{color:'#669bff'}} onClick={()=>{this.see(record)}}>查看</a>
            )
          },
        },
  ];

  const columns_ = [{
        title: '使用日期',
        dataIndex: 'consumeTime',
        key: 'consumeTime',
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
      }, {
        title: '优惠券编码',
        dataIndex: 'couponCode',
        key: 'couponCode',
        align:'center',
      }, {
        title: '状态',
        dataIndex: ' couponState',
        key: 'couponState',
        align:'center',
      }, {
        title: '操作',
        dataIndex: 'do',
        align:'center',
        render: (text,record) => {
          return(
            <a style={{color:'#669bff'}} onClick={()=>{console.log(record)}}>查看</a>
          )
        },
      },
  ];

  const column = [{
      title: '失效日期',
      dataIndex: 'endTime',
      key: 'endTime',
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
    }, {
      title: '优惠券编码',
      dataIndex: 'couponCode',
      key: 'couponCode',
      align:'center',
    }, {
      title: '状态',
      dataIndex: ' couponState',
      key: 'couponState',
      align:'center',
    }, {
      title: '操作',
      dataIndex: 'do',
      align:'center',
      render: (text,record) => {
        return(
          <a style={{color:'#669bff'}} onClick={()=>{console.log(record)}}>查看</a>
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
              <div className="fr uc-rbody my-coupon ">
              {
                this.state.showSeeCoupon ? <SeeCoupon close={this.close} couponInfo={this.state.couponInfo}/> : null
              }
                <SendCoupon />

                  <div className="graph-box">
                  <div className="tit clearfix">
                    <p className="fl">
                      <span className={this.state.chart === 'bar' ? "act" : ''} onClick={()=>{this.changeChart('bar')}}>优惠券使用统计</span>
                      <span className={this.state.chart === 'pie' ? "act" : ''} onClick={()=>{this.changeChart('pie')}}>优惠券发放统计</span>
                    </p>
                    <p className="send fr">发优惠券</p>
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
                       style={{padding:'0 !important' }}
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
