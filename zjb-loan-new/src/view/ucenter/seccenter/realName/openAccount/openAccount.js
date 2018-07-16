import React from 'react';
import { Link } from 'dva/router';
import { Icon, Input, Button, message, Spin } from 'antd';
import '../realName.scss';
import { securityCentreService } from '../../../../../services/api';
import Path from '../../../../../common/PagePath';
import {TURN_BACK ,LICENSE,VER_PHONE, NOTIFY_URL} from '../../../../../common/SystemParam'
import { POINT_CONVERSION_COMPRESSED } from 'constants';
import { connect } from 'dva';

@connect((state)=>({
  baseData: state.login.baseData
}))
export default class OpenAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPage: 'chinaCard',
      phone: '', //电话号码
      realName: '', //企业名称
      idcard: '', //统一社会信用代码
      openName: '',
      num: 5, // 5秒后
      message2:"",
      loading: false,
      submitParam: {
        reqParam: {
        }
      },
      msgIdcard:'',
      msgRealName: '',
      msgPhone: ''
      
    };
    this.countDown = null;
  }
  componentDidMount() {
  }

  componentWillUnmount() {
    if (this.countDown) {
      clearInterval(this.countDown);
    }
  }

  updateRealName = (e) => {
    let msg = '';
    if(!e.target.value){
      msg = '真实姓名不能为空';
    }
    this.setState({ msgRealName:msg,realName: e.target.value });
    
  };
  updateIdcard = (e) => {
    let msg = '';
    if(!e.target.value){
      msg = '企业信用代码不能为空';
    }else if(!LICENSE.test(e.target.value)){
      msg = '企业信用代码格式有误';
    }
    this.setState({ msgIdcard:msg,idcard: e.target.value });
  };
  updatePhone = (e) => {
    let msg = '';
    if(!e.target.value){
      msg = '手机号不能为空';
    }else if(!VER_PHONE.test(e.target.value)){
      msg = '手机号格式不正确';
    }
    this.setState({msgPhone:msg,phone:e.target.value});
  }

  /**
   * 提交开户请求
   */
  handleSubmit = async () => {
    console.log("handleSubmit running ...")
    if (this.state.loading) {
      return;
    }
    const param = {
      realName: this.state.realName.trim(),
      identificationNo: this.state.idcard.trim(),
      mobile: this.props.baseData.mobile?this.props.baseData.mobile.trim():'',
      accountType: 1,
      notifyPageUrl: `${NOTIFY_URL}/index/uCenter/personAccount`,
    };

    let msgIdcard = '';
    let msgRealName = '';
    let msgPhone = '';
    if (!param.identificationNo) {
      msgIdcard = '企业信用代码不能为空';
    }
    if(msgIdcard === '' && !LICENSE.test(param.identificationNo)){
      msgIdcard = '企业信用代码格式有误';
    }
    if(!param.mobile){
      msgPhone = '手机号不能为空';
    }
    if(msgPhone === '' && !VER_PHONE.test(param.mobile)){
      msgPhone = '手机号格式不正确';
    }
    if (!param.realName) {
      msgRealName = '企业名称不能为空';
    }
    this.setState({msgIdcard,msgPhone,msgRealName});
    if(msgIdcard || msgRealName || msgPhone){
      return;
    }
    console.log("verify true");
    this.setState({loading: true});
    try {
      const response = await securityCentreService.createAccount(param);
      this.setState({loading: false});
      if (response.code === 0) {
        message.info(response.msg);
        this.setState({
          submitParam: response.data
        }, ()=>{
          this.formId.submit();
          setTimeout(()=>{
            this.props.parentHandSubmit(response.data);
          },100)
        })
      } else {
        message.error(response.msg);
      }
    } catch (e) {
      this.setState({loading: false});
      if (typeof e === 'object' && e.name === 288) {
        throw e;
      }
      console.log(e);
      message.error('服务器繁忙，请稍后重试');
    }
  };

  render() {
    const {submitParam,msgIdcard,msgRealName,msgPhone } = this.state;
    console.log(this.props.baseData);
    const mobile = this.props.baseData.mobile || '';
    return (
      <div className="pages" style={{width: '1248px'}}>
        <div className="real_title_">
          <span className="safeCenter_" onClick={()=>this.props.history.push('/index/uCenter/realName')}>企业开通借款账户</span>
        </div>
        {
          this.state.showPage === 'chinaCard' ?
            <div>
              <div className="Prompt">
                <img alt="提示" src={require('../../../../../assets/img/u3530.png')} />
                <p  style={{textAlign:'center',paddingTop:35}}>企业全称和统一社会信用代码必须与提现的银行卡开户名保持一致</p>
              </div>
                <div className="info">
                  <div className="inp">
                    <Input placeholder="请输入企业全称" onChange={this.updateRealName} />
                    <img alt="真实姓名" src={require('../../../../../assets/img/u186.png')} className="img1"/>
                    <span className="span_">|</span>
                    {
                      msgRealName ? 
                      <span className="prompts" style={{color:'red'}}>{msgRealName}</span>:
                      <span className="prompts">&nbsp;</span>
                    }
                  </div>
                  <div className="inp">
                    <Input placeholder="请输入企业统一社会信用代码" onChange={this.updateIdcard} style={{marginTop:3}}/>
                    <img alt="身份证id" src={require('../../../../../assets/img/u192.png')}  className="img2"/>
                    <span className="span_1">|</span>
                    {
                      msgIdcard ? 
                      <span className="prompts" style={{color:'red'}}>{msgIdcard}</span>:
                      <span className="prompts">&nbsp;</span>
                    }
                  </div>

                  <div className="inp">
                    <Input placeholder="手机号（默认）" value={mobile} readOnly onChange={()=>{}} style={{marginTop:3}}/>
                    <img alt="身份证id" src={require('../../../../../assets/img/ph.png')}  className="img3"/>
                    <span className="span_2">|</span>
                    {
                      msgPhone ? 
                      <span className="prompts" style={{color:'red'}}>{msgPhone}</span>:
                      <span className="prompts">&nbsp;</span>
                    }
                  </div>
      
                  <span onClick={this.handleSubmit} type="primary"  className="Button" style={{top:247,left:474}}>提交开户</span>
                </div>
            </div> :
          (this.state.showPage === 'ok') ?
              <div className="info">
                <h1>
                  <img alt="ok" src={require('../../../../../assets/img/u3551.png')} />
                  {this.state.openName}，恭喜您已经通过身份认证
                </h1>
                <h3>下一步：前往开通资金托管账户</h3>
                <a className="goback" onClick={()=>this.props.history.push('/index/uCenter/openQAccount')}>{this.state.num}秒后自动跳转</a>
              </div> : null
        }

        <form ref={ref => { this.formId = ref}} action={submitParam.submitUrl} method="post" style={{ display: 'none' }}>
          <input id="AccountType" name="AccountType" value={submitParam.reqParam.AccountType} />
          <input id="Email" name="Email" value={submitParam.reqParam.Email} />
          <input id="IdentificationNo" name="IdentificationNo" value={submitParam.reqParam.IdentificationNo} />
          <input id="LoanPlatformAccount" name="LoanPlatformAccount" value={submitParam.reqParam.LoanPlatformAccount} />
          <input id="Mobile" name="Mobile" value={submitParam.reqParam.Mobile} />
          <input id="NotifyURL" name="NotifyURL" value={submitParam.reqParam.NotifyURL} />
          <input id="PlatformMoneymoremore" name="PlatformMoneymoremore" value={submitParam.reqParam.PlatformMoneymoremore} />
          <input id="RandomTimeStamp" name="RandomTimeStamp" value={submitParam.reqParam.RandomTimeStamp} />
          <input id="RealName" name="RealName" value={submitParam.reqParam.RealName} />
          <input id="RegisterType" name="RegisterType" value={submitParam.reqParam.RegisterType} />
          <input id="Remark1" name="Remark1" value={submitParam.reqParam.Remark1} />
          <input id="Remark2" name="Remark2" value={submitParam.reqParam.Remark2} />
          <input id="Remark3" name="Remark3" value={submitParam.reqParam.Remark3} />
          <input id="ReturnURL" name="ReturnURL" value={submitParam.reqParam.ReturnURL} />
          <input id="SignInfo" name="SignInfo" value={submitParam.reqParam.SignInfo} />
        </form>
      </div>
    );
  }
}
