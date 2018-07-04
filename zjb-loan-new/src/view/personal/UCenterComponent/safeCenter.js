import React from 'react';
import '../../assets/personal/personal.scss';
import { Icon, Form, Modal, Input, message, Row, Col, Button} from 'antd';
import { Link } from 'dva/router';
import {AUTH_CODE_TIME, AUTH_CODE_TIME_, ID_CORD, VER_PHONE, AUTH_PAGE_URL} from '../../common/systemParam';
import { connect } from 'dva';
import { getEmailAuth, getOldPhoneCode, getOldCode, changePhoneNum, getNewCode, distribution, authorizationState,closeAuthorization, phoneExist} from '../../services/api';
import Path from '../../common/pagePath';
import LeftMenu from '../../components/UCenterComponent/leftMenu';


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20},
  },
};
@connect((state)=>({
  safeData: state.safeCenter.safeData,
  safeDataLoading: state.safeCenter.safeDataLoading
}))
export default class SafeCenter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameAuth: false,
      phoneAuth: false,
      emailAuth: false,
      loading:false,
      showAuthCode: true,//显示获取验证码的接口
      regPhone: '', //注册手机号
      token_:'',
      countDown: AUTH_CODE_TIME_,  //获取验证码倒计时

      countDown_: AUTH_CODE_TIME_,
      showAuthCode_: true,//显示获取验证码的接口
      changePhoneAuth: false,   //更新手机号码表单
      fmobile:'',  //更新后的手机号码
      authcode:'', //新验证码

      getCodeMobile: '',
      regPhoneErr: '',  //注册手机号提示
      regAuthErr: '', //验证码提示

      distribution:{},  //授权表单数据
      url:'',     //提交表单乾多多链接
      status:'',  //投标状态
      showAuth: false , //判断开户展示授权

      // data:{},  //取消授权
      // closeUrl:'',
    };
    this.countDownFun = null;
    this.countDownFun_ = null;
  }

 getCodeNum(val) {
    this.setState({getCodeMobile: val});
 }

  componentDidMount() {
    this.initFetchSafeData();
    if (this.countDownFun) {
      clearInterval(this.countDownFun);
    }

    if (this.countDownFun_) {
      clearInterval(this.countDownFun_);
    }

    this.getAuthorizationState();
  }

  // 初始化安全中心首页数据
  initFetchSafeData= () => {
    this.props.dispatch({
      type: 'safeCenter/getSafe'
    })
  };

  handleCancel = () => {
    this.setState({
      nameAuth: false,
      phoneAuth: false,
      emailAuth: false,
      countDown_: AUTH_CODE_TIME_,
      showAuthCode: true
    });
    this.nameForm.resetFields();
    this.phoneForm.resetFields();
    this.emailForm.resetFields();
    if (this.countDownFun){
      clearInterval(this.countDownFun);
    }
  };

  //提交新表单
  handleCancel_ = () => {
    this.setState({
      changePhoneAuth:false
    });
    this.changePhoneAuthForm.resetFields();
    if (this.countDownFun_){
      clearInterval(this.countDownFun_);
    }
  }

  //提交 实名认证
  changeNameAuth = () => {
    const form = this.nameForm;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('实名认证数据: ', values);
      form.resetFields();
      this.handleCancel();
    });
  };

  //提交 手机号绑定
  changePhoneAuth = () => {
    const form = this.phoneForm;
    form.validateFields( async (err, values) => {
      if (err) {
        return;
      }
      const response = await getOldCode(values.captcha);
      if (response.code === 0) {
        console.log('手机号认证数据: ', values);
        this.setState({changePhoneAuth:true});
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
    this.setState({loading:true});
    const sendTime = localStorage.getItem(regPhone);
    if (sendTime && new Date().getTime() - sendTime * 1 < AUTH_CODE_TIME_ * 1000 ) {
      alert(`${AUTH_CODE_TIME_}秒内仅能获取一次验证码，请稍后重试`);
      return;
    }
    try{
      const response = await getOldPhoneCode(data);
      this.setState({loading:false});
      if(response.code ===0){
        
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
      }  else{
        message.error(response.msg);
      }
    } catch(e){
      this.setState({loading:false});
      if (typeof e === 'object' && e.name === 288) {
        throw e;
      }
      message.error('服务器繁忙，请稍后重试');
    }
  }

  //提交修改后的手机
  changePhoneAuth_ = () => {
    const form = this.changePhoneAuthForm;
    form.validateFields( async (err, values) => {
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
        this.setState({changePhoneAuth:false});
        form.resetFields();
        this.handleCancel_();
      } else {
        message.error(response.msg);
      }
    });
  };

  //获取新手机号验证码
  async getNewCode_() {
    const {getCodeMobile} = this.state;
    if(getCodeMobile.trim().length ===0){
      message.error('手机号不能为空')
      return;
    }
    if (!VER_PHONE.test(getCodeMobile)) {
      this.setState({regPhoneErr:'请输入正确的手机号'});
      return;
    }
    this.setState({loading:true});
    const res = await phoneExist(getCodeMobile);
    if (res.code !== 0) {
      this.setState({loading:false});
      if (res.msg === '该手机号已注册，请直接登录！') {
        message.error('手机号已注册');
        return;
      } 
      message.error(res.msg);
      return;
    }
    try{
      const response = await getNewCode(getCodeMobile);
      this.setState({loading:false});
      if(response.code ===0) {
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
      } else{
        message.error(response.msg);
      }
    } catch(e){
      this.setState({loading:false});
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
      console.log('邮箱认证数据: ', values);
      const response = await getEmailAuth(values.email);
      console.log(response);
      if (response.code === 0) {
        message.info('邮件发送成功');
        form.resetFields();
        this.handleCancel();
        this.setState({emailAuth:false});
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
    this.setState({loading:true});
    const response = await distribution(type,'',encodeURIComponent(window.location.href));
    this.setState({loading:false});
    if(response.code === 0){
      this.setState({
        distribution:response.data.param,
        url:response.data,
      },()=>{
        this.formId.submit();
        Modal.info({
          title: '提示',
          content: '请在新页面完成操作,可刷新页面查看结果',
          okText: '确定',
          onOk: ()=> {
            this.getAuthorizationState();
          },
        });
      });
    }else {
      response.msg && message.error(response.msg);
    }
  }


  //查询授权状态  1:自动投标，2：自动还款，3：二次分配自动通过
  async getAuthorizationState(){
    this.setState({loading:true});
    const response = await authorizationState('');
    console.log('1234', response);
    this.setState({loading:true});
    if(response.code === 0){
      this.setState({
        status:response.data?response.data: '',
      })
    } else if (response.code === -3) {
      this.setState({
        showAuth: true
      })
    } else {
      response.msg && message.error(response.msg);
    }

  }

  //关闭授权
  async CloseAuthorization(type){
    const response = await closeAuthorization(type,'', encodeURIComponent(window.location.href));
    console.log(response);
    if(response.code === 0){
      this.setState({
        distribution:response.data.param,
        url:response.data,
      },()=>{
        this.formId.submit();
        Modal.info({
          title: '提示',
          content: '请在新页面完成操作,可刷新页面查看结果',
          okText: '确定',
          onOk: ()=> {
            this.getAuthorizationState();
          },
        });
      });
    } else {
      response.msg && message.error(response.msg);
    }

  }

  render() {
    const {distribution,url,status} = this.state;
    console.log(status);
    const { safeData} = this.props;
    return (
      <div >
        <LeftMenu param={this.props}/>
        <form ref={ref => this.formId = ref} action={url.submitUrl} method="post" target="_blank" style={{display:'none'}}>
          <input id="MoneymoremoreId" name="MoneymoremoreId" value={distribution.moneymoremoreId?distribution.moneymoremoreId:''}/>
          <input id="PlatformMoneymoremore" name="PlatformMoneymoremore" value={distribution.platformMoneymoremore?distribution.platformMoneymoremore:''}/>
          <input id="AuthorizeTypeOpen" name="AuthorizeTypeOpen" value={distribution.authorizeTypeOpen?distribution.authorizeTypeOpen:''}/>
          <input id="AuthorizeTypeClose" name="AuthorizeTypeClose" value={distribution.authorizeTypeClose?distribution.authorizeTypeClose:''}/>
          <input id="RandomTimeStamp" name="RandomTimeStamp" value={distribution.randomTimeStamp?distribution.randomTimeStamp:''}/>
          <input id="Remark1" name="Remark1" value={distribution.remark1?distribution.remark1:''}/>
          <input id="Remark2" name="Remark2" value={distribution.remark2?distribution.remark2:''}/>
          <input id="Remark3" name="Remark3" value={distribution.remark3?distribution.remark3:''}/>
          <input id="ReturnURL" name="ReturnURL" value={distribution.returnURL?distribution.returnURL:''} />
          <input id="NotifyURL" name="NotifyURL" value={distribution.notifyURL?distribution.notifyURL:''}/>
          <input id="SignInfo" name="SignInfo" value={distribution.signInfo?distribution.signInfo:''}/>
        </form>

        <div className="fr uc-rbody">
          <div className="safeCenter">
            <p>安全中心</p>
            <div className="line">
              <div className="block1">
                {
                  !!safeData.userSecurityCenter.fCertification?<Icon type="check" className="i1"/>:<Icon type="warning" className="i2" />
                }

                <span className="word">实名认证</span>
                {
                  !!safeData.userSecurityCenter.fCertification?<span className="icon">V</span>:<span className="icon1">V</span>
                }
              </div>
              <div className="block2">{!!safeData.userSecurityCenter.fCertification?`您认证的实名信息：${safeData.fRealName}`:'您还未实名认证，请尽快去认证'}</div>
              <div className="block3">{!!safeData.userSecurityCenter.fCertification?'已认证':<span>认证</span>}</div>
            </div>

            <div className="line">
              <div className="block1">
                {
                  !!safeData.userSecurityCenter.fThirdAccount?<Icon type="check" className="i1"/>:<Icon type="warning" className="i2" />
                }
                <span className="word">第三方开户</span>
                {
                  !!safeData.userSecurityCenter.fThirdAccount?<span className="icon">V</span>:<span className="icon1">V</span>
                }
              </div>
              <div className="block2">{!!safeData.userSecurityCenter.fThirdAccount?'您已开通第三方开户，此信息不可更改':'您还未验证第三方开户，建议您尽快去开通'}</div>
              <div className="block3">{!!safeData.userSecurityCenter.fThirdAccount?'已开通':<Link to={Path.OPEN_ACCOUNT+'/0'}>开通</Link>}</div>
            </div>

            <div className="line">
              <div className="block1">
                {
                  !!safeData.userSecurityCenter.fMobileBinding?<Icon type="check" className="i1"/>:<Icon type="warning" className="i2" />
                }

                <span className="word">手机绑定</span>
                {
                  !!safeData.userSecurityCenter.fMobileBinding?<span className="icon">V</span>:<span className="icon1">V</span>
                }
              </div>
              <div className="block2">{!!safeData.userSecurityCenter.fMobileBinding?`您验证的手机：${safeData.fMobile}   若已丢失或停用，请立即更换`:'您还未手机绑定，为了您的账户安全，建议您尽快完成手机绑定'}</div>
              <div className="block3">{!!safeData.userSecurityCenter.fMobileBinding?<a onClick={()=>this.setState({phoneAuth: true})}>修改</a>:'认证'}</div>
            </div>

            <div className="line">
              <div className="block1">
                {
                  !!safeData.userSecurityCenter.fEmailBinding?<Icon type="check" className="i1"/>:<Icon type="warning" className="i2" />
                }
                <span className="word">邮箱绑定</span>
                {
                  !!safeData.userSecurityCenter.fEmailBinding?<span className="icon">V</span>:<span className="icon1">V</span>
                }
              </div>
              <div className="block2">{!!safeData.userSecurityCenter.fEmailBinding?`您验证的邮箱：${safeData.fEmail}`:'您还未邮箱绑定，为了您的账户安全，建议您尽快完成邮箱绑定'}</div>
              <div className="block3">{!!safeData.userSecurityCenter.fEmailBinding?<a onClick={()=>this.setState({emailAuth: true})}>修改</a>:<a onClick={()=>this.setState({emailAuth: true})}>认证</a>}</div>
            </div>

            <NameAuth
              ref={(ref)=>this.nameForm = ref}
              visible={this.state.nameAuth}
              onCancel={this.handleCancel}
              onCreate={this.changeNameAuth}
            />
            <PhoneAuth
              ref={(ref)=>this.phoneForm = ref}
              visible={this.state.phoneAuth}
              onCancel={this.handleCancel}
              onCreate={this.changePhoneAuth}
              token_={this.state.token_}
              getOldCode={()=> this.getOldCode(this.state.token_)}
              loading={this.state.loading}
              countDown={this.state.countDown}
              showAuthCode={this.state.showAuthCode}
            />
            <EmailAuth
              ref={(ref)=>this.emailForm = ref}
              visible={this.state.emailAuth}
              onCancel={this.handleCancel}
              onCreate={this.changeEmailAuth}
            />
            <ChangePhoneAuth
              ref={(ref)=>this.changePhoneAuthForm = ref}
              visible={this.state.changePhoneAuth}
              onCancel={this.handleCancel_}
              onCreate={this.changePhoneAuth_}
              getNewCode={()=> this.getNewCode_()}
              loading={this.state.loading}
              getCodeNum={(val) => this.getCodeNum(val)}
              countDown_={this.state.countDown_}
              showAuthCode_={this.state.showAuthCode_}
              getCodeMobile={this.state.getCodeMobile}
            />
          </div>
        </div>
        {!this.state.showAuth ?
          <div className="fr uc-rbody" style={{marginTop:28}} >
            <div className="safeCenter">
              <p>乾多多授权</p>
              <div className="line">
                <div className="block1">
                  {
                    status.indexOf('3') !== -1  ? <Icon type="check" className="i1"/>:<Icon type="warning" className="i2" />
                  }
                  <span className="word">二次分配授权</span>
                  {
                    status.indexOf('3') !== -1  ? <span className="icon">V</span>:<span className="icon1">V</span>
                  }
                </div>
                <div className="block2">{status.indexOf('3') !== -1 ?'您已授权二次分配':'您还未授权二次分配，建议您尽快授权'}</div>
                <div className="block3">{status.indexOf('3') !== -1 ?null:<Button onClick={()=>this.getDistribution(3)}>立即启用</Button>}</div>
              </div>

              <div className="line">
                <div className="block1">
                  {
                    status.indexOf('2') !== -1?<Icon type="check" className="i1"/>:<Icon type="warning" className="i2" />
                  }
                  <span className="word">自动还款授权</span>
                  {
                    status.indexOf('2') !== -1?<span className="icon">V</span>:<span className="icon1">V</span>
                  }
                </div>
                <div className="block2">{status.indexOf('2') !== -1?'您已授权自动还款':'您还未授权自动还款，建议您尽快授权'}</div>
                <div className="block3">{status.indexOf('2') !== -1?<Button onClick={()=>this.CloseAuthorization(2)}>取消授权</Button>:<Button onClick={()=>this.getDistribution(2)}>立即启用</Button>}</div>
              </div>

            </div>
          </div> : null
        }

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
                {pattern: ID_CORD, message: '身份证号格式不正确'}],
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
    const { visible, onCancel, onCreate, form ,token_} = props;
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
                    props.showAuthCode ? <Button onClick={()=> props.getOldCode()}>获取验证码</Button> :
                      <Button loading={props.loading}>
                        {props.countDown}s获取验证码
                    </Button>
                  }
              </Col>
              <Col span={5} push={2}>
                {
                  props.showAuthCode ? null :
                    <span style={{lineHeight: '30px'}}>已发送</span>
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
          {pattern: VER_PHONE, message: '手机号格式不正确'}],
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
                  props.showAuthCode_ ? <Button onClick={()=> props.getNewCode(props.getCodeMobile)}>获取验证码</Button> :
                    <Button loading={props.loading}>
                      {props.countDown_}s获取验证码
                    </Button>
                }
              </Col>
              <Col span={6} push={2}>
                {
                  props.showAuthCode_ ? null :
                    <span style={{lineHeight: '30px'}}>已发送</span>
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
