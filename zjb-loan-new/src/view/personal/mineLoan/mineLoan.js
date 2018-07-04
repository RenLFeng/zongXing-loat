import React from 'react';
import './mineloan.scss'

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
                <NoLoan></NoLoan>
            )
        }else{
            return(
                <HaveLoan></HaveLoan>
            )
        }
    }
}

export default MineLoan;