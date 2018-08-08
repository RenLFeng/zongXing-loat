import React, { PureComponent } from 'react';
import { Card, Form, Col, Row, Input, Select, InputNumber, Alert, Icon, Tooltip,Button,message } from 'antd';
import Title from './title'
import { MONEY_REG, MUN_INTEGER, IMG_BASE_URL, LIMIT_MOENY, } from '../../../../../common/SystemParam';
import styles from './loanInfo.scss';
import City from '../../../rechargecomponents/card/bindcard/moneyCity';
const FormItem = Form.Item;
const Option = Select.Option;

const RequireLabel = ({ children, notRequire }) => (
    <div className="span_require_div">
       <span className="span_require_div_right" style={notRequire?{color: '#333'}:null}>{children}</span>
       {notRequire ? null:
       <img src={require('../../../../../assets/img/apply/ic_star.png')} className="span_require_div_left"/>}
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
        console.log(value);
        if (!LIMIT_MOENY && MONEY_REG.test(value) && (value * 1 < 50000 || value * 1 > 1000000)) {
            callback('金额应为5-100万之间');
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

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { cityList, data } = this.props;
        const { visible } = this.props;
        const {  fcredit_money,fcredit_month,fcity_code,fcredit_use,frate_predict,fchannel } = this.state.data;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 16 },
        };
        let rateArr=[{value:'8',num:'8%'},{value:'9',num:'9%'},{value:'10',num:'10%'},{value:'11',num:'11%'},{value:'12',num:'12%'},{value:'13',num:'13%'},{value:'15',num:'15%'}]
        return (
            <div className="applone-info" >
                <Title Title="借款信息" />
                <Form onSubmit={this.submits.bind(this)} ref="froms">
                    <div style={{position: 'relative'}} style={{marginBottom: 30}}>
                        <Form.Item {...formItemLayout} label={
                            <RequireLabel>要借多钱</RequireLabel>}>
                            {getFieldDecorator('fcredit_money', {
                                initialValue: data.fcredit_money ? `${data.fcredit_money}` : '',
                                rules: [
                                    { pattern: MONEY_REG, message: '请输入正确的金额格式' },
                                    { validator: this.validateNumber }
                                ]
                            })(<InputNumber size='large' min={50000} max={1000000} step={100} style={{ width: '520px' }} placeholder="借款金额最低5万元" />)}
                        </Form.Item>
                        <span className="span_form_suffix">元</span>
                    </div>

                    <Form.Item style={{marginBottom: 30}} {...formItemLayout} label={<RequireLabel>要借多久
                        </RequireLabel>}>
                            {getFieldDecorator('fcredit_month', {
                            initialValue: data.fcredit_month ? data.fcredit_month + '': '3'
                        })(
                            <Select placeholder="请选择" size='large' style={{ width: '520px',fontSize: '14px' }}>
                                {this.state.monthList.map((data) => {
                                    return (
                                        <Select.Option key={data.fcode} >{data.fname}</Select.Option>
                                    );
                                })}
                            </Select>)}
                    </Form.Item>

                    
                    <Form.Item style={{marginBottom: 60}} {...formItemLayout}  label={<RequireLabel notRequire> 获客渠道</RequireLabel>}>
                        {getFieldDecorator('fchannel', {
                            rules: [],
                            initialValue: data.fchannel ? data.fchannel : '0'
                        })(
                            <Select size='large' style={{ width: '520px',fontSize: '14px' }} >
                                <Select.Option value="0">网络搜索</Select.Option>
                                <Select.Option value="1">熟人推荐分享</Select.Option>
                                <Select.Option value="2">线下宣传</Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item style={{marginBottom: 30}} {...formItemLayout} label={<RequireLabel>借款用途</RequireLabel>}>
                        {getFieldDecorator('fcredit_use', {
                            initialValue: data.fcredit_use? data.fcredit_use :'',
                        })(
                            <Input placeholder="请输入"  size='large' style={{ width: '520px',fontSize: '14px' }} maxLength={100}/>
                        )}
                    </Form.Item>
                    
                    <Form.Item style={{marginBottom: 30}} {...formItemLayout}   label={<RequireLabel notRequire>期望利率</RequireLabel>}>
                        {getFieldDecorator('frate_predict', {
                            initialValue: data.frate_predict ?  data.frate_predict + '' : '10',
                        })(
                            <Select size='large' style={{ width: '520px',fontSize: '14px' }} >
                                {
                                   rateArr.map((data,index)=>{
                                        return  <Select.Option value={data.value}>{data.num}</Select.Option>
                                    })
                                }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item  style={{marginBottom: 60}} {...formItemLayout}  label={<RequireLabel>所在城市</RequireLabel>}>
                        {getFieldDecorator('fcity_code', {
                            initialValue: data.fcity_code ? data.fcity_code : cityList.length > 0 ? cityList[0].fCode : ''
                        })(
                            <Select placeholder="请选择" size='large' style={{ width: '520px',fontSize: '14px' }}>
                                {cityList.map((data) => {
                                    return (
                                        <Select.Option key={data.fCode} >{data.fCityName}</Select.Option>
                                    );
                                })}
                            </Select>)}
                    </Form.Item>
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
