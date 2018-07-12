
import React from 'react';

import './recharge.scss'
import { Modal, Upload, Form, Input, Tooltip,message, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import Recharge from '../rechargecomponents'

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
export default class Loaninfo extends React.Component {
    constructor(pops) {
        super(pops)
        this.state = {
       
        }
    }
    render() {
     

        return (
            <div>
                < Recharge types='1' />
            </div>
        )
    }
}

