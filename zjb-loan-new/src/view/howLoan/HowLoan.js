import React from 'react';
import $ from 'jquery';

import Qa from '../qestionanswer/Qa';
import { startAnimate } from './index.js';
import './index.scss';

export default class HowLoan extends React.Component {
  componentDidMount() {
    startAnimate();
  }
  componentWillUnmount() {
    $(window).off('scroll');
    $('body').off('click');
  }
	render() {
		return(
      <div  className='hl-content'>
        <div className="banner1 autosize">
          <img className="big" src={require('./img/bg0.png')} />
          <div className="w">
            <a className="btn "
               onClick={()=>{
                 $("#fix").removeClass('fix');}}>我要借款</a>
          </div>
        </div>
        {/* 借款流程 */}
        <div className="section sec-tab3">
          <div className="w center">
            <div className="tab3 center">
              <i/>
              <a href="" className="hover">申请借款流程</a>
              <i/>
              <a href="">借款适用的各种场景</a>
              <i/>
              <a href="">成功案例采访</a>
              <i/>
            </div>
          </div>
        <div className="w tab3con">
          <div className="tab3con1">
            <div className="swiper-container">
              <div className="swiper-wrapper">
                <div className="swiper-slide clearfix">
                  <div className="item" >
                    <img className="pic" src={require('./img/step1.jpg')} />
                    <p className="t1">第一步：录入借款基本项目信息</p>
                  </div>
                  <div className="item" >
                    <img className="pic" src={require('./img/step2.jpg')} />
                    <p className="t1">第二步：填写个人借款信息</p>
                  </div>
                  <div className="item" >
                    <img className="pic" src={require('./img/step3.jpg')} />
                    <p className="t1">第三步：填写企业相关资料</p>
                  </div>
                  <div className="item" >
                    <img className="pic" src={require('./img/step4.jpg')} />
                    <p className="t1">第四步：确认优惠券</p>
                  </div>
                </div>
                <div className="swiper-slide clearfix">
                  <div className="item" >
                    <img className="pic" src={require('./img/step1.jpg')} />
                    <p className="t1">第一步：录入借款基本项目信息</p>
                  </div>
                  <div className="item" >
                    <img className="pic" src={require('./img/step2.jpg')} />
                    <p className="t1">第二步：填写个人借款信息</p>
                  </div>
                  <div className="item" >
                    <img className="pic" src={require('./img/step3.jpg')} />
                    <p className="t1">第三步：填写企业相关资料</p>
                  </div>
                  <div className="item" >
                    <img className="pic" src={require('./img/step4.jpg')} />
                    <p className="t1">第四步：确认优惠券</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-pagination"/>
          </div>
        </div>
      </div>
      <div className="section sec-tabs g">
        <div className="tabs">
          <div className="w">
            <a>视频展示</a>
            <a>客户需求</a>
            <a>创造价值</a>
            <a>众借好处</a>
            <a>借款人手册</a>
          </div>
        </div>
        <div className="tabcon1">
          <div className="sec1">
            <div className="w clearfix">
              <div className="fl tright">
                <img className="pic" src={require('./img/pic4.png')} />
              </div>
              <div className="fr">
                <p className="t1">小微企业融资的挑战</p>
                <p className="t2">
                  轻资产型小微企业，因为缺乏抵押物，融资难；<br />
                  科技创新型小微企业，因为创业成果尚未转化，融资成本高；<br />
                  服务型小微企业，因为财务信息不完整，融资渠道少；<br />
                  小微企业经营性资金额度不大，但实效性要求高；<br />
                  小微企业融资覆盖率低，融资方式选择性少；<br />
                  小微企业不仅需要钱，更需要综合金融服务。
                </p>
              </div>
            </div>
          </div>
          <div className="sec2 bgw">
            <div className="w clearfix">
              <div className="fl tright">
                <p className="t1">客户拓展的挑战</p>
                <p className="t2">
                  新店开业，需要促销<br />
                  新产品、新服务推出，需要客户体验<br />
                  品牌举办营销活动，需要客户参与<br />
                  需要线上活动和促销推广<br />
                  要培养粉丝用户<br />
                  要多渠道与客户互动
                </p>
              </div>
              <div className="fr">
                <img className="pic" src={require('./img/pic3.jpg')} />
              </div>
            </div>
          </div>
        </div>
      </div>
        <div className="section sec-road autosize">
          <img className="big" src={require('./img/pic4.jpg')} />
          <div className="w"/>
        </div>
        <div className="section sec-profit1 g">
          <div className="w">
            <div className="tit">
              <i>众借的好处</i>
            </div>
            <div className="box61 box6 clearfix">
              <div className="shadow">
                <div className="pic circlechart" data-percentage="100">
                  <i className="c1"></i>
                </div>
                <p className="t1">利息低</p>
                <p className="t2">借款企业信用等级越高，<br />利息越低，最低年化利率8%</p>
              </div>
              <div className="shadow">
                <div className="pic circlechart" data-percentage="100">
                  <i className="c2"/>
                </div>
                <p className="t1">速度快</p>
                <p className="t2">48小时内审核完成<br />您的在线借款申请</p>
              </div>
              <div className="shadow">
                <div className="pic circlechart" data-percentage="100">
                  <i className="c3"/>
                </div>
                <p className="t1">申请便捷</p>
                <p className="t2">无担保无抵押<br />在线申请</p>
              </div>
              <div className="shadow">
                <div className="pic circlechart" data-percentage="100">
                  <i className="c4"/>
                </div>
                <p className="t1">拓展客户</p>
                <p className="t2">把投资人变成客户<br />把投资人变成粉丝</p>
              </div>
              <div className="shadow">
                <div className="pic circlechart" data-percentage="100">
                  <i className="c5"/>
                </div>
                <p className="t1">精准营销</p>
                <p className="t2">发放优惠券、发起活动、<br />互动交流</p>
              </div>
              <div className="shadow">
                <div className="pic circlechart" data-percentage="100">
                  <i className="c6"/>
                </div>
                <p className="t1">借款用途广</p>
                <p className="t2">流动资金，新设备，<br />新分店或任何有助于拓展业务</p>
              </div>
            </div>
          </div>
        </div>
        {/* 问答 */}
        <Qa />
			</div>
		);
	}
}
