/*
 * @Author: wfl 
 * @Date: 2018-07-04 18:42:28 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-26 12:23:39
 * 我的借款--确认借款 
 */
import React from 'react';
import './sureloan.scss';
import {connect} from 'dva';
import {parseTime, returnFloat} from '../dateformat/date';
import { Table, message,Input, Spin,Modal } from 'antd';
import {mineloan} from '../../../../services/api';
const { TextArea } = Input;

@connect((state) =>({
    
}))
class SureLoan extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            suredata: [],
            bzInfo: '',
            loading: false,
            visible:false,
            code:'',
            Loading:false
        }
    }

    componentDidMount(){
        this.getSureDate();
    }

    async getSureDate(){
        let data = {
            projectId: this.props.suredata.fid
        }
        let res = await mineloan.getSureDate(data);
        if(res.code === 0){
            this.setState({
                suredata: res.data
            })
        }else{
            message.error(res.msg)
        }
    }

    getNewInfo(){
        this.props.dispatch({
            type: 'mineloan/getMineLoan',
            payload: ''
        })
    }
    onchange(val){
        this.setState({code:val})
      }
    hideModal(){
        this.setState({visible:false,code:''})
    }

    async getSignMessage(){
         this.setState({visible:true,Loading:true})
         const res = await mineloan.getSign(this.props.suredata.fid);
         this.setState({Loading:false})
         if(res.code === 0 ){
           
         } else {
           res.msg && message.error(res.msg)
         }
       }

    async agreeOrUnagree(statu){
        const {suredata, bzInfo} = this.state;
        console.log(suredata,bzInfo,'suredata')
        if(this.state.code.trim().length < 4){
          message.info('请输入合法的验证码')
          return;
        }
        let data = {
            remark: bzInfo,
            isPass: statu,
            projectId: this.props.suredata.fid,
            chickCode:this.state.code
        }
        if([0,-1].includes(statu)){
            if(data.remark === ''){
                message.info(`请输入${statu === 0 ? '不同意' : '拒绝'}理由！`)
                return;
            }
        }else{
            if(data.remark === ''){
                data.remark = '同意借款';
            }
        }
        if (this.state.loading) {
            return;
        }
        this.setState({loading: true})
        let res = await mineloan.isAgreeBorrow(data);
        if(res.code === 0){
            this.getNewInfo();
            this.setState({loading: false,visible:false})
        }else{
            this.setState({loading: false})
        }
    }
    
    render(){
        console.log('11111111',[this.state.suredata])
        const locale = {
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '暂无数据',
          };
        const columns = [
            { 
                title: '借款金额', 
                align: 'center',
                dataIndex: 'fmoney_last', 
                key: 'fmoney_last',
                render: (text,record) =>{
                    return <span>{returnFloat(record.fmoney_last)}元</span>
                }  
            },
            { 
                title: '借款期数',
                align: 'center',
                dataIndex: 'fmonth_last', 
                key: 'fmonth_last' ,
                render: (text,record) =>{
                    return <span>{record.fmonth_last}个月</span>
                }
            },
            { 
                title: '借款利率', 
                align: 'center',
                dataIndex: 'frate_last', 
                key: 'frate_last',
                render: (text,record) =>{
                    return <span>{record.frate_last}%</span>
                }  
            },
            { 
                title: '项目评级', 
                align: 'center',
                dataIndex: 'fleve_name', 
                key: 'fleve_name',
            },
            { 
                title: '评级时间', 
                align: 'center',
                dataIndex: 'frate_last_date', 
                key: 'frate_last_date',
                render: (text,record) =>{
                    return <span style={{ margin:' 8px 0',display: 'inline-block',color:' #999999'}}>{parseTime(record.frate_last_date,'{y}-{m}-{d} {h}:{i}')}</span>
                }
            },
          ];
        const {fname,fproject_no,fflag} = this.props.suredata;
        return(
            <div className="sure-loan">
                <p>项目编号:<span>{fproject_no}</span></p>
                <p>项目名称:<span>{fname}</span></p>
                <div className="table-bg">
                    <Table
                        bordered size="small"
                        locale={locale}
                        pagination={false}
                        dataSource={[this.state.suredata]}
                        columns={columns}
                        rowClassName="editable-row"
                        // loading={this.state.loading}
                    />
                </div>
                <Spin spinning={this.state.loading}>
                    <span>备注:</span>
                    <TextArea placeholder="备注" value={this.state.bzInfo} onChange={(e) =>{ this.setState({bzInfo: e.target.value})} } autosize={{ minRows: 2, maxRows: 4 }} />
                    <div className="ac-button">
                        <a className="agree" onClick={()=>this.getSignMessage()}>同意</a>
                        <a className="unagree" onClick={()=>this.agreeOrUnagree(0)}>不同意</a>
                        <a className="stop" onClick={()=>this.agreeOrUnagree(-1)}>终止项目</a>
                    </div>
                </Spin>

                <Modal
                    title="验证"
                    visible={this.state.visible}
                    confirmLoading={this.state.loading}
                    onOk={this.agreeOrUnagree.bind(this,1)}
                    onCancel={this.hideModal.bind(this)}
                    okText="确认"
                    cancelText="取消"
                    maskClosable={false}
                >
                    <div>
                        <span>验证码：</span>
                        <Input style={{width:'30%'}} placeholder="请输入验证码" onChange={(e)=>this.onchange(e.target.value)} value={this.state.code} maxLength={6}/>
                    </div> 
                </Modal>
            </div>
        )
    }
}
export default SureLoan;