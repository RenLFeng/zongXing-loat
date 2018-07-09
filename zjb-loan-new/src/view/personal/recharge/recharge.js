
import React from 'react';

import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import Recharge from '../rechargecomponents'
const FormItem = Form.Item;
const Option = Select.Option;

export default  class Loaninfo extends React.Component{
     constructor(pops){
         super(pops)
         this.state={
             
         }
     }
    render(){
        return(
            <div  className="applone-info">
             < Recharge types='1' />
            </div>
        )
    }
}
