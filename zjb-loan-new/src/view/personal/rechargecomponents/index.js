
import React from 'react';
import './index.scss'
import Title from './title'
import Card from './card'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, message ,Modal} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

export default  class Loaninfo extends React.Component{
   
    render(){
        const {commisson} = this.state;
        return(
            <div  className="recharge-info">  
                <Title types={this.props.types}  commissionShow={this.state.commissionShow}/>
                <Card  types={this.props.types}  commissionShow={this.state.commissionShow}/>    
            </div>
        )
    }
}
