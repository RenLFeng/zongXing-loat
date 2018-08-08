

import Title from './title'
import React, { PureComponent } from 'react';

import { Card, Button, Form, Icon, Col, Row, DatePicker, TimePicker, Input, Select, Popover, InputNumber, Tooltip, message } from 'antd';
import UploadMultipleFile from './UpLoad/UploadMultipleFile';
import { baseService } from '../../../../../services/api';

import { MONEY_REG, MUN_INTEGER, ID_CORD, VER_PHONE, TEL_PHONE, BANK_CARD, E_MAIL, IMG_BASE_URL, ZHUZHI_REG, LICENSE } from '../../../../../common/SystemParam';

import styles from './loanInfo.scss';

import UploadFile from './UpLoad/UploadFile';
import UploadSingle from './UpLoad/UpLoadSingle';



const { Option } = Select;


const RequireLabel = ({ children, notRequire }) => (
    <div className="span_require_div">
        <span className="span_require_div_right" style={notRequire ? { color: '#333' } : null}>{children}</span>
        {notRequire ? null :
            <img src={require('../../../../../assets/img/apply/ic_star.png')} className="span_require_div_left" />}
    </div>
);



class Loaninfo extends React.Component {
    state = {
        cityList: [],
        industryType: []
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
        this.fetchProjectType();
    }

    componentWillReceiveProps(nextProps) {
    }
    async fetchProjectType() {
        const response = await baseService.getProjectType();
        if (response.code === 0) {
            this.setState({
                industryType: response.data
            });
        }
    }
    componentWillUnmount() {

    }

