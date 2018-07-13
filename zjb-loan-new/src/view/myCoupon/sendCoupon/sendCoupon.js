import React from 'react';
import './sendCoupon.scss';
import Coupon from './couPon.js';
import CouponSmall from '../../personal/mineLoan/mineLoanComm/sendCoupon.js';
export default class SendCoupon extends React.Component {
  render(){
    return(
      <div className="send-coupon none">
        <a className="close">x</a>
        <p className="tit">发优惠券</p>
        <div className="content-info">
          <div className="tit">
            <p>项目编号:<span>P18060006</span></p>
            <p>项目名称<span>海底捞火锅新店扩张</span></p>
          </div>
          <table border="1">
            <tr>
              <td>借款金额 </td>
              <td>借款期数</td>
              <td>借款利率</td>
              <td>创建时间</td>
              <td>状态</td>
            </tr>
            <tr>
              <td>10.00万元</td>
              <td>12个月</td>
              <td>9%</td>
              <td>2018-06-28 17:36</td>
              <td className="state">还款中</td>
            </tr>
          </table>
          <Coupon />
        </div>
        <p className="btns">
          <a className="hold">保存</a><a className="sub">提交</a>
        </p>
      </div>
    )
  }
}
