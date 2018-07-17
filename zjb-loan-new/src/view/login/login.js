import React from 'react';
import './login.scss';
import { VER_PHONE, AUTH_CODE_TIME } from '../../common/SystemParam';
import { connect } from 'dva';
import {Spin, message, Button, Icon, Steps, Modal, Form, Row, Col, Input} from 'antd';
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
      alert('登录手机号不能为空');
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
    const {loginPhone} = this.state;
    if (loginPhone.length === 0) {
      this.setState({loginNameErr:'手机号不能为空'})
      return;
    }
    if (loginPhone.length < 6 || loginPhone.length > 16) {
      this.setState({loginNameErr:'手机号长度不正确',loginError: true})
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
      <div className="logindiv1 "  style={{height: 495,borderRadius:10,marginTop: 80,marginBottom: 500}}>
      <Modal
          visible={this.state.authPhone}
          title="解除账号锁定"
          okText="提交"
          cancelText="取消"
          confirmLoading={this.state.relieveLoading}
          onOk={() => this.relieveAccountLock()}
          onCancel={() => {
            if (this.state.relieveLoading) {
              message.warning('请求处理中请稍后');
              return;
            }
            this.setState({authPhone: false});
          }}
        >
          <Row>
            <Col span={3}>手机号</Col>
            <Col span={15}>
              <Input value={this.state.phoneNumber} disabled/>
            </Col>
            <Col span={6} style={{textAlign: 'right'}}>
              <Button type="primary" loading={this.state.sendErrorCodeLoading} onClick={()=>this.sendErrorCodeAuth()} disabled={this.state.errorTime !== 60}>
                {this.state.errorTime === 60 ? '发送验证码' : `${this.state.errorTime}s后重试`}
              </Button>
            </Col>
          </Row>
          <Row style={{marginTop: 20}}>
            <Col span={3}>
              验证码
            </Col>
            <Col span={21}>
            <Input type="password" value={this.state.errorAuthCode} placeholder="请输入" onChange={(e)=>this.setState({errorAuthCode: e.target.value})} maxLength={10}/>
            </Col>
          </Row>
        </Modal>

        <div className="back">
                <div className="form logf" onChange={this.onChange}>
                  <div className="hd center">
                    <a className="hover">欢迎登录</a>
                  </div>
                  <Spin tip="登录中..." spinning={this.props.submitting} style={{width:400}}>
                    <div className="spinContent" style={{width:400}}>
                    <div className="row" style={{position:'relative'}}>
                      <input className="put" value={loginPhone} maxLength={20}
                            onChange={(e) => {this.setState({loginPhone: e.target.value})}} name="loginPhone" type="tel"
                            placeholder="手机号" onBlur={()=>this.checkPhone()} onKeyDown={(e)=>this.pressKey(e)}/>
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
                    <div style={{marginTop:96,width:329}}>
                      <a className="btn" onClick={this.submitLogin}>登录</a>
                    </div>
                    <p className="safe-info" style={{marginRight:90}}>
                      <i className="zjb zjb-renzheng1" style={{color:'#4cd964',fontSize:14,marginRight:5}}/>
                      您的信息已使用SSL加密技术，数据传输安全
                    </p> 
                    </div>
                   
                  </Spin>
                </div> 
        </div>
        <div className="back_">
          <img src={require('../../assets/img/login_03.png')} />
        </div>
      </div>
    );
  }
}
