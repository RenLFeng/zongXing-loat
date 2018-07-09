/*
 * @Author: wfl 
 * @Date: 2018-07-05 11:48:42 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-05 18:47:19
 * 发放优惠券
 */
import React from 'react';
import {connect} from 'dva';
import './sendcoupon.scss';
import {IMG_BASE_URL} from '../../../../common/SystemParam';
import UploadImg from '../../../../components/imgupload/ImgUpload';
import DatePick from './datePick';
import { Input, InputNumber, Row, Col, Select } from 'antd';
const Option = Select.Option;
@connect((state)=>({

}))

class SendCoupon extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            imgsrc: '',
            fullrule: 0,
            parvalue: '',
            address: '',
            phone: '',
            couponnum: 0,
            data:[
                {
                    status: 0,
                    name: '海底捞火锅新店扩张',
                    rule: '投资满150元发一张',//规则
                    deno: '50',//面额
                    userule: '满150减50',
                    deltime: '2018-06-28',
                    useaddress: '西安、上海、北京',
                    
                },
                {
                    name: '海底捞火锅新店扩张',
                    count: '共100张',//规则
                    deno: '30',//面额
                    userule: '满150减50',
                    deltime: '2018-06-28',
                    useaddress: '西安、上海、北京'
                }
            ]
        };
        this.data = {
            className: "ant-upload",
            type: "images/",
            divClassName: "upload-div",
            baseUrl: IMG_BASE_URL
          };
    }
    onChange(val){
        console.log(val,'ppp')
    }
    render(){
        const {data, parvalue, fullrule, couponnum, address, phone} = this.state;
        let couCard = [];
        for(let i of data){
            if(i.status === 0){
                couCard.push(<Col span={12} className="send-coupon1">
                        <span className="num">P1806006</span>
                        <p className="t-img">
                            <img src={require('../img/u1162.png')}/>
                        </p>
                        <span className="per-type">投资人</span>
                        <Row className="info">
                            <Col span={16} className="coupon-info">
                                <p className="coupon-name">{i.name}</p>
                                <p className="coupon-rule">{i.rule}</p>
                                <div>
                                    <p className="coupon-deno">￥<span>{i.deno}</span>YUAN</p>
                                    <ul>
                                        <li>使用规则: {i.userule}</li>
                                        <li>失效日期: {i.deltime}</li>
                                        <li>使用地址: {i.useaddress}</li>
                                    </ul>
                                </div>
                            </Col>
                            <Col span={8} className="business-img">
                                <UploadImg {...this.data} prefix={'personal/'} tipText="上传商家图片" onChange={this.onChange.bind(this)}/>
                            </Col>
                            <div className="send-form" style={{marginTop: 175}}>
                                <div className="send-form-div">
                                    <span className="fir-span">优惠券面值:</span> 
                                    <Input className="form-item" value={parvalue} 
                                            placeholder= "请输入5的倍数"
                                        onChange={(e)=> this.setState({parvalue: e.target.value })} 
                                        style={{display: 'inline-block',width: '200px'}}/>
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">使用规则:</span> 
                                    满 <InputNumber className="form-item" value={fullrule} 
                                                    onChange={(e)=> this.setState({fullrule: e })} step={10}
                                                    style={{ marginLeft:'14px'}}/>
                                    <span className="full-jie">满150减50元</span>
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">优惠券数量:</span> 
                                    投资 <InputNumber className="form-item" value={couponnum} 
                                                    onChange={(e)=> this.setState({couponnum: e})} step={10}
                                                    />
                                    <span className="full-ff">元发放1张优惠券</span>
                                <p>优惠券数量666张</p>
                                </div>
                                <div className="send-form-div" style={{marginTop: '-15px'}}>
                                    <span className="fir-span">失效日期:</span> 
                                </div>
                            </div>
                        </Row>
                        
                    </Col>)
            }else{
                couCard.push(<Col className="send-coupon2">
                    <span className="num">P1806006</span>
                        <p  className="t-img">
                            <img src={require('../img/u1162.png')}/>
                        </p>
                    <span className="per-type">游客</span>
                    <Row className="info">
                        <Col span={16} className="coupon-info">
                            <p className="coupon-name">{i.name}</p>
                            <p className="coupon-rule">{i.count}</p>
                            <div>
                                <p className="coupon-deno">￥<span>{i.deno}</span>YUAN</p>
                                <ul>
                                    <li>使用规则: {i.userule}</li>
                                    <li>失效日期: {i.deltime}</li>
                                    <li>使用地址: {i.useaddress}</li>
                                </ul>
                            </div>
                        </Col>
                        <Col span={8} className="business-img">
                            <UploadImg {...this.data} prefix={'personal/'} tipText="上传商家图片" onChange={this.onChange.bind(this)}/>
                        </Col>
                        <div  className="send-form" style={{marginTop: 175}}>
                                <div className="send-form-div">
                                    <span className="fir-span">优惠券面值:</span> 
                                    <Input className="form-item" value={parvalue} 
                                            placeholder= "请输入5的倍数"
                                        onChange={(e)=> this.setState({parvalue: e.target.value })} 
                                        style={{display: 'inline-block',width: '200px'}}/>
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">使用规则:</span> 
                                    满 <InputNumber className="form-item" value={fullrule} 
                                                    onChange={(e)=> this.setState({fullrule: e })} step={10}
                                                    style={{ marginLeft:'14px'}}/>
                                    <span className="full-jie">满150减50元</span>
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">优惠券数量:</span> 
                                    <Input className="form-item" value={parvalue} 
                                            placeholder= "请输入优惠券数量"
                                        onChange={(e)=> this.setState({parvalue: e.target.value })} 
                                        style={{display: 'inline-block',width: '123px'}}/>
                                        <span style={{paddingLeft: '10px'}}>张</span>
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">失效日期:</span> 
                                </div>
                            </div>
                    </Row>
                </Col>)
            }
        }


        return(
            <Row className="send-coupon" type="flex" justify="center">
                {couCard}
                <div className="send-form-div">
                    <span className="fir-span">使用地址:</span> 
                    <Input className="form-item" value={address} 
                            placeholder= "详细地址"
                            onChange={(e)=> this.setState({address: e.target.value })} 
                            style={{display: 'inline-block',width: '123px'}}/>
                    <Input className="form-item" value={phone} 
                            placeholder= "联系电话"
                            onChange={(e)=> this.setState({phone: e.target.value })} 
                            style={{display: 'inline-block',width: '123px'}}/>
                </div>
            </Row>
        )
    }
}

export default SendCoupon;
