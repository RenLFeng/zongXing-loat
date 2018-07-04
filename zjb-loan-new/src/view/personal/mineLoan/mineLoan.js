import React from 'react';
import './mineloan.scss'
import LeftMenu from '../../../components/leftmenu/leftMenu';
import NoLoan from './mineLoanComm/noLoan';
import HaveLoan from './mineLoanComm/haveLoan';

class MineLoan extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            noloan: true
        }
    }
    render(){
        if(this.state.noloan){
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