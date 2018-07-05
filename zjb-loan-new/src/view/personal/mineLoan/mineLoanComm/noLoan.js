/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:16:41 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-05 17:50:19
 * 无借款记录
 */
import React from 'react';
import LoanTitle from './loanTitle';
import {connect} from 'dva';
import { Link } from 'dva/router';
import '../mineloan.scss'
import Path from '../../../../common/PagePath';


class NoLoan extends React.Component{
	constructor(props){
		super(props);
		this.state={
			
		}
	}
	
    render(){
        return(
            <div className="mineloan">
                <div className="pe personal-rbody" style={{backgroundColor: '#fff',padding: 30}}>
                    <LoanTitle></LoanTitle>
                    <div className="apply">
                        <div className="apply-top"></div>
                        <Link to={Path.APPALY_LOAN} ><a>申请借款</a></Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default NoLoan;