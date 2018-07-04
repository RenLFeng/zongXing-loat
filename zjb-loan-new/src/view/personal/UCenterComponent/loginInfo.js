import React from 'react';
import { connect } from 'dva';
import { Button, Divider } from 'antd';
import '../../assets/login/login.scss';
import { ACCOUNT_RECHARGE, ACCOUNT_WITHDRAWALS } from '../../common/pagePath';
import { getSiteNotice } from '../../services/api';
import Path from '../../common/pagePath';
import moment from 'moment';
import { setInterval, setTimeout } from 'timers';
import { Link } from 'dva/router';
import { IMG_BASE_URL } from '../../common/systemParam';

@connect((state) => ({
    nickName: state.login.nickName,
    baseData: state.login.baseData,
    status: state.login.status,
}))
class LoginInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageCurrent: 1,
            pageSize: 10,
            dataInfo: [],
            x: '',
            y: '',
            h: '',
            hh: ''
        };
        this.x = '';
        this.x='',
        this.y= '',
        this.h= '',
        this.hh= '';

    }

    componentDidMount() {
        this.getNotice();
        
    }

    init() {     
        this.x=$('#news_li'),
        this.y=$('#swap'),
        this.h= $('#news_li li').length * 20,
        this.hh= $('#news_li li').length
        this.start.call(this);      
    }
    start() {
        let y_ = this.y;
        let x_ = this.x;
        let h_ = this.h;
        let _this = this;
        let t = parseInt(x_.css('top'));
        if (t !== t) t = 0;

        y_.css('top', '20px');

        x_.animate({ top: t - 20 + 'px' }, 'slow'); //20为每个li的高度
        if (Math.abs(t) == h_ - 20) { //20为每个li的高度
            y_.animate({ top: '0px' }, 'slow');  
            let z = x_;
            x_ = y_;
            y_ = z;
            this.x = x_;
            this.y = y_;         
        }
        setTimeout(() => this.start.call(this), 3000); //滚动间隔时间 现在是3秒
    }


    async getNotice() {
        const response = await getSiteNotice(this.state.pageCurrent, this.state.pageSize);
        if (response.code === 0) {
            this.setState({
                dataInfo: response.data.notices,
            },()=>{
                this.init.call(this);
            })
        } else {
            response.msg && message.error(response.msg)
        }
    }

    render() {
        const { baseData } = this.props;
        console.log(baseData);
        return (
            <div className='lg-login'>
                {
                    this.props.status ?
                        <div className="w" >
                            <div className="uc-tbody clearfix" style={{ height: 90, boxShadow: '1px 1px 16px rgba(0, 0, 0, 0.2)', padding: '20px 15px' }}>
                                {/* 用户头像 */}
                                <a className="fl">
                                    <img className="av" src={this.props.baseData.headPic?`${IMG_BASE_URL}${this.props.baseData.headPic}`:require('../../assets/img/ucenter/av1.png')} />
                                </a>
                                {/* 用户信息 */}
                                <div className="fl">
                                    {/* 用户名 */}
                                    <p className="t1">
                                        {/* <span>{this.props.nickName}</span> */}
                                        {/* <span className="split">|</span> */}
                                        {this.props.baseData.mobile}
                                        <a onClick={() => this.props.dispatch({ type: 'login/logout' })}>退出登录</a>
                                    </p>
                                    <p className="uinfo" style={{ position: 'relative' }}>
                                     
                                        <span className="nickname">{baseData.realName ? baseData.realName : '未认证'}</span>
                                        <span className="split">|</span>

                                        <i title="绑定手机号" className={`zjb zjb-shouji-copy ${baseData.userSecurityCenter.fMobileBinding ? 'active' : ''}`}></i>
                                        {
                                            baseData.userSecurityCenter.fCertification ? 
                                            <i title="身份证认证" className="zjb zjb-moban active"></i>:
                                            <i title="身份证认证" className="zjb zjb-moban" onClick={()=>{this.props.history.push(Path.REALNAME_AUTHENTICATION)}}></i>
                                        }
                                        {
                                            baseData.userSecurityCenter.fBankCardBinding ?  
                                            <i title="银行卡绑定" className="zjb zjb-icon active"></i> :
                                            <i title="银行卡绑定" className="zjb zjb-icon " onClick={()=>{this.props.history.push(Path.BINDCARD)}}></i> 
                                        }
                                         
                                    </p>
                                </div>
                                <div className="fr">
                                    <div className="account-content">
                                        <p>待领取代金券</p>
                                        <p className="account-money">{baseData.countCoupon || '0'}张</p>
                                    </div >
                                    <i></i>
                                    <div className="account-content">
                                        <p>券额</p>
                                        <p className="account-money">￥{`${baseData.sumCoupon || 0}`.fm()}</p>
                                    </div>
                                    <i></i>
                                    <div className="account-content" style={{ borderRight: '0px' }}>
                                        <p>可用资金余额</p>
                                        <p className="account-money">￥{`${baseData.balance || 0}`.fm()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="uc-message" >
                                <div id="box">
                                    <div id="t_news">
                                         <span id="b">系统消息：</span> 
                                         {
                                             this.state.dataInfo.length > 1  ?
                                             <div>
                                                    <ul id="news_li">
                                                    {
                                                        this.state.dataInfo.map((data,index)=>{
                                                            return(
                                                                <li key={index} >【{moment(data.fpublishTime).format('M-D')}】<Link to={Path.SITE_NOTICE} style={{color:'#7D7D7D'}}>{data.ftitle} &gt; </Link></li>
                                                            )      
                                                        })
                                                    }
                                                    </ul>
                                                    <ul id="swap" >
                                                    {
                                                        this.state.dataInfo.map((data,index)=>{
                                                            return(
                                                                <li key={index} >【{moment(data.fpublishTime).format('M-D')}】<Link to={Path.SITE_NOTICE} style={{color:'#7D7D7D'}}>{data.ftitle} &gt; </Link></li>
                                                            )      
                                                        })
                                                    }
                                                    </ul>
                                             </div> :
                                                <li >【{moment(this.state.dataInfo.fpublishTime).format('M-D')}】<Link to={Path.SITE_NOTICE} style={{color:'#7D7D7D'}}>{this.state.dataInfo.ftitle} &gt; </Link></li>
                                         } 
                                    </div>
                                </div>
                                {baseData.userSecurityCenter.fThirdAccount ?

                                    <Button className="buttonl" style={{ width: '64px', height: '34px' }} onClick={() => this.props.history.push(ACCOUNT_WITHDRAWALS)}>提现</Button> : null
                                }
                                {baseData.userSecurityCenter.fThirdAccount ?

                                    <Button type="primary" className="buttonl" style={{ width: '64px', height: '34px' }} onClick={() => this.props.history.push(ACCOUNT_RECHARGE)}>充值</Button> : null
                                }
                            </div>
                        </div> : ''
                }
            </div>

        )
    }
}

export default LoginInfo;