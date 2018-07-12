/*
 * @Author: wfl 
 * @Date: 2018-07-04 18:16:00 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-11 09:56:34
 */
import React from 'react';
import './mineloan.scss';
import {connect} from 'dva';
import {Spin} from 'antd';
import LeftMenu from '../../../components/leftmenu/leftMenu';
import NoLoan from './mineLoanComm/noLoan';
import HaveLoan from './mineLoanComm/haveLoan';

@connect((state)=>({
    mineloan: state.mineloan,
    data: state.mineloan.data,
    loading: state.mineloan.loading, 
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
        if(this.props.data.length !== 0){
            return(
            	<div>
            	 <LeftMenu param={this.props}/>
                 <Spin spinning={this.props.loading}>
            	    <NoLoan></NoLoan>
                 </Spin>
            	</div>
            )
        }else{
            return(
            	<div>
            	 <LeftMenu param={this.props}/>
                 <Spin spinning={this.props.loading}>
            	    <HaveLoan></HaveLoan>
                 </Spin>
            	</div>
            )
        }
    }
}

export default MineLoan;