import React from 'react';
import './tixian.scss'
import Recharge from '../rechargecomponents'

export default  class Loaninfo extends React.Component{
     constructor(props){
         super(props)
         this.state={
             
         }
     }
    render(){
        return(
            <div  className="tixian-contenter">
               < Recharge types='2' />
            </div>
        )
    }
}
