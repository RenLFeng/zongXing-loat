import React from 'react';
import LeftMenu from '../../components/leftmenu/leftMenu';
import './repayment.scss';

export default class Repayment extends React.Component {
    render(){
        return(
            <div>
                <LeftMenu param={this.props} />
                <div className="fr uc-rbody F">
                    <div className="real_title">
                        <span className="safeCenter_">还款计划</span>
                    </div>
                    <p>近期应还</p>
                    <div className="repay"> 
                         <span className="time">2018/07/21</span> 
                         <span className="btns">待还款</span>
                         <div className="data">
                             20/16期
                             <span style={{ margin: '0 5px 0 8px'}}>|</span>
                             <span style={{color:'#f29827'}}> ￥26.25</span>    
                         </div>
                         <span style={{marginLeft:55}}>本金：<span style={{width:80,display:'inline-block'}}>25</span></span>
                         <span >利息：<span style={{width:80,display:'inline-block'}}>2.5</span></span>
                         <span style={{color:'#ff3b35'}}>逾期费：<span style={{width:80,display:'inline-block'}}>50</span></span>
                         <span className="a">手动还款</span>
                    </div>
                    <p className="info" style={{marginTop:30}}>
                        <span className="date">2018/7/6 19:14</span>
                        <span style={{marginLeft:40}}>本笔还款已逾期<span style={{color:'#ff3b35'}}>{1}天</span>，逾期费用<span style={{color:'#ff3b35'}}>{10}元</span>，为了不影响您的征信，请及时还款(只显示最新一条结果)</span>
                    </p>
                    <p className="info" style={{marginTop:6}}>
                        <span className="date">2018/7/6 19:14</span>
                        <span style={{marginLeft:40}}>本笔还款<span style={{color:'#ff3b35'}}>已逾期</span>，为了不影响您的征信，请及时通过手动还款(只显示最新一条结果)</span>
                    </p>
                    <p className="info" style={{marginTop:6}}>
                        <span className="date">2018/7/6 19:14</span>
                        <span style={{marginLeft:40}}>本笔<span style={{color:'#ff3b35',marginRight:5}}>扣款失败</span>原因：账户余额不足，为了不影响您的征信，请及时通过手动还款(只显示最新一条结果)</span>
                    </p>
                    <div style={{float:'right',color:'#ff3b35'}}><i className="zjb zjb-jinggao1" style={{width:23,height:23}}></i>逾期处罚措施</div>
                </div>

                <div className="fr uc-rbody S" style={{marginTop:10}}>
                   <div className="project">
                     <p></p>
                     <p></p>
                   </div>
                </div>

            </div>
        )
    }
}