import React from 'react';
import { Switch, Route } from 'dva/router';
import '../../../assets/MessageDetail/messageDetail.scss';
import {STATION_MESSAGE} from '../../../common/pagePath';
import {message} from "antd/lib/index";
import moment from 'moment';
import {getOneMessage} from "../../../services/api";
import Editor from '../../editor'; 


export default class MessageDetail extends React.Component {
 constructor(props){
   super(props);
   this.state = {
     messageData:{},
   }
 }

  componentDidMount() {
    const id = this.props.match.params.msgId;
    this.getOneMessage(id);
  }

//查询单个信息
  async getOneMessage(id){
    const response = await getOneMessage(id);
    console.log(response);
    if(response.code === 0){
      this.setState({
        messageData:response.data,
      })
    }else {
      message.error(response.msg);
    }

  }
  render() {
   const {messageData}= this.state;
    return (
      <div className="fr uc-rbody" >
        <a onClick = {()=>this.props.history.push(STATION_MESSAGE)} className="back" style={{color:"#ff9900",fontWeight:"bold"}}> &lt; 返回列表</a><hr/>
        <div className="message">
           <h2>{messageData.ftitle}</h2>
           <h5>{moment(messageData.fsendTime).format('YYYY-MM-DD HH:mm:ss')}</h5>
           <Editor value={messageData.article ? messageData.article.fcontent:''}/>
        </div>
      </div>
    );
  }
}