    // 将下层组件传递给 父组件
    getChildData = () => {
        let val = null;
        this.props.form.validateFieldsAndScroll((error, values) => {
            if (!error) {
                // submit the values
                values.fstatement_file = typeof values.fstatement_file !== 'string' ? JSON.stringify(values.fstatement_file) : values.fstatement_file;
                values.fplace_lease = typeof values.fplace_lease !== 'string' ? JSON.stringify(values.fplace_lease) : values.fplace_lease;
                values.fjoin_file = typeof values.fjoin_file !== 'string' ? JSON.stringify(values.fjoin_file) : values.fjoin_file;
                values.fcompany_govern = typeof values.fcompany_govern !== 'string' ? JSON.stringify(values.fcompany_govern) : values.fcompany_govern;
                values.femployee_record = typeof values.femployee_record !== 'string' ? JSON.stringify(values.femployee_record) : values.femployee_record;
                values.fratepaying_record = typeof values.fratepaying_record !== 'string' ? JSON.stringify(values.fratepaying_record) : values.fratepaying_record;
                values.fliving_payment = typeof values.fliving_payment !== 'string' ? JSON.stringify(values.fliving_payment) : values.fliving_payment;
                values.ftopsh_file = typeof values.ftopsh_file !== 'string' ? JSON.stringify(values.ftopsh_file) : values.ftopsh_file;
                values.faudit_file = typeof values.faudit_file !== 'string' ? JSON.stringify(values.faudit_file) : values.faudit_file;
                // 处理其他资质文件数组 将状态不是done的都删掉
                let handleOtherFile = (arr) => {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].status !== 'done') {
                            arr.splice(i, 1);
                        }
                    }
                    return arr;
                }
                if (typeof values.fother_file1 !== 'string') {
                    values.fother_file1 = JSON.stringify(handleOtherFile(values.fother_file1));
                } else {
                    values.fother_file1 = JSON.stringify(handleOtherFile(JSON.parse(values.fother_file1)));
                }
                val = values;
            } else {
                val = null;
            }
        });
        return val;
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
            callback('家庭住址不能纯数字');
        }
        // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
        callback()
    };

    validateName = (rule, value, callback) => {
        const { getFieldValue } = this.props.form;
        if (value && /^[0-9]*$/.test(value)) {
            callback('不能为纯数字');
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
    submitLoanInfo(obj) {
        console.log(obj, "su")
    }
    render() {
        const { form, dispatch, submitting } = this.props;
        const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;

        const { cityList, } = this.state;
        const dataPath = this.props.companyNo + '/';
        const { visible, data } = this.props;
        const formItemLayoutUser = {
            labelCol: { span: 8 },
            wrapperCol: { span: 15 },
        };
        
        return (
            <div>
                <Title Title="借款企业信息" />
                <div>
                    <Form hideRequiredMark style={{ marginTop: 29 }} onSubmit={this.submit.bind(this)}>
                        <Row >
                            <Col span={12}>
                                <Form.Item {...formItemLayoutUser} label={<RequireLabel>企业名称</RequireLabel>}>
                                    {getFieldDecorator('companyName', {
                                        initialValue: this.props.companyName ? this.props.companyName : '',
                                        rules: [{ validator: this.validateName }]
                                    })(
                                        <Input placeholder="请输入" size='large' style={{ width: '302px', fontSize: '14px' }} disabled maxLength={50} />
                                    )}
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item {...formItemLayoutUser} label={<RequireLabel>统一社会信用代码</RequireLabel>}>
                                    {getFieldDecorator('fsocial_credit_code', {
                                        initialValue: this.props.companyNo ? this.props.companyNo : '',
                                        rules: [],
                                    })(
                                        <Input placeholder="请输入" size='large' style={{ width: '302px', fontSize: '14px' }} disabled maxLength={50} />
                                    )}
                                </Form.Item>
                            </Col>


                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item  {...formItemLayoutUser} label={<RequireLabel>企业开户行</RequireLabel>}>
                                    {getFieldDecorator('fcbank_name', {
                                        initialValue: data.fcbank_name ? data.fcbank_name : '',
                                        rules: [{
                                            validator: this.validateName
                                        }]
                                    })(<Input placeholder="请输入" size='large' style={{ width: '302px', fontSize: '14px' }} maxLength={20} />)}
                                </Form.Item>
                            </Col>


                            <Col span={12}>
                                <Form.Item  {...formItemLayoutUser} label={<RequireLabel>企业对公银行账户</RequireLabel>}>
                                    {getFieldDecorator('fcbank_no', {
                                        initialValue: data.fcbank_no ? data.fcbank_no : '',
                                        rules: [{
                                            pattern: BANK_CARD, message: '请输入正确的账号'
                                        }]
                                    })(
                                        <Input placeholder="请输入" size='large' style={{ width: '302px', fontSize: '14px' }} maxLength={25} />
                                    )}
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row >
                            <Col span={12}>
                                <Form.Item {...formItemLayoutUser} label={<RequireLabel>公司座机 </RequireLabel>}>
                                    {getFieldDecorator('fctelephone', {
                                        initialValue: data.fctelephone ? data.fctelephone : '',
                                        rules: [{
                                            pattern: TEL_PHONE, message: '请输入正确的单位座机'
                                        }]
                                    })(
                                        <Input placeholder="请输入" size='large' style={{ width: '302px', fontSize: '14px' }} maxLength={50} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item  {...formItemLayoutUser} label={'经营行业'}>
                                    {getFieldDecorator('fbus_trade', {
                                        initialValue: data.fbus_trade ? data.fbus_trade : this.state.industryType[0] ? this.state.industryType[0].fTypeCode : ''
                                    })(<Select size='large' style={{ width: '302px', fontSize: '14px' }} >
                                        {
                                            this.state.industryType.map((data) => {
                                                return (
                                                    <Select.Option key={data.fTypeCode} value={data.fTypeCode}>{data.fTypeName}</Select.Option>
                                                );
                                            })
                                        }
                                    </Select>)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item  {...formItemLayoutUser} label={
                                    <RequireLabel>实际经营地址</RequireLabel>}>
                                    {getFieldDecorator('fbus_address', {
                                        initialValue: data.fbus_address ? data.fbus_address : '',
                                        rules: [{
                                            pattern: ZHUZHI_REG, message: '请输入正确的经营地址（只能包含汉字，数字，字母，下划线）'
                                        }],
                                    })(
                                        <Input size='large'  placeholder="请详细到门牌号" style={{ width: '780px', fontSize: '14px' }}  maxLength={200} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div style={{ marginBottom: 20, borderTop: '1px dashed #e6e2e2',paddingTop: 20 }}>
                        <Row  >
                            <Col span={12} >
                                <Form.Item style={{marginLeft: 50}} label={<RequireLabel>营业执照</RequireLabel>} className="lecines_"  >
                                    {getFieldDecorator('fbus_license', {
                                        initialValue: data.fbus_license ? data.fbus_license : '',
                                        rules: [],
                                    })(
                                        <UploadSingle {...this.data} prefix={dataPath} tipText="营业执照" />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item style={{marginLeft: 50}} label={<RequireLabel>银行开户许可证</RequireLabel>} >
                                    {getFieldDecorator('fbank_permit', {
                                        initialValue: data.fbank_permit ? data.fbank_permit : '',
                                        rules: [],
                                    })(
                                        <UploadSingle {...this.data} prefix={dataPath} tipText="银行开户许可证" />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ marginBottom: 20, borderTop: '1px dashed #e6e2e2', paddingTop: 10 }} >
                        <Row gutter={16} style={{ height: 115 }}>
                            <Col lg={8} md={12} sm={24}>
														<div style={{position: 'relative'}}>
                							<img src={require('../../../../../assets/img/apply/ic_star.png')} style={{position: 'absolute',top: '10px',left: '10px'}}/>
                                <Form.Item  style={{marginLeft: 25}}>
                                    <div>
                                        <Tooltip title={<p>填写说明：<br />
                                            1、要求包含转账交易中交易对方收款人名字、账号、金额等详细信息，并加盖银行签章；<br />
                                            2、拍照上传请确保页面内容清晰可辨认。</p>}>
                                            <Icon type="question-circle-o" className='filler_uploads' style={{ left: 150, top: -18 }} /></Tooltip></div>
                                    {getFieldDecorator('fstatement_file', {
                                        initialValue: data.fstatement_file ? JSON.parse(data.fstatement_file) : [],
                                        rules: [],
                                    })(
                                        <UploadFile {...this.fileData} prefix={dataPath}>企业六个月银行流水</UploadFile>
                                    )}
                                </Form.Item>
																</div>
                            </Col>
                            <Col lg={8} md={12} sm={24}>
														<div style={{position: 'relative'}}>
                							<img src={require('../../../../../assets/img/apply/ic_star.png')} style={{position: 'absolute',top: '10px',left: '10px'}}/>
                                <Form.Item style={{marginLeft: 25}} >
                                    <div><Tooltip title={<p>填写说明：<br />请提供企业经营场所有关证明，包括自有房屋产权证明、租赁合同
。</p>}><Icon type="question-circle-o" className='filler_uploads' style={{ left: 120, top: -18 }} /></Tooltip></div>
                                    {getFieldDecorator('fplace_lease', {
                                        initialValue: data.fplace_lease ? JSON.parse(data.fplace_lease) : [],
                                        rules: [],
                                    })(
                                        <UploadFile {...this.fileData} prefix={dataPath}>经营地址证明</UploadFile>
                                    )}
                                </Form.Item>
																</div>
                            </Col>

                            <Col lg={8} md={12} sm={24}>
														<div style={{position: 'relative'}}>
                							<img src={require('../../../../../assets/img/apply/ic_star.png')} style={{position: 'absolute',top: '10px',left: '10px'}}/>
                                <Form.Item style={{marginLeft: 25}} >
                                    <div><Tooltip title={<p>填写说明：<br />1.如有多个文件可打包上传。</p>}><Icon type="question-circle-o"
                                        className='filler_uploads' style={{ left: 170, top: -18 }} /></Tooltip></div>
                                    {getFieldDecorator('fliving_payment', {
                                        initialValue: data.fliving_payment ? JSON.parse(data.fliving_payment) : [],
                                        rules: [],
                                    })(
                                        <UploadFile {...this.fileData} prefix={dataPath}>六个月水电气费缴费记录</UploadFile>
                                    )}
                                </Form.Item>
																</div>
                            </Col>

                        </Row>
                        <Row gutter={16} style={{ height: 115 }}>
                            <Col lg={8} md={12} sm={24}>
                                <Form.Item style={{marginLeft: 25}} >
                                    <div>
                                        <Tooltip title={<p>填写说明：<br />上传相关加盟证明文件，包括加盟合同、加盟费缴费记录等。</p>}>
                                            <Icon type="question-circle-o" className='filler_uploads' style={{ left: 150, top: -18 }} /></Tooltip></div>
                                    {getFieldDecorator('fjoin_file', {
                                        initialValue: data.fjoin_file ? JSON.parse(data.fjoin_file) : [],
                                        rules: [],
                                    })(
                                        <UploadFile {...this.fileData} prefix={dataPath}>企业加盟合同-附件</UploadFile>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col lg={8} md={12} sm={24}>
                                <Form.Item style={{marginLeft: 25}} >
                                    <div><Tooltip title={<p>填写说明：<br />1、包括公司章程、验资报告等。<br />2.如有多个文件可打包上传。</p>}>
                                        <Icon type="question-circle-o" className='filler_uploads' style={{ left: 130, top: -18 }} /></Tooltip></div>
                                    {getFieldDecorator('fcompany_govern', {
                                        initialValue: data.fcompany_govern ? JSON.parse(data.fcompany_govern) : [],
                                        rules: [],
                                    })(
                                        <UploadFile {...this.fileData} prefix={dataPath}>公司内部治理文件</UploadFile>
                                    )}
                                </Form.Item>
                            </Col>

                            <Col lg={8} md={12} sm={24}>
                                <Form.Item style={{marginLeft: 25}} >
                                    <div><Tooltip title={<p>填写说明：<br />1、包括公司章程、验资报告等。<br />2.如有多个文件可打包上传。</p>}>
                                        <Icon type="question-circle-o" className='filler_uploads' style={{ left: 145, top: -18 }} /></Tooltip></div>
                                    {getFieldDecorator('ftopsh_file', {
                                        initialValue: data.ftopsh_file ? JSON.parse(data.ftopsh_file) : [],
                                        rules: [],
                                    })(
                                        <UploadFile {...this.fileData} prefix={dataPath}>股东会议决议/授权书</UploadFile>
                                    )}
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={16} style={{ height: 125 }}>
                            <Col lg={8} md={12} sm={24}>
                                <Form.Item style={{marginLeft: 25}} >
                                    <div><Tooltip title={<p>填写说明：<br />
                                        1、纳税记录文件需有权部门公章，银行代缴有关凭证需加盖银行签章。
                                    <br />2.如有多个文件可打包上传。</p>}>
                                        <Icon type="question-circle-o" className='filler_uploads' style={{ left: 180, top: -18 }} /></Tooltip></div>
                                    {getFieldDecorator('fratepaying_record', {
                                        initialValue: data.fratepaying_record ? JSON.parse(data.fratepaying_record) : [],
                                        rules: [],
                                    })(
                                        <UploadFile {...this.fileData} prefix={dataPath}>六个月企业纳税、开票记录</UploadFile>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col lg={8} md={12} sm={24}>
                                <Form.Item style={{marginLeft: 25}} >
                                    <div>
                                        <Tooltip title={<p>填写说明：<br />
                                            暂无。</p>}>
                                            <Icon type="question-circle-o" className='filler_uploads'
                                                style={{ left: 120, top: -18 }} /></Tooltip>
                                    </div>
                                    {getFieldDecorator('faudit_file', {
                                        initialValue: data.faudit_file ? JSON.parse(data.faudit_file) : [],
                                        rules: [],
                                    })(
                                        <UploadFile {...this.fileData} prefix={dataPath}>财务报表</UploadFile>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col lg={8} md={12} sm={24}>
                                <Form.Item style={{marginLeft: 25}} >
                                    <div>
                                        <Tooltip title={<p>填写说明：<br />
                                            包括特许行业经营许可（如烟草、烟花爆竹经营许可等）、环保许可、餐饮行业卫生许可、公司名下资产等。</p>}>
                                            <Icon type="question-circle-o" className='filler_uploads' style={{ left: 120, top: -18 }} /></Tooltip>
                                    </div>
                                    {getFieldDecorator('fother_file1', {
                                        initialValue: data.fother_file1 ? JSON.parse(data.fother_file1) : [],
                                        rules: [],
                                    })(
                                        <UploadFile {...this.fileData} prefix={dataPath}>其他资质文件</UploadFile>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16} style={{ height: 105 }}>
                            <Col lg={8} md={12} sm={24}>
                                <Form.Item  style={{marginLeft: 25}}>
                                    <div><Tooltip title={<p>填写说明：<br />1、银行代缴有关凭证需加盖银行签章。<br />
                                        2.如有多个文件可打包上传。</p>}><Icon type="question-circle-o" className='filler_uploads' style={{ left: 240, top: -18 }} /></Tooltip></div>
                                    {getFieldDecorator('femployee_record', {
                                        initialValue: data.femployee_record ? JSON.parse(data.femployee_record) : [],
                                        rules: [],
                                    })(
                                        <UploadFile {...this.fileData} prefix={dataPath}>六个月员工工资清单、社保缴费记录</UploadFile>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </div>
                {this.props.hasUnfinishProject ? null :
                    <div style={{ width: '100%', textAlign: 'center', marginTop: 50 }}>
                        <Button style={{ width: 140, margin: '0 auto' }} type={'primary'} onClick={this.submit.bind(this)} loading={this.props.loading}>保存</Button>
                    </div>}
            </div>
        )
    }
}
export default Form.create()(Loaninfo);