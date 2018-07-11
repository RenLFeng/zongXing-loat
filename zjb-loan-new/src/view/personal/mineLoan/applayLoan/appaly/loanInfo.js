import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Select, InputNumber, Alert, Icon, Tooltip,Button } from 'antd';
import Title from './title'
import { MONEY_REG, MUN_INTEGER, IMG_BASE_URL, LIMIT_MOENY, } from '../../../../../common/SystemParam';
import styles from './loanInfo.scss';
import City from '../../../rechargecomponents/card/bindcard/moneyCity';
const FormItem = Form.Item;
const Option = Select.Option;

const RequireLabel = ({ children }) => (
    <div>
        <span style={{ color: 'red', display: 'inline-block', verticalAlign: 'sub', marginRight: 5 }}>{`* `}</span>
        <span style={{ display: 'inline-block', verticalAlign: 'middle' }}> {children}</span>
    </div>
);

class Loaninfo extends React.Component {
    state = {
        cityList: City.provincerList,
        monthList:[],
        data:{
            fcredit_money:'',
            fcredit_month:'',
            fcity_code:'',
            fcredit_use:'',
            frate_predict:'',
            fchannel:'',
        }
    };
    data = {
        className: "ant-upload",
        type: "images/",
        divClassName: "upload-div",
        baseUrl: IMG_BASE_URL
    };
    getMonth(){
        let arr=[];
        for(let i=1;i<=12;i++){
         arr.push({
             fcode:i,
             fname:i+"个月"
         })
        }
        this.setState({
            monthList:arr 
        })
    }
    componentDidMount() {
      this.getMonth()
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.num !== nextProps.num) {
            if (this.props.visible) {
                this.props.form.validateFieldsAndScroll((error, values) => {
                    if (!error) {
                        // submit the values
                        if (this.props.saveNO !== nextProps.saveNO) {
                            this.props.changeData('info', values, true, true);
                        } else {
                            if (this.props.commit !== nextProps.commit) {
                                this.props.changeData('info', values, true, false, true);
                            } else {
                                this.props.changeData('info', values, true, false);
                            }
                        }
                    } else {
                        this.props.changeData('info', values, false);
                    }
                });
            }
        }
    }

    componentWillUnmount() {
    }

    validateNumber = (rule, value, callback) => {
        const { getFieldValue } = this.props.form;
        if (!LIMIT_MOENY && MONEY_REG.test(value) && (value * 1 < 100000 || value * 1 > 1000000)) {
            callback('金额应为10-100万之间');
        } else if (!LIMIT_MOENY && value && value * 1 % 100 !== 0) {
            callback('金额需为100的整数倍');
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
    submits(){
        let obj={};
        let flag=true
        this.props.form.validateFields((err, values) => {
            if (!err) {
                obj=values;
            }
          });
        
          for(let i in obj){
              if(obj[i] === undefined){
                flag=false
              }
          }
          if(!flag){
            alert('请完善借款信息');
          }else{
            this.submitLoanInfo(obj)
          }
    }

    submitLoanInfo(obj){
      console.log(obj,"su")
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { cityList, data } = this.props;
        const { visible } = this.props;
        const {  fcredit_money,fcredit_month,fcity_code,fcredit_use,frate_predict,fchannel } = this.state.data;
        return (
            <div className="applone-info">
                <Title Title="借款信息" />
                <div>
                </div>
                <Form layout="inline" onSubmit={this.submits.bind(this)} ref="froms">
                    <Row style={{ display: 'inline-flex' }} > 
                        <div style={{ width: '30%', display: 'contents' }}>
                            <Form.Item layout="inline" label={
                                <RequireLabel>要借多钱</RequireLabel>}>
                                {getFieldDecorator('fcredit_money', {
                                    rules: [
                                        { pattern: MONEY_REG, message: '请输入正确的金额格式' },
                                        { validator: this.validateNumber }
                                    ]
                                })(<InputNumber min={0}    max={1000000} step={100} style={{ width: '200px', marginLeft: 6 }} placeholder="请输入" />)}
                            </Form.Item>
                        </div>
                        <div style={{ width: '30%', display: 'contents' }}>
                            <Form.Item layout="inline" label={<div className={styles.textBox}><RequireLabel>要借多久
                                </RequireLabel> </div>}>

                                         {getFieldDecorator('fcredit_month', {
                                    // initialValue: data.fcity_code ? data.fcity_code : this.props.cityList.length > 0 ? this.props.cityList[0].fCode : ''
                                })(
                                    <Select style={{ width: '200px', marginLeft: 6 }}   >
                                        {this.state.monthList.map((data) => {
                                            return (
                                                <Select.Option key={data.fcode} >{data.fname}</Select.Option>
                                            );
                                        })}
                                    </Select>)}


                                {/* {getFieldDecorator('fcredit_month', {
                                    // initialValue: data.fcredit_month ? data.fcredit_month + '': '',
                                    rules: [
                                        { pattern: MUN_INTEGER, message: '请输入正确的借款期数' },
                                        { validator: this.validateTime }
                                    ]
                                })(<InputNumber min={3} max={12} style={{ width: '200px', marginLeft: 6 }} placeholder="请输入" />)} */}
                            </Form.Item>

                        </div>
                        <div style={{ width: '30%', display: 'contents' }}>
                            <Form.Item layout="inline" label={<div className={styles.textBox}><RequireLabel>所在城市</RequireLabel></div>}>
                                {getFieldDecorator('fcity_code', {
                                    // initialValue: data.fcity_code ? data.fcity_code : this.props.cityList.length > 0 ? this.props.cityList[0].fCode : ''
                                })(
                                    <Select style={{ width: '200px', marginLeft: 6 }}   >
                                        {this.state.cityList.map((data) => {
                                            return (
                                                <Select.Option key={data.fcode} >{data.fname}</Select.Option>
                                            );
                                        })}
                                    </Select>)}
                            </Form.Item>

                        </div>
                    </Row>
                    <Row style={{ display: 'inline-flex' }}>
                        <div style={{ width: '30%', display: 'contents' }}>
                            <Form.Item layout="inline" label={<div className={styles.textBox}>
                                <RequireLabel>借款用途</RequireLabel></div>}>
                                {getFieldDecorator('fcredit_use', {
                                    // initialValue: data.fcredit_use? data.fcredit_use :'',
                                })(
                                    <Input placeholder="请输入"  style={{ width: '200px', marginLeft: 6 }} />
                                )}
                            </Form.Item>

                        </div>
                        <div style={{ width: '30%', display: 'contents' }}>
                            <Form.Item layout="inline" label={<div className={styles.textBox}> 借款利率 (%)
                            </div>}>
                                {getFieldDecorator('frate_predict', {
                                    // initialValue: data.frate_predict ? data.frate_predict + '' : '',
                                })(
                                    <InputNumber   min={8} max={15} step={0.1} placeholder="请输入" style={{ width: '200px', marginLeft: '-6px' }} />
                                )}
                            </Form.Item>

                        </div>
                        <div style={{ width: '30%', display: 'contents' }}>
                            <Form.Item layout="inline" label={'获客渠道'} style={{ marginLeft: 6 }}>
                                {getFieldDecorator('fchannel', {
                                    rules: [],
                                    // initialValue: data.fchannel ? data.fchannel : '0'
                                })(
                                    <Select style={{ width: '200px', marginLeft: 11 }} >
                                        <Select.Option value="0">网络搜索</Select.Option>
                                        <Select.Option value="1">熟人推荐分享</Select.Option>
                                        <Select.Option value="2">线下宣传</Select.Option>
                                    </Select>
                                )}
                            </Form.Item>

                        </div>
                    </Row>
                    <Row>
                    <div className="loan-aoolays-btns"  onClick={this.submits.bind(this)}>
                      <a >保存</a>
                    </div>
                    </Row>
                </Form>



                {/* <Form layout="inline" hideRequiredMark>
                    <Row gutter={16}>
                        <Col lg={6} md={12} sm={24}>
                            <Form.Item layout="inline" label={<div className={styles.textBox}><RequireLabel>借款金额(元)</RequireLabel> <Tooltip title={<p>填写说明：<br />1、借款金额 =项目预计总投资-自有资金-其他渠道已融资金；<br />2、众借帮提供融资额度小于项目预计总投资的50%。例如项目预计总投资为100万，可以向众借帮申请最多50万的借款，但最终审核额度根据信用评审确定</p>}><Icon type="question-circle-o" className={styles.toolTip} style={{ left: 120, top: 6, display: 'block', marginTop: '-22px' }} /></Tooltip> </div>}>
                                {getFieldDecorator('fcredit_money', {
                                    // initialValue: data.fcredit_money ? `${data.fcredit_money}` : '',
                                    rules: [
                                        { pattern: MONEY_REG, message: '请输入正确的金额格式' },
                                        { validator: this.validateNumber }
                                    ]
                                })(<InputNumber min={0} max={1000000} step={100} style={{ width: '100%' }} placeholder="请输入" />)}
                            </Form.Item>
                        </Col>

                        <Col xl={{ span: 6, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                            <Form.Item layout="inline" label={'获客渠道'}>
                                {getFieldDecorator('fchannel', {
                                    rules: [],
                                    // initialValue: data.fchannel ? data.fchannel : '0'
                                })(
                                    <Select>
                                        <Select.Option value="0">网络搜索</Select.Option>
                                        <Select.Option value="1">熟人推荐分享</Select.Option>
                                        <Select.Option value="2">线下宣传</Select.Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <Form.Item layout="inline" label={<div className={styles.textBox}><RequireLabel>借款期数 (月)</RequireLabel><Tooltip title={<p>填写说明：<br />1、相同借款金额下，借款期数大小影响每月还款金额的多少，设置期数时请充分考虑经营周转的流动性压力；<br />2、众借帮借款期数限制：3-12个月，最少3个月，最多12个月，按整月计算</p>}><Icon type="question-circle-o" className={styles.toolTip} style={{ display: 'block', marginTop: '-17px', marginLeft: 40 }} /></Tooltip> </div>}>
                                {getFieldDecorator('fcredit_month', {
                                    // initialValue: data.fcredit_month ? data.fcredit_month + '': '',
                                    rules: [
                                        { pattern: MUN_INTEGER, message: '请输入正确的借款期数' },
                                        { validator: this.validateTime }
                                    ]
                                })(<InputNumber min={3} max={12} placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col lg={6} md={12} sm={24}>
                            <Form.Item layout="inline" label={<div className={styles.textBox}>
                                <RequireLabel>借款用途</RequireLabel>
                                <Tooltip title={<p>填写说明：<br />1、请根据所借款项主要用途如实填写，例如：经营场所购买、租赁费用、门面装修费用、进货、连锁加盟费等；<br />2、众借帮给小微企业提供融资主要用于扩大生产和扩大经营。</p>}><Icon type="question-circle-o" className={styles.toolTip} style={{ left: 95, top: 6, display: 'block', marginTop: '-20px' }} /></Tooltip></div>}>
                                {getFieldDecorator('fcredit_use', {
                                    // initialValue: data.fcredit_use? data.fcredit_use :'',
                                })(
                                    <Input placeholder="请输入" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                            <Form.Item layout="inline" label={<div className={styles.textBox}>
                                <RequireLabel>所在城市</RequireLabel>
                                <Tooltip title={<p>填写说明：<br />1、请根据项目经营所在地如实填写；<br />2、省会城市代表省，例如：宁波申请的项目，“所在城市”是“杭州”，杭州代表整个浙江省。</p>}><Icon type="question-circle-o" className={styles.toolTip} style={{ left: 95, top: 6, display: 'block', marginTop: '-20px' }} /></Tooltip>
                            </div>}>
                                {getFieldDecorator('fcity_code', {
                                    // initialValue: data.fcity_code ? data.fcity_code : this.props.cityList.length > 0 ? this.props.cityList[0].fCode : ''
                                })(
                                    <Select>
                                        {this.state.cityList.map((data) => {
                                            console.log(data,"4154564654654564----------------------------------")
                                            return (
                                                <Select.Option key={data.fcode} value={data.fcode}>{data.label}</Select.Option>
                                            );
                                        })}
                                    </Select>)}
                            </Form.Item>
                        </Col>
                        <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                            <Form.Item layout="inline" label={<div className={styles.textBox}> 借款利率 (%)
                  <Tooltip title={<p>填写说明：<br />1、借款利率为支付投资人利息（8%-15%）与众借帮平台管理费用（4%-6%）的总和；<br />2、最终利率由平台对借款人进行充分风险评估后决定；<br />3、众借帮客户信用分为七个等级，各等级和对应返还投资者利率分别为：<br />A类，A+（8%）、A（9%）、A-（10%）；<br />B类，B+（11%）、B（12%）、B-（13%）；<br />C类（15%）<br />4、不同信用等级客户借款平台管理费费率分别为：A类（4%），B类（5%），C类（6%）<br />5、最终利率由平台对借款人进行充分风险评估后决定；</p>}><Icon type="question-circle-o" className={styles.toolTip} style={{ marginLeft: 44 }} /></Tooltip>
                            </div>}>
                                {getFieldDecorator('frate_predict', {
                                    // initialValue: data.frate_predict ? data.frate_predict + '' : '',
                                })(
                                    <InputNumber min={8} max={15} step={0.1} placeholder="请输入" />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form> */}
            </div>
        )
    }
}

export default Form.create()(Loaninfo);