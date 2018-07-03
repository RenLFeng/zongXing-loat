import React from 'react';
import { Link } from 'dva/router';
import {connect} from 'dva';

import { startAnimate } from '../../assets/home/index';
import $ from 'jquery';

const styles = {
  masker : {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: '100vh',
    background: 'rgba(0,0,0,.5)',
    zIndex: 5
  },
  titleBtn: {
    padding: '0 14px',
    marginTop: '40px',
    fontSize: '20px'
  },
  fr: {
    display: 'inline-block',
    marginTop: '30px'
  }
};

@connect((state)=>({
  loginStatus: state.user.loginStatus
}))
export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      fixContent:'uCenter,login,collection,register,forgetPassWord,couponCenter,companyDiscount,commonProblem,uCenter'
    }
  }
  componentDidMount() {
    startAnimate();
  }
  render() {
    // couponCenter
    const {match, location, history} = this.props.param;
    let localPath =location.pathname;
    const styleS = localPath.indexOf('/index/howLoan') !== -1 || localPath.indexOf('/index/howInvest') !== -1 ? {position:'fixed'}: {position:'absolute'};
    let fontColor = 'null';
    // if(localPath.indexOf('/index/projectLoan')!== -1){
    //   fontColor='project';
    // }else if(localPath.indexOf('/index/howLoan')!== -1){
    //   fontColor='howLoan';
    // }else if(localPath.indexOf('/index/howInvest')!== -1){
    //   fontColor='howInvest';
    // }else if(localPath.indexOf('/index/companyDiscount')!== -1){
    //   fontColor='companyDiscount';
    // }else if(localPath.indexOf('/index/commonProblem')!== -1){
    //   fontColor='commonProblem';
    // }else 
    
    if(localPath.indexOf('/index/uCenter')!== -1){
      fontColor='uCenter';
    }
    let shouldFix=true;
    this.state.fixContent.split(',').map((item)=>{
      if(localPath.indexOf('/index/'+item)!=-1){
        shouldFix = false;
        return false;
      }
    });

  if (shouldFix) {
      return (
      <div id="fix" className="topnav" style={styleS}>
        <div className="w clearfix">
          <a className="logo fl" onClick={()=>{
            history.push(`${match.path}/`);
            $("#fix").removeClass('fix');
          }}>
            <img src={require('./zjb-logo.png')}  className='zjb-logo'/>
          </a>
          <span className="fr" style={styles.fr}>
            {/* <a className={'a1 '+(fontColor=='project'?'project':null)} style={styles.titleBtn} onClick={()=>{
              history.push(`${match.path}/projectLoan`);
              $("#fix").removeClass('fix');
            }}>投资项目</a>
            <a className={'a1 '+(fontColor=='howInvest'?'howInvest':null)} style={styles.titleBtn} onClick={()=>{
              history.push(`${match.path}/howInvest`);
            }}>如何投资</a>
            <a className={'a1 '+(fontColor=='companyDiscount'?'companyDiscount':null)} style={styles.titleBtn} onClick={()=>{
              history.push(`${match.path}/companyDiscount`);
              $("#fix").removeClass('fix');
            }}>商家优惠</a>
             <a className={'a1 '+(fontColor=='howLoan'?'howLoan':null)} style={styles.titleBtn} onClick={()=>{
              history.push(`${match.path}/howLoan`);
            }}>如何借款</a>
            <a className={'a1 '+(fontColor=='commonProblem'?'loanCollege':null)} style={styles.titleBtn} onClick={()=>{
              history.push(`${match.path}/commonProblem`);
              $("#fix").removeClass('fix');
            }}>信息披露</a> */}
            { !this.props.loginStatus ?
              <a className="btn btn2" style={{width: 122, height: 40,marginTop:5}}>
                <p style={{paddingTop:7}}>
                  <span style={{fontSize: 14}} onClick={()=>{
                    history.push('/index/login');
                    $("#fix").removeClass('fix');
                  }}>登录</span>
                  <span style={{display:'inline-block',marginRight:10,marginLeft:10,fontSize: 14}}>|</span>
                  <span style={{fontSize: 14}} onClick={()=>{
                    history.push('/index/register');
                    $("#fix").removeClass('fix');
                  }}>注册</span>
                </p>
                </a> :
              <a className={'a1 '+(fontColor=='uCenter'?'loanCollege':null)} style={styles.titleBtn} onClick={()=>{
                  history.push('/index/uCenter/personAccount');
                  $("#fix").removeClass('fix');
                }}>个人中心</a>
            }
          </span>
        </div>
      </div>

      );
    }
  	return (
      <div id="fix" className="topnav" style={{backgroundColor:'#333'}}>
        <div className="w clearfix">
          <a className="logo fl" onClick={()=>{
            history.push(`${match.path}/`);
            $("#fix").removeClass('fix');
          }}>
            <img src={require('../../assets/img/logo-main_1.png')} />
          </a>
          <span className="fr" style={styles.fr}>
            {/* <a className={'a1 '+(fontColor=='project'?'project':null)} style={styles.titleBtn} onClick={()=>{
              history.push(`${match.path}/projectLoan`);
              $("#fix").removeClass('fix');
            }}>投资项目</a>
             <a className={'a1 '+(fontColor=='howInvest'?'howInvest':null)} style={styles.titleBtn} onClick={()=>{
              history.push(`${match.path}/howInvest`);
            }}>如何投资</a>
            <a className={'a1 '+(fontColor=='companyDiscount'?'companyDiscount':null)} style={styles.titleBtn} onClick={()=>{
              history.push(`${match.path}/companyDiscount`);
              $("#fix").removeClass('fix');
            }}>商家优惠</a>
            <a className={'a1 '+(fontColor=='howLoan'?'howLoan':null)} style={styles.titleBtn} onClick={()=>{
              history.push(`${match.path}/howLoan`);
            }}>如何借款</a>
            <a className={'a1 '+(fontColor=='commonProblem'?'loanCollege':null)} style={styles.titleBtn} onClick={()=>{
              history.push(`${match.path}/commonProblem`);
              $("#fix").removeClass('fix');
            }}>信息披露</a> */}
            { !this.props.loginStatus ?
              <a className="btn btn2" style={{width: 122, height: 40}}
                 >
                 <p style={{paddingTop:7}}>
                  <span onClick={()=>{
                    history.push('/index/login');
                    $("#fix").removeClass('fix');
                  }} style={{fontSize:14}}>登录</span>
                  <span style={{display:'inline-block',marginRight:10,marginLeft:10,fontSize:14}}>|</span>
                  <span onClick={()=>{
                    history.push('/index/register');
                    $("#fix").removeClass('fix');
                  }} style={{fontSize:14}}>注册</span>
                 </p>

                 </a> :
              <a className={'a1 '+(fontColor=='uCenter'?'loanCollege':null)} style={styles.titleBtn} onClick={()=>{
                history.push('/index/uCenter/personAccount');
                $("#fix").removeClass('fix');
              
              }}>个人中心</a>
            }
          </span>
        </div>
      </div>
  	);
  }
}
