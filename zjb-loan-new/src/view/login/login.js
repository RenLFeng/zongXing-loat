import React from 'react';
import './login.scss';
import { VER_PHONE, AUTH_CODE_TIME } from '../../common/SystemParam';
import { connect } from 'dva';
import {Spin} from 'antd';
import { phoneExist, regUser } from '../../services/api';

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
      type:0,
    };
    this.props.dispatch({
      type: 'login/login',
      payload: login
    })
  }



  render() {
    const { showReg, showAuthCode, countDown, regPhone, regPwd, regAuthCode, loginPhone, loginPwd, readStatus } = this.state;
    return (
      <div className="logindiv1 shadow">
        { 
        <div className="form logf" onChange={this.onChange}>
          <div className="hd center">
            <h1 className="hover"  style={{fontSize: 28,color: '#666666'}}>登录</h1>
            <hr  className="login-hr"/>
          </div>
          <Spin tip="登录中..." spinning={this.props.submitting}>
            <div className="row">
              <input className="put user" value={loginPhone} maxLength={20} name="loginPhone" type="tel" placeholder="请输入手机号码/用户名"/>
            </div>
            <div className="row">
              <input className="put pwd" value={loginPwd} maxLength={16} name="loginPwd" type="password" placeholder="请输入登录密码"/>
            </div>
            <div>
              <a className="btn" onClick={this.submitLogin}>登录</a>
            </div>
            <div>
             <p className="safe-info">
             
                      <i className="zjb zjb-renzheng1" style={{color:'#4cd964',fontSize:14,marginRight:5}}/>
                      您的信息已使用SSL加密技术，数据传输安全
                    </p>
            </div>
            <div>
              {
  	               <p className="tright"><a className="gray f14"    onClick={() => this.props.history.push('./forgetPassWord')}>忘记密码?</a></p>
              }
            </div>
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
