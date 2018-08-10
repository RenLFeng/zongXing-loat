
import React from 'react';
import './index.scss'
import Title from './title'
import Card from './card'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, message ,Modal} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

export default  class Loaninfo extends React.Component{
    constructor(props){
       super(props);
       this.state={
        show:false
       }
    }

    getcommision(type){
    console.log('type',type)
        this.setState({
            show:type
        },()=>{
            console.log('this.state.show',this.state.show)
        })
    }
    render(){
        return(
            <div  className="recharge-info">  
                <Title types={this.props.types} show={this.state.show}/>
                <Card  types={this.props.types}  getcommision={this.getcommision.bind(this)}/>    
            </div>
        )
    }
}
