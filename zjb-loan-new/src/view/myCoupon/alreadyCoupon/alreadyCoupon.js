
import React from 'react';
import $ from 'jquery';
import './alreadyCoupon.scss';
import moment from 'moment';

export default class AlreadyCoupon extends React.Component {
  render(){
    const {couponInfo} = this.props;
    console.log('优惠券详情',couponInfo)
    // let place = couponInfo.couponUsePlaces;
    // console.log('palce',place)
    return(
        <div className="already">
           <div className="see-box send-coupon-info">
                <p className="top-bg"><span>投资人</span></p>
                <a className="close" onClick={()=>{this.props.close('alreadyUse')}}>x</a>
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
                    <img  className="" src={require('../../../assets/img/logo-small.png')} />
                    </div>
                </div>
                </div>
                <div className="coupon-name">
                <p> 项目编号：<span>{couponInfo.projectNo}</span></p>
                <p> 项目名称：<span>{couponInfo.projectName}</span></p>
                </div>
                {/* <div className="coupon-address">
                <p className="tit">可使用地址：</p>
                <ul>
                    {
                    place  ?
                        place.map((data,index)=>{
                            return(
                            <li key={index}>
                                <span>{data.address}</span>
                                <span>{data.fmobile}</span>
                            </li> 
                            )
                        }) : null
                    }
                </ul>
                </div> */}
                <p style={{color:'#f29827'}}>使用日期：</p>
                <p style={{fontSize:24,color:'#f29827'}}>{moment(couponInfo.fconsume_time).format('YYYY-MM-DD HH:mm:ss')}</p>
                <a className="btn">已使用</a>
            </div>
        </div>
     
    )
  }
}
