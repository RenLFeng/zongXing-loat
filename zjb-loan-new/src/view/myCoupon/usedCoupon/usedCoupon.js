
import React from 'react';
import $ from 'jquery';
import './usedCoupon.scss';
import moment from 'moment';
import {IMG_BASE_URL} from '../../../common/SystemParam'

export default class UsedCoupon extends React.Component {
  render(){
    const {couponInfo} = this.props;
    let place = couponInfo.couponUsePlaces;
    return(
        <div className="used">
           <div className="see-box send-coupon-info">
                <p className="top-bg"><span>投资人</span></p>
                <a className="close" onClick={()=>{this.props.close('used')}}>x</a>
                <div className="coupon-nub">
                <p>优惠券编码</p>
                <p>{couponInfo.couponCode}</p>
                </div>
                <div className="coupon-info clearfix">
                <div className="fl">
                    <p className="tit">{couponInfo.couponName}</p>
                    <div>
                    <p className="money">￥<span>{couponInfo.fullSubMoney}</span>元</p>
                    <p className="ins">
                        <i>使用规则：满{couponInfo.fullSubCondition}减{couponInfo.fullSubMoney}</i>
                        <i>失效日期：{moment(couponInfo.endTime).format('YYYY-MM-DD')}</i>
                    </p>
                    </div>
                </div>
                <div className="fr clearfix">
                    <div className="">
                    <img  className="" src={IMG_BASE_URL+couponInfo.logo} style={{width:'70px',height:'70px'}}/>
                    </div>
                </div>
                </div>
                <div className="coupon-name">
                <p> 项目编号：<span>{couponInfo.projectNo}</span></p>
                <p> 项目名称：<span>{couponInfo.projectName}</span></p>
                </div>
                <div className="coupon-address">
                <p className="tit">可使用地址：</p>
                <ul>
                    {
                    place  ?
                        place.map((data,index)=>{
                            return(
                            <li key={index}>
                                <p>{data.address}</p>
                                <p>{data.fmobile}</p>
                            </li> 
                            )
                        }) : null
                    }
                </ul>
                </div>
                <p>失效日期：</p>
                <p style={{fontSize:24}}>{moment(couponInfo.endTime).format('YYYY-MM-DD HH:mm:ss')}</p>
                <p className="btns">
                    <span>已流标</span>
                    <span>/</span>
                    <span>已过期</span>
                </p>
                {/* <a className="btn">未使用</a> */}
            </div>
        </div>
      
    )
  }
}
