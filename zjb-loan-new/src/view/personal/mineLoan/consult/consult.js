/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:16:51 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-09 11:26:38
 * 我的借款
 */
import React from 'react';
import {connect} from 'dva';
import '../mineloan.scss';
import {Row, Col, Input} from 'antd';
import LoanTitle from '../mineLoanComm/loanTitle';
const { TextArea } = Input;

class Consult extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            waitReply: 100,
            flag: -1,
            hfdata: '',
            data:[
                {
                    type: '投前咨询',
                    content: '投前咨询投前咨询投前咨询投前咨询投前咨询投前咨询',
                    time: '2018-02-25 14:05',
                    statu: 1,
                    replay: '回复回复回复'
                }
            ],
        }
    }
    //待？已？举报？
    getReply(type){
        if(type === 0){

        }else if(type === 1){

        }else{
            
        }
    }

    //回复
    replay(item, index){
        console.log(item,index,'----')
        this.setState({
            flag: index
        })
    }
    //举报
    tipquestion(){

    }
    //取消回复
    cancelan(){
        console.log('888')
        this.setState({
            flag: -1,
            hfdata: ''
        })
    }
    //提交回复
    commitan(){

    }
    render(){
        const list = [];
        const {flag, hfdata} = this.state;
        this.state.data.map((item,index)=>{
            list.push(<div className="reply-card">
                        <Row>
                            <Col span={20} className="replay-col20">
                                <span className="type">{item.type}:</span>
                                {item.content}
                            </Col>
                            <Col span={4}  className="replay-col4">
                                <p>{item.time}</p>
                                <p><a className="jb" onClick={ () => this.tipquestion.bind(this,item,index)}>举报问题</a></p>
                                {flag === index ? '' : <a className="hf" onClick={this.replay.bind(this,item,index)}>回复</a>}
                            </Col>
                        </Row>
                        {flag === index ?
                                <div className="hf-div">
                                    <TextArea value={hfdata} onChange={(e)=> this.setState({hfdata: e.target.value})} rows={4}
                                            style={{backgroundColor: '#e9e9e9',padding: '10px 25px',boxShadow: '0 0 0 2px #e9e9e9',borderRadius: 0,
                                            border:'none',marginTop:' 15px'}}/>
                                    <div className="hf-btn">        
                                        <a className="commit" onClick={() => this.commitan(item)}>提交</a>
                                        <a className="cancle" onClick={() => this.cancelan(item)}>取消</a>
                                    </div>
                                </div>          
                        : ''}
                      </div>)
        })
        return(
            <div className="pe personal-rbody" style={{marginTop: '8px'}}>
                <LoanTitle title="投资咨询"></LoanTitle>
                <div className="reply-statu">
                    <a className="statu-a" onClick={this.getReply(0)}>待回复<span>({this.state.waitReply > 99 ? '99+' : this.state.waitReply})</span></a>
                    <a className="statu-a" onClick={this.getReply(1)}>已回复<span></span></a>
                    <a className="statu-a" onClick={this.getReply(2)}>已举报<span></span></a>
                </div>
                {list}
            </div>
        )
    }
}

export default Consult;