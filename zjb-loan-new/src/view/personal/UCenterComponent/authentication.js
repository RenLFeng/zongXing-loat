import React from 'react';
import { Link } from 'dva/router';
import { Icon, Input, Button, message, Spin } from 'antd';
import '../../assets/ucenter/realName.scss';
import { verifyIdcard } from '../../services/api';
import Path from '../../common/pagePath';
import {CARD_REG} from '../../common/systemParam'

export default class Authentication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPage: 'chinaCard',
      // showPage: 'ok',
      realName: '',
      idcard: '',
      openName: '',
      num: 5, // 5秒后
      // loading:false,
      message1:"",
      message2:""
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
    console.log('updateRealName', e.target.value);
    this.setState({ realName: e.target.value });
  };
  updateIdcard = (e) => {
    console.log('updateIdcard', e.target.value);
    this.setState({ idcard: e.target.value });
  };
  handleSubmit = async () => {
    if (this.state.loading) {
      return;
    }
    const param = {
      realName: this.state.realName.trim(),
      idcard: this.state.idcard,
    };
    if(!CARD_REG.test(param.idcard)){
      this.setState({
        message2:'身份证格式不正确'
      })
      return
    } else {
      this.setState({
        message2:''
      })
    }
    if (!param.realName) {
      message.error('真实姓名不能为空！');
      return;
    }
    if (!param.idcard) {
      message.error('身份证号不能为空！');
      return;
    }
    this.setState({loading: true});
    const response = await verifyIdcard(param);
    this.setState({loading: false})
    if (response.code === 1) {
      this.setState({ 
        showPage: 'ok',
        openName: param.realName
      });
      this.countDown = setInterval(()=>{ 
         this.setState({
           num: this.state.num - 1
         }, () => {
           if (!this.state.num) {
             clearInterval(this.timeDown);
             this.props.history.push('/index/uCenter/openQAccount');
           }
         });
      }, 1000);
    } else {
      this.setState({
        message2:'信息不匹配'
      })
    }
  };



  render() {
    const { userName } = this.state;
    const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;

    return (
      <div className="pages">
        <div className="real_title_">
          <span className="safeCenter_" onClick={()=>this.props.history.push('/index/uCenter/realName')}>安全中心</span>
          <span style={{fontSize: 16}}>&gt; 身份认证 &gt; 居民身份认证</span>
        </div>
        {
          this.state.showPage === 'chinaCard' ?
            <div>
              <div className="Prompt">
                <img alt="提示" src={require('../../assets/img/u3530.png')} />
              
                <p className="p1" style={{textAlign:'center'}}>完成身份认证，有助于建立完善可靠的互联网信用体系</p>
                <p className="p2"  style={{textAlign:'center'}}>姓名必须与充值、提现的银行卡开户名保持一致</p>
              </div>
                <div className="info">
                  <div className="inp">
                    <Input placeholder="请输入真实姓名" onChange={this.updateRealName} />
                    <img alt="真实姓名" src={require('../../assets/img/u186.png')} className="img1"/>
                    <span className="span_">|</span>
                  </div>
                  <div className="inp">
                    <Input placeholder="请输入第二代身份证号码" onChange={this.updateIdcard} style={{marginTop:23}}/>
                    <img alt="身份证id" src={require('../../assets/img/u192.png')}  className="img2"/>
                    <span className="span_1">|</span>
                    <span className="prompts">{this.state.message2}</span>
                  </div>
      
                  <span onClick={this.handleSubmit} type="primary" loading={this.state.loading} className="Button">立即身份认证</span>
                </div>
            </div> :
          (this.state.showPage === 'ok') ?
              <div className="info">
                <h1>
                  <img alt="ok" src={require('../../assets/img/u3551.png')} />
                  {this.state.openName}，恭喜您已经通过身份认证
                </h1>
                <h3>下一步：前往开通资金托管账户</h3>
                <a className="goback" onClick={()=>this.props.history.push('/index/uCenter/openQAccount')}>{this.state.num}秒后自动跳转</a>
              </div> : null
        }
      </div>
    );
  }
}
