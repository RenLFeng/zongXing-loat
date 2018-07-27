import React from 'react';
import './regiser.scss';
import {VER_PHONE, AUTH_CODE_TIME, AUTH_CODE_TIME_,pass_reg} from '../../common/SystemParam';
import {connect} from 'dva';
import {Spin, message, Button, Icon, Steps, Modal, Form, Row, Col, Input} from 'antd';
import {regiserAccount} from '../../services/api';
import { setTimeout } from 'timers';

const Step = Steps.Step;

@connect((state) => ({
  login: state.login,
  submitting: state.login.submitting
}))
@Form.create()
export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showReg: false, //是否显示注册表单
      countDown: AUTH_CODE_TIME,  //获取验证码倒计时
      countDown_: AUTH_CODE_TIME_,
      showAuthCode: true, //显示获取验证码的接口
      showAuthCodeFor: true, // 显示忘记密码获取验证码的状态
      regPhone: '', //注册手机号
      regPwd: '', //注册密码
      regAuthCode: '', //注册验证码
      loginPhone: '', //登录手机号
      loginPwd: '', //登录密码
      readStatus: false, //阅读注册协议状态
      regLoading: false,
      loginNameErr: '', //登录用户名提示
      loginPwdErr: '', //登录密码提示
      regNameErr: '',  //注册手机号提示
      regAuthErr: '', //验证码提示
      regPwdErr: '', //注册密码提示
      textErr: '',  //阅读注册协议提示
      authLoading: false, //验证码接口发送状态
      errorTime: 60,
      flag: 1,  //显示登陆页面
      loginName: '',  //验证身份时的手机号或用户名
      mobile: '',
      authCode: '',
      codeNameErr1: '',   //验证手机号码提示
      codeNameErr2: '',   //验证验证码提示语
      newPass: '',  //
      newPass_: '',
      message1: '', //第一次输入密码时提示
      message2: '',  //第二次输入密码时提示
      password: '',
      code: '', //忘记密码时验证码

      flagShow: false, //验证码发送之后提示语

      registerShow:true,  //校验是否显示已注册提示
      registerShow_:true,  //校验手机号是否存在时，发送验证码按钮的状态
      loginError: true,
      regPwdErrShow: true,

      infoCurrent:false,  //注册信息完整
      
      status:false,  //密码是否可见
      disabled_:false  //是否可点

    };
    this.getAuthCode = this.getAuthCode.bind(this);
    this.onChange = this.onChange.bind(this);
    this.submitReg = this.submitReg.bind(this);
    this.checkPhoneNumber = this.checkPhoneNumber.bind(this);
    this.countDownFun = null;
    this.countDownFun_ = null;
    this.countDownErrorCode = null;
  }

  componentWillUnmount() {
    if (this.countDownFun) {
      clearInterval(this.countDownFun);
    }

    if (this.countDownFun_) {
      clearInterval(this.countDownFun_);
    }

    if (this.countDownErrorCode) {
      clearInterval(this.countDownErrorCode);
    }
  }

  
  checkInfo(){
    const {regPhone, regPwd, regAuthCode, readStatus} = this.state;
    if(regPhone.length > 0 && regPwd.length > 0 && regAuthCode.length > 0 ){
      console.log(regPhone,regPwd,regAuthCode)
      this.setState({
        disabled_:true
      })
    } else {
      this.setState({
        disabled_:false
      })
    }
  }

  //检验手机号是否存在
  async checkPhoneNumber() {
    
    const phoneNum = this.state.regPhone;
    if (phoneNum.length === 0) {
      this.setState({regNameErr: '请输入手机号'});
      return;
    } else {
      this.setState({registerShow: true,loginError:true});
    }
    if (!VER_PHONE.test(phoneNum)) {
      this.setState({regNameErr: '请输入正确的手机号',registerShow_:false});
      return;
    } else {
      this.setState({regNameErr: ''});
    }

    if (phoneNum && phoneNum.length > 0 && VER_PHONE.test(phoneNum)) {
      let param = {
        mobile:phoneNum
      }
      const response = await regiserAccount.getPhoneExist(param);
      if (response.code !== 0) {
        if (response.msg === '该手机号已注册，请直接登录！') {
          this.setState({
            registerShow: false,
            registerShow_: false,
            loginError: false
          });
         
          return;
        }
        this.setState({
          regNameErr: response.msg,
          // registerShow: true,
        }); 
      } else {
        this.setState({
          registerShow: true,
          registerShow_:true
        },()=>{
          this.setState({regNameErr: ''});
          this.checkInfo()
        })  
      }
    }
  }

  //获取验证码
  async getAuthCode() {
    if (this.state.authLoading) {
      return;
    }
    const {regPhone} = this.state;
    if (regPhone.length === 0) {
      this.setState({regNameErr: '手机号不能为空'});
      return;
    }
    if (!VER_PHONE.test(regPhone)) {
      this.setState({regNameErr: '请输入正确的手机号'});
      return;
    }
    this.setState({regNameErr: ''});
    // 发送验证码的时间存在本地
    const sendTime = localStorage.getItem(regPhone);
    if (sendTime && new Date().getTime() - sendTime * 1 < AUTH_CODE_TIME * 1000) {
      alert(`${AUTH_CODE_TIME}秒内仅能获取一次验证码，请稍后重试`);
      return;
    }
    //调用获取验证码接口
    this.setState({authLoading: true});
    try {
      let param = {
        mobile:regPhone
      }
      const response = await regiserAccount.getAuthCode(param);
      this.setState({authLoading: false});
      if (response.code === 0) {
        message.info('发送成功');
      } else {
        message.error(response.msg);
        return;
      }
    } catch (e) {
      this.setState({authLoading: false});
      message.error('请求失败');
      return;
    }
    localStorage.setItem(regPhone, new Date().getTime());
    //发送请求 按钮变不可点状态
    this.setState({showAuthCode: false});
    //成功之后倒计时开始启动
    this.countDownFun = setInterval(() => {
      if (this.state.countDown === 0) {
        clearInterval(this.countDownFun);
        this.setState({countDown: AUTH_CODE_TIME, showAuthCode: true});
      } else {
        this.setState({countDown: this.state.countDown - 1});
      }
    }, 1000);
  }

  //修改所有input的state统一方法
  onChange(e) {
    const a = e.target.name;
    this.setState({
      [a]: e.target.value
    });
  }


  //注册提交方法
  async submitReg() {
    console.log(11111111)
    if (this.state.regLoading) {
      return;
    }
    const {regPhone, regPwd, regAuthCode, readStatus} = this.state;
    let that = this.props;
    let flag = true;
   
    if (regPhone.trim().length === 0) {
      this.setState({regNameErr: '请输入手机号'});
      flag = false;
    } else if (!VER_PHONE.test(regPhone.trim())) {
      this.setState({regNameErr: '手机号格式不正确'});
      flag = false;
    } else {
      this.setState({regNameErr: ''});
    }
    if (regAuthCode.trim().length === 0) {
      this.setState({regAuthErr: '请输入验证码'});
      flag = false;
    } else if (regAuthCode.trim().length !== 6) {
      this.setState({regAuthErr: '验证码应为6位数'});
      flag = false;
    } else {
      this.setState({regAuthErr: ''});
    }
    if (regPwd.trim().length !== regPwd.length) {
      this.setState({regPwdErr: '密码中不能含空格'});
      flag = false;
    } else if (regPwd.length === 0) {
      this.setState({regPwdErr: '请输入密码'});
      flag = false;
    }else if (regPwd.trim().length < 6) {
      this.setState({regPwdErr: '密码不小于6位'});
      flag = false;
    } else {
      this.setState({regPwdErr: ''});
    }
    if(!pass_reg.test(regPwd)){
      this.setState({
        regPwdErr: '密码不能为纯数字，不包含空格，区分大小写，8-15位字符',
        regPwdErrShow:false
      });
      return;
    } else {
      this.setState({regPwdErr: '',regPwdErrShow:true});
    }
    if (readStatus) {
      this.setState({textErr: '请先阅读注册协议'});
      flag = true;
    } else {
      this.setState({textErr: ''});
    }
    if (!flag) {
      return;
    }
    this.setState({
      regNameErr: '',
      regAuthErr: '',
      regPwdErr: ''
    });
    const reg = {
      fmobile: regPhone.trim(),
      fpwd: regPwd.trim(),
      authcode:regAuthCode.trim(),
      type: 1, //投资用户
    };
    // 调用注册接口
    try {
      this.setState({regLoading: true});
      const response = await regiserAccount.regUser(reg);
      this.setState({regLoading: false});
      if (response.code === 0) {
        this.setState({showReg: false});
        this.setState({
          regPhone: '',
          regPwd: '',
          regAuthCode: '',
          showAuthCode: true,
        });
        message.info('注册成功,即将自动跳转到登录界面')
        setTimeout(function(){
          that.history.push('./login')
        },3000)
        
      } else {
        response.msg && message.warning(response.msg);
      }
    } catch (e) {
      this.setState({regLoading: false});
      message.error('服务器繁忙，请稍后重试');
    }
  }

  pwdStatus(status){
    if(status === 'show'){
       this.setState({
         status:false
       })
    } 
    if(status === 'hide') {
      this.setState({
        status:true
      })
    }
  }

  pressKey(e) {
    if (e.keyCode === 13) {
      this.submitReg();
    }
  }


  render() {
    const {showReg, showAuthCode, authCode, countDown, countDown_, regPhone, regPwd, regAuthCode, loginPwd, readStatus, flag, loginName, codeNameErr, newPass, newPass_, show, code, flagShow} = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
       
      <div className="logindiv1"  style={{height: 495,borderRadius:10,marginTop: 80,marginBottom: 500}}>
        <div className="back">
                <div className="form logf" onChange={this.onChange} style={{paddingTop:80}}>
                  <Spin tip="注册中..." spinning={this.props.submitting} >
                    <div className="row" style={{position:'relative'}}>   
                      <input className="put "  value={regPhone} maxLength={20}
                            onChange={(e) => {this.setState({regPhone: e.target.value})}} name="regPhone" type="tel"
                            placeholder="请输入11位手机号码" onBlur={()=>this.checkPhoneNumber()} onKeyDown={(e)=>this.pressKey(e)}/>
                           <i className="zjb zjb-shouji-copy" style={{position:'absolute',top:'4px',left:'11px',fontSize:25,color:'#d5d5d5'}}></i>
                           <span style={{position:'absolute',top:'6px',left:'44px',fontSize:20,color:'#f0f0f0'}}>|</span>
                      
                      {
                        this.state.registerShow ?this.state.regNameErr?
                        <p className="prompts" style={{marginLeft:0}}>{this.state.regNameErr}</p>:
                        <p className="registration-prompts"> &nbsp;</p> : 
                        <p className="registration-prompts">该手机号已注册，<a onClick={() => this.props.history.push('./login')}>立即登录</a></p>
                       }
                     
                    </div>
                    <div className="row relative" style={{marginBottom:15}}>
                      <input className="put" value={regAuthCode} maxLength={6} name="regAuthCode" type="tel"
                            placeholder="输入短信验证码" onChange={(e) => this.setState({regAuthCode: e.target.value})} style={{paddingLeft:'15px',marginBottom:2}} onBlur={()=>{this.checkInfo()}} onKeyDown={(e)=>this.pressKey(e)}/>
                            {
                              this.state.regAuthErr ?
                             <p className="prompts" style={{marginLeft:0}}>{this.state.regAuthErr}</p> :
                            <p className="prompts" style={{marginLeft:0}}>&nbsp;</p> }
                      

                      {// 根据倒计时时间显示是否可以点击获取验证码按钮
                        this.state.registerShow_ ? 
                          ((showAuthCode) ?
                          <a className="getvc center" onClick={()=>this.getAuthCode()} >点击获取验证码</a> :
                          <span className="getvc center" style={{backgroundColor: '#D1D1D1'}}>{countDown}s后重新获取</span>) :
                          <span className="getvc center" style={{backgroundColor: '#D1D1D1'}}>点击获取验证码</span>
                      }
                    </div>
                    <div className="row" style={{marginBottom:70,position:'relative'}}>
                     
                           {
                             this.state.status ? 
                             <div>
                                  <input className="put "  value={regPwd} maxLength={15}
                            name="regPwd" onChange={(e) => this.setState({regPwd: e.target.value})}
                            placeholder="请设置登录密码" onBlur={()=>{this.checkInfo()}} onKeyDown={(e)=>this.pressKey(e)}/>
                           <i className="zjb zjb-mima" style={{position:'absolute',top:'4px',left:'11px',fontSize:24,color:'#d5d5d5'}} ></i>
                           <i className="zjb zjb-mimakejian" style={{position:'absolute',top:'4px',right:'11px',fontSize:24,color:'#d5d5d5'}} onClick={()=>{this.pwdStatus('show')}}></i>
                           <span style={{position:'absolute',top:'5px',left:'44px',fontSize:20,color:'#f0f0f0'}}>|</span>
                             </div>:

                             <div>
                               <input className="put "  value={regPwd} maxLength={15}
                            name="regPwd" type="password" onChange={(e) => this.setState({regPwd: e.target.value})}
                            placeholder="请设置登录密码" onBlur={()=>{this.checkInfo()}} onKeyDown={(e)=>this.pressKey(e)}/>
                           <i className="zjb zjb-mima" style={{position:'absolute',top:'4px',left:'11px',fontSize:24,color:'#d5d5d5'}} ></i>
                           <i className="zjb zjb-htmal5icon08" style={{position:'absolute',top:'4px',right:'11px',fontSize:24,color:'#d5d5d5'}} onClick={()=>{this.pwdStatus('hide')}}></i>
                           <span style={{position:'absolute',top:'5px',left:'44px',fontSize:20,color:'#f0f0f0'}}>|</span>
                             </div>
                            
                           }
                           
                      <p className="prompts" style={{marginLeft:0}} >{this.state.regPwdErr}</p>
                      {
                        this.state.regPwdErrShow ?  <p className="registration-prompts">密码不可纯数字，区分大小写，8-15位字符</p>  : null
                      }
                      
                    </div>
                   
                      <p  style={{position:'relative'}}>
                        <input
                          className="fl"
                          id="chk1"
                          checked={readStatus}
                          type="checkbox"
                          onChange={() => this.setState({readStatus: !readStatus})}
                          style={{position:'absolute',top:-3,left:-92}}
                        />
                        <label className="fl"  style={{ marginLeft:17,color:'#333333',marginTop:-7}}>
                          <i>已阅读并接受</i>
                          <a className="blue" style={{textDecoration:'none'}}>注册协议</a>
                      
                        </label>
                      </p>
                    
                    <div style={{marginTop:95}}>
                     {
                       this.state.disabled_  && this.state.readStatus? 
                       <a className="btn" onClick={this.submitReg} loading={this.state.regLoading}>注册</a>:
                       <a className="btn" style={{backgroundColor: '#D1D1D1'}}>注册</a>
                    }
        
                    </div>
                    <p className="safe-info">
                      <i className="zjb zjb-renzheng1" style={{color:'#4cd964',fontSize:14,marginRight:5}}/>
                      您的信息已使用SSL加密技术，数据传输安全
                    </p>
                  </Spin>
                </div> 
        </div>
        <div className="back_">      
          <img src={require('../../assets/img/register_03.png')}  />
        </div>
      </div>
      
    );
  }
}


