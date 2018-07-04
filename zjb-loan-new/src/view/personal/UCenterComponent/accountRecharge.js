import React from 'react';
import { connect } from 'dva'
import Path from '../../common/pagePath';
import {Link} from 'dva/router';
import {Form, Input, Button, Select, Modal, message} from 'antd';
import { MONEY_REG, MONEY_REG_, PERSONAL_PAGE} from '../../common/systemParam';
import {getRecharge} from  '../../services/api';
import LeftMenu from '../../components/UCenterComponent/leftMenu';
import '../../assets/ucenter/recharge.scss';

@connect((state) =>({
  accountId: state.login.baseData.accountId
}))
export default class AccountRecharge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personAccount: null,
      companyAccount: [],
      recharge: {},
      loading: false,
      rechargeType: 2, //默认充值方式
      amount: 0.0, //充值金额
    };
  }

  componentDidMount() {

  }

  async setRechargeData(data) {
    try {
      data.notifyPageUrl = PERSONAL_PAGE;
      this.setState({loading: true});
      const response = await getRecharge(data);
      console.log(response);
      this.setState({loading: false});
      if (response.code === 0) {
        this.setState({ recharge: response.data });
        Modal.confirm({
          title: '提示',
          content: '确认充值吗?',
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk: () => this.submitMoney()
        });
      } else {
        message.error(response.msg);
      }
    } catch (e) {
      this.setState({loading: false});
      console.log(e);
      message.error('请求失败,请稍后重试');
    }
  }

  submitMoney() {
    this.formId.submit();
    Modal.confirm({
      title: '提示',
      content: '请在新页面完成充值',
      okText: '充值成功',
      cancelText: '取消',
      onOk: () => this.props.history.push(Path.PERSONAL_ACCOUNT)
    });
  }

  handleMoneyChange = (event) => {
    console.log("amount:",event.target.value);
    if(isNaN(Number(event.target.value))){
      this.setState({ amountError: true })
    }else{
      this.setState({ amountError: false })
      this.setState({amount:event.target.value})
    }
    
  }

  handleSubmit = () => {
    if(this.state.amountError){
      return;
    }
    let param = {
      accountId: this.props.accountId,
      rechargeType: this.state.rechargeType,
      amount: this.state.amount
    }
    this.setRechargeData(param);
  }

  render() {
    const { match,accountId } = this.props;
    console.log("this.props:",this.props);
    const { recharge } = this.state;
    console.log(recharge);
    return (
      <div className="fr uc-rbody" style={{width: 1248,padding: '30px 20px'}}>
        <div className="rech_div">
          <span className="rech_title">充值</span><span className="rech_title" style={{marginLeft: 10, marginRight: 10}}>></span><span className="rech_title" style={{fontSize: '16px'}}>发起充值</span>
        </div>
        <div>
          <div className="rech_center">
            <div className="label_div" style={{width: '116px'}}>
              <span className="label_text">充值金额</span>
              <span className="label_text">充值方式</span>
            </div>
            <div className="label_div">
              <div className="input-view">
                <span className="money_tip">￥</span>
                <input type="text" className="input_money" onChange={this.handleMoneyChange} />
              </div>
              {this.state.amountError ? <div><span style={{ color:'red', fontSize:'10px' }}>只能输入数字</span></div> : null}
              <div className="select_div">
                <span className={`recharge_btn ${this.state.rechargeType?'recharge_btn_choose': ''}`} style={{marginRight: '20px'}} onClick={()=>this.setState({rechargeType: 2})}>快捷支付</span>
                <span className={`recharge_btn ${this.state.rechargeType?'': 'recharge_btn_choose'}`} onClick={()=>this.setState({rechargeType: 0})}>网银充值</span>
              </div>
            </div>
            <Button type="primary" onClick={this.handleSubmit} style={{width: 279}}>发起充值</Button>
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
          <input id="NotifyURL" name="NotifyURL" value={recharge.notifyURL} type="hidden"  />
          <input id="SignInfo" name="SignInfo" value={recharge.signInfo} type="hidden" />
        </form>
      </div>
    );
  }
}
