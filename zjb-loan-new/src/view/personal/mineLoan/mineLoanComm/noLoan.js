/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:16:41 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-11 09:48:06
 * 无借款记录
 */
import React from 'react';
import LoanTitle from './loanTitle';
import {connect} from 'dva';
import { Link } from 'dva/router';
import '../mineloan.scss'
import Path from '../../../../common/PagePath';
import DelModal from './deleteModal/deleteModal';

class NoLoan extends React.Component{
	constructor(props){
		super(props);
		this.state={
		}
	}
	show(){
        this.refs.delmodal.showModal();
    }
    render(){
        return(
            <div className="mineloan">
                <div className="pe personal-rbody" style={{backgroundColor: '#fff',padding: 30}}>
                    <LoanTitle title="我的借款"></LoanTitle>
                    <div className="apply">
                        <div className="apply-top"></div>
                        <Link to={Path.APPALY_LOAN}><span>申请借款</span></Link>
                    </div>
                </div>
                <DelModal ref="delmodal" content="你确定要删除吗?" sure="确定" cancel="取消"></DelModal>
            </div>
        )
    }
}

export default NoLoan;