import React from 'react';
import LoanTitle from './loanTitle';
import '../mineloan.scss'

class NoLoan extends React.Component{
    render(){
        return(
            <div className="mineloan">
                <div className="pe personal-rbody" style={{backgroundColor: '#fff',padding: 30}}>
                    <LoanTitle></LoanTitle>
                    <div className="apply">
                        <a>申请借款</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default NoLoan;