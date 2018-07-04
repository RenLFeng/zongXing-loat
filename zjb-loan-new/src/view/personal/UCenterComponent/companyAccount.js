import React from 'react';
import { Link } from 'dva/router';
import {Select,Form} from 'antd';
import PieReact from '../../components/Echarts/PieReact';
import LineReact from '../../components/Echarts/LineReact';
import Path from '../../common/pagePath';
import {getPersonAccount} from '../../services/api';
import {connect} from 'dva';
import moment from "moment/moment";
import { AUTH_ADDRESS } from '../../common/systemParam';
import LeftMenu from '../../components/UCenterComponent/leftMenu';

const FormItem = Form.Item;
@connect((state) => ({
  company: state.account.company,
  companyStatus: state.account.companyStatus,
  companyList: state.account.companyList,
  companyListStatus: state.account.companyListStatus,
  company_page: state.account.company_page
}))
export default class CompanyAccount extends React.Component {
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
            } else if (name === '待收收益') {
              return `${name}  {b|0.00}`
            } else {
              return `${name}  {b|100.01}`
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
            name: '待收收益',
            icon: 'circle'
          },{
            name: '待还总额',
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
              {value:0, name:'待收收益'},
              {value:0, name:'待还总额'}
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
          data: [[1, 20], [2, 400], [3, 5000]],
          type: 'line',
          lineStyle: {
            color: '#FEA063'
          },
          itemStyle: {
            color: '#28F3AD'
          }
        }]
      },
      // 显示的企业公司Id
      companyId: '',
      companyData: {},
    }
  }

  componentDidMount() {
    // 获取公司账户数据
    this.props.dispatch({
      type: 'account/getCompanyLists',
      payload: ''
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props.companyList);
    if (this.props.companyList !== nextProps.companyList && nextProps.companyList.length > 0) {
      this.setState({
        companyId: nextProps.companyList[0].companyNo
      });
      this.props.dispatch({
        type: 'account/getCompanyAccount',
        payload: {
          showNumInfo: 4,
          zjbNo: nextProps.companyList[0].companyNo
        }
      })
    }
    if (this.props.company_page !== nextProps.company_page) {
      const money = nextProps.company_page.totalAssets;
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
                return `${name}  {c|${(money.availableBalance+'').fm()}}`
              } else if (name === '冻结金额') {
                return `${name}  {b|${(money.freezingAmount+'').fm()}}`
              } else if (name === '待收本金') {
                return `${name}  {b|${(money.collectPrincipal+'').fm()}}`
              } else {
                return `${name}  {b|${(money.collectInterest+'').fm()}}`
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
              name: '待收收益',
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
                {value:money.collectInterest, name:'待收收益'}
              ]
            }
          ]
        }
      })
    }
  }


  jumpRecharge(accoundId) {
    this.props.history.push({pathname: Path.ACCOUNT_RECHARGE, state: {account:accoundId}})
  }

  jumpRecharge_(accoundId) {
    console.log(accoundId);
    this.props.history.push({pathname: Path.ACCOUNT_WITHDRAWALS, state: {account:accoundId}})
  }

  // 获取选择的公司账户信息
  changeCompanyData(val) {
    this.setState({
      companyId: val
    });
    this.props.dispatch({
      type: 'account/getCompanyAccount',
      payload: {
        showNumInfo: 4,
        zjbNo: val
      }
    })
  }

  companyRender() {
    console.log(this.props.company_page);
    return (
      <div >
        <LeftMenu param={this.props}/>
        <div className="ptit">
          <i>账户总资产</i>
          <b>{(this.props.company_page.totalAssets.totalAssets+'').fm()}</b>
          <em>单位：元</em>
        </div>
        <div className="tright hd1">
          <a className="fl">
            <i>累计充值</i>
            <b className="f18">{(this.props.company_page.totalAssets.totalRecharge+'').fm()}</b>
          </a>
          <a className="fl">
            <i>累计提现</i>
            <b className="f18">{(this.props.company_page.totalAssets.totalWithdrawals+'').fm()}</b>
          </a>
          <a className="btn btn1" onClick={()=>window.open(AUTH_ADDRESS)}>实名认证</a>
          <a className="btn btn1" onClick={()=>this.jumpRecharge(this.props.company_page.totalAssets.accountId)}>充值</a>
          <a className="btn btn2" onClick={()=>this.jumpRecharge_(this.props.company_page.totalAssets.accountId)}>提现</a>
          {/*<a className="btn btn3">好友转账</a>*/}
        </div>
        <div className="border shadow box1">
          <div className="pieDiv">
            <div>
              <span style={{fontSize: '22px'}}>{(this.props.company_page.totalAssets.totalAssets+'').fm()}</span>
              <span style={{fontSize: '14px'}}>账户总资产</span>
            </div>
          </div>
          <PieReact width='500px' height="200px"  option={this.state.pieOption}/>
          <div className="coupon">
            <i className="c6">代金券</i>
            <i className="fr">{(this.props.company_page.totalAssets.capitalCoupon+'').fm()}</i>
          </div>
        </div>

        <div className="hd2 clearfix">
          <a className="fl">回款计划</a><i className="fl">|</i><a className="fl hover">还款计划</a>
          <a className="fr">更多 &gt;&gt;</a>
        </div>
        <div>
          <LineReact height="450px" width="900px" option={this.state.lineOption}/>
        </div>

        <div className="hd3">
          <a className="fl">资金动态</a>
          <a className="fr">查看更多 &gt;&gt;</a>
        </div>
        <div>
          <div className="timetree">
            <div className="end"/>
            <div className="list">
              {
                this.props.company_page.accountDynamicVos.map((data,index) => {
                  let year_ = moment(data.time).format('YYYY');
                  let month = moment(data.time).format('MM-DD');
                  return(
                    <div className="item" key={index}>
                      <p className="date">
                        <i className="y">{year_}</i><br /><i className="d">{month}</i>
                      </p>
                      <i className="cc"/>
                      <p className="text">{data.remark} {data.inMoney=== 0 ? null : `收入: ${(data.inMoney+'').fm()}元`} { data.outMoney === 0 ? null : `支出: ${(data.outMoney+'').fm()}元`}</p>
                    </div>
                  );
                })
              }
            </div>
            <div className="start"/>
          </div>
        </div>
      </div>
    );
  }

  render() {
    console.log(this.props.company_page.totalAssets);
    return (
      <div className="fr uc-rbody">
        { this.props.companyList.length !== 0 ?
        <Select value={this.state.companyId} onChange={(val)=>this.changeCompanyData(val)} style={{width: 500, marginBottom: 30}}>
          {this.props.companyList.map((data) => {
            return (
              <Select.Option value={data.companyNo} key={data.companyId}>{data.companyName}</Select.Option>
            );
          })}
        </Select> : null }
        { this.props.companyList.length === 0?
          <div>
            <span>您还没有开通企业账户，开通 <Link to={Path.OPEN_ACCOUNT + '/1'} style={{color: 'blue'}}>点击此处</Link></span>
          </div> : null
        }
        {this.props.companyList.length !== 0 ? this.companyRender.call(this ) : null}
      </div>
    );

  }
}


