import React from 'react';
import { Link } from 'dva/router';
import PieReact from '../../common/Echarts/PieReact';
import Path from '../../common/PagePath';
import { connect } from 'dva';
import moment from 'moment';
import LeftMenu from '../../components/leftmenu/leftMenu';

import { accountService, baseService, personal } from '../../services/api';
import { Modal, message, Tooltip } from 'antd';
import './personal.scss';
import Statement from '../statement/Statement';
import { formatFlagToText, NOTIFY_URL } from '../../common/SystemParam';

@connect((state) => ({
  personal: state.personal.data,
  baseData: state.login.baseData
}))
export default class PersonAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      earlyMoney: {}, //提前还款金额
      paymentParam: {}, //还款调用参数
      activeFlag: 0,
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
            rich: {
              b: {
                fontSize: 16,
                align: 'right',
                padding: [0, 10, 0, 0],
                width: 100,
                fontWeight: 'bold',
              },
              c: {
                fontSize: 16,
                align: 'right',
                padding: [0, 10, 0, 0],
                width: 100,
                fontWeight: 'bold',
                color: '#FF6600'
              }
            }
          },
          formatter: function (name) {
            if (name === '可用余额') {
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
          data: [{
            name: '可用余额',
            icon: 'circle'
          }, {
            name: '冻结金额',
            icon: 'circle'
          }, {
            name: '待还本金',
            icon: 'circle'
          }, {
            name: '待还利息',
            icon: 'circle'
          }]
        },
        grid: {
          right: '70%'
        },
        series: [
          {
            name: '金额',
            type: 'pie',
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

            data: [
              { value: 0, name: '可用余额' },
              { value: 0, name: '冻结金额' },
              { value: 0, name: '待还本金' },
              { value: 0, name: '待还利息' }
            ]
          }
        ]
      },
      statements: []
    };
  }

  componentDidMount() {
    this.fetchPersonalData();
    this.getUserBaseData();
  }

  async getUserBaseData() {
    const response = await personal.getLoginData(); 
    if (response.code === 0) {
      this.props.dispatch({type: 'login/saveLoadingDataAfter', response: response.data})
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.personal !== nextProps.personal) {
      const { companyTotalAssetsVo, myBorrowVo } = nextProps.personal;
      console.log(nextProps.personal)
      this.setState({
        activeFlag: myBorrowVo ? myBorrowVo.fflag : 0,
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

              rich: {
                b: {
                  fontSize: 16,
                  align: 'right',
                  padding: [0, 10, 0, 0],
                  width: 100,
                  fontWeight: 'bold',
                },

                c: {
                  fontSize: 16,
                  align: 'right',
                  padding: [0, 10, 0, 0],
                  width: 100,
                  fontWeight: 'bold',
                  color: '#FF6600'
                }
              }
            },

            formatter: function (name) {
              if (name === '可用余额') {
                return `${name}  {c|${`${companyTotalAssetsVo.availableBalance || 0}`.fm()}}`
              } else if (name === '冻结金额') {
                return `${name}  {b|${`${companyTotalAssetsVo.freezingAmount || 0}`.fm()}}`
              } else if (name === '待还本金') {
                return `${name}  {b|${`${companyTotalAssetsVo.forReturnPrincipal || 0}`.fm()}}`
              } else {
                return `${name}  {b|${`${companyTotalAssetsVo.forReturnInterest || 0}`.fm()}}`
              }
            },
            left: '60%',
            y: 'center',

            data: [{
              name: '可用余额',
              icon: 'circle'

            }, {
              name: '冻结金额',
              icon: 'circle'

            }, {
              name: '待还本金',
              icon: 'circle'

            }, {
              name: '待还利息',
              icon: 'circle'
            }]
          },

          grid: {
            right: '70%'
          },
          series: [
            {

              name: '金额',
              type: 'pie',
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

              data: [
                { value: companyTotalAssetsVo.availableBalance || 0, name: '可用余额' },
                { value: companyTotalAssetsVo.freezingAmount || 0, name: '冻结金额' },
                { value: companyTotalAssetsVo.forReturnPrincipal || 0, name: '待还本金' },
                { value: companyTotalAssetsVo.forReturnInterest || 0, name: '待还利息' }
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
    if (response.code === 0) {
      this.props.dispatch({
        type: 'personal/getPersonalAccount',
        payload: response.data
      })
      this.props.dispatch({
        type: 'personal/savePersonalStatus',
        payload: {
          openStatus: 1, // 开户成功 
          openFailMsg: ''
        }
      })
    } else if (response.code === -1 && response.msg === '该账户未开户') {
      this.props.dispatch({
        type: 'personal/savePersonalStatus',
        payload: {
          openStatus: -1, // 未开户 
          openFailMsg: ''
        }
      })
      this.props.history.push('/index/uCenter/openAccount');
    } else if (response.code === -1 && response.msg === '该账户正在开户中') {
      this.props.dispatch({
        type: 'personal/savePersonalStatus',
        payload: {
          openStatus: 2, // 开户中 
          openFailMsg: ''
        }
      })
      this.props.history.push('/index/uCenter/realName');
    } else if (response.code === -1 && response.msg === '该账户开户失败') {
      this.props.dispatch({
        type: 'personal/savePersonalStatus',
        payload: {
          openStatus: 0, // 开户失败 
          openFailMsg: response.data
        }
      })
      this.props.history.push('/index/uCenter/realName');
    } else {
      response.msg && message.error(response.msg);
    }
  }
  //格式化时间
  format(val) {
    if (val == null) {
      return
    } else {
      let date = new Date(val)
      let m = date.getMonth() + 1;
      if (m < 10) {
        m = '0' + m
      }
      return date.getFullYear() + "/" + m + "/" + date.getDate();
    }
  }
  formatNewDate() {
    let date = new Date()
    let m = date.getMonth() + 1;
    if (m < 10) {
      m = '0' + m
    };
    let d = date.getDate();
    if (d < 10) {
      d = '0' + d
    };
    let h = date.getHours();
    if (h < 10) {
      h = '0' + h
    };
    let mm = date.getMinutes();
    if (mm < 10) {
      mm = '0' + mm
    }
    console.log(date.getMinutes())
    return date.getFullYear() + "/" + m + "/" + d + " " + h + ':' + mm;
  }
  //手动还款
  repayment(val) {
    console.log(val)
    this.getDetailPlaneAjax(val)
  }




  // 获取还款计划详情数据
  async getDetailPlaneAjax(obj) {
    // if (this.state.loading)
    //   return;
    // this.setState({ loading: true });
    const response = await baseService.getDetailPlane({ projectId: obj.project, forPayTime: obj.forPayTime });
    // this.setState({ loading: false });
    console.log(response);
    if (response.code === 0 && response.data.length > 0) {
      // 小于200个订单 直接请求转账接口
      this.postManualRepayment(response.data);
    } else {
      response.msg && message.error(response.msg);
    }
  }
  // 进行手动还款接口调用
  async postManualRepayment(projectIdArr) {
    if (this.state.loading)
      return;
    this.setState({ loading: true });
    const response = await baseService.manualReimpayment({ repayBillIdsStr: projectIdArr.join(','), notifyPageUrl: encodeURIComponent(`${NOTIFY_URL}/index/uCenter/personAccount`) })
    console.log(response);
    this.setState({ loading: false });
    if (response.code === 0) {
      this.setState({
        paymentParam: response.data,
      }, () => {
        console.log(this.formId);
        this.formId.submit();
        Modal.success({
          title: '提示',
          content: (
            <p>请在新页面中完成操作，之后刷新查看结果</p>
          ),
          onOk: () => {
            this.getPlanData();
          },
          onText: '确定'
        });
      })
    } else if (response.code === 1) {
      Modal.success({
        title: '提示',
        content: (
          <p>还款处理中，请稍后查看</p>
        ),
        onOk: () => {
          this.getPlanData();
        },
        onText: '确定'
      });
    } else {
      response.msg && message.error(response.msg);
    }
  }
  // 进入页面获取还款计划列表
  async getPlanData() {
    const response = await baseService.getRepaymentPlan();
    console.log(response);
    if (response.code === 0) {
      this.setState({
        error: false,
        dataSource: response.data.borrowsPlanVos,
        data: response.data.project[0]
      })
      // -2 是没有还款计划
    } else if (response.code === -2) {

    } else {
      if (response.msg !== '该企业下没有正在还款的项目') {
        response.msg && message.error(response.msg);
      }
    }
  }

  render() {
    const lables = [
      {

        text: '借款申请',
        fflag: 0
      },
      {

        text: '进入初审',
        fflag: 1
      },
      {

        text: '大数据风控',
        fflag: 3
      },
      {

        text: '进入终审',
        fflag: 6
      },
      {

        text: '确认借款',
        fflag: 7
      },
      {

        text: '发放优惠',
        fflag: 14
      },
      {

        text: '上线筹款',
        fflag: 10
      },
      {

        text: '满标放款',
        fflag: 11
      },
      {

        text: '按月还款',
        fflag: 12
      },
      {

        text: '还清借款',
        fflag: 13
      },
    ];

    // 当前借款金额  近期还款  我的借款  账户金额  资金动态
    const { currentBorrowAmount, recentForRepanymentVo, myBorrowVo, companyTotalAssetsVo, accountDynamicVos } = this.props.personal;
    const { userSecurityCenter } = this.props.baseData;
    console.log(recentForRepanymentVo, "reduxs")
    const { data, dataSource, paymentParam } = this.state;
    return (
      <div>
        
        <LeftMenu param={this.props} />
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
              {userSecurityCenter.faccountBind && userSecurityCenter.fidcardBind?
                  <div className="to-loan" style={{ cursor: 'pointer' }} onClick={() => { this.props.history.push(Path.APPALY_LOAN) }}>
                    <span></span> 申请借款
                    </div>
                : 
                <Tooltip title="您还未实名认证">
                  <div className={'to-loan-un'} >
                    <span></span> 申请借款
                  </div>
                </Tooltip>
              }
          </div>
        </div>
        {recentForRepanymentVo && recentForRepanymentVo.length > 0 ?
          <div className="per_account">
            <div className="ptit">

              <i>近期还款</i>
            </div>
            <div className="recent-repany" >

              <p className='title'>{recentForRepanymentVo && recentForRepanymentVo.length > 0 ? '近期应还' : ' '} </p>
              {
                recentForRepanymentVo && recentForRepanymentVo.length > 0 ?
                  recentForRepanymentVo && recentForRepanymentVo.map((item, index) => {
                    return <div>
                      <p className='title'></p>
                      <div className='repany-content '>
                        <span className='txt1'>{this.format(item.forPayTime)}</span>
                        <span className='txt2'>待还款</span>
                        <span className='txt3'>{item.fsort}/{myBorrowVo.fcreditMonth}期</span>
                        <span className='txt4'>|</span>
                        <span className='txt5'>￥{item.borrowInterest}</span>
                        <span className='txt6'>本金：{item.principal}</span>
                        <span className='txt7'>利息：{item.interest}</span>
                        <span className='txt8'>逾期：{item.overdueMoney <= 0 ? '' : item.overdueMoney}</span>
                        <a className='hand-repay' onClick={() => { this.repayment(item) }}>手动还款</a>
                      </div>
                      {
                        item.overdueMoney > 0 ? <div>
                          <div className='sub-content'>
                            <span className='txt1'>{this.formatNewDate(item.forPayTime)}</span>
                            <span className='txt2'>本笔还款已逾期</span>
                            <span className='txt3'>{'{' + item.overdue + '}'}</span>
                            <span className='txt2'>天，逾期费用</span>
                            <span className='txt3'>{'{' + item.overdueMoney + '元}'}</span>
                            <span className='txt2'>，为了不影响您的征信，请及时还款</span>
                          </div>
                          <p className='chufa'><i className='zjb zjb-jinggao1'></i> 逾期处罚措施</p>
                        </div> : ''
                      }
                    </div>

                  }) : ''
              }

            </div>
          </div> : null}

        {myBorrowVo ?
          <div className="per_account">
            <div className="ptit">
              <i>我的借款</i>
            </div>
            <div className="my-loan" >
              <p className='loan-lable'>
                {
                  lables.map(item => {
                    if (item.fflag == this.state.activeFlag) {
                      return <span className='active'>{item.text}</span>
                    } else {
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
                  <td style={{ color: '#333' }}>状态</td>
                  <td>操作</td>
                </tr>
                <tr>
                  <td>{myBorrowVo.fcreditMoney ? `${myBorrowVo.fcreditMoney / 10000}`.fm() + '万元' : ''}</td>
                  <td>{myBorrowVo.fcreditMonth ? `${myBorrowVo.fcreditMonth}` + '个月' : ''}</td>
                  <td>{myBorrowVo.frate ? `${myBorrowVo.frate}`.fm() + '%' : ''}</td>
                  <td>{moment(myBorrowVo.fcreateTime).format('YYYY-MM-DD HH:mm')}</td>
                  <td>{formatFlagToText(myBorrowVo.fflag)}</td>
                  <td>
                    <a onClick={()=>this.props.history.push('/index/uCenter/mineLoan')}>查看详情</a>
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
            <PieReact width='600px' height="200px" option={this.state.pieOption} />
            <div className='account-info'>
              <p>{`${companyTotalAssetsVo.totalAssets || 0}`.fm()}</p>
              <p>账户总资产</p>
            </div>
          </div>
        </div>

        <div className="per_account">
          <div className="ptit">
            <i>资金动态</i>
          </div>
          <div className="my-statement" style={{ paddingTop: 20 }}>
            {
              accountDynamicVos.length > 0 ?
                accountDynamicVos.map((item, index) => {
                  return <Statement data={item} key={index}></Statement>
                }) :
                <span className="no-statement">暂无资金动态</span>

            }
          </div>
        </div>



        <Modal
          title="提示"
          confirmLoading={this.state.earlyMoneyLoading}
          visible={this.state.visible}
          onOk={() => this.earlyMoney()}
          onCancel={() => this.setState({ visible: false })}
          okText="确认"
          cancelText="取消"
        >
          <p>您确认进行提前还款吗?总计还款{`${this.state.earlyMoney.allPrincipal + this.state.earlyMoney.allInterest}`.fm()}元,其中本金{`${this.state.earlyMoney.allPrincipal}`.fm()}元,利息{`${this.state.earlyMoney.allInterest}`.fm()}元</p>
        </Modal>
        <form ref={ref => this.formId = ref} id="form1" name="form1" action={paymentParam.submitURL} method="post" target="_blank">
          <input id="Action" name="Action" value={paymentParam.action} type="hidden" />
          <input id="ArrivalTime" name="ArrivalTime" value={paymentParam.arrivalTime} type="hidden" />
          <input id="LoanJsonList" name="LoanJsonList" value={paymentParam.loanJsonList} type="hidden" />
          <input id="NeedAudit" name="NeedAudit" value={paymentParam.needAudit} type="hidden" />
          <input id="PlatformMoneymoremore" name="PlatformMoneymoremore" value={paymentParam.platformMoneymoremore} type="hidden" />
          <input id="RandomTimeStamp" name="RandomTimeStamp" value={paymentParam.randomTimeStamp} type="hidden" />
          <input id="TransferAction" name="TransferAction" value={paymentParam.transferAction} type="hidden" />
          <input id="TransferType" name="TransferType" value={paymentParam.transferType} type="hidden" />
          <input id="RandomTimeStamp" name="RandomTimeStamp" value={paymentParam.randomTimeStamp} type="hidden" />
          <input id="Remark1" name="Remark1" value={paymentParam.remark1} type="hidden" />
          <input id="Remark2" name="Remark2" value={paymentParam.remark2} type="hidden" />
          <input id="Remark3" name="Remark3" value={paymentParam.remark3} type="hidden" />
          <input id="ReturnURL" name="ReturnURL" value={paymentParam.returnURL} type="hidden" />
          <input id="NotifyURL" name="NotifyURL" value={paymentParam.notifyURL} type="hidden" />
          <input id="SignInfo" name="SignInfo" value={paymentParam.signInfo} type="hidden" />
        </form>

      </div>

    );
  }
}
