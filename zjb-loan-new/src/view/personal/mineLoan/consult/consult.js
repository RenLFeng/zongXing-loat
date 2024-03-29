/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:16:51 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-26 13:51:14
 * 我的借款
 * /projectTopic/getOne
 */
import React from 'react';
import {connect} from 'dva';
import '../mineloan.scss';
import {mineloan} from '../../../../services/api';
import {Row, Col, Input, message, Spin} from 'antd';
import {parseTime} from '../dateformat/date';
import LoanTitle from '../mineLoanComm/loanTitle';
import moment from 'moment';


const { TextArea } = Input;

@connect((state)=>({
    
}))
class Consult extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            waitReply: 0,
            flag: -1,
            types: 0,
            hfdata: '',
            loading: false,
            condata:[],
        }
    }

    componentDidMount(){
        this.getConsult();
    }

    async getConsult(val){
        this.setState({
            loading: true
        })
        let data = {
            projectId: this.props.projectId,//'ef58885bb2fa4c1cafe0596450a35db5',
            flag: val ? val : this.state.types
        }
        let res = await mineloan.getConsult(data);
        if(res.code === 0){
            if(data.flag === 0){
                this.setState({
                    condata: res.data,
                    waitReply: res.data.length,
                    loading: false
                })
            }else{
                this.setState({
                    condata: res.data,
                    loading: false
                })
            }
        }else{
            message.error(res.msg);
        }
    }

    //待？已？举报？
    getReply(val){
        this.setState({
            hfdata: '',
            showType: val
        })
        this.getConsult(val);
    }

    //回复
    replay(item, index){
        this.setState({
            flag: index,
            hfdata: ''
        })
    }
    //举报
    tipquestion(){

    }
    //取消回复
    cancelan(){
        this.setState({
            flag: -1,
            hfdata: ''
        })
    }
    //提交回复
    async commitan(item){
        let data = {};
        let res;
        if (this.state.commitLoading) {
            return;
        }
        this.setState({commitLoading: true});
        if(item.ftype === 1){
            data =  {
                fquestionId: item.fid, 
                fanswer: this.state.hfdata.trim(),
                fisAnonymity: 0
            }
            res = await mineloan.saveConsult(data)
        }else{
            data =  {
                fTopicId: item.fid, 
                fContent: this.state.hfdata.trim(),
                fIsAnonymity: 0
            }
            res = await mineloan.saveConsultq(data)
        }
        this.setState({commitLoading: false});
        if(res.code === 0){
            this.getConsult(this.state.showType);
            this.setState({flag: -1});
        }else{
            message.error(res.msg); 
        }
    }
    render(){
        const list = [];
        const {flag, hfdata, condata} = this.state;
        condata.map((item,index)=>{
            list.push(<div className="reply-card" key={index}>
                        <Row>
                            <Col span={20} className="replay-col20" style={{wordBreak: 'break-all'}}>
                                <span className="type" style={item.ftype === 0?{color: '#009900'}:null}>{item.ftype === 0 ? '投前咨询' : '投后追踪'}:</span>
                                {item.content}
                            </Col>
                            <Col span={4}  className="replay-col4">
                                <p>{parseTime(item.time,'{y}-{m}-{d} {h}:{i}')}</p>
                                <p><a className="jb" onClick={ () => this.tipquestion.bind(this,item,index)}>举报问题</a></p>
                                {item.projectAnswers.length ? null : flag === index ? '' : <a className="hf" onClick={this.replay.bind(this,item,index)}>回复</a>}
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
                        {
                            item.projectAnswers.map((item,index) =>{
                               return <div className="hf-div" style={{padding: '15px 10px', background: '#F2F2F2', wordBreak: 'break-all',marginBottom: 10}}>
                                        <p style={{textAlign: 'left',color: '#99A4BE'}}>{moment(item.time).format('YYYY-MM-DD HH:mm')}</p>
                                        <p style={{textAlign: 'left'}}>{item.content}</p>
                                    {/* <TextArea value={item.content} rows={4} readOnly key={index}
                                            style={{backgroundColor: '#e9e9e9',padding: '10px 25px',boxShadow: '0 0 0 2px #e9e9e9',borderRadius: 0,
                                            border:'none',marginTop:' 15px'}}/> */}
                                            
                                    {/* <p style={{textAlign: 'right'}}>{parseTime(item.time,'{y}-{m}-{d} {h}:{i}')}</p>         */}
                                    </div>
                            })
                        }

                      </div>)
        })
        return(
            <div>
                {
                    
                        <div className="pe personal-rbody" style={{marginTop: '8px'}}>
                            <LoanTitle title="投资咨询"></LoanTitle>
                            <div className="reply-statu">
                                <a className="statu-a" onClick={() =>this.getReply(0)}>待回复<span>({this.state.waitReply > 99 ? '99+' : this.state.waitReply})</span></a>
                                <a className="statu-a" onClick={() =>this.getReply(1)}>已回复<span></span></a>
                                <a className="statu-a" onClick={() =>this.getReply(-1)}>已举报<span></span></a>
                            </div>
                            { list.length > 0 ?
                            <Spin spinning={this.state.loading}>
                                {list}
                            </Spin>:
                            '' }
                        </div>
                        
                }
            </div>
        )
    }
}

export default Consult;