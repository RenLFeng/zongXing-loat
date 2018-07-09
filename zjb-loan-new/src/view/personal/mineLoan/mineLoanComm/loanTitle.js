/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:16:51 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-09 11:38:38
 * 我的借款
 */
import React from 'react';
import {connect} from 'dva';
import '../mineloan.scss'

class LoanTitle extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <p className="mine-loan">{this.props.title}
                    {this.props.children}
                </p>
                <img src={require('../img/u904.png')}/>
            </div>
        )
    }
}

export default LoanTitle;