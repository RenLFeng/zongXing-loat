import React from 'react';
import './couponsmall.scss'
import moment from 'moment';

export default class CouponSmall extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            data:{},
        }
        
    } 
    componentDidMount() {
        this.setCouponSmall(this.props);
    } 

    componentWillReceiveProps(props){ 
        this.setCouponSmall(props);
    } 

    setCouponSmall(props){ 
        let fflag_class ='qsy';
        let btn_text ='去使用'; 
        switch(props.data.fflag){
            case 0:case 1:
            fflag_class ='dlq';
            btn_text='待领取';
            break;
            case 2:case 3:
            fflag_class ='qsy';
            btn_text='去使用';
            break;
            case 4:
            fflag_class ='ysy';
            btn_text='已使用';
            break;
            case 5:
            fflag_class ='ysx';
            btn_text='已失效';
            break; 
        }  
        this.setState({ 
            data:props.data?props.data:{},
            fflag_class:fflag_class, 
            btn_text:btn_text,
            logo:'https://zjb-test-1255741041.cos.ap-guangzhou.myqcloud.com/base/defut-head.jpg'
        });
    }

    render() { 
        return ( 
            <div className={`small-coupon ${this.state.fflag_class}`}>
                <div className='coupon-left'>
                    <p className='coupon-name'>{this.state.data.fname||'优惠券名称'}</p>
                    <p className='coupon-money'>
                        <span className='t1'>￥</span>
                        <span  className='t2'>{this.state.data.ffull_sub_money||'0'}</span>
                        <div className='sub-money'> 
                            {
                                this.state.fflag_class=='qsy'?
                                <span className='t4'>{this.state.data.ffull_sub_money||'0'}券额</span>:null
                            } 
                            <span  className='t3'>YUAN</span>
                        </div>
                    </p>
                    <p className='coupon-rule'>使用规则：满{this.state.data.ffull_sub_condition||0}使用</p>
                    <p className='coupon-time'>有效期：{this.state.data.fend_time?moment(this.state.data.fend_time).format('YYYY年MM月DD日'):'----年--月--日'}</p>
                </div>
                <div className='coupon-right' onClick={this.props.handlerBtnClick?()=>this.props.handlerBtnClick(this.state.data):()=>{}} style={this.props.handlerBtnClick?{cursor: 'pointer'}:null}>
                    <img className={`logo ${this.props.onlyOne?'center':''}`} src={this.state.data.flogo_pic||this.state.logo}/>
                    {
                        this.props.onlyOne?null:
                        <div className='text'>
                            <p className='coupon-flag'>{this.state.btn_text}</p>
                            <p className='coupon-count'>共 <span>{this.state.data.countNum>0?this.state.data.countNum:1}</span> 张</p>
                        </div>
                    } 
                </div>
            </div> 
         )
    }
}
  
