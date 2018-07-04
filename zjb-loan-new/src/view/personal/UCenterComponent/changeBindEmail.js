
import React from 'react';
import { Input, Button, Spin, message  } from 'antd';
import { UpdateEmail, UpdateEmail_ } from '../../services/api';
import { AUTHENTICATION, OPENQACCOUNT, BINDCARD ,USER_BASIC} from '../../common/pagePath';
import { AUTH_CODE_TIME, E_MAIL} from '../../common/systemParam';
import '../../assets/ucenter/changePwd.scss';
import {connect} from 'dva';

@connect((state)=>({
  baseData: state.login.baseData,
}))

export default class ChangeBindEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      email:'',
      show:false,  //密码隐藏
      newEmail:'',
      newShow:false,//密码隐藏
      code:''  ,
      showAuthCode:true,
      loading:false,
      countDown: AUTH_CODE_TIME,  //获取验证码倒计时
      firstShow:true,
      num:3,   //3秒后跳转
      click:true ,
      message1:'',  //提示语 
      message2:'',  //提示语 
      sureloading:false    //确定按钮
    }
    this.countDown = null;
    this.countDownFun = null;
  }

  componentWillUnmount() {
    if (this.countDown) {
      clearInterval(this.countDown);
    }
    if (this.countDownFun) {
      clearInterval(this.countDownFun);
    }
  }

  async update(){
    const {email, newEmail} = this.state;
    if(email.trim().length === 0 || newEmail.trim().length === 0){
      this.setState({
        message1:'请输入原来的邮箱号',
        message2:'请输入新的邮箱号'
      })
      return
   } else {
    this.setState({message1:'',message2:''})
   }
    if(newEmail === email){
      this.setState({
        message2:'请输入新的邮箱号'
      })
      return
    }else {
      this.setState({message2:'' })
    }
    if(!E_MAIL.test(email)){
      this.setState({
        message1:'填写的邮箱格式不正确'
      })
      return
    } else {
      this.setState({
        message1:''
      })
    }
    if(!E_MAIL.test(newEmail)){
      this.setState({
        message2:'填写的邮箱格式不正确'
      })
      return
    } else {
      this.setState({
        message2:''
      })
    }
    let param = {
      oldEmail:email,
      newEmail:newEmail
    }
    const sendTime = localStorage.getItem(param);
    if (sendTime && new Date().getTime() - sendTime * 1 < AUTH_CODE_TIME * 1000) {
      alert(`${AUTH_CODE_TIME}秒内仅能获取一次验证码，请稍后重试`);
      this.setState({click:false})
      // return;
    } else {
     this.setState({click:true,showAuthCode: true})
    }
    this.setState({ loading: true });
    try{
      const response = await UpdateEmail(param);
      if(response.code === 0){
        message.info(response.msg)
        this.setState({
          loading: false,
          showAuthCode: false,
        })
      } else {
        this.setState({showAuthCode: true,loading: false})
        response.msg && message.error(response.msg);
        return;
      }
    } catch(e) {
      this.setState({loading: false });
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

  //绑定
    async changeEmail_(){
      const {newEmail,code} = this.state;
      if(code.trim().length === 0){
        message.error('验证码不能为空');
        return;
      }
      let param = {
        newEmail:newEmail,
        verificationCode:code
      }
      this.setState({sureloading:true})
     const response = await UpdateEmail_(param);
     console.log('11111',response);
     if(response.code === 0){
       this.setState({
         firstShow:false,
         sureloading:false
       })
      this.countDown = setInterval(()=>{ 
          this.setState({
            num: this.state.num - 1
          }, () => {
            if (!this.state.num) {
              clearInterval(this.countDown);
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
    const {email,newEmail,code,showAuthCode,countDown,message1,message2} = this.state;
    const {baseData} = this.props;
    return (

        <div className="fr uc-rbody user-form-box" style={{width:"100%",float:"none",height:900}}>
            
            {
              this.state.firstShow ?
              <div>
                <div className="real_title_">
                  <span className="safeCenter_" onClick={()=>this.props.history.push('/index/uCenter/realName')}>实名认证</span>
                  <span style={{fontSize: 16}}>&gt; 变更绑定邮箱 &gt;  绑定新邮箱</span>
               </div>
              <div style={{width:230,margin:'71px auto 0 auto'}}>
                
                  <div className="pass">
                    <Input placeholder="输入正在使用的邮箱地址" className="inp" value={email} onChange={(e) => { this.setState({ email: e.target.value }) }} />
                    {
                      message1 ? 
                      <p className="prompts" style={{ marginBottom: 5, color: 'red' }}>{message1}</p>:
                      <p className="prompts" style={{ marginBottom: 5, color: 'red' }}>&nbsp;</p>
                    }               
                    <i className="zjb zjb-e-mail_icon img1" />
                  </div>
                
              </div>
              <div style={{width:230,margin:'5px auto 0 auto'}}>
                <div className="pass">
                    <Input placeholder="输入新邮箱地址" className="inp" value={newEmail} onChange={(e) => { this.setState({ newEmail: e.target.value }) }} />
                    {
                      message2 ? 
                      <p className="prompts" style={{ marginBottom: 5, color: 'red' }}>{message2}</p>:
                      <p className="prompts" style={{ marginBottom: 5, color: 'red' }}>&nbsp;</p>
                    }  
                    <i className="zjb zjb-e-mail_icon img1" />
                </div>
              </div>
              <div style={{width:230,margin:'4px auto 0 auto'}} className="codeInp">
                <Input placeholder="输入短信验证码" className="input1" value={code} onChange={(e) => { this.setState({ code: e.target.value }) }} maxLength={6} />
                  {// 根据倒计时时间显示是否可以点击获取验证码按钮
                    this.state.showAuthCode ?
                    (this.state.click ?  
                     <Button className="input2" onClick={() => this.update()} loading={this.state.loading}>点击获取验证码</Button>:
                     <Button className="input2" style={{ backgroundColor: '#D1D1D1' }}>点击获取验证码</Button>)
                      :
                      <Button className="input2" style={{ backgroundColor: '#D1D1D1' }}>{countDown}s后重新获取</Button>
                  }
                  <p className="prompts" style={{ marginBottom: 15, color: 'red', position: 'relative' }}>{this.state.code_prompt}</p>
              </div>
              <div style={{width:230,margin:'60px auto 0 auto'}} >
                <Button style={{width:230,fontSize:18}} type="primary" onClick={()=>{this.changeEmail_()}} loading={this.state.sureloading}>确定</Button>
              </div>
            </div>:
            <div>
                <div className="real_title_">
                  <span className="safeCenter_" onClick={()=>this.props.history.push('/index/uCenter/realName')}>实名认证</span>
                  <span style={{fontSize: 16}}>&gt; 变更绑定邮箱 &gt; 新邮箱绑定成功</span>
                </div>
                <div className="success">
                  <h1>
                     <img alt="ok" src={require('../../assets/img/u3551.png')} />{baseData ? baseData.nickName:''}，恭喜您新邮箱地址绑定成功
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
