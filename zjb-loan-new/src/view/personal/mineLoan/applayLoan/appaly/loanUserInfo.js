



import Title from './title'
import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, DatePicker, TimePicker, Input, Select, Popover, InputNumber, Tooltip } from 'antd';

import styles from './loanInfo.scss';

import UploadFile from './UpLoad/UploadFile';
import UploadSingle from './UpLoad/UpLoadSingle';
import { getCityCode } from '../../../../../services/api';
import { MONEY_REG, MUN_INTEGER, ID_CORD, VER_PHONE, TEL_PHONE, BANK_CARD, E_MAIL, IMG_BASE_URL, QQ_REG, WeChat_REG } from '../../../../../common/SystemParam';
const RequireLabel = ({ children }) => (
  <div>
    <span style={{ color: 'red', display: 'inline-block', verticalAlign: 'sub', marginRight: 5 }}>{`* `}</span>
    <span style={{ display: 'inline-block', verticalAlign: 'middle' }}> {children}</span>
  </div>
);


class Loaninfo extends React.Component {
  state = {
    width: '100%',
    cityList: []
  };
  data = {
    className: "ant-upload",
    type: "images/",
    divClassName: "upload-div",
    baseUrl: IMG_BASE_URL
  };
  fileData = {
    type: "file/",
    baseUrl: IMG_BASE_URL
  };

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.num !== nextProps.num) {
      if (this.props.visible) {
        
      }
    }
  }
  // 处理组件内的数据 传递给上层组建
  getChildData = () => {
    let val = null;
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        values.fother_pic_json = typeof values.fother_pic_json !== 'string' ? JSON.stringify(values.fother_pic_json) : values.fother_pic_json;
        values.fdeal_log = typeof values.fdeal_log !== 'string' ? JSON.stringify(values.fdeal_log) : values.fdeal_log;
        values.fcredit_report = typeof values.fcredit_report !== 'string' ? JSON.stringify(values.fcredit_report) : values.fcredit_report;
        for (let i = 1; i <= 3; i++) {
          values[`tlo${i}Idcard`] = values[`fIdcardNo${i}`] ||'';
          values[`tlo${i}Name`] = values[`fName${i}`] ||'';
          values[`tlo${i}phone`] = values[`fPhone${i}`] ||'';
          values[`tlo${i}relation`] = values[`fRelation${i}`] ||'';
        }
        console.log('values', values);
        val = values;
      } else {
        val = null;
      }
    });
    return val;
  }
  componentWillUnmount() {

  }
  
  validateNumber = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (MONEY_REG.test(value) && (value * 1 < 100000 || value * 1 > 1000000)) {
      callback('金额应为10万到100万之间');
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback()
  };

  validateTime = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (MONEY_REG.test(value) && value * 1 < 3 || value * 1 > 12) {
      callback('期数应为3月到12月之间');
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback()
  };

  validateStr = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && /^[0-9]*$/.test(value)) {
      callback('不能输入纯数字');
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback()
  };

  submit() {
    const val = this.getChildData();
    if (val == null) {
        message.error('请检查数据格式');
        return;
    } else {
        this.props.changeOldData(val, 'SAVE');
    }
  }
  render() {
    const { form, dispatch, submitting, data } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { cityList } = this.state;
    const { visible, tableData } = this.props;
    const dataPath = this.props.companyNo + '/';
    return (
      <div className="seconds">
        <Title Title="借款人信息" />

        <div style={{ padding: 2, marginTop: 24 }}>
          <Form layout="vertical" hideRequiredMark className={styles.cecondFrom} onSubmit={this.submit.bind(this)}>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={<RequireLabel ><span className="names">姓名</span></RequireLabel>}>
                  {getFieldDecorator('lenderName', {
                    initialValue: data.lenderName ? data.lenderName : ''
                  })(
                    <Input placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={<RequireLabel>手机号码</RequireLabel>} style={{ paddingLeft: 6 }}>
                  {getFieldDecorator('fmobile', {
                    initialValue: data.fmobile ? data.fmobile : '',
                    rules: [{
                      pattern: VER_PHONE, message: '请填写正确的手机'
                    }]
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>

              <Col lg={8} md={12} sm={24}>
                <Form.Item label={<RequireLabel><span className="namepx">QQ号</span></RequireLabel>}>
                  {getFieldDecorator('fqq', {
                    initialValue: data.fqq ? data.fqq : '',
                    rules: [{
                      pattern: QQ_REG, message: '请填写正确的QQ号'
                    }],
                  })(
                    <Input placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>

            </Row>
            <Row gutter={16}>


              <Col lg={8} md={12} sm={24}>
                <Form.Item label={<RequireLabel>身份证号</RequireLabel>}>
                  {getFieldDecorator('fidcard_no', {
                     initialValue: data.fidcard_no ? data.fidcard_no : '',
                    rules: [{
                      pattern: ID_CORD, message: '请填写正确的身份证号码'
                    }],
                  })(
                    <Input placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={'婚姻情况'} style={{ paddingLeft: 18 }}>
                  {getFieldDecorator('fmarriage', {
                    initialValue: data.fmarriage ? data.fmarriage.toString() : '0',
                  })(
                    <Select style={{ width: 200 }}>
                      <Select.Option value="0">未婚</Select.Option>
                      <Select.Option value="1">已婚</Select.Option>
                      <Select.Option value="2">离异</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={<RequireLabel><span className="namepx">微信号</span></RequireLabel>}>
                  {getFieldDecorator('fweichat', {
                    initialValue: data.fweichat ? data.fweichat : '',
                    rules: [{
                      pattern: WeChat_REG, message: '请填写正确的微信号'
                    }],
                  })(
                    <Input placeholder="请输入" style={{ marginLeft: "-8px" }} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginLeft: 4 }}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={'银行卡号'}>
                  {getFieldDecorator('fbank_no', {
                    initialValue: data.fbank_no ? data.fbank_no : '',
                    rules: [{
                      pattern: BANK_CARD, message: '请输入正确的银行卡号'
                    }],
                  })(
                    <Input placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>

              <Col lg={8} md={12} sm={24}>
                <Form.Item label={<RequireLabel ><span className="names">学历</span></RequireLabel>}  >
                  {getFieldDecorator('feducation', {
                    initialValue: data.feducation ? data.feducation : '大专及以下',
                  })(
                    <Select style={{ width: 200 }}>
                      <Select.Option value="大专及以下">大专及以下</Select.Option>
                      <Select.Option value="本科">本科</Select.Option>
                      <Select.Option value="硕士">硕士</Select.Option>
                      <Select.Option value="博士及以上">博士及以上</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={'电子邮箱'}>
                  {getFieldDecorator('fcompany_email', {
                   initialValue: data.fcompany_email ? data.fcompany_email : '',
                    rules: [{
                      pattern: E_MAIL, message: '请输入正确的电子邮箱'
                    }]
                  })(
                    <Input placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>



            </Row>
            <Row gutter={16} style={{ marginLeft: 4 }}>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={'开户银行'}>
                  {getFieldDecorator('fbank_name', {
                    initialValue: data.fbank_name ? data.fbank_name : '',
                    rules: [],
                  })(
                    <Input placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <Form.Item label={<RequireLabel ><span className="names">座机</span></RequireLabel>}  >
                  {getFieldDecorator('ftelephone', {
                    initialValue: data.ftelephone ? data.ftelephone : '',
                    rules: [{
                      pattern: TEL_PHONE, message: '请填写正确的座机号'
                    }],
                  })(
                    <Input placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>

              <Col lg={8} md={12} sm={24}>
                <Form.Item label={<div className={styles.textBox}>家庭住址
              </div>} style={{ marginBottom: 20 }}>
                  {getFieldDecorator('faddress', {
                   initialValue: data.faddress ? data.faddress : '',
                    rules: [
                      { validator: this.validateStr }
                    ]
                  })(
                    <Input placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div>
          <Form layout="inline" style={{ borderTop: '1px dashed #e6e2e2' }}>
            <Row style={{ display: 'inline-flex', marginBottom: '-40px' }}>
              <div style={{ width: '20%', }}>
                <Form.Item layout="inline" label={
                  <RequireLabel>第一紧急联系人</RequireLabel>}>
                  {getFieldDecorator('fName1', {
                    initialValue: data.tlo1Name ? data.tlo1Name : '',
                    rules: [
                    ]
                  })(<Input style={{ width: '100%', marginLeft: 6 }} placeholder="姓名" maxLength={20}/>)}
                </Form.Item>
              </div>
              <div style={{ width: '35%', }}>
                <Form.Item layout="inline" style={{ marginTop: 41 }}>
                  {getFieldDecorator('fIdcardNo1', {
                    initialValue: data.tlo1Idcard ? data.tlo1Idcard : '',
                    rules: [{
                      pattern: ID_CORD, message: '请填写正确的身份证号码'
                    }],
                  })(<Input style={{ width: 300, marginLeft: 6 }} placeholder="身份证号" />)}
                </Form.Item>

              </div>
              <div style={{ width: '20%', }}>
                <Form.Item layout="inline" style={{ marginTop: 41 }} >
                  {getFieldDecorator('fPhone1', {
                    initialValue: data.tlo1phone ? data.tlo1phone : '',
                    rules: [
                      { pattern: VER_PHONE, message: '请输入手机号' },
                    ]
                  })(<Input style={{ width: '100%', marginLeft: 6 }} placeholder="手机号" />)}
                </Form.Item>
              </div>
              <div style={{ width: '25%', }}>
                <Form.Item layout="inline" style={{ marginTop: 41 }} >
                  {getFieldDecorator('fRelation1', {
                    initialValue: data.tlo1relation ? data.tlo1relation : '',
                  })(
                    <Select style={{ width: '200px', marginLeft: 11 }}>
                      <Select.Option value="配偶">配偶</Select.Option>
                      <Select.Option value="父亲">父亲</Select.Option>
                      <Select.Option value="母亲">母亲</Select.Option>
                      <Select.Option value="子女">子女</Select.Option>
                      <Select.Option value="其他亲属">其他亲属</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </div>
            </Row>
            {/* // --------------------------------------------------------------- */}
            <Row style={{ display: 'inline-flex', marginBottom: '-40px' }}>
              <div style={{ width: '20%', }}>
                <Form.Item layout="inline" label={
                  <div>商业伙伴</div>}>
                  {getFieldDecorator('fName2', {
                    initialValue: data.tlo2Name ? data.tlo2Name : '',
                    rules: [
                        { pattern: MONEY_REG, message: '请输入姓名' },
                    ]
                  })(<Input style={{ width: '100%', marginLeft: 6 }} placeholder="姓名" maxLength={20}/>)}
                </Form.Item>
              </div>
              <div style={{ width: '35%', }}>
                <Form.Item layout="inline" style={{ marginTop: 41 }}>
                  {getFieldDecorator('fIdcardNo2', {
                    initialValue: data.tlo2Idcard ? data.tlo2Idcard : '',
                    rules: [{
                      pattern: ID_CORD, message: '请填写正确的身份证号码'
                    }],
                  })(<Input style={{ width: 300, marginLeft: 6 }} placeholder="身份证号" />)}
                </Form.Item>

              </div>
              <div style={{ width: '20%', }}>
                <Form.Item layout="inline" style={{ marginTop: 41 }} >
                  {getFieldDecorator('fPhone2', {
                    initialValue: data.tlo2phone ? data.tlo2phone : '',
                    rules: [
                      { pattern: VER_PHONE, message: '请输入手机号' },
                    ]
                  })(<Input style={{ width: '100%', marginLeft: 6 }} placeholder="手机号" />)}
                </Form.Item>
              </div>
              <div style={{ width: '25%', }}>
                <Form.Item layout="inline" style={{ marginTop: 41 }} >
                  {getFieldDecorator('fRelation2', {
                    initialValue: data.tlo2relation ? data.tlo2relation : '',
                  })(
                    <Select style={{ width: '200px', marginLeft: 11 }}>
                      <Select.Option value="同事">同事</Select.Option>
                      <Select.Option value="上下游供应商">上下游供应商</Select.Option>
                      <Select.Option value="合伙人">合伙人</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </div>
            </Row>
            <Row style={{ display: 'inline-flex', marginBottom: '-20px' }}>
              <div style={{ width: '20%', }}>
                <Form.Item layout="inline" label={
                  <div>朋友</div>}>
                  {getFieldDecorator('fName3', {
                    initialValue: data.tlo3Name ? data.tlo3Name : '',
                    rules: [
                        { pattern: MONEY_REG, message: '请输入姓名' },
                    ]
                  })(<Input style={{ width: '100%', marginLeft: 6 }} placeholder="姓名" />)}
                </Form.Item>
              </div>
              <div style={{ width: '35%', }}>
                <Form.Item layout="inline" style={{ marginTop: 41 }}>
                  {getFieldDecorator('fIdcardNo3', {
                    initialValue: data.tlo3Idcard ? data.tlo3Idcard : '',
                    rules: [{
                      pattern: ID_CORD, message: '请填写正确的身份证号码'
                    }],
                  })(<Input style={{ width: 300, marginLeft: 6 }} placeholder="身份证号" />)}
                </Form.Item>

              </div>
              <div style={{ width: '20%', }}>
                <Form.Item layout="inline" style={{ marginTop: 41 }} >
                  {getFieldDecorator('fPhone3', {
                    initialValue: data.tlo3phone ? data.tlo3phone : '',
                    rules: [
                      { pattern: VER_PHONE, message: '请输入手机号' },
                    ]
                  })(<Input style={{ width: '100%', marginLeft: 6 }} placeholder="手机号" />)}
                </Form.Item>
              </div>
              <div style={{ width: '25%', }}>
                <Form.Item layout="inline" style={{ marginTop: 41 }} >
                  {getFieldDecorator('fRelation3', {
                    initialValue: data.tlo3relation ? data.tlo3relation : '',
                  })(
                    <Select style={{ width: '200px', marginLeft: 11 }}>
                      <Select.Option value="朋友">朋友</Select.Option>
                      <Select.Option value="其他">其他</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </div>
            </Row>
          </Form>
        </div>
        <div style={{ marginBottom: 20 }} className="IDcard">
          <Row gutter={16}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item colon={false} label='身份证正面照'>
                <div>
                  {/* <Tooltip title={<p>填写说明：<br/>身份证正面拍照清晰，头像，名字，号码、证件地址基本信息清晰明了。</p>}>
                  <Icon type="question-circle-o" className={styles.toolTip} style={{left:120,top:-27}}/></Tooltip> */}
                </div>
                {getFieldDecorator('fidcard_pic1', {
                    initialValue: data.fidcard_pic1 ? data.fidcard_pic1 : '',
                })(
                  <UploadSingle {...this.data} prefix={dataPath} tipText="身份证正面" />
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item colon={false} label='身份证反面照' >
                <div>
                  {/* <Tooltip title={<p>填写说明：<br/>发证机关、证件有效期清晰可见</p>}>
                  <Icon type="question-circle-o" className={styles.toolTip} style={{left:120,top:-27}}/>
                  </Tooltip> */}
                </div>
                {getFieldDecorator('fidcard_pic2', {
                    initialValue: data.fidcard_pic2 ? data.fidcard_pic2 : '',
                  rules: [],
                })(
                  <UploadSingle {...this.data} prefix={dataPath} tipText="身份证反面" />
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item colon={false} label='手持身份证'>
                <div>
                  {/* <Tooltip title={<p>填写说明：<br/>1、手持身份证置于胸前，确保人脸、身份证同框；<br/>
                  2、禁止使用过期、已挂失、已作废身份证，如您身份证已更换请使用最新身份证；<br/>
                  3、禁止冒用他人身份证，违者一律上报公安机关。</p>}>
                  <Icon type="question-circle-o" className={styles.toolTip} style={{left:120,top:-27}}/></Tooltip> */}
                </div>
                {getFieldDecorator('fidcard_pic3', {
                    initialValue: data.fidcard_pic3 ? data.fidcard_pic3 : '',
                  rules: [],
                })(
                  <UploadSingle {...this.data} prefix={dataPath} tipText="手持身份证" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item colon={false} label='车辆行驶证' className="cars" >
                <div>
                  {/* <Tooltip title={<p>填写说明：<br/>拍摄车辆行驶证相关信息清晰可见。</p>}>
                  <Icon type="question-circle-o" className={styles.toolTip} style={{left:120,top:-27}}/>
                  </Tooltip> */}
                </div>
                {getFieldDecorator('fcar_pic', {
                    initialValue: data.fcar_pic ? data.fcar_pic : '',
                  rules: [],
                })(
                  <UploadSingle {...this.data} prefix={dataPath} tipText="车辆行驶证" />
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item colon={false} label='房产证明' className="home">
                <div>
                  {/* <Tooltip title={<p>填写说明：<br/>请清晰拍摄包含房产所有人等详细信息页面</p>}>
                  <Icon type="question-circle-o" className={styles.toolTip} style={{left:120,top:-27}}/>
                  </Tooltip> */}
                </div>
                {getFieldDecorator('fhouse_pic1', {
                    initialValue: data.fhouse_pic1 ? data.fhouse_pic1 : '',
                  rules: [],
                })(
                  <UploadSingle {...this.data} prefix={dataPath} tipText="房产证明" />
                )}
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div style={{ marginBottom: 20 }} className="third">
          <Row gutter={16}>
            <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <Form.Item>
                <div>
                  <Tooltip title={<p>填写说明：<br />
                    1、请前往人行或被授权的商业银行网点打印个人征信报告，每一页都需拍摄上传。<br />
                    2、如有多个文件可使用压缩包上传。</p>}>
                    <Icon type="question-circle-o" className=' person_xin' />
                  </Tooltip>
                </div>
                {getFieldDecorator('fcredit_report', {
                    initialValue: data.fcredit_report ? JSON.parse(data.fcredit_report) : [],
                  rules: [],
                })(
                  <UploadFile {...this.fileData} prefix={dataPath}>个人征信报告</UploadFile>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item >
                <div>
                  <Tooltip title={<p>填写说明：<br />1、商业银行打印个人经营有关的账户或主要资金周转账户往来六个月流水；<br />
                    2、要求包含转账交易中交易对方收款人名字、账号、金额等详细信息，并加盖银行签章；<br />
                    3、拍照上传请确保页面内容清晰可辨认。<br />4、如有多个文件可使用压缩包上传。</p>}>
                    <Icon type="question-circle-o" className=' person_xin' />
                  </Tooltip>
                </div>
                {getFieldDecorator('fdeal_log', {
                    initialValue: data.fdeal_log ? JSON.parse(data.fdeal_log) : [],
                  rules: [],
                })(
                  <UploadFile {...this.fileData} prefix={dataPath}>个人交易流水</UploadFile>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item >
                <div>
                  <Tooltip title={<p>填写说明：<br />1、您可上传：国债、银行理财、信托购买记录；基金、证券持仓截屏；私募基金、
                  私募股权、资管计划购买记录或协议；（以上信息除购买价值、现值、盈亏外，其他关键信息不可涂抹加工）
                  印有个人姓名拼音的的银行VIP储蓄卡、信用卡等。<br />2、如有多个文件可使用压缩包上传</p>}>
                    <Icon type="question-circle-o" className=' person_xin' />
                  </Tooltip>
                </div>
                {getFieldDecorator('fother_pic_json', {
                  initialValue: data.fother_pic_json ? JSON.parse(data.fother_pic_json) : [],
                  rules: [],
                })(
                  <UploadFile {...this.fileData} prefix={dataPath}>其他财产证明</UploadFile>
                )}
              </Form.Item>
            </Col>
          </Row>
          {this.props.hasUnfinishProject ? null: 
          <div style={{width: '100%',textAlign: 'center',marginTop: 20}}>
            <Button style={{width: 140, margin: '0 auto'}} type={'primary'} onClick={this.submit.bind(this)} loading={this.props.loading}>保存</Button>
          </div>}
        </div>
      </div>);
  }
}
export default Form.create()(Loaninfo);

























