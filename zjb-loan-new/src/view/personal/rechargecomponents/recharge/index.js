
import React from 'react';
import './index.scss'
import Path from '../../../../common/PagePath';
import { Form, Input, Tooltip, Icon, Modal, message, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import { MONEY_REG, MONEY_REG_, PERSONAL_PAGE, NOTIFY_URL } from '../../../../common/SystemParam';
import { accountService } from '../../../../services/api';


const FormItem = Form.Item;
const Option = Select.Option;

export default class Loaninfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rechargeType: 0, //默认充值方式
      amount: 0.0, //充值金额
      activeObj: {},

      recharge: {},  //提交表单后返回的数据
      loading: false,
      id: '',
      accountId: ''

      //  提交表单参数
    }
  }
  sub(val) {
    let str = '';
    if (val == null) {
      return;
    } else {
      return val.substring(val.length - 4)
    }
  }
  componentWillReceiveProps(nextProps) {
    if ('param' in nextProps) {
      this.setState({
        activeObj: nextProps.param
      })
    }
  }
  componentDidMount() {
    // this.getinit();
    this.getUserINfo();
  }
  async getUserINfo() {
    const response = await accountService.getPersonalData();
    if (response.code === 0) {
      this.setState({
        accountId: response.data.companyTotalAssetsVo.accountId
      })
    }
  }
  handleSubmit = () => {
    if (this.state.amountError||this.state.loading) {
      return;
    }
    let param = {
      accountId: this.state.accountId,
      rechargeType: this.state.rechargeType,
      amount: this.state.amount
    }
    this.setRechargeData(param);
  }

  async setRechargeData(data) {
    try {
      data.notifyPageUrl =  `${NOTIFY_URL}/index/uCenter/personAccount`;
      this.setState({ loading: true });
      const response = await accountService.getRecharge(data);
      this.setState({ loading: false });
      if (response.code === 0) {
        Modal.confirm({
          title: '提示',
          content: '确认充值吗?',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => this.submitMoney()
        });
        this.setState({
          recharge: response.data
        })
      } else {
        message.error(response.msg);
      }
    } catch (e) {
      this.setState({ loading: false });
      message.error('请求失败,请稍后重试');
    }
  }
  handleMoneyChange = (event) => {
    if (isNaN(Number(event.target.value))) {
      this.setState({ amountError: true })
    } else {
      this.setState({ amountError: false })
      this.setState({ amount: event.target.value })
    }

  }

  submitMoney() {
    this.formId.submit();
    Modal.confirm({
      title: '提示',
      content: '请在新页面完成充值',
      okText: '充值成功',
      cancelText: '取消',
      onOk: () => {}
    });
  }

  render() {
    const { recharge } = this.state;
    return (
      <div className="recharge-form">
        <div className="containers">
          {/* <p style={{ width: 500 }}>
            <span className="label_text-card">   充值银行卡 </span> <span className="card-info-title">{this.state.activeObj.fbank} 尾号 {this.sub(this.state.activeObj.fbankcard
            )} </span>
          </p> */}
          <div>
            <div className="rech_center">
              <div className="label_div" style={{ width: '116px' }}>
                <span className="label_text">充值金额</span>
                <span className="label_text">充值方式</span>
              </div>
              <div className="label_div">
                <div style={{height: 50}}>
                  <div className="input-view">
                    <span className="money_tip">￥</span>
                    <input type="text" className="input_money" onChange={this.handleMoneyChange} maxLength={9}/>
                  </div>
                  {this.state.amountError ? <div><span style={{ color: 'red', fontSize: '10px' }}>只能输入数字</span></div> : null}
                </div>
                <div className="select_div">
                  {/* <span className={`recharge_btn ${this.state.rechargeType ? 'recharge_btn_choose' : ''}`} style={{ marginRight: '20px' }} onClick={() => this.setState({ rechargeType: 2 })}>快捷支付</span> */}
                  <span className={`recharge_btn ${this.state.rechargeType ? '' : 'recharge_btn_choose'}`} onClick={() => this.setState({ rechargeType: 0 })}>网银充值</span>
                </div>
              </div>
              <Button type="primary" onClick={this.handleSubmit} loading={this.state.loading} style={{ width: 325, height: 38 }}>发起充值</Button>
            </div>
          </div>
          <form ref={ref => this.formId = ref} id="form1" name="form1" action={recharge.submitURL} method="post" target="_blank">
            <input id="RechargeMoneymoremore" name="RechargeMoneymoremore" value={recharge.rechargeMoneymoremore} type="hidden" />
            <input id="PlatformMoneymoremore" name="PlatformMoneymoremore" value={recharge.platformMoneymoremore} type="hidden" />
            <input id="OrderNo" name="OrderNo" value={recharge.orderNo} type="hidden" />
            <input id="Amount" name="Amount" value={recharge.amount} type="hidden" />
            <input id="RechargeType" name="RechargeType" value={recharge.rechargeType} type="hidden" />
            <input id="FeeType" name="FeeType" value={recharge.feeType} type="hidden" />
            <input id="CardNo" name="CardNo" value={recharge.cardNo} type="hidden" />
            <input id="RandomTimeStamp" name="RandomTimeStamp" value={recharge.randomTimeStamp} type="hidden" />
            <input id="Remark1" name="Remark1" value={recharge.remark1} type="hidden" />
            <input id="Remark2" name="Remark2" value={recharge.remark2} type="hidden" />
            <input id="Remark3" name="Remark3" value={recharge.remark3} type="hidden" />
            <input id="ReturnURL" name="ReturnURL" value={recharge.returnURL} type="hidden" />
            <input id="NotifyURL" name="NotifyURL" value={recharge.notifyURL} type="hidden" />
            <input id="SignInfo" name="SignInfo" value={recharge.signInfo} type="hidden" />
          </form>
        </div>
      </div>
    )
  }
}
