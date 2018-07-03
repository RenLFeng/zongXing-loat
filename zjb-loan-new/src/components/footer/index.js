import React from 'react';
import $ from 'jquery';
import {Link,Switch,Route} from 'dva/router';

export default class Footer extends React.Component {
  componentDidMount() {
    $('.fl ul li a').on('click', ()=>{
      console.log(123);
      $(window).scrollTop(0);
    })
  }

  componentWillUnmount() {
    $('.fl ul li a').off('click');
  }

  render() {
    return (
      <div className="footer">
        <div className="w">
          <div className="sec1 clearfix">
            <div className="fl col1">
              <div>
                <a href="/" className="logo">
                  <img src={require('../../assets/img/logo2.png')} />
                </a>
              </div>
              <div style={{marginTop:60,marginLeft:4}}>
                <a className="ic ic_wx"/>
                <a className="ic ic_weibo"/>
                <a className="ic ic_print"/>
              </div>
            </div>
            <div className="fl col2">
              <p className="hd"/>
              <ul>
                <li className="tit"><Link  to={`/infor/organizationInformation`}>信息披露</Link></li>
                <li><Link  to={`/infor/recordInformation`}>备案信息</Link></li>
                <li><Link  to={`/infor/organizationInformation`}>组织信息</Link></li>
                <li><Link  to={`/infor/auditInformation`}>审核信息</Link></li>
                <li><Link  to={`/infor/businessInformation`}>经营信息</Link></li>
                <li><Link  to={`/infor/projectInformation`}>项目信息</Link></li>
              </ul>
              <ul>
                <li className="tit"><Link  to={`/infor/auditInformation`}>法律法务</Link></li>
                <li><Link  to={`/infor/platformNotice`}>法律法规</Link></li>
                <li><Link  to={`/infor/platformNotice`}>法务支持</Link></li>
                <li><Link  to={`/infor/platformNotice`}>风险控制</Link></li>
                <li><Link  to={`/infor/platformNotice`}>安全保障</Link></li>
                <li><Link  to={`/infor/platformNotice`}>服务条款</Link></li>
              </ul>
              <ul>
                <li className="tit"><Link  to={`/infor/platformNotice`}>关于我们</Link></li>
                <li><Link  to={`/infor/platformNotice`}>公司介绍</Link></li>
                <li><Link  to={`/infor/newsReports`}>管理团队</Link></li>
                <li><Link  to={`/infor/legalDeclaration`}>企业愿景</Link></li>
                <li><Link  to={`/infor/legalDeclaration`}>服务理念</Link></li>
                <li><Link  to={`/infor/legalDeclaration`}>联系我们</Link></li>
              </ul>
              <ul>
                <li className="tit"><Link  to={`/infor/platformNotice`}>合作伙伴</Link></li>
                <li><Link  to={`/infor/platformNotice`}>技术合作</Link></li>
                <li><Link  to={`/infor/newsReports`}>风控合作</Link></li>
                <li><Link  to={`/infor/legalDeclaration`}>法务合作</Link></li>
                <li><Link  to={`/infor/legalDeclaration`}>安全合作</Link></li>
                <li><Link  to={`/infor/legalDeclaration`}>媒体合作</Link></li>
              </ul>
            </div>
            <div className="fr col3">
              <div className="wxcode">
                <img src={require('../../assets/img/wx_code.png')} />
                <p className="center f14">微信公众号</p>
              </div>
            </div>
          </div>
        </div>
        <div className="line"/>
        <div className="w sec2">
          <p className="center f14 c6">版权所有&copy;深圳众鑫互联网金融服务有限公司 crowdlendingchina.com 保留所有权利。</p>
        </div>
      </div>
    );
  }
}
