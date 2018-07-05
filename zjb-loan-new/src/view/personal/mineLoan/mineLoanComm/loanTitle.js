/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:16:51 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-05 09:32:12
 * 我的借款
 */
import React from 'react';
import {connect} from 'dva';
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