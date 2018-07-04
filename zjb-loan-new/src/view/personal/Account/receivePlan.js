import React from 'react';
import {message, Pagination} from 'antd'; 
import moment from 'moment';
import LeftMenu from '../UCenterComponent/leftMenu' 
import '../../assets/ucenter/receivePlan.scss';
import LineReact from '../../components/Echarts/LineReact';
import { receivePlanByTop, receivePlanByTime, receivePlanByBottom } from '../../services/api';
import Sideslip from '../../components/Sideslip/Sideslip.js'
import CouponList from '../../components/couponList/couponList.js';
export default class ReceivePlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCurrent: 1, //当前页，初始值为第一页
      pageSize: 10,    //每页可显示的消息条数
      maxPage: 0,     //最大页
      arr: [],
      num:0,  //总条数
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
        tooltip: {
          trigger: 'axis'
        },
        yAxis: {
          name: '元'
        },
        grid: {
          width: 800,
          left: '6%'
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
      lastRepayBill: null, // 最近一次回款计划
      count: 0,
      showPro: true, // 按项目查看
      interest: 0, // 待收利息
      money: 0, // 待回款总额度
      principal: 0, // 待收本金
      year: '',
      timePageList: [],
      timePageParam: {  // 按时间查看翻页
        pageSize: 8,
        pageCurrent: 1,
        total: 0
      },
      proPageList: [],
      proPageParam: { // 按项目查看翻页
        pageSize: 4,
        pageCurrent: 1,
        total: 0
      },
      allMoney: 0, // 已回款总额
      receivePrincipal: 0, //已收本金
      receiveInterest: 0, //已收利息
    }
  }

  componentDidMount() {
    this.renderCanvas();
    this.getReceivePlanTopData();
    this.getReceivePlanByTime();
    this.getReceivePlanByPro();
  } 

  // 获取回款计划顶部数据
  async getReceivePlanTopData() {
    const response = await receivePlanByTop();
    if (response.code === 0) {
      // 生成全部回款折线图数据结构
      let planArr = [];
      for (let obj of response.data.repayPlanView) {
        planArr.push([obj.month, obj.money]);
      }
      // 
      this.setState({
        interest: response.data.interest,
        money: response.data.money,
        principal: response.data.principal,
        count: response.data.count,
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
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              const data = params[0];
              const money = data.data[1];
              return `${data.axisValue}月
              ${`${money}`.fm()}元`;
            }
          },
          grid: {
            width: 800,
            left: '6%'
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
        }
      });
    } else {  
      response.msg && message.error(response.msg);
    }
  }

  // 按时间获取回款计划数据
  async getReceivePlanByTime() {
    if (this.state.planByTimeLoading) {
      return;
    }
    this.setState({planByTimeLoading: true});
    const response = await receivePlanByTime({
      pageParam: this.state.timePageParam,
      year: this.state.year.toString()
    });
    if (response.code === 0) {
      this.setState({
        timePageParam: {
          ...this.state.timePageParam,
          total: response.data.totalNumber
        },
        timePageList: response.data.infoList
      })
    } else {
      response.msg && message.error(response.msg);
    }
  }
  // 按项目获取数据
  async getReceivePlanByPro() {
    if (this.state.planByProLoading) {
      return;
    }
    this.setState({planByProLoading: true});
    const response = await receivePlanByBottom(this.state.proPageParam);
    this.setState({planByProLoading: false});
    if (response.code === 0) {
      this.setState({
        proPageParam: {
          ...this.state.proPageParam,
          total: response.data.totalNumber
        },
        proPageList: response.data.list,
        allMoney: response.data.money, // 已回款总额
        receivePrincipal: response.data.principal, //已收本金
        receiveInterest: response.data.interest, //已收利息
      })
    } else {
      response.msg && message.error(response.msg);
    }
  }
  // 按时间获取翻页
  handlerPageChange = (page) => {
    this.setState({timePageParam: {...this.state.timePageParam, pageCurrent: page}},()=> {
      this.getReceivePlanByTime();
    })
  }
  // 按项目翻页
  handlerPageChange = () => {
    this.setState({proPageParam: {...this.state.proPageParam, pageCurrent: page}},()=> {
      this.getReceivePlanByPro();
    })
  }
  // 使用年份切换 
  switchYear(param){
    this.setState({
      timePageParam: {
        pageSize: 8,
        pageCurrent: 1,
        total: 0
      },
      year: param.toString()
    }, ()=> {
      this.getReceivePlanByTime();
    });
  } 
  // 渲染圆图
  renderCanvas() {
    const canvasDom = this.canvas;
  }

  

  render() { 
    let success = true;
    return (
      <div>
        <LeftMenu param={this.props}/>
        <div className="fr uc-rbody"> 
          <div className="rp_top">
            <span className="rp_top_left" onClick={()=>this.sideslip.showModal()}>回款计划</span>
            <span className="rp_top_right">目前共有<span style={{color: '#ff9900'}}>{this.state.count}个</span>项目正在回款</span>
          </div>
          {this.state.lastRepayBill ? 
            <div className="rp_current_plan">
              <span className="rp_title">·<span style={{paddingLeft: '9px', fontSize: '18px', color: '#333', fontWeight: 'normal'}}>近期回款</span></span>
              <div className="rp_content">
                {/* 时间 */}
                <span className="rp_content_time">{moment().format('YYYY/MM/DD')}</span>
                <div className="rp_content_step">
                  <div className="rp_content_step_circle"/>
                  <div className="rp_content_step_line"/>
                </div>
                <div className="rp_content_moeny_div">
                  <span style={{display:'block'}}>￥500&nbsp;&nbsp;&nbsp;&nbsp;本金:500.00&nbsp;&nbsp;&nbsp;&nbsp;利息:45.00&nbsp;&nbsp;&nbsp;&nbsp;佣金:32.00</span>
                  <span style={{display: 'block', marginTop: '16px'}}>6/12期回款</span>
                  <span style={{display: 'block', marginTop: '4px'}}>项目编号:</span>
                  <span style={{display: 'block', marginTop: '4px'}}>项目名称:</span>
                </div>
              </div>
            </div> : 
            <div className="rp_current_plan" style={{height: 60}}>
              <span style={{display: 'inline-block',fontSize: 16, width: '100%', textAlign: 'center',color: '#a4a4a4'}}>暂无近期回款计划</span>
            </div> 
          }
        </div>  
        <div className="fr uc-rbody" style={{marginTop: 35}}> 
          <div className="rp_top" style={{border: '0px',verticalAlign:'bottom',marginTop: '-10px'}}>
            <span className="rp_top_left" style={{fontSize: '18px',marginTop: '10px'}}>全部回款</span>
            <span className="rp_top_right">
              待回款总额度:&nbsp;<span style={{color: '#ff9900'}}>￥{`${this.state.money}`.fm()}</span>&nbsp;&nbsp;&nbsp;
              待收本金:&nbsp;<span style={{color: '#ff9900'}}>￥{`${this.state.principal}`.fm()}</span>&nbsp;&nbsp;&nbsp;
              待收利息:&nbsp;<span style={{color: '#ff9900'}}>￥{`${this.state.interest}`.fm()}</span>&nbsp;&nbsp;&nbsp;
            </span>
          </div>
          <LineReact height="450px" width="900px" option={this.state.lineOption}/>
        </div>
        <div className="fr uc-rbody rp" style={{marginTop: 35}}> 
          <div className="rp_top" style={{border: 0}}>
            <div className="rp_top_left">
              <span className={`${this.state.showPro?'time_detail': 'time_detail_choose'}`} onClick={()=>this.setState({showPro: false})}>按时间查看</span>
              <span style={{color: '#f3f3f3',fontSize: 18}}>丨</span>
              <span className={`${this.state.showPro?'pro_detail_choose': 'pro_detail'}`} onClick={()=>{this.setState({showPro: true})}}>按项目查看</span>
            </div>
            {this.state.showPro ? null: 
              <div className="rp_top_right">
                <span className={`${this.state.year.length===0?'time_detail_choose':'time_detail'}`}>全部</span>
                <span className={`${this.state.year.length==moment().format('YYYY')?'time_detail_choose':'time_detail'}`} onClick={()=>this.switchYear(moment().format('YYYY'))}>{moment().format('YYYY')}</span>
                <span className={`${this.state.year.length==(moment().format('YYYY')*1+1)?'time_detail_choose':'time_detail'}`} onClick={()=>this.switchYear(moment().format('YYYY')*1+1)}>{moment().format('YYYY')*1+1}</span>
                <span className={`${this.state.year.length==(moment().format('YYYY')*1+2)?'time_detail_choose':'time_detail'}`} onClick={()=>this.switchYear(moment().format('YYYY')*1+2)}>{moment().format('YYYY')*1+2}</span>
              </div>
            }
          </div>
          
          {this.state.showPro ? 
            <div>
              {
                this.state.proPageList.length > 0 ? 
                this.state.proPageList.map((data, index)=> {
                  return (
                    <ReceiveDetail key={index} id={data.projectNo} data={data}/> 
                  )
                }) : 
                <span style={{width: '100%',fontSize: '18px', textAlign: 'center',color: '#a4a4a4', display: 'inline-block'}}>暂无数据</span>
              }
              {
                Math.ceil(this.state.proPageParam.total/this.state.proPageParam.pageSize)>1?<div className='page_switch'>
                  <Pagination current={this.state.proPageParam.pageCurrent} pageSize={this.state.proPageParam.pageSize} onChange={this.handlerPageChange} total={this.state.proPageParam.total} />
                </div>:null
              } 
              {this.state.proPageList.length > 0 ?
                <span style={{display:'inline-block',width: '100%',textAlign: 'right', marginTop: 10,fontSize: 12, color: '#A4A4A4'}}>
                  已回款总额：<span style={{color: '#ff9900'}}>￥{`${this.state.allMoney}`.fm()}</span>
                  &nbsp;已收本金：<span style={{color: '#ff9900'}}>￥{`${this.state.receivePrincipal}`.fm()}</span>
                  &nbsp;已收利息：<span style={{color: '#ff9900'}}>￥{`${this.state.receiveInterest}500`.fm()}</span>
                </span> : null} 
            </div> :
            <div className="rp_detail_time_div">
              {/* 按照时间查看样式 */}
              {this.state.timePageList.length > 0 ? this.state.timePageList.map((data, index)=> {
                return (
                  <div className="rp_detail_time_item" key={index} style={{fontSize:16}}>
                    <div className="rp_detail_time_item_left">
                      <span style={{color:'#666666'}}>{moment(data.fforPayTime).format('YYYY/MM/DD')}</span>
                    </div>
                    <div className="rp_detail_time_item_center" >
                      <div className="rp_detail_time_item_line" style={{height: `${data.fispay?'2px':'6px'}`, borderLeft: `${index==0?'0px solid #e6e6e6':'1px solid #e6e6e6'}`}}/>
                      { 
                        !data.fispay ? 
                        <div className="rp_detail_time_item_tip"/> :
                        <div className='rp_detail_time_item_tip_choose'>
                          <i className="zjb zjb-duihao1 rp_detail_time_item_tip_icon"/>
                        </div>
                      }
                      <div className="rp_detail_time_item_line" />
                    </div>
                    <div className="rp_detail_time_item_right" >
                      <div style={{color:'#666666'}}>
                        <span style={{color: '#ff9900',width:120}}>￥{`${data.allMoney}`.fm()}</span>
                        <span style={{marginRight:10}}>本金:</span><span style={{width:120}}>{`${data.fprincipal}`.fm()}</span>
                        <span style={{marginRight:10}}>利息:</span><span style={{width:120}}>{`${data.finterest}`.fm()}</span>
                        <span style={{marginRight:10}}>佣金:</span><span style={{width:120}}>{`${data.fkickBack}`.fm()}</span>
                      </div>
                      <div style={{ marginTop: '14px',color:'#666666'}}>{data.fsort}/{data.month}期回款</div>
                      <div style={{ marginTop: '4px',color:'#666666'}}>项目编号:&nbsp;{data.fprojectNo}</div>
                      <div style={{ marginTop: '4px',color:'#666666'}}>项目名称:&nbsp;{data.fname}</div>
                      {
                        data.fispay ? 
                        <div style={{ marginTop: '4px',color: '#ff9900'}}>到账日期:&nbsp;{moment(data.fpayTime).format('YYYY/MM/DD HH:mm')}</div>
                        :null
                      }
                    </div>
                  </div>
                );
              }): <span style={{width: '100%',fontSize: '18px', textAlign: 'center',color: '#a4a4a4', display: 'inline-block'}}>暂无数据</span>}
              
              {
                Math.ceil(this.state.timePageParam.total/this.state.timePageParam.pageSize)>1?<div className='page_switch'>
                  <Pagination  current={this.state.timePageParam.pageCurrent} pageSize={this.state.timePageParam.pageSize} onChange={this.handlerPageChange} total={this.state.timePageParam.total} />
                </div>:null
              } 
            </div>
          }   
        </div>
      </div> 
    );
  }
}

class ReceiveDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isComplete: false,
      showCircle: true,
      data: props.data
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('data' in nextProps) {
      this.setState({
        data: nextProps.data
      });
    }
  }

  render() {
    const { data } = this.state;
    return (
      <div className='rp_detail'>
        <div className='rp_detail_top'>
          <span className="rp_detail_top_left">项目编号: {data.projectNo} </span>
          <div className="rp_detail_top_right">
            <i className={`zjb zjb-bingtu ${this.state.showCircle?'rp_pro_icon_choose': 'rp_pro_icon'}`} onClick={()=>this.setState({showCircle: true})} style={{marginRight: 8}}/>
            <i className={`zjb zjb-biaoge ${this.state.showCircle?'rp_pro_icon': 'rp_pro_icon_choose'}`} onClick={()=>this.setState({showCircle: false})} style={{color:'#999999'}}/>
          </div>
        </div>
        { this.state.showCircle ?
        <div className="rp_detail_content">
          <p className="rp_pro_title">{data.projectName}</p>
          {this.state.data.flag==13?null:
            <p className="rp_pro_time" >{moment(data.minTime).format('YYYY/MM/DD')} - {moment(data.maxTime).format('YYYY/MM/DD')}</p>
          }
          {this.state.data.flag==13?
            <i className="zjb zjb-yiwancheng" style={{color: '#4cd964', fontSize: 150,marginLeft: 130,display: 'inline-block',marginTop: -21,marginLeft: 128}}/>:
            <div style={{width: '100%', paddingLeft: 70,marginTop: '10px',marginBottom: '15px'}}>
              <CanvasCircle id={this.props.id} width={300} height={155} data={data.repayPlanByProjectInfoVos}/>
            </div> }
            
            <div className="rp_pro_money_div">
              <div style={{width: `${100/3}%`,display: 'inline-block'}}>
                <p className="rp_pro_label">利息收入</p>
                <p className="rp_pro_value">{data.allInterest.toString().fm()}元</p>
                <p className="rp_pro_label" style={{marginTop: 10}}>投资金额</p>
                <p className="rp_pro_value">{data.allInvMoney.toString().fm()}元</p>
              </div>
              <div style={{width: `${100/3}%`,display: 'inline-block'}}>
                <p className="rp_pro_label">待收本金</p>
                <p className="rp_pro_value">{data.supulsPrincipal.toString().fm()}元</p>
                <p className="rp_pro_label" style={{marginTop: 10}}>已收本金</p>
                <p className="rp_pro_value">{data.principal.toString().fm()}元</p>
              </div>
              <div style={{width: `${100/3}%`,display: 'inline-block'}}>
                <p className="rp_pro_label">待收利息</p>
                <p className="rp_pro_value">{data.supulsInterest.toString().fm()}元</p>
                <p className="rp_pro_label" style={{marginTop: 10}}>已收利息</p>
                <p className="rp_pro_value">{data.interest.toString().fm()}元</p>
              </div>
            </div>
          </div>: 
          <div className="rp_detail_content" style={{border:'1px solid red'}}>
            {/* 表格 */}
            {data.repayPlanByProjectInfoVos.map((data, index)=> {
              return (
                <div className="rp_detail_table_item" key={index}>
                  <div className="rp_detail_table_item_left">
                    <span className={`${data.fispay||data.iscurrent?'chosse':''}`}>第{data.sort}期</span>
                    <div className="rp_detail_table_item_left_line"/>
                  </div>
                  <div style={{display: 'inline-block'}}>
                    <span style={{display:'block'}}>
                      <span style={data.fispay?{color: '#ff9900'}:null}>￥{`${data.allMoney}`.fm()}</span>
                       &nbsp;&nbsp;&nbsp;本金:{`${data.allMoney}`.fm()}&nbsp;&nbsp;&nbsp;利息:{`${data.interest}`.fm()}&nbsp;&nbsp;&nbsp;佣金:{`${data.kickBack}`.fm()}
                    </span>
                    <span style={{display: 'block', marginTop: '16px'}}>回款日期:&nbsp;{moment(data.forPayTime).format('YYYY/MM/DD')}</span>
                    {!data.fispay? null:
                     <span style={{display: 'block', marginTop: '4px',color: '#ff9900'}}>到账日期:{moment(data.payTime).format('YYYY/MM/DD')}</span>
                    }
                  </div>
                </div>
              )
            })}
            
          </div>
        }
      </div>
    )
  }
}


