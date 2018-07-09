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

@connect((state)=>({
  personal: state.account.personal,
  openStatus: state.account.openStatus,
  errorMessage: state.account.message
}))

export default class PersonAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 个人中心 饼图
      pieOption: {
        tooltip: {
          trigger: 'item',
        },
        color: ['#03B9CB', '#F84B23', '#8BC25B', '#FD9F09', '#C7C7C7'],
        legend: {
          orient: 'vertical',
          x: 'right',
          align: 'left',
          itemGap: 20,
          textStyle: {
            fontFamily: 'Arial',
            fontSize: 16,
            rich:{
              b:{
                fontSize:16,
                align:'right',
                padding:[0,10,0,0],
                width: 100,
                fontWeight: 'bold',
              },
              c:{
                fontSize:16,
                align:'right',
                padding:[0,10,0,0],
                width: 100,
                fontWeight: 'bold',
                color: '#FF6600'
              }
            }
          },
          formatter:  function(name){
            if (name==='可用余额') {
              return `${name}  {c|0.00}`
            } else if (name === '冻结金额') {
              return `${name}  {b|0.00}`
            } else if (name === '待收金额') {
              return `${name}  {b|0.00}`
            } else {
              return `${name}  {b|0.00}`
            }
          },
          left: '60%',
          y: 'center',
          data:[{
            name: '可用余额',
            icon: 'circle'
          },{
            name: '冻结金额',
            icon: 'circle'
          },{
            name: '待收本金',
            icon: 'circle'
          },{
            name: '待收利息',
            icon: 'circle'
          }]
        },
         grid: {
           right: '70%'
         },
        series: [
          {
            name:'金额',
            type:'pie',
            radius: ['100%', '90%'],
            center: ['20%', '50%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data:[
              {value:0, name:'可用余额'},
              {value:0, name:'冻结金额'},
              {value:0, name:'待收本金'},
              {value:0, name:'待收利息'}
            ]
          }
        ]
      },
      // 个人账户 折线图
      lineOption: {
        xAxis: {
          type: 'value',
          nameLocation: 'end',
          minInterval: 1,
          min: 1,
          max: 12,
          scale: true,
          interval: 1,
          name: '月'
        },
        yAxis: {
          name: '元'
        },
        series: [{
          data: [],
          type: 'line',
          lineStyle: {
            color: '#FEA063'
          },
          itemStyle: {
            color: '#28F3AD'
          }
        }]
      },
      couponList: [
      ],
      allMoney: 0, // 待收总额
      daishoubenjin: 0, // 待收本金
      daishoulixi: 0,//待收利息
      showType: 'biaoge',
      reMoneyList: [{name: 1}, {name: 2}],
      infoList: [],
      pageParam: {
        pageCurrent: 1,
        pageSize: 10,
        total: 0,
      },
    };
    this.reMoneyColumn = [
      {
        align: 'center',
        title: '序号',
        className: 'per_table_font',
        width: '5%'
      },
      {
        align: 'center',
        title: '回款日期',
        className: 'per_table_font',
        width: '8%'
      },
      {
        align: 'center',
        title: '项目名称',
        className: 'per_table_font',
        width: '12%'
      },
      {
        align: 'center',
        title: '本金',
        className: 'per_table_font',
        width: '8%'
      },
      {
        align: 'center',
        title: '利息',
        className: 'per_table_font',
        width: '8%'
      },
      {
        align: 'center',
        title: '佣金',
        className: 'per_table_font',
        width: '8%'
      },
      {
        align: 'center',
        title: '当期回款总额',
        className: 'per_table_font',
        width: '12%'
      },
      {
        align: 'center',
        title: '回款状态',
        className: 'per_table_font',
        width: '8%'
      },
      {
        align: 'center',
        title: '项目编号',
        className: 'per_table_font',
        width: '12%'
      },
    ];
    this.jumpRecharge = this.jumpRecharge.bind(this);
  }

  componentDidMount() {
    console.log(this.props.openStatus);
    this.getInitData();
    this.initFetchSafeData();
    this.getAccountStatement();
    
  }

  // 初始化安全中心首页数据
  initFetchSafeData= () => {
    this.props.dispatch({
      type: 'safeCenter/getSafe',
    });
  };

  // 获取优惠券数据
  async getCouponList() {
    if (this.state.loadingPage) {
      return;
    }
    this.setState({loadingPage: true});
    const response= await personal.getAccountCoupon(this.state.pageParam);
    this.setState({loadingPage: false});
    console.log('getCouponList', response);
    if (response.code === 0) {
      this.setState({
        pageParam: {
          ...this.state.pageParam,
          total: response.data.totalNumber
        },
        couponList: response.data.infoList
      })
    } else {
      response.msg && message.error(response.msg);
    }
  }

  // 获取回款计划折线图数据
  async getReceivePlan() {
    const response = await personal.repayPlan(); 
    if (response.code === 0) {
      let planArr = [];
      for (let obj of response.data.list) {
        planArr.push([obj.month, obj.money])
      }
      this.setState({
        allMoney:  response.data.money, // 待收总额
        daishoubenjin: response.data.principal, // 待收本金
        daishoulixi: response.data.interest,//待收利息
        lineOption: {
          tooltip : {
            trigger: 'axis',
            formatter: function (params) {
              params = params[0];
              return `${params.axisValue}月
              回款${params.data[1]}元`
            },
          },
          xAxis: {
            type: 'value',
            nameLocation: 'end',
            minInterval: 1,
            min: 1,
            max: 12,
            scale: true,
            interval: 1,
            name: '月'
          },
          yAxis: {
            name: '元'
          },
          series: [{
            data: planArr,
            type: 'line',
            lineStyle: {
              color: '#FEA063'
            },
            itemStyle: {
              color: '#28F3AD'
            }
          }]
        },
      })
    } else {
      response.msg && message.error(response.mag);
    }

  }

  getInitData() {
    this.props.dispatch({
      type: 'account/getPersonalAccount',
      payload:{
        showNumInfo:4,
        // jumpAuth:()=>this.jumpAuth()
        jumpAuth:()=>this.jumpAuth()
      }
    });
  }

  jumpAuth() {
    var that = this;
    that.props.history.push('/index/uCenter/realName');
  }

  async getAccountStatement() {
    let param = { 
      busTypeCode:this.state.activeCode==='0000'?null:this.state.activeCode,
      pageCurrent: 1, 
      pageSize: 10
    }; 
    //调用后台
    const res = await accountService.getAccountStatement(param); 
    if (res.code === 0) {
      this.setState({
        infoList:res.data.infoList, 
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.personal !== nextProps.personal) {
      const money = nextProps.personal.totalAssets;
      const data = nextProps.personal;
      this.getReceivePlan();
      this.getCouponList();
      // 回款计划
      const plan = nextProps.personal.plan?nextProps.personal.plan: [];
      let planArr = [];
      for (let obj of plan) {
        planArr.push([obj.month, obj.money])
      }
      this.setState({
        pieOption: {
          tooltip: {
            trigger: 'item',
          },
          color: ['#03B9CB', '#F84B23', '#8BC25B', '#FD9F09', '#C7C7C7'],
          legend: {
            orient: 'vertical',
            x: 'right',
            align: 'left',
            itemGap: 20,
            textStyle: {
              fontFamily: 'Arial',
              fontSize: 16,
              rich:{
                b:{
                  fontSize:16,
                  align:'right',
                  padding:[0,10,0,0],
                  width: 100,
                  fontWeight: 'bold',
                },
                c:{
                  fontSize:16,
                  align:'right',
                  padding:[0,10,0,0],
                  width: 100,
                  fontWeight: 'bold',
                  color: '#FF6600'
                }
              }
            },
            formatter:  function(name){
              if (name==='可用余额') {
                return `${name}       {c|${(money.availableBalance+'').fm()}}`
              } else if (name === '冻结金额') {
                return `${name}       {b|${(money.freezingAmount+'').fm()}}`
              } else if (name === '待收本金') {
                return `${name}       {b|${`${money.collectPrincipal}`.fm()}}`
              } else {
                return `${name}       {b|${`${money.collectInterest}`.fm()}}`
              }
            },
            left: '50%',
            y: 'center',
            data:[{
              name: '可用余额',
              icon: 'circle'
            },{
              name: '冻结金额',
              icon: 'circle'
            },{
              name: '待收本金',
              icon: 'circle'
            },{
              name: '待收利息',
              icon: 'circle'
            }]
          },
          grid: {
            right: '70%'
          },
          series: [
            {
              name:'金额',
              type:'pie',
              radius: ['100%', '90%'],
              center: ['20%', '50%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:[
                {value:money.availableBalance, name:'可用余额'},
                {value:money.freezingAmount, name:'冻结金额'},
                {value:money.collectPrincipal, name:'待收本金'},
                {value:money.collectInterest, name:'待收利息'}
              ]
            }
          ]
        },
      });
    }
  }

  jumpRecharge(accoundId) {
    this.props.history.push({pathname: Path.ACCOUNT_RECHARGE, state: {account:accoundId}})
  };
  jumpRecharge_(accoundId) { 
    this.props.history.push({pathname: Path.ACCOUNT_WITHDRAWALS, state: {account:accoundId}})
  };

  clickCoupon = (data) => { 
    if (data.fflag == 1) {
      this.receiveCoupon(data.fcoupon_id)
    }
  };

  // 领取优惠券
  async receiveCoupon(fid) {
    if (this.state.receiveLoading) {
      return;
    }
    this.setState({receiveLoading: true});
    const response = await CouponService.receiveCoupon({couponId :fid});
    this.setState({receiveLoading: false});
    if (response.code === 0) {
      this.getCouponList();
      this.reashLoginData();
    } else {
      response.msg && message.error(response.msg);
    }
  }

  async reashLoginData(){
    const response = await personal.getLoginData(); 
    if (response.code === 0) {
        this.props.dispatch({type: 'login/saveLoadingDataAfter', response: response.data})
    }
  }

  render() {
    const { openStatus, errorMessage } = this.props;
    console.log(openStatus === 0,'openStatus')
    if (openStatus === 1) {
      return (
        <div> 
          <div className="fr uc-rbody" style={{backgroundColor: '#fff',padding: 30}}>
            <span>您的账户开户中，可<a style={{color: 'blue'}} onClick={()=>this.getInitData()}>刷新</a>查看</span>
          </div>
        </div>
      );
    } else if (openStatus === 2) {
      return (
        <div>
          {/* <LeftMenu param={this.props}/> */}
          <div className="fr uc-rbody" style={{backgroundColor: '#fff',padding:30}}>
            <span>您的账户开户失败，原因：{errorMessage} ,可重新尝试开通，<Link to={Path.OPENQACCOUNT} style={{color: 'blue'}}>点击此处</Link></span>
          </div>
        </div>
      );
    }
    if (this.props.personal.totalAssets.totalAssets==null) {
      return null;
    }
    return (
      <div>
        <LeftMenu param={this.props}/>  
        <div className="per_account">
          <div className="ptit">
            <i>当前借款金额</i>
            <span>￥{this.props.personal.totalAssets.totalAssets?(this.props.personal.totalAssets.totalAssets.add(this.props.personal.totalAssets.collectPrincipal).add(this.props.personal.totalAssets.collectInterest)+'').fm():'0.00'}</span>
            <em>单位：元</em>
          </div>
          <div className="sub-info">
              <i>累计利息支出</i>
              <span >{(this.props.personal.totalAssets.totalInterest+'').fm()}</span>
              <i>累计借款金额</i>
              <span >{(this.props.personal.totalAssets.totalInvMoney+'').fm()}</span>
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
