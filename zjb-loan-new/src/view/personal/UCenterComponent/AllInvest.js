import React from 'react';
import { Link } from 'dva/router';
import PieReact from '../../components/Echarts/PieReact';
import LineReact from '../../components/Echarts/LineReact'
import Path from '../../common/pagePath';
import {connect} from 'dva';
import { Select, message } from 'antd';
import moment from 'moment';
import BarReact from '../../components/Echarts/BarReact';
import { selectYearInvest } from '../../services/api';
import LeftMenu from '../../components/UCenterComponent/leftMenu';

const Option = Select.Option;
@connect((state)=>({
  personal: state.account.personal,
  openStatus: state.account.openStatus,
  errorMessage: state.account.message
}))

export default class AllInvest extends React.Component {
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
              {value:0, name:'可用余额'},
              {value:0, name:'冻结金额'},
              {value:0, name:'待收本金'},
              {value:0, name:'待收收益'}
            ]
          }
        ]
      },
      // 年度值
      barOption: {
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data:['投资成功金额','流标金额','待放款金额']
        },
        xAxis: {
          axisTick: {show: false},
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        },
        yAxis: {
          type: 'value',
          name: '元'
        },
        series: [{
            itemStyle: {
              normal: {color: '#03B9CB'}
            },
            barGap: 0,
            name:'投资成功金额',
            data: [320, 332, 301, 334, 390, 330, 320],
            type: 'bar'
          },
          {
            itemStyle: {
              normal: {color: '#F84B23'}
            },
            name:'流标金额',
            type:'bar',
            data:[320, 123, 301, 334, 123, 330, 320]
          },
          {
            itemStyle: {
              normal: {color: '#FF9900'}
            },
            name:'待放款金额',
            type:'bar',
            data:[320, 332, 123, 334, 390, 123, 320]
          },]
      },
      // 可选年份
      selectYear: [],
      yearValue: parseInt(moment().format('YYYY')),
      investData: {
        all:{},
        refundList: [],
        successList: [],
        waitAuditList: []
      }
    };

  }

  componentDidMount() {
    this.getInitData();
    this.calYear();
    this.getYearInvest();
  }

  // 获取年度投资总览
  async getYearInvest() {
    const res = await selectYearInvest(this.state.yearValue);
    console.log(res);
    if (res.code === 0) {
      this.setState({
        investData: {
          ...res.data,
          refundList: this.packageData(res.data.refundList),
          successList: this.packageData(res.data.successList),
          waitAuditList: this.packageData(res.data.waitAuditList),
        }
      }, () => {
        console.log(this.state.investData)
        this.setState({
          barOption: {
            tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              data:['投资成功金额','流标金额','待放款金额']
            },
            xAxis: {
              axisTick: {show: false},
              type: 'category',
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            },
            yAxis: {
              type: 'value',
              name: '元'
            },
            series: [{
              itemStyle: {
                normal: {color: '#03B9CB'}
              },
              barGap: 0,
              name:'投资成功金额',
              data: this.state.investData.successList,
              type: 'bar'
            },
              {
                itemStyle: {
                  normal: {color: '#F84B23'}
                },
                name:'流标金额',
                type:'bar',
                data:this.state.investData.refundList
              },
              {
                itemStyle: {
                  normal: {color: '#FF9900'}
                },
                name:'待放款金额',
                type:'bar',
                data:this.state.investData.waitAuditList
              },]
          }
        })
      });

    } else {
      res.msg && message.error(res.msg);
    }
  }

  // 循环制造柱状图数据
  packageData(initData) {
    let arr = [];
    for (let i=1;i<=12;i++) {
      arr[i-1] = 0;
      for (let obj of initData) {
        if (obj.MONTH == i) {
          arr[i-1] = obj.money;
          break;
        }
      }
    }
    return arr;
  }

  // 计算可查询年份
  calYear() {
    //初始年份
    const INIT_YEAR = 2018;
    //当前年份
    let currentYear = parseInt(moment().format('YYYY'));
    let yearArr = [];
    while (currentYear>=INIT_YEAR) {
      yearArr.push(currentYear);
      currentYear--;
    }
    this.setState({
      selectYear: yearArr
    })
  }

  getInitData() {
    this.props.dispatch({
      type: 'account/getPersonalAccount',
      payload:{showNumInfo:4}
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.personal !== nextProps.personal) {
      const money = nextProps.personal.totalAssets;
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

  // 切换选择
  changeSelect(val) {
    this.setState({
      yearValue:val
    }, ()=> {
      this.getYearInvest();
    })
  }

  render() {
    const { openStatus, errorMessage } = this.props;
    if (openStatus === 0) {
      return (
        <div className="fr uc-rbody">
          <span>您还没有开通个人账户，开通 <Link to={Path.REALNAME_AUTHENTICATION} style={{color: 'blue'}}>点击此处</Link></span>
        </div>
      );
    } else if (openStatus === 1) {
      return (
        <div className="fr uc-rbody">
          <span>您的账户开户中，可<a style={{color: 'blue'}} onClick={()=>this.getInitData()}>刷新</a>查看</span>
        </div>
      );
    } else if (openStatus === 2) {
      return (
        <div className="fr uc-rbody">
          <span>您的账户开户失败，原因：{errorMessage} ,可重新尝试开通，<Link to={Path.REALNAME_AUTHENTICATION} style={{color: 'blue'}}>点击此处</Link></span>
        </div>
      );
    }
    return (
      <div>
        <LeftMenu param={this.props}/>
        <div className="fr uc-rbody">
          <div className="ptit">
            <i>账户总资产</i>
            <b>{(this.props.personal.totalAssets.totalAssets+'').fm()}</b>
            <em>单位：元</em>
          </div>
          <div className="tright hd1" style={{margin: '20px 0 100px 0'}}>
            <a className="fl">
              <i>累计充值</i>
              <b className="f18">{(this.props.personal.totalAssets.totalRecharge+'').fm()}</b>
            </a>
            <a className="fl">
              <i>累计提现</i>
              <b className="f18">{(this.props.personal.totalAssets.totalWithdrawals+'').fm()}</b>
            </a>
          </div>
          <div className="border shadow box1">
            <div className="pieDiv">
              <div>
                <span style={{fontSize: '22px'}}>{(this.props.personal.totalAssets.totalAssets+'').fm()}</span>
                <span style={{fontSize: '14px'}}>账户总资产</span>
              </div>
            </div>
            <PieReact width='500px' height="200px"  option={this.state.pieOption}/>
            <div className="coupon">
              <i className="c6">优惠券</i>
              <i className="fr">{(this.props.personal.totalAssets.capitalCoupon+'').fm()}</i>
            </div>
          </div>
          <div className="hd2 clearfix" style={{position: 'relative'}}>
            <a className="fl hover">投资统计</a>
            {/*<i className="fl">|</i><a className="fl hover">还款计划</a>*/}
            <Select style={{width: 200, float: 'right',top: 10}} value={this.state.yearValue} onChange={(val)=>this.changeSelect(val)}>
              {
                this.state.selectYear.map((data, index)=>{
                  return (
                    <Option value={data} key={index}>{`${data}至${data+1}年度投资总览`}</Option>
                  )
                })
              }
            </Select>
          </div>
          <div style={{width: '100%'}}>
            <div style={{margin: '0 auto',width: '70%', position: 'relative'}}>
              <div style={{float: 'left'}}>
                <span style={{display: 'block', borderLeft: '2px solid #FF9900', paddingLeft: 8,fontSize: 16}}>年度投资项目数</span>
                <b style={{marginLeft: 8,fontSize: 16}}>{this.state.investData.all?this.state.investData.all.projectCount: 0}个</b>
              </div>
              <div style={{float: 'right'}}>
                <span style={{display: 'block', borderLeft: '2px solid #FF9900', paddingLeft: 8,fontSize: 16}}>年度投资金额</span>
                <b style={{marginLeft: 8,fontSize: 16}}>{`${this.state.investData.all?this.state.investData.all.money: '0'}`.fm()}</b>
              </div>
            </div>
          </div>
          <BarReact
            height="500px"
            width="1100px"
            margin="0 0 0 -80px"
            option={this.state.barOption}
          />
        </div>
      </div>
     
    );
  }
}
