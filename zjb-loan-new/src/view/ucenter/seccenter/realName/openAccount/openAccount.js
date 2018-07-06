import React from 'react';
import { Link } from 'dva/router';
import { Form, Input, Button, Select, Modal, message, Row, Col, Icon,Tooltip, Cascader } from 'antd';
import { connect } from 'dva';
import { relative } from 'path';

import Path from '../../../../../common/PagePath';
import {securityCentreService} from '../../../../../services/api';
import { VER_PHONE, LICENSE, TURN_BACK } from '../../../../../common/SystemParam';
import './openaccount.scss';

const FormItem = Form.Item;
const TIME_OUT = 10;

export default class OpenAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '', //用户手机号码
      realName: '', //真实姓名
      idcard: '', //统一社会信誉代码
    };
  }

  componentDidMount() {
    //this.getCompanyRealInfo();
  }

// 获取当前用户的企业开户所需信息
  async getCompanyRealInfo() {
    const response = await securityCentreService.getCompanyRealInfo();
    console.log(response);
    if (response.code === 0) {
      if (response.data) {
        this.setState({
          phone: response.data.fmobile,
          realName: response.data.frealName,
          idcard: response.data.idcardNo,
        });
      }
    }
  }

  render() {
    console.log("match:",this.props.match);
    return (
      <div className='oa-content'>
        <div></div>
        <div className="Prompt" style={{marginTop:'50px'}}>
          <img alt="提示" src={require('../../../../../assets/img/u3530.png')} />
          <p className="p1" style={{textAlign:'center'}}>企业全称和统一社会信用代码必须与提现的银行卡开户名保持一致</p>
        </div>
        <div className='oa-form'>
          <FormOpenComponent
            phone={this.state.phone}
            realName={this.state.realName}
            idcard={this.state.idcard}
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
      loading: false,
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
  }
  componentWillUnmount() {
   
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll( async (err, values) => {
      console.log("err",err);
      if (!err) {
        // 提交表单接口
        if (this.state.loading) {
          return;
        }
        values.accountType = '1';
        values.notifyPageUrl = `${TURN_BACK}/#/index/uCenter/bindCard`
        this.setState({loading: true});
        try {
          const response = await securityCentreService.createAccount(values);
          this.setState({loading: false});
          if (response.code === 0) {
            message.info(response.msg);
            this.setState({
              submitParam: response.data
            }, ()=>{
              this.formId.submit();
            })  
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

  render() {
    
    const { getFieldDecorator } = this.props.form;
    const { submitParam } = this.state;
    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('identificationNo', {
              initialValue: this.props.idcard,
              rules: [
                { pattern: LICENSE, message: '企业统一社会信用代码格式不正确' },
                { required: true, message: '请输入企业统一社会信用代码' },
              ],
            })(<Input placeholder='请输入企业统一社会信用代码' maxLength={'20'} autoComplete="off" />)}
          </FormItem>
        </Row>
        <Row>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('realName', {
              initialValue: this.props.realName,
              rules: [
              { required: true, message: '请输入企业全称' },
              ],
            })(<Input placeholder='请输入企业全称' maxLength={'20'} autoComplete="off" />)}
          </FormItem>
        </Row>
        <Row style={{ postion: 'relative' }}>
          <FormItem
            {...formItemLayout}
          >
            {getFieldDecorator('mobile', {
              initialValue: this.props.phone,
              rules: [{ pattern: VER_PHONE, message: '手机格式不正确' },
                { required: true, message: '请填写手机' }],
            })(<Input maxLength={'20'} autoComplete="off"  />)}
          </FormItem>
        </Row>
        <FormItem {...btnLayout}>
          <Button type="primary" htmlType="submit" loading={this.state.loading} style={{ width: '200px' }}>提交开户</Button>
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