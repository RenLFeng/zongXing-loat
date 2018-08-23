/*
 * @Author: wfl 
 * @Date: 2018-07-04 18:16:00 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-24 20:02:54
 */
import React from 'react';
import './mineloan.scss';
import {connect} from 'dva';
import {Spin} from 'antd';
import LeftMenu from '../../../components/leftmenu/leftMenu';
import NoLoan from './mineLoanComm/noLoan';
import HaveLoan from './mineLoanComm/haveLoan';
import ReadyData from './mineLoanComm/readyData/readyData';

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
        const haveData = [];
        this.props.data.map((item,index) =>{
            if(item.fflag !== 16 && item.fflag !== -3 && item.fflag !== -1 && item.fflag !== 88){
                haveData.push(item)
            }
        });
        if(haveData.length === 0){
            return(
            	<div>
                <Spin spinning={this.props.loading}>
            	 <LeftMenu param={this.props}/>
            	    <NoLoan></NoLoan>
                    <ReadyData></ReadyData>
                 </Spin>
            	</div>
            )
        }else{
            return(
            	<div>
                  <Spin spinning={this.props.loading}>
            	    <LeftMenu param={this.props}/>
            	    <HaveLoan history={this.props.history}></HaveLoan>
                    <ReadyData></ReadyData>
                  </Spin>
            	</div>
            )
        }
    }
}

export default MineLoan;