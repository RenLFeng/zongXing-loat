import React from 'react';
import LeftMenu from '../../components/leftmenu/leftMenu';
import {Button} from 'antd';
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
                    <div style={{float:'right',color:'#ff3b35',marginTop:10}}><i className="zjb zjb-jinggao1" style={{width:23,height:23}}></i>逾期处罚措施</div>
                </div>

                <div className="fr uc-rbody S" style={{marginTop:10}}>
                   <div className="project">
                     <p><span style={{color:'#666666'}}>项目编号：</span>P124578</p>
                     <p style={{marginTop:8}}><span style={{color:'#666666'}}>项目名称：</span>海底捞火锅新店扩张</p>
                     <div className="number">
                       <div className="money">
                         <p className="num">10.00</p>
                         <p className="word">借款金额（万元）</p>
                       </div>
                       <div className="money">
                         <p className="num">12<span style={{fontSize:14,fontWeight:'normal'}}>个月</span></p>
                         <p className="word">借款期数</p>
                       </div>
                       <div className="money">
                         <p className="num">9<span style={{fontSize:14,fontWeight:'normal'}}>%</span></p>
                         <p className="word">借款利率（年化）</p>
                       </div>
                     </div>
                     <div style={{textAlign:"center"}}>
                        <Button className="button">提前还款</Button>
                        <p style={{paddingBottom:26,color:'#999999'}}>待还款总额：<span style={{color:'#f29827'}}>￥123456.12</span></p>
                     </div>
                   </div>

                   <div>
                       <p style={{color:"#999999",marginTop:18}}><span>计划还款时间</span><span style={{float:"right"}}>实际还款时间</span></p>
                        <div className="repay_"> 
                            <span className="time">2018/07/21</span> 
                            <span className="btns_">已还款</span>
                            <div className="data">
                                20/16期
                                <span style={{ margin: '0 5px 0 8px'}}>|</span>
                                <span style={{color:'#f29827'}}> ￥26.25</span>    
                            </div>
                            <span style={{marginLeft:55}}>本金：<span style={{width:80,display:'inline-block'}}>25</span></span>
                            <span >利息：<span style={{width:80,display:'inline-block'}}>2.5</span></span>
                            <span className="times">2018/7/6 10:50</span>
                        </div>
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
                        <p className="info_" style={{marginTop:30}}>
                            <span className="date">2018/7/6 19:14</span>
                            <span style={{marginLeft:20}}>本笔还款已逾期<span style={{color:'#ff3b35'}}>{1}天</span>，逾期费用<span style={{color:'#ff3b35'}}>{10}元</span>，为了不影响您的征信，请及时还款(只显示最新一条结果)</span>
                        </p>
                        <p className="info_" style={{marginTop:6}}>
                            <span style={{marginLeft:147}}>本笔还款已逾期<span style={{color:'#ff3b35'}}>{1}天</span>，逾期费用<span style={{color:'#ff3b35'}}>{10}元</span>，为了不影响您的征信，请及时还款(只显示最新一条结果)</span>
                        </p>
                        <div style={{float:'right',color:'#ff3b35',marginTop:10}}><i className="zjb zjb-jinggao1" style={{width:23,height:23}}></i>逾期处罚措施</div>

                        <div className="repay_" style={{marginTop:40}}> 
                            <span className="time">2018/07/21</span> 
                            <span className="btns">待还款</span>
                            <div className="data">
                                20/16期
                                <span style={{ margin: '0 5px 0 8px'}}>|</span>
                                <span style={{color:'#f29827'}}> ￥26.25</span>    
                            </div>
                            <span style={{marginLeft:55}}>本金：<span style={{width:80,display:'inline-block'}}>25</span></span>
                            <span >利息：<span style={{width:80,display:'inline-block'}}>2.5</span></span>
                         
                        </div>
                        <div className="repay_" style={{marginTop:8}}> 
                            <span className="time">2018/07/21</span> 
                            <span className="btns">待还款</span>
                            <div className="data">
                                20/16期
                                <span style={{ margin: '0 5px 0 8px'}}>|</span>
                                <span style={{color:'#f29827'}}> ￥26.25</span>    
                            </div>
                            <span style={{marginLeft:55}}>本金：<span style={{width:80,display:'inline-block'}}>25</span></span>
                            <span >利息：<span style={{width:80,display:'inline-block'}}>2.5</span></span>   
                        </div>
                        <div className="repay_" style={{marginTop:8}}> 
                            <span className="time">2018/07/21</span> 
                            <span className="btns">待还款</span>
                            <div className="data">
                                20/16期
                                <span style={{ margin: '0 5px 0 8px'}}>|</span>
                                <span style={{color:'#f29827'}}> ￥26.25</span>    
                            </div>
                            <span style={{marginLeft:55}}>本金：<span style={{width:80,display:'inline-block'}}>25</span></span>
                            <span >利息：<span style={{width:80,display:'inline-block'}}>2.5</span></span>   
                        </div>
                        <div className="repay_" style={{marginTop:8}}> 
                            <span className="time">2018/07/21</span> 
                            <span className="btns">待还款</span>
                            <div className="data">
                                20/16期
                                <span style={{ margin: '0 5px 0 8px'}}>|</span>
                                <span style={{color:'#f29827'}}> ￥26.25</span>    
                            </div>
                            <span style={{marginLeft:55}}>本金：<span style={{width:80,display:'inline-block'}}>25</span></span>
                            <span >利息：<span style={{width:80,display:'inline-block'}}>2.5</span></span>   
                        </div>
                        <div className="repay_" style={{marginTop:8}}> 
                            <span className="time">2018/07/21</span> 
                            <span className="btns">待还款</span>
                            <div className="data">
                                20/16期
                                <span style={{ margin: '0 5px 0 8px'}}>|</span>
                                <span style={{color:'#f29827'}}> ￥26.25</span>    
                            </div>
                            <span style={{marginLeft:55}}>本金：<span style={{width:80,display:'inline-block'}}>25</span></span>
                            <span >利息：<span style={{width:80,display:'inline-block'}}>2.5</span></span>   
                        </div>
                   </div>
                </div>

            </div>
        )
    }
}