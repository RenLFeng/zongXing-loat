import React from 'react';
import { Link } from 'dva/router';
import PieReact from '../../common/Echarts/PieReact';
import Path from '../../common/PagePath';
import {connect} from 'dva';
import moment from 'moment';
import LeftMenu from '../../components/leftmenu/leftMenu';
import { Modal, message} from 'antd'; 
import './personal.scss';
import Statement from '../statement/Statement';  
import { accountService } from '../../services/api';
import { formatFlagToText } from '../../common/SystemParam';
 
@connect((state)=>({
  personal: state.personal.data
}))
export default class PersonAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        activeFlag:0,
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
              } else if (name === '待还本金') {
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
              name: '待还本金',
              icon: 'circle'
            },{
              name: '待还利息',
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
                {value:0, name:'待还本金'},
                {value:0, name:'待还利息'}
              ]
            }
          ]
        },
        statements:[]
    }; 
  } 

  componentDidMount() {
    this.fetchPersonalData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.personal !== nextProps.personal) {
      const {companyTotalAssetsVo, myBorrowVo} = nextProps.personal; 

      this.setState({
        activeFlag: myBorrowVo.fflag||0,
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
                return `${name}  {c|${`${companyTotalAssetsVo.availableBalance||0}`.fm()}}`
              } else if (name === '冻结金额') {
                return `${name}  {b|${`${companyTotalAssetsVo.freezingAmount||0}`.fm()}}`
              } else if (name === '待还本金') {
                return `${name}  {b|${`${companyTotalAssetsVo.forReturnPrincipal||0}`.fm()}}`
              } else {
                return `${name}  {b|${`${companyTotalAssetsVo.forReturnInterest||0}`.fm()}}`
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
              name: '待还本金',
              icon: 'circle'
            },{
              name: '待还利息',
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
                {value:companyTotalAssetsVo.availableBalance||0, name:'可用余额'},
                {value:companyTotalAssetsVo.freezingAmount||0, name:'冻结金额'},
                {value:companyTotalAssetsVo.forReturnPrincipal||0, name:'待还本金'},
                {value:companyTotalAssetsVo.forReturnInterest||0, name:'待还利息'}
              ]
            }
          ]
        }
      })
    }
  }

  // 借款用户 账户总览信息 数据获取 存入redux
  async fetchPersonalData() {
    const response = await accountService.getPersonalData();
    console.log(response);
    if (response.code === 0) {
      // 存入redux
      this.props.dispatch({
        type: 'personal/getPersonalAccount',
        payload: response.data
      })
    } else {
      response.msg && message.error(response.msg);
    }
  }

  render() { 
    console.log(this.props);
    const lables = [
      {
        text:'借款申请',
        fflag:0
      },
      {
        text:'进入初审',
        fflag:1
      },
      {
        text:'大数据风控',
        fflag:3
      },
      {
        text:'进入终审',
        fflag:6
      },
      {
        text:'确认借款',
        fflag:7
      },
      {
        text:'发放优惠',
        fflag:14
      },
      {
        text:'上线筹款',
        fflag:10
      },
      {
        text:'满标放款',
        fflag:11
      },
      {
        text:'按月还款',
        fflag:12
      }, 
      {
        text:'还清借款',
        fflag:13
      },
    ];
    console.log(this.props.personal);
    // 当前借款金额  近期还款  我的借款  账户金额  资金动态
    const { currentBorrowAmount, recentForRepanymentVo, myBorrowVo, companyTotalAssetsVo, accountDynamicVos } = this.props.personal;
    return (
      <div>
        <LeftMenu param={this.props}/>  
        <div className="per_account">
          <div className="ptit">
            <i>当前借款金额</i>
            <span>￥{`${currentBorrowAmount.currentBorrowAmount}`.fm()} </span>
            <em>单位：元</em>
          </div>
          <div className="sub-info">
              <i>累计利息支出</i>
              <span >{`${currentBorrowAmount.sumInterestOut}`.fm()} </span>
              <i>累计借款金额</i>
              <span >{`${currentBorrowAmount.sumBorrowAmount}`.fm()} </span>
              <div className='to-loan' style={{cursor: 'pointer'}} onClick={()=>{this.props.history.push(Path.APPALY_LOAN)}}>
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
        { myBorrowVo?
        <div className="per_account"> 
          <div className="ptit">
              <i>我的借款</i> 
          </div> 
          <div className="my-loan" >
            <p className='loan-lable'>
              {
                lables.map(item=>{
                  if(item.fflag == this.state.activeFlag){
                    return  <span className='active'>{item.text}</span>
                  }else{
                    return <span>{item.text}</span>
                  } 
                })
              }  
            </p>
            <p className='project-info'>
              <span className='txt1'>项目编号：</span>
              <span className='txt2'>{myBorrowVo.fprojectNo}</span>
            </p>
            <p className='project-info'>
              <span className='txt1'>项目名称：</span>
              <span className='txt2'>{myBorrowVo.fname}</span>
            </p>
            <table className='loan-table'>
              <tr>
                <td>借款金额</td>
                <td>借款期数</td>
                <td>借款利率</td>
                <td>创建时间</td>
                <td style={{color: '#333'}}>状态</td>
                <td>操作</td>
              </tr>
              <tr>
                <td>{myBorrowVo.fcreditMoney?`${myBorrowVo.fcreditMoney/1000}`.fm()+'万元': ''}</td>
                <td>{myBorrowVo.fcreditMonth?`${myBorrowVo.fcreditMonth}`+'个月':''}</td>
                <td>{myBorrowVo.frate?`${myBorrowVo.frate}`.fm()+'%':''}</td>
                <td>{moment(myBorrowVo.fcreateTime).format('YYYY-MM-DD HH:mm')}</td>
                <td>{formatFlagToText(myBorrowVo.fflag)}</td>
                <td>
                  <a href="javascript:;" onClick={()=>this.props.history.push('/uCenter/receivePlan')}>还款计划</a>
                </td>
              </tr>
            </table>
          </div>  
        </div> : 
        null
      }
        <div className="per_account"> 
          <div className="ptit">
              <i>账户总资产</i> 
          </div> 
          <div className="total-acount" >
            <PieReact width='600px' height="200px"  option={this.state.pieOption}/>
            <div className='account-info'>
              <p>{`${companyTotalAssetsVo.totalAssets||0}`.fm()}</p>
              <p>账户总资产</p>
            </div>
          </div>
        </div>


        <div className="per_account"> 
          <div className="ptit">
              <i>资金动态</i> 
          </div> 
          <div className="my-statement" style={{paddingTop: 20}}>
              {
                accountDynamicVos.length > 0 ? 
                accountDynamicVos.map((item,index)=>{
                  return <Statement data={item} key={index}></Statement>
                }) :
                <span className="no-statement">暂无资金动态</span>
              }
          </div>
        </div>
      </div>

    );
  }
}