class CanvasCircle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: {
        1: '#e6e6e6',  // 未还款
        2: '#ff9900', // 已还款
        3: 'red', // 已逾期
      },
      list: props.data,

    };
  }
  
  componentDidMount() {
    let data = {
      current: 0, // 当前期
      total: 0, // 总期数
      allMoney: 0, // 总金额
      principal: 0, // 本金
      interest: 0, // 利息
      kickBack: 0, // 佣金
    };
    console.log('this.state.list', this.state.list);
    let arr = [];
    let status = {}
    for (let obj of this.state.list) {
      if (obj.overdueMoney > 0) {
        status.status = 3
        if (obj.fispay) {
          data.current += 1;
        }
      } else {
        if (obj.fispay) {
          data.current += 1;
          status.status = 2;
        } else {
          status.status = 1;
        }
      }
      arr.push(status);
      if (obj.iscurrent) {
        data.allMoney = obj.allMoney; // 总金额
        data.principal = obj.principal; // 本金
        data.interest = obj.interest; // 利息
        data.kickBack = obj.kickBack; // 佣金
      }
    } 
    data.total = this.state.list.length;
    this.initCircle(data, arr);
  }

  initCircle(obj, arr) {
    const {width, height, data} = this.props;
    const {color} = this.state;
    let current = obj.current + 1; // 当前期数
    let sum = obj.total; // 总期数
    // 获取节点
    let ele = document.getElementById(this.props.id);
    // 生成canvas对象
    const cxt = ele.getContext('2d');
    arr.map((obj,index)=>{
      cxt.lineWidth = 10;
      cxt.strokeStyle = color[obj.status];
      cxt.beginPath();
      let startAngle = 1.5-(index*(1/data.length)*2);
      let endAngle = 1.5-((index+1)*(1/data.length)*2);
      if (startAngle<0) {
        startAngle+=2
      }
      if (endAngle<0) {
        endAngle+=2
      }
      cxt.arc(130,72.5,62.5,startAngle*Math.PI,endAngle*Math.PI,true);
      cxt.stroke();
    })
    cxt.lineWidth = 1;
    cxt.strokeStyle = '#d8d8d8';
    cxt.beginPath();
    cxt.setLineDash([9,3]);
    cxt.moveTo(140, 135);
    cxt.lineTo(205, 98.5);
    cxt.moveTo(205, 98.5);
    cxt.lineTo(248, 98.5);
    cxt.stroke();
    cxt.beginPath();
    cxt.font="12px Microsoft YaHei";
    cxt.fillStyle = '#999';
    cxt.fillText(`佣金 ${`${obj.kickBack}`.fm()}`,215,90);
    cxt.font="12px Microsoft YaHei";
    cxt.fillText(`利息 ${`${obj.interest}`.fm()}`,215,72);
    cxt.font="12px Microsoft YaHei";
    cxt.fillText(`本金 ${`${obj.principal}`.fm()}`,215,55);
    cxt.font="12px Microsoft YaHei";
    cxt.stroke();
    cxt.beginPath();
    cxt.fillStyle = '#ff9900';
    cxt.font="16px Microsoft YaHei";
    cxt.fillText(`￥${`${obj.allMoney}`.fm()}`,210,35);
    cxt.stroke();
    cxt.beginPath();
    cxt.fillStyle = '#84e192';
    cxt.font="12px Microsoft YaHei";
    cxt.fillText("还款中",115,65);
    cxt.font="12px Microsoft YaHei";
    if (current > 10 && sum > 10) {
      cxt.fillText(`第${current}/${sum}期`,107,85);
    } else if (current < 10 && sum > 10) {
      cxt.fillText(`第${current}/${sum}期`,107,85);
    } else if (current < 10 && sum < 10) {
      cxt.fillText(`第${current}/${sum}期`,113,85);
    } else {
      cxt.fillText(`第${current}/${sum}期`,113,85);
    }
    cxt.stroke();

  }

  render() {
    const {width, height} = this.props;
    return (
        <canvas id={this.props.id} width={width} height={height}/>
    );
  }
}