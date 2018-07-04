import React from 'react';
import LeftMenu from '../../components/UCenterComponent/leftMenu';
import '../../assets/ucenter/mycoupon.scss';
import Coupon from '../common/Coupon';
import CouponDetail from '../common/CouponDetail';
import {CouponService} from '../../services/api2';
import {getLoginData} from  '../../services/api.js'; 
import { Pagination,message} from 'antd';
import { connect } from 'dva';
import Sideslip from '../Sideslip/Sideslip';

@connect((state)=>({ 
  })) 
export default class  MyCoupon extends React.Component {
    // "flag":1,   状态    0：待生效   1.待领取， 2：正常  3:兑换券  4：过期  5.已使用 
    constructor(props){
        super(props); 
        this.state = {
            loading:true,
            activeFlag:1, 
            activemoney:0,//激活状态下的优惠券总额
            currPage:1,
            pageSize:6,
            totalNum:0,
            lables:[
                {flag:1,lable:'待领取',val:0},
                {flag:2,lable:'待消费',val:0},
                {flag:3,lable:'兑换券',val:0},
                {flag:4,lable:'已使用',val:0},
                {flag:5,lable:'已失效',val:0},
            ], 
            flagCount:0,
            couponCount:{ 
                allmoney: 0 , //总额度
                canConvert: 0,// 可兑换额度
            },
            data:[], 
            fid:'',
        }
    }
    componentWillMount(){
        this.getSlelectLable();
    }
    async reashLoginData(){
        const response = await getLoginData(); 
        if (response.code === 0) {
            this.props.dispatch({type: 'login/saveLoadingDataAfter', response: response.data})
        }
    }
    //获取顶部查询列表
    async getSlelectLable(){ 
        //获取顶部标题数量
        let rest = await CouponService.getCouponCount();
        if(rest.code===0){  
            let temp = this.state.lables; 
            let  haveDataFlag = 0; 
            if(rest.data.flagCount && rest.data.flagCount.length>0){
                rest.data.flagCount.map(item=>{
                    if(item.flag>0){ //待生效不显示
                        item.flag = item.flag-1; 
                    }
                    temp[item.flag].val = item.count; 
                    if(haveDataFlag==0 && item.count!=0){
                        haveDataFlag = item.flag;
                    }
                });
            } 
            this.setState({
                couponCount:rest.data.couponCount,
                lables:temp,
                activeFlag:haveDataFlag,
            },()=>{ 
                //获取我的优惠券
                this.getCoupon();
            });
        }
    }
    /**
     * 获取我的优惠券
     * @param {*} flag 
     */
    async getCoupon(){ 
        var param={ 
            flag:this.state.activeFlag,  
            pageParam:{
                pageCurrent:this.state.currPage,//当前页数
                pageSize:this.state.pageSize,//每页条数
            }
        }; 
        let rest = await CouponService.getCoupon(param);
        if(rest.code===0){  
            //设置总页数
            this.setState({
                totalNum:rest.data.totalNum,
                data:rest.data.list,
                activemoney:rest.data.money,
            }); 
        }
    }
    //点击顶部标题
    handlerLableClick(flag){  
        this.setState({ 
            activeFlag:flag, 
            currPage:1,//设置为第一页
        },()=>{
            //获取我的优惠券
            this.getCoupon();
        });  
    }
    handlerPageChange=(page)=>{
        this.setState({  
            currPage:page,//设置为第一页
        },()=>{
            //获取我的优惠券
            this.getCoupon();
        });  
    }
    //点击领取
    handlerLingquClick =async (fcoupon_id)=>{
        let rest = await CouponService.receiveCoupon({
            couponId :fcoupon_id
        }); 
        if(rest.code===0){
            message.info(rest.msg);
            this.getSlelectLable();
        }else{
            rest.msg && message.error(rest.msg);
        }
    }
    //去使用
    handlerShiyongClick=(fcoupon_id,data)=>{ 
        this.setState({
            fid:data.fid
        },()=>{ 
            this.sideslip.showModal();
        }); 
    }
    //点击兑换
    handlerExchangeClick=async (couponId,pieces)=>{ 
        let rest = await CouponService.convertCoupon({
            couponId :couponId,
            pieces:pieces,
        });  
        if(rest.code===0){
            message.info(rest.msg);
            this.getSlelectLable();
            this.reashLoginData();
        }else{
            rest.msg && message.error(rest.msg);
        }
    } 
    render() { 
        return (
            <div>
                <LeftMenu  param={this.props} />
                <div  className="fr mycoupon">
                    <div className='top-content'>
                        <p className='top-title'>我的优惠券 </p>
                        <ul className='search-tag'>
                            {
                                this.state.lables.map((item,index)=>{
                                    return  <li key={index} onClick={this.handlerLableClick.bind(this,item.flag)} className={this.state.activeFlag===item.flag?'active':''}>{item.lable}({item.val})</li>;
                                })
                            }
                        </ul> 
                    </div>
                    {
                         this.state.data.length >0 ?<p className='sub-text'> 
                            <span>优惠券总额度 </span>
                            <span className='val'>{String(this.state.activemoney).fm()}元</span> 
                        </p>:null
                    }
                    
                    <div className='coupon-list'>
                        {
                            this.state.data.length===0?<div className='not-found'>暂无优惠券</div>:null
                        }
                        {
                            this.state.data.map((item,index)=>{ 
                                if(item.fflag==1){
                                    return <div  key={item.fid}>  <Coupon  data={item} showVal='true'  hasLine='true' handlerBtnClick={this.handlerLingquClick} ></Coupon> </div>
                                }else if(item.fflag==2){
                                    return <div  key={item.fid}>  <Coupon  data={item}   showVal='true'  hasLine='true' handlerBtnClick={this.handlerShiyongClick} giveFriend='赠送好友' exchange='兑换券额' handlerExchangeClick={this.handlerExchangeClick}></Coupon> </div>  
                                }else if(item.fflag==3){
                                    return <div  key={item.fid}>  <Coupon  data={item} showVal='true'  hasLine='true' handlerBtnClick={this.handlerShiyongClick} giveFriend='赠送好友'></Coupon> </div>  
                                }else{
                                    return <div  key={item.fid}>  <Coupon  data={item}   showVal='true'  hasLine='true'></Coupon> </div>
                                } 
                            })
                        }  
                        {
                            Math.ceil(this.state.totalNum/this.state.pageSize)>1?<div className='coupon-paging'>
                                    <Pagination   current={this.state.currPage} pageSize={this.state.pageSize} onChange={this.handlerPageChange} total={this.state.totalNum} />
                                </div>:null
                        } 
                    </div>  
                </div>
                <div className='slip_model'> 
                    <Sideslip ref={ref=>this.sideslip = ref}> 
                        <CouponDetail fid={this.state.fid}/> 
                    </Sideslip>
                </div>
            </div>
        )
    }
} 