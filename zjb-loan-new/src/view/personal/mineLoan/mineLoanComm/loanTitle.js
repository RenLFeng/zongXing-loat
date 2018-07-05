/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:16:51 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-04 18:39:22
 * 我的借款
 */
import React from 'react';
import '../mineloan.scss'

class LoanTitle extends React.Component{
    render(){
        return(
            <div>
                <p className="mine-loan">我的借款</p>
                <img src={require('../img/u904.png')}/>
            </div>
        )
    }
}

export default LoanTitle;