import React from 'react';
import $ from 'jquery';
import './seeCoupon.scss';
export default class SeeCoupon extends React.Component {
  render(){
    return(
      <div className="see-box send-coupon-info none">
        <p className="top-bg"><span>投资人</span></p>
        <a className="close">x</a>
        <div className="coupon-nub">
          <p>优惠券编码</p>
          <p>20180618000100003</p>
        </div>
        <div className="coupon-info clearfix">
          <div className="fl">
            <p className="tit">美丽人生现金优惠券</p>
            <div>
              <p className="money">￥<span>50</span>元</p>
              <p className="ins">
                <i>使用规则：满150减50</i>
                <i>失效日期：2018-07-30</i>
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
          <p> 项目编号：<span>P18060006</span></p>
          <p> 项目名称：<span>海底捞火锅新店扩张</span></p>
        </div>
        <div className="coupon-address">
          <p className="tit">可使用地址：</p>
          <ul>
            <li>
              <span>广东省深圳市南山区沙河路XX大厦详细地址</span>
              <span>18682056589</span>
            </li>
            <li>
              <span>广东省深圳市南山区沙河路XX大厦详细地址</span>
              <span>18682056589</span>
            </li>
            <li>
              <span>广东省深圳市南山区沙河路XX大厦详细地址</span>
              <span>18682056589</span>
            </li>
          </ul>
        </div>
        <a className="btn">未使用</a>
      </div>
    )
  }
}
