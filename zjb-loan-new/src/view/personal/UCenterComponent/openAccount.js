import React from 'react';
import { Link } from 'dva/router';

import { Form, Input, Button, Select, Modal, message, Row, Col, Icon,Tooltip, Cascader } from 'antd';
import { connect } from 'dva';

import '../../assets/ucenter/modelCenter.scss';
import { VER_PHONE, ID_CORD, AUTH_ADDRESS, TURN_BACK } from '../../common/systemParam';
import Path from '../../common/pagePath';
import { city } from '../../common/cityData';

import {getPersonAccount, commitOpenAccount, getNoAccountCompany, getUserBaseData} from '../../services/api';
import { relative } from 'path';
import LeftMenu from '../../components/UCenterComponent/leftMenu';

const FormItem = Form.Item;
const TIME_OUT = 10;
export default class OpenAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      realName: '',
      idcard: '',
    };
  }

  componentDidMount() {
    this.getUserPhone();
  }

  // 获取用户手机号
  async getUserPhone() {
    const response = await getUserBaseData();
    console.log(response);
    if (response.code === 0) {
      if (response.data) {
        this.setState({
          phone: response.data.fmobile,
          realName: response.data.freal_name,
          idcard: response.data.fidcard_No,
        });
      }
    }
  }
  render() {
    console.log("match:",this.props.match);
    const { match, history, parentHandSubmit } = this.props;
    const type = match.params.type;

    return (
      <div>
        {/* <LeftMenu param={this.props}/> */}
        <div className="fr uc-rbody" >
          <FormOpenComponent
            type={type}
            history={history}
            phone={this.state.phone}
            realName={this.state.realName}
            idcard={this.state.idcard}
            parentHandSubmit={parentHandSubmit}
          />
        </div>
      </div>
    );
  }
}


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
const btnLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
class FormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openType: '0',
      visible: false,
      countDownTime: TIME_OUT,
      companyNumber: '',
      loading: false,
      regCompany: [],
      companyName: '',
      license: '',
      submitParam: {
        reqParam: {

        }
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.countDown = null;
    this.confirmRequest = null;
  }

  componentDidMount() {
    this.getCompany();
  }

  async getCompany() {
    try {
      const response = await getNoAccountCompany();
      console.log(response);
      if (response.code === 0) {
        this.setState({regCompany: response.data});
      }
    } catch(e) {
      if (typeof e === 'object' && e.name === 288) {
        throw e;
      }
      message.error('服务器繁忙，请稍后重试');
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll( async (err, values) => {
      console.log(err);
      if (!err) {
        // 提交表单接口
        if (this.state.loading) {
          return;
        }
        values.accountType = '0';
        values.notifyPageUrl = `${TURN_BACK}/#/index/uCenter/bindCard`
        this.setState({loading: true});
        try {
          const response = await commitOpenAccount(values);
          this.setState({loading: false});
          if (response.code === 0) {
            message.info(response.msg);
            this.setState({
              submitParam: response.data
            }, ()=>{
              this.formId.submit();
              setTimeout(()=>{
                this.props.parentHandSubmit(response.data);
              },100)
            })
            // 提交表单接口回调成功使用
            // this.commitSuccess();
            // if (values.accountType === '0') {
            //   this.props.history.push(Path.PERSONAL_ACCOUNT);
            // } else if (values.accountType === '1') {
            //   this.props.history.push(Path.COMPANY_ACCOUNT);
            //   Modal.confirm({
            //     title: '提示',
            //     content: '企业账户已开通，请完成实名认证',
            //     okText: '前往',
            //     cancelText: '取消',
            //     onOk: () => {
            //       window.open(AUTH_ADDRESS);
            //     }
            //   });
            // }
          } else {
            message.error(response.msg);
          }
        } catch (e) {
          this.setState({loading: false});
          if (typeof e === 'object' && e.name === 288) {
            throw e;
          }
          console.log(e);
          message.error('服务器繁忙，请稍后重试');
        }
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.countDown);
  }

  commitSuccess = () => {
    // 打开等待弹出层
    this.setState({visible: true});
    //开启2s一次请求
    this.confirmRequest = setInterval(() => {
      // 查个人账户是否创建成功
      if (this.state.openType === '0') {
        this.checkPersonalAccount();
      }
      // 查企业账户是否创建成功
      if (this.state.openType === '1') {
        this.checkCompanyAccount();
      }
    }, 2000);
    this.countDown = setInterval(() => {
      this.setState({
        countDownTime: this.state.countDownTime - 1
      }, () => {
        if (this.state.countDownTime === 0) {
          this.setState({
            countDownTime: TIME_OUT,
            visible: false
          });
          message.warning('请求超时,请稍后重试');
          clearInterval(this.countDown);
          clearInterval(this.confirmRequest);
        }
      });
    }, 1000);
  };

  // 检查个人账户是否已开户
  checkPersonalAccount = async () => {
    const response = await getPersonAccount(0); // 0: 个人账户 1: 企业账户
    if (response.code === 0 ) {

      clearInterval(this.countDown); // 清除倒计时
      clearInterval(this.confirmRequest); // 清除连续请求
      this.setState({   // 重置倒计时
        countDownTime: TIME_OUT,
        visible: false
      });
      message.info('开户成功');
    }
  };

  checkCompanyAccount = async () => {
    const response = await getPersonAccount(1); // 0: 个人账户 1: 企业账户
    /*
     *  判断企业是否已开户的状态 因为企业账户可能有多个，所以利用
     *  返回的企业数组使用 企业营业执照号 companyNumber 来判断 这个企业是否已经注册过了
     * **/
    if (response.code === 0 && response.accountInfos.length > 0) {
      for (let company of response.accountInfos) {
        if (company.companyNumber === this.state.companyNumber) {
          clearInterval(this.countDown); // 清除倒计时
          clearInterval(this.confirmRequest); // 清除连续请求
          this.setState({   // 重置倒计时
            countDownTime: TIME_OUT,
            visible: false
          });
          message.info('开户成功');
        }
      }
    }
  };

  handleCancel = () => {
    clearInterval(this.countDown);
    this.setState({
      visible: false
    });
  };

  changeCompany(val) {
    for (let data of this.state.regCompany) {
      if (val === data.fid) {
        this.setState({
          companyName: data.fname,
          license: data.fsocialCreditCode,
        });
        return;
      }
    }
  }

  changeType(val) {
    this.setState({
      openType: val,
      companyName: '',
      license: '',
    });
    this.props.form.resetFields();

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { parentHandSubmit } = this.props;
    const { submitParam } = this.state;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <Row style={{ postion: 'relative' }}>
          <FormItem
            {...formItemLayout}
            label="手机"
          >
            {getFieldDecorator('mobile', {
              initialValue: this.props.phone,
              rules: [{ pattern: VER_PHONE, message: '手机格式不正确' },
                { required: true, message: '请填写手机' }],
            })(<Input maxLength={'20'} autoComplete="off" readOnly />)}
          </FormItem>
          <Tooltip title="如需修改请去安全中心更换手机号" style={{position: 'absolute', top: 10, right: 250 }}>
            <Icon type="question-circle-o" style={{ position: 'absolute', top: 10, right: 250 }} />
          </Tooltip>
        </Row>
            <Row>
              <FormItem
                {...formItemLayout}
                label="身份证号"
              >
                {getFieldDecorator('identificationNo', {
                  initialValue: this.props.idcard,
                  rules: [
                    { pattern: ID_CORD, message: '身份证格式不正确' },
                    { required: true, message: '请填写身份证号' },
                  ],
                })(<Input maxLength={'20'} readOnly autoComplete="off" />)}
              </FormItem>
              <Tooltip title="该信息无法修改" style={{ position: 'absolute', top: 10, right: 250 }}>
                <Icon type="question-circle-o" style={{ position: 'absolute', top: 10, right: 250 }} />
              </Tooltip>
            </Row>
            <Row>
              <FormItem
                {...formItemLayout}
                label="真实姓名"
              >
                {getFieldDecorator('realName', {
                  initialValue: this.props.realName,
                  rules: [
                  { required: true, message: '请填写真实姓名' },
                  ],
                })(<Input maxLength={'20'} readOnly autoComplete="off" />)}
              </FormItem>
              <Tooltip title="该信息无法修改" style={{ position: 'absolute', top: 10, right: 250 }}>
                <Icon type="question-circle-o" style={{ position: 'absolute', top: 10, right: 250 }} />
              </Tooltip>
            </Row>
        <FormItem {...btnLayout}>
          <Button type="primary" htmlType="submit" loading={this.state.loading} style={{ width: '200px' }}>开通</Button>
        </FormItem>
        
      </Form>
        <form ref={ref => { this.formId = ref}} action={submitParam.submitUrl} method="post" style={{ display: 'none' }}>
          <input id="AccountType" name="AccountType" value={0} />
          <input id="Email" name="Email" value={submitParam.reqParam.Email} />
          <input id="IdentificationNo" name="IdentificationNo" value={submitParam.reqParam.IdentificationNo} />
          <input id="LoanPlatformAccount" name="LoanPlatformAccount" value={submitParam.reqParam.LoanPlatformAccount} />
          <input id="Mobile" name="Mobile" value={submitParam.reqParam.Mobile} />
          <input id="NotifyURL" name="NotifyURL" value={submitParam.reqParam.NotifyURL} />
          <input id="PlatformMoneymoremore" name="PlatformMoneymoremore" value={submitParam.reqParam.PlatformMoneymoremore} />
          <input id="RandomTimeStamp" name="RandomTimeStamp" value={submitParam.reqParam.RandomTimeStamp} />
          <input id="RealName" name="RealName" value={submitParam.reqParam.RealName} />
          <input id="RegisterType" name="RegisterType" value={submitParam.reqParam.RegisterType} />
          <input id="Remark1" name="Remark1" value={submitParam.reqParam.Remark1} />
          <input id="Remark2" name="Remark2" value={submitParam.reqParam.Remark2} />
          <input id="Remark3" name="Remark3" value={submitParam.reqParam.Remark3} />
          <input id="ReturnURL" name="ReturnURL" value={submitParam.reqParam.ReturnURL} />
          <input id="SignInfo" name="SignInfo" value={submitParam.reqParam.SignInfo} />
        </form>
      </div>
    );
  }
}

const FormOpenComponent = Form.create()(FormComponent);
