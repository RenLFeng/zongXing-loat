import React from 'react';
import { Icon, Form, Modal, Input, message, Row, Col, Button, Card, Steps } from 'antd';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';

import '../../assets/ucenter/realName.scss';
import { AUTH_CODE_TIME, AUTH_CODE_TIME_, ID_CORD, VER_PHONE, AUTH_PAGE_URL, AUTH_ADDRESS } from '../../common/systemParam';
import { getEmailAuth, getOldPhoneCode, getOldCode, changePhoneNum, getNewCode, distribution, authorizationState, closeAuthorization, phoneExist, getBankCardList, unbindBankCard } from '../../services/api';
import { AUTHENTICATION, OPENQACCOUNT, BINDCARD ,USER_BASIC, CHANGE_LPWD, CHANGE_BINDEMAIL, BIND_EMAIL } from '../../common/pagePath';
import LeftMenu from '../../components/UCenterComponent/leftMenu';

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

}))
export default class RealName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameAuth: false, // 实名认证
      phoneAuth: false, // 手机认证
      emailAuth: false, // 邮箱认证
      loading: false, // 标记是否为加载状态
      showAuthCode: true,
      regPhone: '', // 注册手机号
      token_: '',
      countDown: AUTH_CODE_TIME_,  // 获取验证码倒计时

      countDown_: AUTH_CODE_TIME_,
      showAuthCode_: true, // 显示获取验证码的接口
      changePhoneAuth: false,   // 更新手机号码表单
      fmobile: '',  // 更新后的手机号码
      authcode: '', // 新验证码

      getCodeMobile: '',
      regPhoneErr: '',  // 注册手机号提示
      regAuthErr: '', // 验证码提示

      distribution: {},  // 授权表单数据
      url: '',     // 提交表单乾多多链接
      status: '',  // 投标状态
      showAuth: false, // 判断开户展示授权

      showMMMChangepayPassword: false, // 判断修改支付密码
      showMMMChangeLoginPass: false, // 判断修改登录密码
      num: 1,
      safeData: null,
      cardList: []
    };
    this.countDownFun = null;
    this.countDownFun_ = null;
  }

  getCodeNum(val) {
    this.setState({ getCodeMobile: val });
  }

  componentDidMount() {
    this.initFetchSafeData();
    // 第三方开户成功再去获取用户银行卡信息
    if (this.props.safeData.userSecurityCenter.fThirdAccount) {
      this.getBankCardListAjax(); // 获取用户绑定银行卡
    }
    if (this.countDownFun) {
      clearInterval(this.countDownFun);
    }
    if (this.countDownFun_) {
      clearInterval(this.countDownFun_);
    }
    //获取已经授权的授权代码
    this.getAuthorizationState();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.safeData.userSecurityCenter.fThirdAccount !== nextProps.safeData.userSecurityCenter.fThirdAccount) {
      this.getBankCardListAjax(); // 获取用户绑定银行卡
    }
    if (this.props.accountId !== nextProps.accountId) {
      this.getBankCardListAjax(nextProps.accountId); // 获取用户绑定银行卡
    }
  }

  // 获取用户绑定银行卡
  getBankCardListAjax = async (param) => {
    const response = await getBankCardList(param?param:this.props.accountId);
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

  // 初始化安全中心首页数据
  initFetchSafeData = () => {
    this.props.dispatch({
      type: 'safeCenter/getSafe',
    });
  };

  handleCancel = () => {
    this.setState({
      nameAuth: false,
      phoneAuth: false,
      emailAuth: false,
      countDown_: AUTH_CODE_TIME_,
      showAuthCode: true,
    });
    this.nameForm.resetFields();
    this.phoneForm.resetFields();
    this.emailForm.resetFields();
    if (this.countDownFun) {
      clearInterval(this.countDownFun);
    }
  };

  // 提交新表单
  handleCancel_ = () => {
    this.setState({
      changePhoneAuth: false,
    });
    this.changePhoneAuthForm.resetFields();
    if (this.countDownFun_) {
      clearInterval(this.countDownFun_);
    }
  }

  // 提交 实名认证
  changeNameAuth = () => {
    const form = this.nameForm;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      form.resetFields();
      this.handleCancel();
    });
  };

  // 提交 手机号绑定
  changePhoneAuth = () => {
    const form = this.phoneForm;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const response = await getOldCode(values.captcha);
      if (response.code === 0) {
        this.setState({ changePhoneAuth: true });
        form.resetFields();
        this.handleCancel();
      } else {
        message.error(response.msg);
      }
    });
  };

  //获取旧手机号验证码
  async getOldCode(data) {
    const { regPhone } = this.state;
    this.setState({ loading: true });
    const sendTime = localStorage.getItem(regPhone);
    if (sendTime && new Date().getTime() - sendTime * 1 < AUTH_CODE_TIME_ * 1000) {
      alert(`${AUTH_CODE_TIME_}秒内仅能获取一次验证码，请稍后重试`);
      return;
    }
    try {
      const response = await getOldPhoneCode(data);
      this.setState({ loading: false });
      if (response.code === 0) {

        localStorage.setItem(regPhone, new Date().getTime());
        //发送请求 按钮变不可点状态
        this.setState({ showAuthCode: false });
        //成功之后倒计时开始启动
        this.countDownFun = setInterval(() => {
          if (this.state.countDown === 0) {
            clearInterval(this.countDownFun);
            this.setState({ countDown: AUTH_CODE_TIME_, showAuthCode: true });
          } else {
            this.setState({ countDown: this.state.countDown - 1 });
          }
        }, 1000);
      } else {
        message.error(response.msg);
      }
    } catch (e) {
      this.setState({ loading: false });
      if (typeof e === 'object' && e.name === 288) {
        throw e;
      }
      message.error('服务器繁忙，请稍后重试');
    }
  }

  //提交修改后的手机
  changePhoneAuth_ = () => {
    const form = this.changePhoneAuthForm;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const data = {
        fmobile: values.title,
        authcode: values.captcha,
      };
      const response = await changePhoneNum(data);
      if (response.code === 0) {
        this.initFetchSafeData();
        this.setState({ changePhoneAuth: false });
        form.resetFields();
        this.handleCancel_();
      } else {
        message.error(response.msg);
      }
    });
  };

  //获取新手机号验证码
  async getNewCode_() {
    const { getCodeMobile } = this.state;
    if (getCodeMobile.trim().length === 0) {
      message.error('手机号不能为空')
      return;
    }
    if (!VER_PHONE.test(getCodeMobile)) {
      this.setState({ regPhoneErr: '请输入正确的手机号' });
      return;
    }
    this.setState({ loading: true });
    const res = await phoneExist(getCodeMobile);
    if (res.code !== 0) {
      this.setState({ loading: false });
      if (res.msg === '该手机号已注册，请直接登录！') {
        message.error('手机号已注册');
        return;
      }
      message.error(res.msg);
      return;
    }
    try {
      const response = await getNewCode(getCodeMobile);
      this.setState({ loading: false });
      if (response.code === 0) {
        this.setState({ showAuthCode_: false });
        //成功之后倒计时开始启动
        this.countDownFun_ = setInterval(() => {
          if (this.state.countDown_ === 0) {
            clearInterval(this.countDownFun_);
            this.setState({ countDown_: AUTH_CODE_TIME_, showAuthCode_: true });
          } else {
            this.setState({ countDown_: this.state.countDown_ - 1 });
          }
        }, 1000);
      } else {
        message.error(response.msg);
      }
    } catch (e) {
      this.setState({ loading: false });
      if (typeof e === 'object' && e.name === 288) {
        throw e;
      }
    }
  }


  //提交 邮箱绑定
  changeEmailAuth = () => {
    const form = this.emailForm;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const response = await getEmailAuth(values.email);
      if (response.code === 0) {
        message.info('邮件发送成功');
        form.resetFields();
        this.handleCancel();
        this.setState({ emailAuth: false });
        Modal.confirm({
          title: '提示',
          content: '邮件已发送,请注意查看',
          okText: '完成',
          cancelText: '取消',
          onOk: () => {
            this.props.dispatch({
              type: 'safeCenter/getSafe'
            });

          }
        });
      } else {
        message.error(response.msg);
      }
    });
  };

  //授权
  async getDistribution(type) {
    this.setState({ loading: true });
    const response = await distribution(type, '', encodeURIComponent(window.location.href));
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

  // 查询授权状态  1:自动投标，2：自动还款，3：二次分配自动通过
  async getAuthorizationState() {
    this.setState({ loading: true });
    const response = await authorizationState('');
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

  // 关闭授权
  async CloseAuthorization(type) {
    const response = await closeAuthorization(type, '', encodeURIComponent(window.location.href));
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

  changStutas(num) {
    if (num % 2 === 0) {
      this.setState({
        changePayPass: true,
      });
    } else {
      this.setState({
        changePayPass: false,
      });
    }
  }

  // 判断步骤
  _judgeAccount(safeData) {
    let step = 0;
    if (safeData.userSecurityCenter.fCertification) {
      step = 1;
    }
    if (safeData.userSecurityCenter.fThirdAccount) {
      step = 2;
    }
    return step;
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
    const response = await unbindBankCard({
      accountId: this.props.accountId,
      bankcard: cardId,
      password: this.state[`${fid}password`].trim()
    });
    this.setState({ unbindLoading: false });
    if (response.code === 0) {
      this.getBankCardListAjax()
      // for (let i = 0, len = this.state.cardList.length; i < len; i++) {
      //   if (this.state.cardList[i].fbankcard === cardId) {
      //     this.state.cardList.splice(1, i);
      //     break;
      //   }
      // }
      // this.setState({ cardList: this.state.cardList });
    } else {
      response.msg && message.error(response.msg);
    }
  }

  render() {
    // 初始化数据
    const { safeData } = this.props;
    const { status, distribution, url } = this.state;
    return (
      <div>
        <div>
          <LeftMenu param={this.props} />
          {
            safeData.userSecurityCenter.fCertification !== undefined ?
              <div className="fr uc-rbody">
                <div className="real_title">
                  <span className="safeCenter_">安全中心</span>
                  <span className="registrationTime">注册时间:{moment(safeData.userSecurityCenter.fCreattime).format('YYYY/MM/DD HH:mm')}</span>
                </div>
                <div className="rn-content">
                  <Steps progressDot direction="vertical" current={this._judgeAccount(safeData)}>
                    <Step title="第一步"
                      description={
                        <div style={{ marginBottom: 23 }}>
                          <div className="first">
                            <i className="zjb zjb-bixutian" style={{ color: 'red', fontSize: '22px', lineHeight: '22px', position: 'absolute', left: '24px', top: '37px' }}></i>
                            <span className="left">身份认证</span>
                            <span className="middle">用于提升账户安全性，认证后不能修改</span>
                            {!safeData.userSecurityCenter.fCertification ? <a className="right" onClick={() => this.props.history.push(AUTHENTICATION)}>立即认证</a> : null}
                          </div>
                          {safeData.userSecurityCenter.fCertification ?
                            <div className="personal" style={{background:'#f9f9f9'}}>
                              <span className="name">{safeData.fRealName}&nbsp;|</span>
                              <span className="id">{safeData.fIdcardNo}</span>
                              <span className="result" >认证通过</span>
                            </div> : null}
                        </div>
                      }
                    />
                    <Step
                      title="第二步"
                      description={
                        <div style={{ marginBottom: 23 }}>
                          <div className="first">
                            <i className="zjb zjb-bixutian" style={{ color: 'red', fontSize: '22px', lineHeight: '22px', position: 'absolute', left: '24px', top: '37px' }}></i>
                            <span className="left">开通乾多多资金托管账户</span>
                            <span className="middle">开通资金托管账户，将投资人、借款人、平台三者的资金完全隔离</span>
                            {!safeData.userSecurityCenter.fThirdAccount && safeData.userSecurityCenter.fCertification ? 
                            <a className="right" onClick={() => this.props.history.push(OPENQACCOUNT)}>开通账户</a>
                             : null} 
                          </div>
                          <div style={{marginTop:9,marginBottom:5}}>
                            <img alt="" src={require('../../assets/img/ucenter/u4288.png')} />
                          </div>
                          {
                            safeData.userSecurityCenter.fThirdAccount ?
                          
                              <div className="personal" style={{ marginTop: 0,background:'#f9f9f9'}}>
                                <span style={{ color: 'black',color:'#999999' }} >你的乾多多账户:{safeData.fThirdAccountNo}</span>
                                <div className="findPass">
                                  <span className="a" onClick={() => this.setState({ showMMMChangepayPassword: !this.state.showMMMChangepayPassword })}>找回乾多多支付密码 </span>
                                  <span className="line" >|</span>
                                  <span className="a" onClick={() => this.setState({ showMMMChangeLoginPass: !this.state.showMMMChangeLoginPass})}>找回乾多多登录密码 </span>
                                </div>
                              </div>
                               : null
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
                      } />
                    <Step
                      title="第三步" description={
                        <div style={{ marginBottom: -12 }}>
                          <div className="first">
                            <i className="zjb zjb-bixutian" style={{ color: 'red', fontSize: '22px', lineHeight: '22px', position: 'absolute', left: '24px', top: '37px' }}></i>
                            <span className="left">我的银行卡</span>
                            <span className="middle">至少绑定一张本人开户的银行卡，最多可绑定5个银行卡</span>
                            <a className="right" style={{ display: 'none' }}>设置</a>
                          </div>

                          <div className="cardBox">
                            {/* 银行卡展示 */}
                              {this.state.cardList.map((data, index) => {
                                return (
                                  <div className="card_div" key={index}>
                                    <div className="IDCard">
                                      <div>
                                      <div className="card_info">
                                          <div className="card_img">
                                            {/* <img src={`${data.flogo}`}/> */}
                                          </div>
                                          <div className="card_text">
                                            <p>{data.fbank}</p>
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
                                          onChange={(e) => this.setState({ [`${data.fid}password`]: e.target.value })}
                                          prefix={<Icon type="lock" />}
                                          suffix={<Icon type="eye-o" onClick={() => this.setState({ [`${data.fid}hide`]: !this.state[`${data.fid}hide`] })} />}
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
                              <div className="unbind_div" onClick={() => this.props.history.push(BINDCARD)} >
                                <i className="zjb zjb-add icon-plus"></i>
                                <span className="bind_new_bank" >绑定新银行卡</span>
                                <span
                                  className="bind_new_bank"
                                  style={{ color: '#e6e6e6', fontSize: 14 ,color:'#e6e6e6'}}
                                >(只支持储蓄卡)</span>
                              </div> : <div><span>只有先开通乾多多账户才能绑定银行卡！</span></div>}                               
                          </div>                          
                        </div>
                      }
                    />
                  </Steps>
                </div>
              </div> : null}
              {safeData.userSecurityCenter.fThirdAccount ?
                  <div className="fr uc-rbody" style={{ marginTop: '30px', padding: '0' }}>
                    <div className="safeCenter">
                      <div className="line">
                        <div className="block1">
                         <i className="zjb zjb-duihao" style={{color:'#4cc261',fontSize:27,marginRight:10,verticalAlign:'middle',lineHeight:'20px',position:'relative',top:-2}}></i> 
                          <span className="word" style={{lineHeight:'20px'}}>二次分配授权</span>
                          <i className="zjb zjb-renzheng " style={{fontSize:27,color:'#ffcb15',marginRight:5,verticalAlign:'middle',lineHeight:'20px',position:'relative',top:-3,left:1}}></i> 
                        </div>
                        <div className="block2">{status.indexOf('3') !== -1 ? '您已授权二次分配' : '您还未授权二次分配，建议您尽快授权'}</div>
                        <div className="block3">{status.indexOf('3') !== -1 ? null : <Button onClick={() => this.getDistribution(3)} >立即启用</Button>}</div>
                      </div>
                    </div>
                  </div> : null}
          <div className="fr uc-rbody" style={{
            marginTop: '30px', padding: 0, display: 'flex',
            justifyContent: 'space-between'
          }}>
            <div className="baseInfo">
              <i className="zjb zjb-moban"></i>
              <h3 onClick={()=>{this.props.history.push(USER_BASIC)}}>基础资料</h3>
              <p>完善个人资料，增强账户安全等级</p>
              <p><span>****</span>*</p>
            </div>

            <div className="baseInfo">
            <i className="zjb zjb-mima1"></i>
              <h3 onClick={()=>{this.props.history.push(CHANGE_LPWD)}}>修改登陆密码</h3>
              <p>定期更改登录密码让你的账户更安全</p>
              <span>2018/6/15</span>
            </div>
            <div className="baseInfo">
              <i className="zjb zjb-youxiang"></i>
              <h3 onClick={()=>{this.props.history.push(CHANGE_BINDEMAIL)}}>变更绑定邮箱</h3>
              <p>绑定电子邮箱后便于接收平台各种通知</p>
              {
                safeData.userSecurityCenter.fEmailBinding ? 
                <p><span>{safeData.fEmail}</span></p>:
              <p><span>还未绑定邮箱，</span><a onClick={()=>{this.props.history.push(BIND_EMAIL)}}>点击绑定</a></p>
              }
            </div>
          </div>
        </div>
        {distribution ?
          <form ref={ref => this.formId = ref} action={url.submitUrl} method="post" target="_blank" style={{ display: 'none' }}>
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
      </div>

    );
  }
}

const FormItem = Form.Item;
// 实名认证
const NameAuth = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="实名认证"
        okText="提交"
        cancelText="取消"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="姓名">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '姓名不能为空' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="身份证号">
            {getFieldDecorator('description', {
              rules: [{ required: true, message: '身份证不能为空' },
              { pattern: ID_CORD, message: '身份证号格式不正确' }],
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

// 手机绑定
const PhoneAuth = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form, token_ } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="手机绑定"
        okText="提交"
        cancelText="取消"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem
            {...formItemLayout}
            label="验证码"
          >
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator('captcha', {
                  rules: [{ required: true, message: '验证码不能为空' }],
                })(
                  <Input />
                )}
              </Col>
              <Col span={6}>
                {
                  props.showAuthCode ? <Button onClick={() => props.getOldCode()}>获取验证码</Button> :
                    <Button loading={props.loading}>
                      {props.countDown}s获取验证码
                    </Button>
                }
              </Col>
              <Col span={5} push={2}>
                {
                  props.showAuthCode ? null :
                    <span style={{ lineHeight: '30px' }}>已发送</span>
                }
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

const ChangePhoneAuth = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="更换手机号码"
        okText="提交"
        cancelText="取消"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem {...formItemLayout} label="新手机号">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '手机号不能为空' },
              { pattern: VER_PHONE, message: '手机号格式不正确' }],
            })(<Input onChange={(e) => props.getCodeNum(e.target.value)} />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="验证码"
          >
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator('captcha', {
                  rules: [{ required: true, message: '验证码不能为空' }],
                })(
                  <Input />
                )}
              </Col>
              <Col span={6}>
                {
                  props.showAuthCode_ ? <Button onClick={() => props.getNewCode(props.getCodeMobile)}>获取验证码</Button> :
                    <Button loading={props.loading}>
                      {props.countDown_}s获取验证码
                    </Button>
                }
              </Col>
              <Col span={6} push={2}>
                {
                  props.showAuthCode_ ? null :
                    <span style={{ lineHeight: '30px' }}>已发送</span>
                }
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Modal>
    );
  }
)

// 邮箱绑定
const EmailAuth = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="邮箱绑定"
        okText="发送"
        cancelText="取消"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form>
          <FormItem label="邮箱">
            {getFieldDecorator('email', {
              rules: [{ type: 'email', message: '邮箱格式不正确', },
              { required: true, message: '邮箱不能为空' }],
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

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
            <img alt="" src={require('../../assets/img/ucenter/u4353.png')} style={{ width: 153, height: 95, marginLeft: '13px' }} />
            <p className="login">点击“忘记登录密码”</p>
          </div>
        </div>
        <div className="step">
          <div className="step_id">3</div>
          <div className="step_box">
            <p className="user">账户名可输入手机号码，你的真实姓名、乾多多数字账户</p>
            <img alt="" src={require('../../assets/img/ucenter/u4371.png')} style={{ width: 158, height: 67, marginLeft: '13px' }} />
          </div>
        </div>
        <div className="step">
          <div className="step_id">4</div>
          <div className="step_box">
            <p className="account">"点击 "立即找回""</p>
            <p className="account">通过手机验证+身份验证</p>
            <p className="account">重新设置登录密码</p>
            <img alt="" src={require('../../assets/img/u3551.png')} style={{ width: 30, height: 25, marginLeft: '70px' }} />
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
            <img alt="" src={require('../../assets/img/ucenter/u4322.png')} style={{ width: 130, height: 126, marginLeft: '23px' }} />
          </div>
        </div>
        <div className="step">
          <div className="step_id">3</div>
          <div className="step_box">
            <p className="account">&quot;我的账户&quot;</p>
            <img alt="" src={require('../../assets/img/ucenter/u4329.png')} style={{ width: 158, height: 67, marginLeft: '13px' }} />
            <p className="login">点击 &quot;找回支付密码&quot;</p>
          </div>
        </div>
        <div className="step">
          <div className="step_id">4</div>
          <div className="step_box">
            <p className="account">&quot;点击 &quot;立即找回&quot;&quot;</p>
            <p className="account">通过手机验证+身份验证</p>
            <p className="account">重新设置支付密码</p>
            <img alt="" src={require('../../assets/img/u3551.png')} style={{ width: 30, height: 25, marginLeft: '70px' }} />
          </div>
        </div>
      </div>
    );
  }
}

