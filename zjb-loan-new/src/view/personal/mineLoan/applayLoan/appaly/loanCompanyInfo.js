
import React from 'react';
import Title from './title'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';

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
               <Title Title="借款企业信息" />
              <div>
              </div>
                3
            </div>
        )
    }
}
