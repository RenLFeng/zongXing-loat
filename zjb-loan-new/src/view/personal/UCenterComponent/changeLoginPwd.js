
import React from 'react';
import { Input, Button, Spin, message } from 'antd';
import { UpdatePass, changePass } from '../../services/api';
import { AUTHENTICATION, OPENQACCOUNT, BINDCARD ,USER_BASIC} from '../../common/pagePath';
import { AUTH_CODE_TIME,pass_reg} from '../../common/systemParam';
import '../../assets/ucenter/changePwd.scss';
import { clearInterval, setInterval } from 'timers';
import {connect} from 'dva';

@connect((state)=>({
  baseData:state.login.baseData,
}))

export default class ChangeLPwd extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      password:'',
      show:false,  //密码隐藏
      message1:'',  //提示1
      newPassword:'',
      newShow:false,//密码隐藏
      message2:'',  //提示2
      code:''  , 
      code_prompt:'', //验证码提示
      showAuthCode:true,  //获取验证码状态
      loading:false,
      countDown: AUTH_CODE_TIME,  //获取验证码倒计时
      firstShow:true,  
      num:3,   //3秒后跳转
      click:true,  //按钮状态
      sureloading:false    //确定按钮
    }
    this.countDowns = null;
    this.countDownFun  = null;
  }

  componentWillUnmount() {
    if (this.countDown) {
      clearInterval(this.countDown);
    }
    if (this.countDownFun) {
      clearInterval(this.countDownFun);
    }
  }
  
  changePassStatus(flag,num) {
    if (flag === 'show' && num ===1) {
      this.setState({
        show: false
      })
    }   
    if (flag === 'hide'&& num ===1) {
      this.setState({
        show: true
      })
    }
    if (flag === 'show' && num ===2) {
      this.setState({
        newShow: false
      })
    }   
    if (flag === 'hide'&& num ===2) {
      this.setState({
        newShow: true
      })
    }
  }

  async getCode() {
    const {password,newPassword} = this.state;
    if(newPassword.trim().length === 0 || password.trim().length === 0){
      this.setState({
        message1:'请输入原来的密码',
        message2:'请输入新密码'
      })
      return
     } else {
      this.setState({
        message1:'',
        message2:''
      })
     }
   if(!pass_reg.test(newPassword)){
     this.setState({
       message2:'密码不能为纯数字，不包含空格，区分大小写，8-15位字符'
     })
     return
   } else {
    this.setState({
      message2:''
    })
   }
  
   let param = {
    oldPwd:password,
    newPwd:newPassword
   }
    // 发送验证码的时间存在本地
    const sendTime = localStorage.getItem(param);
    if (sendTime && new Date().getTime() - sendTime * 1 < AUTH_CODE_TIME * 1000) {
      alert(`${AUTH_CODE_TIME}秒内仅能获取一次验证码，请稍后重试`);
      this.setState({click:false})
      return;
    } else {
      this.setState({click:true})
    }
    this.setState({ loading: true });
    try {
      const response = await UpdatePass(param);
      if (response.code === 0) {
        message.info('发送成功');
        this.setState({
          showAuthCode: false,
          loading: false
        })
      } else {
        this.setState({showAuthCode: true,loading: false})
        response.msg && message.error(response.msg)
        return;
      }
    } catch (e) {
      this.setState({ loading: false });
      message.error('请求失败');
      return;
    }
    localStorage.setItem(param, new Date().getTime());
    //   //发送请求 按钮变不可点状态
    this.setState({ showAuthCode: false });
    //成功之后倒计时开始启动
    this.countDownFun = setInterval(() => {
      if (this.state.countDown === 0) {
        clearInterval(this.countDownFun);
        this.setState({ countDown: AUTH_CODE_TIME, showAuthCode: true });
      } else {
        this.setState({ countDown: this.state.countDown - 1 });
      }
    }, 1000);
  }

  async changepwd(){
    const {newPassword, code} = this.state;
    if(code.trim().length === 0){
      this.setState({code_prompt:'验证码不能为空' })
      return
     } else {
      this.setState({ code_prompt:''})
     }
    let param = {
      newPwd:newPassword,
      verificationCode:code,
    }
    this.setState({sureloading:true})
    const response = await changePass(param);
    console.log('reaponse',response)
    if(response.code === 0){
       this.setState({
        firstShow:false,
        sureloading:false
       })
      this.countDowns = setInterval(()=>{ 
        console.log(this.countDowns);
        this.setState({
            num: this.state.num - 1
          }, () => {
            if (!this.state.num) {
              console.log(111111)
              clearInterval(this.countDowns);
              this.props.history.push('/index/uCenter/realName');
            }
          });
      }, 1000);
    } else {
      this.setState({sureloading:false})
      response.msg && message.error( response.msg)
    }
  }

  render() {
    const {password,newPassword,code,showAuthCode,countDown,message1,message2,code_prompt,sureloading} = this.state;
    const {baseData} = this.props;
    return (
        <div className="fr uc-rbody user-form-box" style={{width:"100%",float:"none",height:900}}>
            
            {
              this.state.firstShow ?
              <div>
                <div className="real_title_">
                  <span className="safeCenter_" onClick={()=>this.props.history.push('/index/uCenter/realName')}>实名认证</span>
                  <span style={{fontSize: 16}}>&gt; 修改登录密码 &gt; 设置新登录密码</span>
               </div>
              <div style={{width:230,margin:'71px auto 0 auto'}}>
                {this.state.show ? 
                  <div className="pass">
                    <Input placeholder="请输入当前登录密码" className="inp" value={password} onChange={(e) => { this.setState({ password: e.target.value }) }} maxLength={15}/>
                    {
                      message1 ? 
                      <p className="prompts" style={{ marginBottom: 5, color: 'red' }}>{message1}</p>:
                      <p className="prompts" style={{ marginBottom: 5, color: 'red' }}>&nbsp;</p>
                    }
                    <i className="zjb zjb-mima2 img1" />
                    <i className="zjb zjb-mimakejian img2" onClick={() => { this.changePassStatus('show',1) }} />
                  </div>:
                  <div className="pass">
                    <Input placeholder="请输入当前登录密码" className="inp" value={password} type="password" onChange={(e) => { this.setState({ password: e.target.value }) }} maxLength={15}/>
                    {
                      message1 ? 
                      <p className="prompts" style={{ marginBottom: 5, color: 'red' }}>{message1}</p>:
                      <p className="prompts" style={{ marginBottom: 5, color: 'red' }}>&nbsp;</p>
                    }
                    <i className="zjb zjb-mima2 img1"  />
                    <i className="zjb zjb-htmal5icon08 img2" onClick={() => { this.changePassStatus('hide',1) }} />
                  </div>
                }    
              </div>
              <div style={{width:230,margin:'10px auto 0 auto'}}>
                {this.state.newShow ? 
                  <div className="pass">
                    <Input placeholder="请设置新登录密码" className="inp" value={newPassword} onChange={(e) => { this.setState({ newPassword: e.target.value })}} maxLength={15}/>
                      {
                        message2 ? 
                        <p className="prompts" style={{ marginBottom: 5, color: 'red' }}>{message2}</p>:
                        <p className="prompts" style={{ marginBottom: 5, color: 'red' }}>&nbsp;</p>
                      }
                    <i className="zjb zjb-mima2 img1" />
                    <i className="zjb zjb-mimakejian img2" onClick={() => { this.changePassStatus('show',2) }} />
                  </div>:
                  <div className="pass">
                    <Input placeholder="请设置新登录密码" className="inp" value={newPassword} type="password" onChange={(e) => { this.setState({ newPassword: e.target.value })}} maxLength={15}/>
                    {
                      message2 ? 
                      <p className="prompts" style={{ marginBottom: 5, color: 'red' }}>{message2}</p>:
                      <p className="prompts" style={{ marginBottom: 5, color: 'red' }}>&nbsp;</p>
                    }
                    <i className="zjb zjb-mima2 img1"  />
                    <i className="zjb zjb-htmal5icon08 img2" onClick={() => { this.changePassStatus('hide',2) }} />
                  </div>
                }    
              </div>
              <div style={{width:230,margin:'7px auto 0 auto'}} className="codeInp">
                <Input placeholder="输入短信验证码" className="input1" value={code} onChange={(e) => { this.setState({ code: e.target.value }) }} maxLength={6} />
                  {// 根据倒计时时间显示是否可以点击获取验证码按钮
                    this.state.showAuthCode ?
                      <Button className="input2" onClick={() => this.getCode()} loading={this.state.loading}>点击获取验证码</Button> :
                      <Button className="input2" style={{ backgroundColor: '#D1D1D1' }}>{countDown}s后重新获取</Button>
                  }
                  {
                    code_prompt?
                    <p className="prompts" style={{ marginBottom: 15, color: 'red', position: 'relative' }}>{this.state.code_prompt}</p>:
                    <p className="prompts" style={{ marginBottom: 15, color: 'red', position: 'relative' }}>&nbsp;</p>
                  }
                 
              </div>
              <div style={{width:230,margin:'60px auto 0 auto'}} >
                <Button style={{width:230,fontSize:18}} type="primary" onClick={()=>{this.changepwd()}} loading={sureloading}>确定</Button>
              </div>
            </div>:
            <div>
                <div className="real_title_">
                  <span className="safeCenter_" onClick={()=>this.props.history.push('/index/uCenter/realName')}>实名认证</span>
                  <span style={{fontSize: 16}}>&gt; 修改登录密码 &gt; 新登录密码设置成功</span>
                </div>
                <div className="success">
                  <h1>
                     <img alt="ok" src={require('../../assets/img/u3551.png')} />{baseData? baseData.nickName:''}，恭喜您修改登录密码成功
                  </h1>
                  <p className="goback">
                    <a  onClick={()=>this.props.history.push('/index/uCenter/realName')}>{this.state.num}秒后自动跳转</a>
                  </p>                
                </div>
                
            </div>
            }   
        </div>

    );
  }
}
