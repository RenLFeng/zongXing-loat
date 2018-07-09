/*
 * @Author: wfl 
 * @Date: 2018-07-04 18:16:00 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-09 10:47:07
 */
import React from 'react';
import './mineloan.scss'
import LeftMenu from '../../../components/leftmenu/leftMenu';
import NoLoan from './mineLoanComm/noLoan';
import HaveLoan from './mineLoanComm/haveLoan';
import {connect} from 'dva';

@connect((state)=>({
    mineloan: state.mineloan,
    data: state.mineloan.data
}))
class MineLoan extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.props.dispatch({
            type: 'mineloan/getMineLoan',
            payload: ''
        })
    }
    render(){
        if(this.props.data.length === 0){
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