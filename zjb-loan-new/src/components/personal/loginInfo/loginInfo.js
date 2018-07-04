import React from 'react';
import $ from 'jquery';
import {connect} from 'dva';
import {Button, message} from 'antd';
import './loginInfo.scss';
import Path from '../../../common/PagePath';
import {personal} from '../../../services/api'; 
import moment from 'moment';
import { setInterval, setTimeout } from 'timers';

@connect((state) => ({
    nickName: state.login.nickName,
    baseData: state.login.baseData,
    status: state.login.status,
}))
class LoginInfo extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
          pageCurrent:1,
          pageSize:10,
          dataInfo:[]
        }
    }  
 
    componentDidMount(){
        this.getNotice();
    }

    componentDidUpdate() {
       
        $.fn.kxbdMarquee=function(options){
            var opts=$.extend({},$.fn.kxbdMarquee.defaults, options);
            return this.each(function(){
                var $marquee=$(this);				//滚动元素容器
                var _scrollObj=$marquee.get(0);		//滚动元素容器DOM
                var scrollW=$marquee.width();		//滚动元素容器的宽度
                var scrollH=$marquee.height();		//滚动元素容器的高度
                var $element=$marquee.children();	//滚动元素
                var $kids=$element.children();		//滚动子元素
                var scrollSize=0;					//滚动元素尺寸
     
                //滚动类型，1左右，0上下
                var _type=(opts.direction=="left"||opts.direction=="right") ? 1:0;
    
                //防止滚动子元素比滚动元素宽而取不到实际滚动子元素宽度
                $element.css(_type?"width":"height",10000);
    
                //获取滚动元素的尺寸
                if(opts.isEqual){
                    scrollSize=$kids[_type?"outerWidth":"outerHeight"]()*$kids.length;
                }else{
                    $kids.each(function(){
                        scrollSize+=$(this)[_type?"outerWidth":"outerHeight"]();
                    });
                };
    
                //滚动元素总尺寸小于容器尺寸，不滚动
                if(scrollSize<(_type?scrollW:scrollH)){return;}; 
    
                //克隆滚动子元素将其插入到滚动元素后，并设定滚动元素宽度
                $element.append($kids.clone()).css(_type?"width":"height",scrollSize*2);
    
                var numMoved=0;
                function scrollFunc(){
                    var _dir=(opts.direction=="left"||opts.direction=="right") ? "scrollLeft":"scrollTop";
                    if (opts.loop>0) {
                        numMoved+=opts.scrollAmount;
                        if(numMoved>scrollSize*opts.loop){
                            _scrollObj[_dir]=0;
                            return clearInterval(moveId);
                        };
                    };
    
                    if(opts.direction=="left"||opts.direction=="up"){
                        var newPos=_scrollObj[_dir]+opts.scrollAmount;
                        if(newPos>=scrollSize){
                            newPos-=scrollSize;
                        }
                        _scrollObj[_dir]=newPos;
                    }else{
                        var newPos=_scrollObj[_dir]-opts.scrollAmount;
                        if(newPos<=0){
                            newPos += scrollSize;
                        };
                        _scrollObj[_dir]=newPos;
                    };
                };
    
                //滚动开始
                var moveId=setInterval(scrollFunc, opts.scrollDelay);
    
                //鼠标划过停止滚动
                $marquee.hover(function(){
                    clearInterval(moveId);
                },function(){
                    clearInterval(moveId);
                    moveId=setInterval(scrollFunc, opts.scrollDelay);
                });
            });
        };
    
        $.fn.kxbdMarquee.defaults={
            isEqual:false,		//所有滚动的元素长宽是否相等,true,false
            loop: 0,			//循环滚动次数，0时无限
            direction: "up",	//滚动方向，"left","right","up","down"
            scrollAmount:1,		//步长
            scrollDelay:100		//时长
    
        };
    
        $.fn.kxbdMarquee.setDefaults=function(settings) {
            $.extend( $.fn.kxbdMarquee.defaults, settings );
        };

        $("#marquee4").kxbdMarquee();
    

    }
    async getNotice(){
        let data = {
            pageIndex: this.state.pageCurrent,
            pageSize: this.state.pageSize
        }
        const response = await personal.getSiteNotice(data);
        if(response.code === 0){
            this.setState({
                dataInfo:response.data.notices,
            })
        } else{
            response.msg && message.error( response.msg)
        }
    }

    render() { 
        const {baseData} = this.props
        return ( 
            <div className='lg-login-info'>
                    {
                    this.props.status ?  <div className="w">
                    <div className="uc-tbody clearfix"> 
                        {/* 用户头像 */}
                        <a className="fl">
                            <img className="av" src={require('../../../assets/img/ucenter/av1.png')} />
                        </a>
                        {/* 用户信息 */}
                        <div className="fl">
                            {/* 用户名 */}
                            <p className="t1">
                                <span>{this.props.nickName}</span>
                                <span className="split">|</span>
                                {this.props.baseData.mobile}  
                                <a onClick={()=>this.props.dispatch({type: 'login/logout'})}>退出登录</a> 
                            </p> 
                            <p className="uinfo" style={{position: 'relative'}}>
                                <span className='uname'>{baseData.userSecurityCenter.fCertification?baseData?baseData.realName:'未认证':'未认证'}</span>
                                <span className="split">|</span> 
                                
                                <i title="绑定手机号" className={`zjb zjb-shouji-copy ${baseData.userSecurityCenter.fMobileBinding?'active':''}`}></i>
                                <i title="身份证认证" className={`zjb zjb-shenfenrenzheng ${baseData.userSecurityCenter.fCertification?'active':''}`}></i> 
                                <i title="银行卡绑定" className={`zjb zjb-icon ${baseData.userSecurityCenter.fBankCardBinding?'active':''}`}></i> 
                            </p>
                        </div>
                        <div className="fr">  
                            <div className="account-content">
                                <p>待领取代金券</p>
                                <p className="account-money">{baseData.countCoupon||'0'}张</p>
                            </div >  
                            <i></i>
                           <div className="account-content">
                                <p>券额</p>
                                <p className="account-money">￥{`${baseData.sumCoupon||0}`.fm()}</p>
                            </div>
                            <i></i>
                             <div className="account-content" style={{borderRight:'0px'}}>
                                <p>可用资金余额</p>
                                <p className="account-money">￥{`${baseData.balance||0}`.fm()}</p>
                            </div> 
                        </div>  
                    </div>
                    <div className="uc-message">       
                            <span className="text1" style={[{verticalAlign: 'middle',height:25,display:'inline-block'},this.state.dataInfo.length > 1 ? {marginTop:'-8px'}:{marginTop:'0px'}]}>系统消息：</span>    
                            {
                                this.state.dataInfo.length > 1 ? 
                                <div id="marquee4" style={{width:400,height:25,overflow:'hidden',display:'inline-block'}}>
                                    <ul>
                                    {
                                        this.state.dataInfo.map((data,index)=>{
                                            return(
                                                <li key={index} style={{float:'left', width:380, padding:' 5px 10px',color:'#7D7D7D'}}>[{moment(data.fpublishTime).format('M-D')}]<a onClick={()=>this.props.history.push(Path.SITE_NOTICE)} style={{color:'#7D7D7D'}}>{data.ftitle} &gt; </a></li>
                                            )
                                        })
                                    }
                                    </ul>
                                </div> : <span className="text2" style={{height:25}}>[{moment(this.state.dataInfo.fpublishTime).format('M-D')}]{this.state.dataInfo.ftitle}</span> 
                            }
                       

                            { baseData.userSecurityCenter.fThirdAccount ?

                                <Button className="buttonl" style={{width: '136px'}} onClick={()=>this.props.history.push(Path.ACCOUNT_WITHDRAWALS)}>提现</Button> : null
                            }
                            { baseData.userSecurityCenter.fThirdAccount ?

                                <Button type="primary" className="buttonl" style={{width: '136px'}} onClick={()=>this.props.history.push(Path.ACCOUNT_RECHARGE)}>充值</Button> : null 
                            }
                    </div> 
                </div>:''
                }
            </div>
            
         )
    }
}
 
export default LoginInfo;