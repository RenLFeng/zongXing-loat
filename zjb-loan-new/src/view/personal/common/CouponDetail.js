
import React from 'react';
import CouponSmall from './CouponSmall';
import {CouponService} from '../../services/api2';
import {message} from 'antd';
import './coupondetail.scss';

export default class  CouponDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            fid:props.fid,
            data:{
                couponUsePlaces:[],
            },
            detail:{
                fflag:2,
                fname:null,
                ffull_sub_money:0,
                ffull_sub_condition:0,
                fend_time:null,
                flogo_pic:'',
                countNum:0,
            },
         } 
    }
    componentDidMount(){
        if(this.props.fid){
            this.getCouponDetail();
        }
    }
    componentWillReceiveProps(props){   
        if (this.props.fid !== props.fid) {
            this.setState({
                fid:props.fid,
            },()=>{
                this.getCouponDetail();
            }); 
        }
       
    } 
    
    //获取详细信息
    async getCouponDetail(){
        if(this.state.fid == ''){
            return ;
        }     
        const rest = await CouponService.myCouponDetail({
            couponUserId:this.state.fid,
        }); 
        if(rest.code===0){ 
            //小优惠券的样式
            let detail = {
                fflag:2,
                fname:null,
                ffull_sub_money:0,
                ffull_sub_condition:0,
                fend_time:null,
                flogo_pic:'',
                countNum:0,
            };
            detail.fflag =rest.data.couponState;
            detail.fname =rest.data.couponName;
            detail.ffull_sub_money =rest.data.fullSubMoney;
            detail.ffull_sub_condition =rest.data.fullSubCondition;
            detail.fend_time =rest.data.endTime;
            detail.flogo_pic=rest.data.logo;
            detail.countNum =rest.data.couponState;  
 
            this.setState({
                detail:detail,
                data:rest.data,
            },() =>{ 
                $("#qrcodeCanvas").qrcode({
                    render : "canvas",    //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
                    text : '请采用商家小程序扫描二维码',    //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
                    width : "160",               //二维码的宽度
                    height : "160",              //二维码的高度
                    background : "#fff",       //二维码的后景色
                    foreground : "#000",        //二维码的前景色
                    src: rest.data.flogo_pic||'',//二维码中间的图片
                });
            });
        }  
    }
 
    render() { 
        return ( 
            <div className='cd-content'>
                 <img className="logo" src={require('../../assets/img/subSite/logo2.png')}/>
                <p className='text1'>{this.state.data.couponName||'优惠券名称'}</p> 
                <p className='text2'>当前代金券编码</p> 
                <p className='text3'>{this.state.data.couponCode||'优惠券编码'}</p> 
                <div className='qr-code'>
                    <div id="qrcodeCanvas"></div>
                </div>
                <p className='text3'>{this.state.data.companyName}</p>
                <div className='little-coupon'>
                    <CouponSmall data={this.state.detail} onlyOne={true}></CouponSmall> 
                </div>
                <p className='text4'>代金券使用地址：</p>
                <div className='cd-address'>
                   {
                       this.state.data.couponUsePlaces.map((item,index)=>{
                        return  <div className='cd-item' key={index}>
                                    <div className='c1'>
                                        <i className='zjb zjb-address'></i>
                                    </div> 
                                    <span>{item.address}</span> 
                                </div> 
                       })
                   }
                </div> 
            </div>
        )
    }
}
  

