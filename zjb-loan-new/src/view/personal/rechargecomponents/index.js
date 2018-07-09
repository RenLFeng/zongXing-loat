
import React from 'react';
import './index.scss'
import Title from './title'
import Card from './card'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

export default  class Loaninfo extends React.Component{
     constructor(props){
         super(props)
         this.state={
             
         }
     }
    render(){
        return(
            <div  className="recharge-info">
            <Title types={this.props.types} />
            <Card  types={this.props.types}/>          
            </div>
        )
    }
}
