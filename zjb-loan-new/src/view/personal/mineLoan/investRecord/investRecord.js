/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:16:51 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-12 14:09:14
 * 我的借款
 * /projectTopic/getOne
 */
import React from 'react';
import {connect} from 'dva';
import './investrecord.scss'
import {mineloan} from '../../../../services/api';
import {Row, Col, Input, message} from 'antd';
import {parseTime, returnff} from '../dateformat/date';
const { TextArea } = Input;

@connect((state)=>({
    
}))
class InvestRecord extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            investData: []
        }
    }

    componentDidMount(){
        this.getInvestRecord();
    }
    async getInvestRecord(){
        let data = {
            projectId: this.props.indata.fid,
        }
        let res = await mineloan.getInvestRecord(data);
        if(res.code === 0){
            this.setState({
                investData: res.data
            })
        }else{
            message.error(res.msg);
        }
    }

    render(){
        const {investData} = this.state;
        let list = [];
        if(investData.length === 0){
            list.push(<Row className="record-row-tc re-content" key="key"><Col span={24}>暂无数据</Col></Row>)
        }else{
            investData.map((item,index) => {
                console.log(item);
                list.push(<Row className="record-row-tc re-content" key={index}>
                <Col span={8}>{item.userName}</Col>
                <Col span={8}>￥{returnff(item.money)}</Col>
                <Col span={8}>{parseTime(item.ftime,'{y}-{m}-{d} {h}:{i}')}</Col></Row>)
            })
        }
        return(
            <div className="pe" style={{marginTop: '8px'}}>
                <p style={{padding:' 8px 0'}}>投标记录</p>
                <div style={{backgroundColor: '#F4F4F4',textAlign: 'center',padding: '25px'}}>
                    <Row className="record-row-tc" key="keys"><Col span={8}>投标人</Col><Col span={8}>投标金额</Col><Col span={8}>投标时间</Col></Row>
                    <div style={{maxHeight: '300px',overflow: 'auto'}}>
                        {list}
                    </div>
                </div>
            </div>
        )
    }
}

export default InvestRecord;