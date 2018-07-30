import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Select, InputNumber, Alert, Icon, Tooltip,Button,message } from 'antd';
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
        for(let i=3;i<=12;i++){
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

    componentWillUnmount() {
    }

    // 传递当前数据给上层组件
    getChildData = () => {
        let value = null;
        this.props.form.validateFieldsAndScroll((error, values) => {
            if (!error) {
                value = values;
            } else {
                value = null;
            }
        });
        return value;
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
    // 保存方法
    submits(){
        const val = this.getChildData();
        if (val == null) {
            message.error('请检查数据格式');
            return;
        } else {
            this.props.changeOldData(val, 'SAVE');
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
                                    initialValue: data.fcredit_money ? `${data.fcredit_money}` : '',
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
                                    initialValue: data.fcredit_month ? data.fcredit_month + '': '',
                                })(
                                    <Select style={{ width: '200px', marginLeft: 6 }}>
                                        {this.state.monthList.map((data) => {
                                            return (
                                                <Select.Option key={data.fcode} >{data.fname}</Select.Option>
                                            );
                                        })}
                                    </Select>)}


                            </Form.Item>

                        </div>
                        <div style={{ width: '30%', display: 'contents' }}>
                            <Form.Item layout="inline" label={<div className={styles.textBox}><RequireLabel>所在城市</RequireLabel></div>}>
                                {getFieldDecorator('fcity_code', {
                                    initialValue: data.fcity_code ? data.fcity_code : cityList.length > 0 ? cityList[0].fCode : ''
                                })(
                                    <Select style={{ width: '200px', marginLeft: 6 }}   >
                                        {cityList.map((data) => {
                                            return (
                                                <Select.Option key={data.fCode} >{data.fCityName}</Select.Option>
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
                                    initialValue: data.fcredit_use? data.fcredit_use :'',
                                })(
                                    <Input placeholder="请输入"  style={{ width: '200px', marginLeft: 6 }} maxLength={500}/>
                                )}
                            </Form.Item>

                        </div>
                        <div style={{ width: '30%', display: 'contents' }}>
                            <Form.Item layout="inline" label={<div className={styles.textBox}> 借款利率 (%)
                            </div>} style={{ marginTop: 5 }}>
                                {getFieldDecorator('frate_predict', {
                                    initialValue: data.frate_predict ? data.frate_predict + '' : '',
                                })(
                                    <InputNumber min={8} max={15} step={0.1} placeholder="请输入" style={{ width: '205px',marginLeft: 3 }} />
                                )}
                            </Form.Item>

                        </div>
                        <div style={{ width: '30%', display: 'contents' }}>
                            <Form.Item layout="inline" label={<div className={styles.textBox}> 获客渠道
                            </div>} style={{ marginTop: 5 }}>
                                {getFieldDecorator('fchannel', {
                                    rules: [],
                                    initialValue: data.fchannel ? data.fchannel : '0'
                                })(
                                    <Select style={{ width: '200px', marginLeft: 5 }} >
                                        <Select.Option value="0">网络搜索</Select.Option>
                                        <Select.Option value="1">熟人推荐分享</Select.Option>
                                        <Select.Option value="2">线下宣传</Select.Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </div>
                    </Row>
                    {
                        this.props.hasUnfinishProject ? null:
                        <div style={{width: '100%',textAlign: 'center',marginTop: 20}}>
                            <Button style={{width: 140, margin: '0 auto'}} type={'primary'} onClick={this.submits.bind(this)} loading={this.props.loading}>保存</Button>
                        </div>
                    }
                </Form>
            </div>
        )
    }
}

export default Form.create()(Loaninfo);
