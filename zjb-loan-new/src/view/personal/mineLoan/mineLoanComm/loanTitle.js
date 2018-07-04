import React from 'react';
import '../mineloan.scss'

class LoanTitle extends React.Component{
    render(){
        return(
            <div>
                <p>我的借款</p>
                <img src={require('../img/u904.png')}/>
            </div>
        )
    }
}

export default LoanTitle;