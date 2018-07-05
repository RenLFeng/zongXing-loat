/*
 * @Author: wfl 
 * @Date: 2018-07-04 18:16:00 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-05 17:53:42
 */
import React from 'react';
import './mineloan.scss'
import LeftMenu from '../../../components/leftmenu/leftMenu';
import NoLoan from './mineLoanComm/noLoan';
import HaveLoan from './mineLoanComm/haveLoan';
import {connect} from 'dva';

class MineLoan extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            noloan: false
        }
    }
    render(){
        if(!this.state.noloan){
            return(
            	<div>
            	 <LeftMenu param={this.props}/>
            	 <NoLoan></NoLoan>
            	</div>
            )
        }else{
            return(
            	<div>
            	 <LeftMenu param={this.props}/>
            	 <HaveLoan></HaveLoan>
            	</div>
            )
        }
    }
}

export default MineLoan;