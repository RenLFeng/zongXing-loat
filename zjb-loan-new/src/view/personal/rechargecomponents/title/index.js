
import React from 'react';
import './index.scss'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';

export default  class Loaninfo extends React.Component{
     constructor(props){
         super(props)
         this.state={
            //  types
         }
         console.log(this.props.types,"2323232323")
     }
    render(){
       
        return(
            <div  className="recharge-info">
            {
                this.props.types ==='1'? <p className="recharge-title">充值  <span className="recharge-title-child">>  发起充值</span>
                </p>
                  :
                <p className="recharge-title">提现  <span className="recharge-title-child">>  发起提现</span>
                </p>
            }
                
                 <img src={require('../../mineLoan/img/u904.png')}/>         
            </div>
        )
    }
}