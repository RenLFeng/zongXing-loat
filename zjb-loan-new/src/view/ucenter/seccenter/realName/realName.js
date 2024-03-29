import React from 'react';
import { Icon, Input, Button, Steps, Modal, message ,Spin } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { AUTH_ADDRESS, } from '../../../../common/SystemParam';
import Path from '../../../../common/PagePath'
import LeftMenu from '../../../../components/leftmenu/leftMenu';
import './realName.scss';
import {securityCentreService, accountService} from '../../../../services/api';
import ModalData from './authorization/authorization';


const Step = Steps.Step;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

@connect((state) => ({
  safeData: state.safeCenter.safeData,
  safeDataLoading: state.safeCenter.safeDataLoading,
  accountId: state.login.baseData.accountId,
  baseData: state.login.baseData,
  openStatus: state.personal.openStatus,
  openFailMsg: state.personal.openFailMsg,
  gotoRealName: state.mineloan.gotoRealName
}))
export default class RealName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distribution: {}, //授权表单数据
      status: '', //授权状态
      url: '',     // 提交表单乾多多链接
      cardList: [], //银行卡列表
      showModal:false,
      yysurl:{},
      sburl:{},
      gjjurl:{},
      xxurl:{},
      jdurl:{},
      snurl:{},
      urlObj:null,
      id:0,
      grantLoading:false
    }
  }

  componentDidMount() {
    //初始化安全中心信息
    this.initFetchSafeData();
    if (this.props.safeData.userSecurityCenter.faccountBind) {
      this.getBankCardListAjax(); // 获取用户绑定银行卡
    }
 
    // 获取用户绑定银行卡
    // this.getBankCardListAjax(); 
    //获取已经授权的授权代码
    this.getAuthorizationState();
    // 获取开户状态信息
    this.getOpenStatus();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.safeData.userSecurityCenter.faccountBind !== nextProps.safeData.userSecurityCenter.faccountBind) {
      this.getBankCardListAjax(); // 获取用户绑定银行卡
    }
    if (this.props.accountId !== nextProps.accountId) {
      this.getBankCardListAjax(nextProps.accountId); // 获取用户绑定银行卡
    }
  }
  componentDidUpdate(){
    //定位到授权位置
    if(this.props.gotoRealName){
      window.scrollTo(0,850)
    }
  }

  async getOpenStatus() {
     // 借款用户 账户总览信息 数据获取 存入redux
    const response = await accountService.getPersonalData();
    if (response.code === 0) {
      this.props.dispatch({
        type: 'personal/getPersonalAccount',
        payload: response.data
      })
      this.props.dispatch({
        type: 'personal/savePersonalStatus',
        payload: {
          openStatus: 1, // 开户成功 
          openFailMsg: ''
        }
      })
    } else if (response.code === -1 && response.msg === '该账户未开户') {
      this.props.dispatch({
        type: 'personal/savePersonalStatus',
        payload: {
          openStatus: -1, // 未开户 
          openFailMsg: ''
        }
      })
      this.props.history.push('/index/uCenter/openAccount');
    } else if (response.code === -1 && response.msg === '该账户正在开户中') {
      this.props.dispatch({
        type: 'personal/savePersonalStatus',
        payload: {
          openStatus: 2, // 开户中 
          openFailMsg: ''
        }
      })
    } else if (response.code === -1 && response.data === '实名认证申请中') {
      this.props.dispatch({
        type: 'personal/savePersonalStatus',
        payload: {
          openStatus: 1, // 等待实名认证 
          openFailMsg: response.data
        }
      })
    } else if (response.code === -1 && response.msg === '该账户开户失败') {
      this.props.dispatch({
        type: 'personal/savePersonalStatus',
        payload: {
          openStatus: 0, // 开户中 
          openFailMsg: response.data
        }
      })
    } else {
      response.msg && message.error(response.msg);
    }
  }

  /** 初始化安全中心信息 */
  initFetchSafeData() {
    this.props.dispatch({
      type: 'safeCenter/getSafe'
    });
  }

   /** 获取用户绑定银行卡 */ 
   getBankCardListAjax = async (param) => {
    const response = await securityCentreService.getBankCardList(param?param:this.props.accountId);
    if (response.code === 0) {
      if (response.data) {
        this.setState({
          cardList: response.data
        })
      }
    } else {
      message.error(response.msg);
    }
  }

 
  /** 跳转到开户界面 */
  jumpCreateAccount() {
    var that = this;
    that.props.history.push('/index/uCenter/openQAccount')
  }
  /** 从后台获取授权所需参数，并跳转乾多多页面 */
  async getDistribution(type) {
    this.setState({ loading: true });
    const response = await securityCentreService.distribution(type, '', encodeURIComponent(window.location.href));
    this.setState({ loading: false });
    if (response.code === 0) {
      this.setState({
        distribution: response.data.param,
        url: response.data,
      }, () => {
        this.formId.submit();
        Modal.info({
          title: '提示',
          content: '请在新页面完成操作,可刷新页面查看结果',
          okText: '确定',
          onOk: () => {
            this.getAuthorizationState();
          },
        });
      });
    } else {
      response.msg && message.error(response.msg);
    }
  }

   // 查询当前账户授权状态  1:自动投标，2：自动还款，3：二次分配自动通过
   async getAuthorizationState() {
    this.setState({ loading: true });
    const response = await securityCentreService.authorizationState('');
    this.setState({ loading: true });
    if (response.code === 0) {
      this.setState({
        status: response.data ? response.data : '',
      })
    } else if (response.code === -3) {
      this.setState({
        showAuth: true
      })
    } else {
      response.msg && message.error(response.msg);
    }

  }
  /** 关闭授权 */
  async CloseAuthorization(type) {
    const response = await securityCentreService.closeAuthorization(type, '', encodeURIComponent(window.location.href));
    if (response.code === 0) {
      this.setState({
        distribution: response.data.param,
        url: response.data,
      }, () => {
        this.formId.submit();
        Modal.info({
          title: '提示',
          content: '请在新页面完成操作,可刷新页面查看结果',
          okText: '确定',
          onOk: () => {
            this.getAuthorizationState();
          },
        });
      });
    } else {
      response.msg && message.error(response.msg);
    }
  }

  // 解除银行卡绑定
  async unbindBankCardAjax(cardId, fid) {
    if (!this.state[`${fid}password`] || (this.state[`${fid}password`] && this.state[`${fid}password`].trim().length === 0)) {
      message.error('密码不能为空');
      return;
    }
    if (this.state.unbindLoading) {
      return;
    }
    this.setState({ unbindLoading: true });
    const response = await securityCentreService.unbindBankCard({
      accountId: this.props.accountId,
      bankcard: cardId,
      password: this.state[`${fid}password`].trim()
    });
    this.setState({ unbindLoading: false });
    if (response.code === 0) {
      this.getBankCardListAjax();
      message.info('解除绑定成功')
    } else {
      response.msg && message.error(response.msg);
    }
  }

  show(key){
    if (!this.state.urlObj) {
      this.authorize(key);
      return;
    }
    this.setState({
      showModal:true,
      authUrl:key
    })
  }

  //授权
  async authorize(key){
    this.setState({grantLoading:true})
    const response = await securityCentreService.getAccredit();
    if(response.code === 0){
      this.setState({
        urlObj: response.data,
        showModal:true,
        authUrl:key,
        grantLoading:false
      })
    } else {
      this.setState({grantLoading:false})
      response.msg && message.error(response.msg);
    }
  }

  // 查询认证状态
  async checkAuthStatus() {
    if (this.state.loadingAuth) {
      return;
    }
    this.setState({loadingAuth: true});
    const res = await accountService.getRealAuthByMoneyMore();
    this.setState({loadingAuth: false});
    if (res.code === 0) {
      if (res.msg == '该企业账号未认证') {
        message.info(res.msg);
        return;
      }
      this.getOpenStatus();
      this.initFetchSafeData();
    } else {
      message.error(res.msg);
    }
  }

  render() {
    // 初始化数据
    const safeData = this.props.safeData;
    const { status, distribution, url } = this.state;
    const dataArr = [{title:'运营商数据',key:'yysUrl'},{title:'社保数据',key:'shebaoUrl'},{title:'公积金数据',key:'gjjUrl'},{title:'学信数据',key:'chsiUrl'},{title:'京东数据',key:'jdUrl'},{title:'苏宁数据',key:'snUrl'}]
    return (
      <div>
        <LeftMenu param={this.props}/>
        <div>
          {
            safeData.userSecurityCenter !== undefined ?
              <div className="fr uc-rbody">
                <div className="real_title">
                  <span className="safeCenter_">开户中心</span>
                  <span className="registrationTime">注册时间:{moment(safeData.userSecurityCenter.fcreateTime).format('YYYY/MM/DD HH:mm')}</span>
                </div>
                <div className="rn-content">
                  <div style={{ marginBottom: 23 }}>
                    <div className="first">
                      <i className="zjb zjb-bixutian" style={{ color: 'red', fontSize: '22px', lineHeight: '22px', position: 'absolute', left: '24px', top: '37px' }}></i>
                      <span className="left"><span style={{ color: '#FF9900' }}>*&nbsp;</span>企业开通借款账户</span>
                      <span className="middle">开通资金托管账户，将投资人、借款人、平台三者的资金完全隔离</span>
                      {this.props.openStatus == 0 || this.props.openStatus == -1 ?  <a className="right" onClick={() => this.props.history.push(Path.OPEN_ACCOUNT)}>开通账户</a>:null}
                      {this.props.openStatus == 1 && !safeData.userSecurityCenter.fidcardBind ?  <a className="right" onClick={() => this.checkAuthStatus()}>查询认证状态</a>:null}
                    </div>
                    <div style={{ marginTop: 9, marginBottom: 5 }}>
                      <img alt="" src={require('../../../../assets/img/ucenter/u4288.png')} />
                    </div>
                    {
                      safeData.userSecurityCenter.faccountBind && safeData.userSecurityCenter.fidcardBind ?
                        <div className="personal" style={{ marginTop: 0, background: '#f9f9f9' }}>
                          <span style={{ color: 'black' }} >{safeData.fRealName}</span>
                          <span className="line" >|</span>
                          <span style={{ color: 'black' }} >{safeData.fIdcardNo}</span>
                          <span className="line" >|</span>
                          <span style={{ color: 'black' }} >乾多多账户：{safeData.fThirdAccountNo}</span>
                          <div className="findPass">
                            <span className="a" onClick={() => this.setState({ showMMMChangepayPassword: !this.state.showMMMChangepayPassword })}>找回乾多多支付密码 </span>
                            <span className="line" >|</span>
                            <span className="a" onClick={() => this.setState({ showMMMChangeLoginPass: !this.state.showMMMChangeLoginPass })}>找回乾多多登录密码 </span>
                          </div>
                        </div>
                        : null
                    }
                    { this.props.openStatus == 1 && safeData.userSecurityCenter.fidcardBind ? null :
                       <div className="personal" style={{ marginTop: 0, background: '#f9f9f9' }}>
                        {this.props.openStatus == 2 ?
                          <span>开户中，请稍后刷新页面查看结果</span> : null }
                        {this.props.openStatus == 0 ?
                          <span>开户失败，{this.props.openFailMsg}，请重新开通</span> : null }
                        {this.props.openStatus == 1 && !safeData.userSecurityCenter.fidcardBind ?
                          <span>开户成功，请前往<a style={{color: 'blue'}} onClick={()=>window.location.href=AUTH_ADDRESS}>实名认证</a>或点击查询认证状态按钮查询</span> : null }
                       </div>
                    }
                    {
                      this.state.showMMMChangepayPassword === true ?
                        <ChangePayPayPass />
                        : null
                    }
                    {
                      this.state.showMMMChangeLoginPass === true ?
                        <ChangeLoginPass />
                        : null
                    }
                  </div>

                </div>
              </div> : null}
        { safeData.userSecurityCenter.faccountBind && safeData.userSecurityCenter.fidcardBind ?
          <div className="fr uc-rbody" style={{marginTop:'30px'}}>
            <div className="rn-content">
              <div className="first">
                <i className="zjb zjb-bixutian" style={{ color: 'red', fontSize: '22px', lineHeight: '22px', position: 'absolute', left: '24px', top: '37px' }}></i>
                <span className="left"><span style={{ color: '#FF9900' }}>*&nbsp;</span>我的银行卡</span>
                <span className="middle">至少绑定一张本人开户的银行卡，最多可绑定5个银行卡</span>
                <a className="right" style={{display:'none'}}>设置</a>
              </div>

              <div className="cardBox">
                {/* 银行卡展示 */}
                {this.state.cardList.map((data, index) => {
                  return (
                    <div className="card_div" key={index}>
                      <div className="IDCard" style={{width: 279, height: 158}}>
                        <div>
                          <div className="card_info">
                            <div className="card_img">
                              {/* <img src={`${data.flogo}`}/> */}
                            </div>
                            <div className="card_text">
                              <p title={data.fbank}>{data.fbank}</p>
                              {/* <span>{data.fcardType}</span> */}
                              <span>储蓄卡</span>
                            </div>
                          </div>
                          <span className="id_num">
                            {data.fbankcard.substring(0, 4)} **** **** {data.fbankcard.substring(data.fbankcard.length - 4, data.fbankcard.length)}
                          </span>
                        </div>
                      </div>
                      {!this.state[data.fid] ?
                        <a className="unbind_card" onClick={() => this.setState({ [data.fid]: true })}>解除绑定</a> :
                        <div className="unbind_block">
                          <span className="unbind_span">解绑银行卡</span>
                          <span className="unbind_span">请输入登录密码</span>
                          <Input
                            type={this.state[`${data.fid}hide`] ? 'text' : 'password'}
                            className="unbind_password"
                            placeholder="请输入登录密码"
                            value={this.state[`${data.fid}password`]}
                            onChange={(e) => this.setState({ [`${data.fid}password`]: e.target.value })}
                            prefix={<Icon type="lock" />}
                            suffix={ <i className={this.state[`${data.fid}hide`]?'zjb zjb-mimakejian': 'zjb zjb-htmal5icon08'} onClick={() => this.setState({ [`${data.fid}hide`]: !this.state[`${data.fid}hide`] })} />}
                          />
                          <Button
                            type="primary"
                            className="unbind-btn"
                            onClick={() => this.unbindBankCardAjax(data.fbankcard, data.fid)}
                            loading={this.state.unbindLoading}
                          >解绑</Button>
                        </div>
                      }
                    </div>
                  );
                })}
                {/* 绑定银行卡 */}
                {this.props.accountId ?
                  (this.state.cardList.length < 5) ? 
                  <div className="unbind_div" onClick={() => this.props.history.push(Path.BINDCARD)} >
                    <i className="zjb zjb-add icon-plus"></i>
                    <span className="bind_new_bank" >绑定新银行卡</span>
                    <span
                      className="bind_new_bank"
                      style={{ color: '#e6e6e6', fontSize: 14 }}
                    >(只支持储蓄卡)</span>
                  </div> :null: <div><span>只有先开通乾多多账户才能绑定银行卡！</span></div>}
              </div>
            </div>
          </div> : null}
    
        { safeData.userSecurityCenter.faccountBind && safeData.userSecurityCenter.fidcardBind ?
          <div className="fr uc-rbody" style={{ marginTop: '30px'}}>

            <div className="rn-content">
              <div className="first">
                <i className="zjb zjb-bixutian" style={{ color: 'red', fontSize: '22px', lineHeight: '22px', position: 'absolute', left: '24px', top: '37px' }}></i>
                <span className="left"><span style={{ color: '#FF9900' }}>*&nbsp;</span>账户授权</span>
              </div>
            </div>
             <div style={{margin:'35px 0px 20px 10px'}}>
             <Spin  spinning={this.state.grantLoading}>
              {
                dataArr.map((data,index)=>{
                  return(
                    
                      <div key={index} style={{width:120,height:120,display:'inline-block',border:'1px dashed #ccc',margin:'15px'}}>
                        <p style={{textAlign:'center',marginTop:38}}>{data.title}</p>
                        <p style={{textAlign:'center',color:'red',cursor:'pointer'}} onClick={()=>this.show(data.key)}>授权</p>
                      </div>
                  
                  )
                })
              } 
              </Spin >
             </div>
            <div className="safeCenter">
              <div className="line">
                <div className="block1">
                  <i className={`zjb ${status.indexOf('3') !== -1?'zjb-duihao':'zjb-jinggao1'}`} style={{ color: `${status.indexOf('3') !== -1?'#4cc261':'#FFCB15'}`, fontSize: 27, marginRight: 10, verticalAlign: 'middle', lineHeight: '20px', position: 'relative', top: -2 }}></i>
                  <span className="word" style={{ lineHeight: '20px' }}>二次分配授权</span>
                  <i className="zjb zjb-renzheng " style={{ fontSize: 27, color: '#ffcb15', marginRight: 5, verticalAlign: 'middle', lineHeight: '20px', position: 'relative', top: -3, left: 1 }}></i>
                </div>
                <div className="block2">{status.indexOf('3') !== -1 ? '您已授权二次分配' : '您还未授权二次分配，建议您尽快授权'}</div>
                <div className="block3">{status.indexOf('3') !== -1 ? null : <Button onClick={() => this.getDistribution(3)} >立即授权</Button>}</div>
              </div>

              <div className="line">
                <div className="block1">
                <i className={`zjb ${status.indexOf('2') !== -1?'zjb-duihao':'zjb-jinggao1'}`} style={{ color: `${status.indexOf('3') !== -1?'#4cc261':'#FFCB15'}`, fontSize: 27, marginRight: 10, verticalAlign: 'middle', lineHeight: '20px', position: 'relative', top: -2 }}></i>
                  <span className="word" style={{ lineHeight: '20px' }}>自动还款授权</span>
                  <i className="zjb zjb-renzheng " style={{ fontSize: 27, color: '#ffcb15', marginRight: 5, verticalAlign: 'middle', lineHeight: '20px', position: 'relative', top: -3, left: 1 }}></i>
                </div>
                <div className="block2">{status.indexOf('2') !== -1 ? '您已授权自动还款' : '您还未授权自动还款，建议您尽快授权'}</div>
                <div className="block3">{status.indexOf('2') !== -1 ? null : <Button onClick={() => this.getDistribution(2)} >立即授权</Button>}</div>
              </div>
            </div>

          </div>:null
        }
          <div className="fr uc-rbody" style={{ marginTop: '30px', padding: 0 }}>
            {/* <div className="baseInfo">
              <i className="zjb zjb-moban"></i>
              <h3 onClick={() => { this.props.history.push(Path.USER_BASIC) }}>基础资料</h3>
              <p>完善个人资料，增强账户安全等级</p>
              <p><span>****</span>*</p>
            </div> */}

            <div className="baseInfo" style={{display:'inline-block'}}>
              <i className="zjb zjb-mima1"></i>
              <h3 onClick={() => { this.props.history.push(Path.CHANGE_LPWD) }}>修改登录密码</h3>
              <p>定期更改登录密码让你的账户更安全</p>
              <span>2018/6/15</span>
            </div>
            <div className="baseInfo" style={{display:'inline-block'}}>
              <i className="zjb zjb-youxiang"></i>
              <h3 onClick={() => { this.props.history.push(Path.CHANGE_BINDEMAIL) }}>变更绑定邮箱</h3>
              <p>绑定电子邮箱后便于接收平台各种通知</p>
              {
                safeData.userSecurityCenter.femailBind ?
                  <p><span>{safeData.fEmail}</span></p> :
                  <p><span>还未绑定邮箱，</span><a onClick={() => { this.props.history.push(Path.BIND_EMAIL) }}>点击绑定</a></p>
              }
            </div>
          </div>
        </div>
        {distribution ?
          <form ref={ref => this.formId = ref} action={url.submitUrl} method="post" style={{ display: 'none' }} target="_blank">
            <input id="MoneymoremoreId" name="MoneymoremoreId" value={distribution.moneymoremoreId ? distribution.moneymoremoreId : ''} />
            <input id="PlatformMoneymoremore" name="PlatformMoneymoremore" value={distribution.platformMoneymoremore ? distribution.platformMoneymoremore : ''} />
            <input id="AuthorizeTypeOpen" name="AuthorizeTypeOpen" value={distribution.authorizeTypeOpen ? distribution.authorizeTypeOpen : ''} />
            <input id="AuthorizeTypeClose" name="AuthorizeTypeClose" value={distribution.authorizeTypeClose ? distribution.authorizeTypeClose : ''} />
            <input id="RandomTimeStamp" name="RandomTimeStamp" value={distribution.randomTimeStamp ? distribution.randomTimeStamp : ''} />
            <input id="Remark1" name="Remark1" value={distribution.remark1 ? distribution.remark1 : ''} />
            <input id="Remark2" name="Remark2" value={distribution.remark2 ? distribution.remark2 : ''} />
            <input id="Remark3" name="Remark3" value={distribution.remark3 ? distribution.remark3 : ''} />
            <input id="ReturnURL" name="ReturnURL" value={distribution.returnURL ? distribution.returnURL : ''} />
            <input id="NotifyURL" name="NotifyURL" value={distribution.notifyURL ? distribution.notifyURL : ''} />
            <input id="SignInfo" name="SignInfo" value={distribution.signInfo ? distribution.signInfo : ''} />
          </form> : null}


          <ModalData  visable={this.state.showModal} operateModal={()=>this.setState({showModal: !this.state.showModal})} url={this.state.urlObj?this.state.urlObj[`${this.state.authUrl}`]:''} id={this.state.id}/>
      </div>


    );
  }
}

