import React from 'react';
import LoanTitle from './loanTitle';
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
                        <a > <Link to={Path.APPALY_LOAN} >申请借款</Link></a>
                    </div>
                </div>
            </div>
        )
    }
}

export default NoLoan;