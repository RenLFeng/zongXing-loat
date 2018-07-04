import React from 'react';
import '../../assets/component/common/coupon.scss';
import {Button,Input} from 'antd';
import moment from 'moment';

class Coupon extends React.Component {
    
    constructor(props) {
        super(props);   
        this.renderData(props);
    }

    componentWillReceiveProps(props){
        this.renderData(props);
    }

    renderData(props){
        let couponData  = {}
        if(props.data){
           couponData =  props.data;
        }  
        let canEdit= false; 
        if(couponData.fflag==1||couponData.fflag==2||couponData.fflag==3){
            canEdit = true;
        }
        let btnName = ""; 
        switch(couponData.fflag){
            case 0:
                btnName ='待领取'; //待生效 
                break;
            case 1:
                btnName ='待领取'; 
                break;
            case 2:
                btnName ='去使用'; 
                break;
            case 3:
                btnName ='去使用'; 
                break;
            case 4:
                btnName ='已使用'; 
                break;
            case 5:
                btnName ='已失效'; 
                break;
            default:
                btnName=''; 
                break;   
        }
        
        this.state = { 
            data: couponData,
            btnName:btnName,
            defaultHead:'https://zjb-test-1255741041.cos.ap-guangzhou.myqcloud.com/base/defut-head.jpg', 
            canEdit:canEdit,
            dh_select:0, //兑换选择的张数
            dh_selectText:0,//兑换选择的文本
            dh_visable:false,//兑换是否显示
            
         }; 
    }
    //点击兑换按钮显示 兑换优惠券面板
    handlerDhClick=()=>{
        this.setState({
            dh_visable:!this.state.dh_visable,
            dh_select:this.state.data.countNum,
        });
    }
    //添加兑换优惠券张数
    handlerDhAddClick=()=>{
        if(this.state.dh_select<this.state.data.countNum){
            this.setState({ 
                dh_select:this.state.dh_select+1, 
            });
        }
    }
    //减少优惠券张数
    handlerDhSubClick=()=>{
        if(this.state.dh_select>1){
            this.setState({ 
                dh_select:this.state.dh_select-1, 
            });
        }
    } 
    handlerCouponChange=(e)=>{
        let text = e.target.value;
        text = text.replace('张','');
        if(!isNaN(text)){
            text = text*1;
            if(text>0 && text<= this.state.data.countNum){
                this.setState({
                    dh_select:text
                });
            } 
        } 
    }
    render() { 
        return ( 
            <div className='cp-coupon-content'>
                <p><span className='project-title'>项目编号：</span><span className='project-no'>{this.state.data.fproject_no||''}</span></p>
                <div className={`cp-coupon ${this.state.data.fbus_type||'other'}${this.props.hasLine==='true'?'-line':''}-img`}> 
                    {/* 左*/}
                    <div className="cp-coupon-left" >
                        {/* logo */}
                        <img className="logo" src={this.state.data.flogo_pic||this.state.defaultHead}/>
                    </div>
                    {/* 中 */}
                    <div className="cp-coupon-center">
                        {/* 优惠券名称 */}
                        <span className="name">{this.state.data.fname||'优惠券名称'}</span>
                        {/* 金额 */}
                        <div className="money">
                            <div className="face-money">￥{this.state.data.ffull_sub_money||'0'}</div> 
                            {this.props.showVal==='true'?
                                <div className="face-vlaue">券额{this.state.data.ffull_sub_money||'0'}</div> :null
                            }
                        </div>
                        <ul>
                            {/* 满多少抵扣 */}
                            <li>消费满{this.state.data.ffull_sub_condition||0}元，抵扣{this.state.data.ffull_sub_money||0}元</li>
                            {/* 截止时间 */}  
                            <li>{this.state.data.fend_time?moment(this.state.data.fend_time).format('YYYY年MM月DD日'):'----年--月--日'}前使用</li> 
                            {/* 使用地点 */}
                            <li>使用地点：{this.state.data.fuser_place||'优惠券使用地址'}</li>
                        </ul> 
                    </div>
                    {/* 右 */}
                    <div className={`cp-coupon-right  ${this.state.data.fflag===5?(this.state.data.fbus_type+'-disable' || 'other-disable'):''}`}>
                        {/* 上 按钮 */}
                        { this.props.hasLine==='true'?
                        <div className={`staus-btn ${this.state.canEdit?'canClick':''}`} onClick={this.props.handlerBtnClick?this.props.handlerBtnClick.bind(this,this.state.data.fcoupon_id,this.state.data):()=>{} }>
                            {this.state.btnName}
                        </div>:null
                        } 
                        {/* 下 张数 */}
                        <span>共{this.state.data.countNum>0?this.state.data.countNum:1}张</span>
                    </div>
                </div>
                <div className='btns'>
                    {
                        this.props.giveFriend?
                        <Button onClick={this.props.handlerGiveFriedClick?this.props.handlerGiveFriedClick.bind(this,this.state.data.fid,this.state.data):()=>{alert('具体怎么做，还得商量！');}} >{this.props.giveFriend}</Button>:null
                    }
                    {
                        this.props.exchange?
                        <Button onClick={this.handlerDhClick}>{this.props.exchange}</Button>:null
                    }
                    
                </div>
                <div className={`doing-panle ${this.state.dh_visable?'':'hide'}`}>
                    <a onClick={this.handlerDhAddClick}>+</a>
                    <Input type='text'  className='coupon-num'  value={this.state.dh_select+'张'} onChange={this.handlerCouponChange}/>
                    <a onClick={this.handlerDhSubClick}>-</a>
                    <span className='money'>
                        {
                            this.props.out?'需花费券额':'券额总额'
                        } 
                        { this.state.dh_select *this.state.data.ffull_sub_money  }元</span>
                    <Button onClick={this.props.handlerExchangeClick?this.props.handlerExchangeClick.bind(this,this.state.data.fcoupon_id,this.state.dh_select,this.state.data.ffull_sub_money):()=>{alert('请绑定handlerExchangeClick回调事件');}}>兑换</Button>
                </div>
            </div>
         )
    }
}
 
export default Coupon;