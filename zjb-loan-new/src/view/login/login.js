import React from 'react';
import './login.scss';
import { VER_PHONE, AUTH_CODE_TIME } from '../../common/SystemParam';
import { connect } from 'dva';
import {Spin} from 'antd';
import { phoneExist, regUser,regiserAccount } from '../../services/api';

@connect((state) => ({
login: state.login,
submitting: state.login.submitting
}))
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showReg: true, //是否显示注册表单
      countDown: AUTH_CODE_TIME,  //获取验证码倒计时
      showAuthCode: true, //显示获取验证码的接口
      regPhone: '', //注册手机号
      regPwd: '', //注册密码
      regAuthCode: '', //注册验证码
      loginPhone: '', //登录手机号
      loginPwd: '', //登录密码
      readStatus: true, //阅读注册协议状态
      regLoading: false,
      loginError: true, 
      loginNameErr: '', //登录用户名提示
    };
    this.onChange = this.onChange.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.countDownFun = null;
  }

  componentWillUnmount() {
    if (this.countDownFun) {
      clearInterval(this.countDownFun);
    }
  }


  //修改所有input的state统一方法
  onChange(e) {
    const a = e.target.name;
    this.setState({
      [a]: e.target.value
    });
  }



  //登录提交方法
  submitLogin() {
    const { loginPhone, loginPwd } = this.state;
    if (loginPhone.length === 0) {
      alert('登录用户名不能为空');
      return;
    }
    if (loginPwd.length === 0) {
      alert('登录密码不能为空');
      return;
    }
    const login = {
      loginName: loginPhone,
      password: loginPwd,
      type:1,
    };
    this.props.dispatch({
      type: 'login/login',
      payload: login
    })
  }
// 判断  手机号是否已被注册过
  async checkPhone() {
    console.log(111)
    const {loginPhone} = this.state;
    if (loginPhone.length === 0) {
      this.setState({loginNameErr:'手机号|用户名不能为空'})
      return;
    }
    if (loginPhone.length < 6 || loginPhone.length > 16) {
      this.setState({loginNameErr:'用户名长度为6-16位字符',loginError: true})
      return;
    }
    if (this.state.checkPhoneLoading) {
      return;
    }
    this.setState({checkPhoneLoading: true});
    let param ={
    	mobile:loginPhone
    }
    const response = await regiserAccount.getPhoneExist(param);
    console.log('登陆结果为',response)
    this.setState({checkPhoneLoading: false});
    if (response.code === 0) {
      this.setState({loginError: false});
    } else {
      this.setState({loginError: true,loginNameErr:''});
    }
  }
  pressKey(e) {
    if (e.keyCode === 13) {
      this.submitLogin();
    } else {

    }
  }

  render() {
    const { showReg, showAuthCode, countDown, regPhone, regPwd, regAuthCode, loginPhone, loginPwd, readStatus } = this.state;
    return (
      <div className="logindiv1 shadow">
        { 
        <div className="form logf" onChange={this.onChange}>
          <div className="hd center">
            <h1 className="hover"  style={{fontSize: 28,color: '#666666'}}>欢迎登录</h1>

          </div>
           <Spin tip="登录中..." spinning={this.props.submitting}>
                    <div className="row" style={{position:'relative'}}>
                      <input className="put" value={loginPhone} maxLength={20}
                            onChange={(e) => {this.setState({loginPhone: e.target.value})}} name="loginPhone" type="tel"
                            placeholder="手机号|用户名" onBlur={()=>this.checkPhone()} onKeyDown={(e)=>this.pressKey(e)}/>
                            <i className="zjb zjb-shouji-copy" style={{position:'absolute',top:'4px',left:'11px',fontSize:25,color:'#d5d5d5'}}></i>
                            <span style={{position:'absolute',top:'6px',left:'44px',fontSize:20,color:'#f0f0f0'}}>|</span>      
                      {
                        this.state.loginError ? this.state.loginNameErr?
                        <p className="registration-prompts_" >
                          {this.state.loginNameErr}
                        </p> : 
                        <p className="registration-prompts">
                          &nbsp;
                        </p>
                        :
                        <p className="registration-prompts">
                          该用户还未注册，<a onClick={() => this.props.history.push('./register')}>立即注册</a>
                        </p> 
                      }                 
                    </div>

                    <div className="row" style={{position:'relative'}}>
                      <input className="put"  value={loginPwd} maxLength="16"
                            name="loginPwd" type="password" onChange={(e) => this.setState({loginPwd: e.target.value})}
                            placeholder="请输入登录密码" onKeyDown={(e)=>this.pressKey(e)} style={{marginTop:4}}/>  
                            <i className="zjb zjb-mima" style={{position:'absolute',top:'7px',left:'11px',fontSize:24,color:'#d5d5d5'}} ></i>
                            <span style={{position:'absolute',top:'8px',left:'44px',fontSize:20,color:'#f0f0f0'}}>|</span>
                      <p className="prompts" style={{color: '#868686'}}>{this.state.loginPwdErr}</p>
                      <a className="gray f14"
                          style={{marginTop: 1}}
                          onClick={() => this.props.history.push('./forgetPassWord')}>
                          忘记密码
                        </a>
                    </div>
                    <div style={{width:329,marginTop:60}}>
                      <a className="btn" onClick={this.submitLogin}>登录</a>
                    </div>
                    <p className="safe-info" style={{marginRight:46}}>
                      <i className="zjb zjb-renzheng1" style={{color:'#4cd964',fontSize:14,marginRight:5}}/>
                      您的信息已使用SSL加密技术，数据传输安全
                    </p>
                  </Spin>
          <div>
        
            <p className="other">
        <span>
            {/*<i className="fl c6">其他登录方式</i>*/}
            {/*<a className="qq"/>*/}
            {/*<a className="weixin"/>*/}
            {/*<a className="sina"/>*/}
        </span>
            </p>
          </div>
        </div> }
      </div>
    );
  }
}