class ChangeLoginPass extends React.Component {
  render() {
    return (
      <div className="imgBox">
        <div className="step">
          <div className="step_id">1</div>
          <div className="step_box">
            <p className="text">打开乾多多官网</p>
            <Button className="goWeb" type="primary" onClick={() => window.open(AUTH_ADDRESS)}>前往</Button>
          </div>
        </div>
        <div className="step">
          <div className="step_id">2</div>
          <div className="step_box">
            <p className="login">在登录窗口</p>
            <img alt="" src={require('../../../../assets/img/ucenter/u4353.png')} style={{ width: 153, height: 95, marginLeft: '13px' }} />
            <p className="login">点击“忘记登录密码”</p>
          </div>
        </div>
        <div className="step">
          <div className="step_id">3</div>
          <div className="step_box">
            <p className="user">账户名可输入手机号码，你的真实姓名、乾多多数字账户</p>
            <img alt="" src={require('../../../../assets/img/ucenter/u4371.png')} style={{ width: 158, height: 67, marginLeft: '13px' }} />
          </div>
        </div>
        <div className="step">
          <div className="step_id">4</div>
          <div className="step_box">
            <p className="account">"点击 "立即找回""</p>
            <p className="account">通过手机验证+身份验证</p>
            <p className="account">重新设置登录密码</p>
            <img alt="" src={require('../../../../assets/img/u3551.png')} style={{ width: 30, height: 25, marginLeft: '70px' }} />
          </div>
        </div>
      </div>
    );
  }
}
class ChangePayPayPass extends React.Component {
  render() {
    return (
      <div className="imgBox">
        <div className="step">
          <div className="step_id">1</div>
          <div className="step_box">
            <p className="text">打开乾多多官网</p>
            <Button className="goWeb" type="primary" onClick={() => window.open(AUTH_ADDRESS)}>前往</Button>
          </div>
        </div>
        <div className="step">
          <div className="step_id">2</div>
          <div className="step_box">
            <p className="login">登录进入乾多多网站</p>
            <img alt="" src={require('../../../../assets/img/ucenter/u4322.png')} style={{ width: 130, height: 126, marginLeft: '23px' }} />
          </div>
        </div>
        <div className="step">
          <div className="step_id">3</div>
          <div className="step_box">
            <p className="account">&quot;我的账户&quot;</p>
            <img alt="" src={require('../../../../assets/img/ucenter/u4329.png')} style={{ width: 158, height: 67, marginLeft: '13px' }} />
            <p className="login">点击 &quot;找回支付密码&quot;</p>
          </div>
        </div>
        <div className="step">
          <div className="step_id">4</div>
          <div className="step_box">
            <p className="account">&quot;点击 &quot;立即找回&quot;&quot;</p>
            <p className="account">通过手机验证+身份验证</p>
            <p className="account">重新设置支付密码</p>
            <img alt="" src={require('../../../../assets/img/u3551.png')} style={{ width: 30, height: 25, marginLeft: '70px' }} />
          </div>
        </div>
      </div>
    );
  }
}