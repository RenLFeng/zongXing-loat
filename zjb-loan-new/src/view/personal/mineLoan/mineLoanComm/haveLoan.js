/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:17:00 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-16 10:36:10
 * 有借款记录
 */
import React from 'react';
import LoanTitle from './loanTitle';
import LoanStep from './loanStep';
import SureLoan from './sureLoan';
import MineTimel from '../minetime/minetimeline';
import InvestRecord from '../investRecord/investRecord';
import DelModal from './deleteModal/deleteModal';
import UploadFile from '../applayLoan/appaly/UpLoad/UploadFile';
import {mineloan} from '../../../../services/api';
import {connect} from 'dva';
import {IMG_BASE_URL} from '../../../../common/SystemParam';
import SendCoupon from './sendCoupon';
import Notice from '../notice/notice';
import ConSult from '../consult/consult';
import {Row, Col, message} from 'antd';
import {parseTime, returnFloat, getTime, loanDelay} from '../dateformat/date';
import { Table } from 'antd';
import '../mineloan.scss'

function getStatu(flag){
    switch(flag){
        case 0:
            return '待提交';
        case 1:
            return '待初审';
        case 2:
            return '待缴费';       
        case 3:
            return '待大数据风控';
        case 4:
            return '待补充资料';//'待配置问题';
        case 5:
            return '项目背调';   
        case 6:
            return '待委员会审核';
        case 7:
            return '待确认借款';
        case 8:
            return '待排版发布';
        case 9:
            return '项目排版';
        case 10:
            return '筹款中';       
        case 11:
            return '待放款';
        case 12:
            return '还款中';
        case 13:
            return '还清借款';   
        case 14:
            return '待配置优惠券';
        case 15:
            return '待审核优惠券';
        case -1:
            return '流标';
        case -2:
            return '风控打回';           
        case -3:
            return '终止';
        case -4:
            return '逾期';      
        case -5:
            return '坏账';                   
        default:
            return ''                                     
    }
}

@connect((state)=>({
    mineloan: state.mineloan,
    data: state.mineloan.data,
    loading: state.mineloan.loading,
}))
class NoLoan extends React.Component{
    fileData = {
        type: "file/",
        baseUrl: IMG_BASE_URL
    };
    constructor(props){
        super(props);
        this.state = {
            loadingdel: false,
            delId: '',
            visible: false,
            upfile: {},
            doingData: []
        }
    };

    submitLoan(text,record,index){
        console.log(text,record,index)
    }

    editLoan(text,record,index){
        console.log(text,record,index)
    }

    deleteLoan(text,record,index){
        this.setState({
            delId: record.fid,
            visible: true
        })
    }
    cnacelDel(){
        this.setState({
            delId: '',
            visible: false
        })
    }
    //删除项目
    async comitdeleteLoan(){
        let data = {
            projectId: this.state.delId
        }
        this.setState({
            loadingdel: true
        })
        let res = await mineloan.delProject(data);
        if(res.code === 0){
            this.props.dispatch({
                type: 'mineloan/getMineLoan',
                payload: ''
            })
            this.setState({
                loadingdel: false,
                visible: false
            })
        }else{
            this.setState({
                loadingdel: false
            })
            message.error(res.msg)
        }
    }

    componentDidMount(){
       
    }
    //缴费
    pay(text,record,index){
        console.log(text,record,index)
    }
    //数据授权
    dataLicense(text,record,index){
        console.log(text,record,index,'888')
    }
    //确认借款
    sureBorrow(text,record,index){
        console.log(text,record,index)
    }

    //上传补充资料
    uploadInfo(){
        
    }
    
    //还款计划
    payPlan(){

    }

    //上传资料
    onChange(val){
        this.setState({
            upfile: val
        })
    }

    //完善项目信息
    fullProjectInfo(){
        
    }

    async updatstate(val){
        let time = val[0].loanTime;
        await setInterval(()=>{
            this.setState({
                doingData: [{
                    ...this.state.doingData,
                    loanTime: time++
                }]
            },1000)
        })
    }
    render(){
        const doing = [];
        // fflag = 其它
        const columns = [
            { 
                title: '要借多钱', 
                align: 'center',
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.fcredit_money)}万元</span>
                } 
            },
            { 
                title: '要借多久',
                align: 'center',
                dataIndex: 'fcredit_month', 
                key: 'fcredit_month' ,
                render: (text,record) =>{
                    return <span>{record.fcredit_month}个月</span>
                } 
            },
            { 
                title: '创建时间', 
                align: 'center',
                dataIndex: 'fcreate_time', 
                key: 'fcreate_time' ,
                render: (text,record) =>{
                    return <span>{parseTime(record.fcreate_time,'{y}-{m}-{d} {h}:{i}')}</span>
                }
            },
            { 
                title: '状态', 
                align: 'center',
                dataIndex: 'state', 
                key: 'state',
                render: (text,record, index) =>{
                    return <p className="wait-commit">
                            •{getStatu(record.fflag)} {record.fflag === 5 ? <span style={{color: '#000'}}>(待背调)</span>: ''}
                        </p>
                } 
            },
            { 
                title: '操作', 
                align: 'center',
                dataIndex: '', 
                key: 'x',   
                render: (text,record,index) =>{
                    return <div className="action">
                            { record.fflag == 0 ?
                                <div>
                                    <a className="ac-commit" onClick={() => this.submitLoan(text,record,index)}>提交</a>
                                    <span>|</span>
                                    <a className="ac-edit" onClick={() => this.editLoan(text,record,index)}>编辑</a>
                                    <span>|</span>
                                    <a className="ac-del" onClick={() => this.deleteLoan(text,record,index)}>删除</a>
                                </div>:
                                record.fflag === 2 ? 
                                    <a className="ac-commit" onClick={() => this.pay(text,record,index)}>缴费</a>:
                                record.fflag === 3 ?    
                                    <a className="ac-commit" onClick={() => this.dataLicense(text,record,index)}>数据授权</a>:
                                record.fflag === 4 ?    
                                    <UploadFile {...this.fileData} prefix={'person/'} onChange={this.onChange.bind(this)}>上传补充资料</UploadFile>:
                                    // <a className="ac-commit" onClick={() => this.uploadInfo(text,record,index)}>上传补充资料</a>:
                                record.fflag === 7 ?  
                                    <a className="ac-commit" onClick={() => this.sureBorrow(text,record,index)}>确认借款</a>:
                                ''    
                            }
                        </div>
                } 
            },
          ];
        const columns8_9 = [
            { 
                title: '借款金额', 
                align: 'center',
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.fcredit_money)}万元</span>
                }  
            },
            { 
                title: '借款期数',
                align: 'center',
                dataIndex: 'fcredit_month', 
                key: 'fcredit_month',
                render: (text,record) =>{
                    return <span>{record.fcredit_month}个月</span>
                }  
            },
            { 
                title: '借款利率',
                align: 'center',
                dataIndex: 'frate_predict', 
                key: 'frate_predict',
                render: (text,record) =>{
                    return <span>{record.frate_predict}%</span>
                } 
            },
            { 
                title: '创建日期', 
                align: 'center',
                dataIndex: 'fcreate_time', 
                key: 'fcreate_time',
                render: (text,record) =>{
                    return <span>{parseTime(record.fcreate_time,'{y}-{m}-{d} {h}:{i}')}</span>
                }
            },
            { 
                title: '状态', 
                align: 'center',
                dataIndex: 'state', 
                key: 'state',
                render: (text,record, index) =>{
                    return <span className="wait-commit">
                            •{getStatu(record.fflag)}
                        </span>
                } 
            },
            { 
                title: '操作', 
                align: 'center',
                dataIndex: '', 
                key: 'x',   
                render: (text,record,index) =>{
                    return <div className="action">
                            {
                                record.fflag === 9 ? 
                                <a className="ac-commit" onClick={() => this.fullProjectInfo(text,record,index)}>完善项目信息</a>:
                                ''
                            }
                            
                        </div>
                } 
            },
          ];
        //上线筹款    fflag = 10
        const columns10 = [
            { 
                title: '借款金额', 
                align: 'center',
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.fcredit_money)}万元</span>
                } 
            },
            { 
                title: '借款期数',
                align: 'center',
                dataIndex: 'fcredit_month', 
                key: 'fcredit_month' ,
                render: (text,record) =>{
                    return <span>{record.fcredit_month}个月</span>
                } 
            },
            { 
                title: '借款利率', 
                align: 'center',
                dataIndex: 'frate_last', 
                key: 'frate_last' ,
                render: (text,record) =>{
                    return <span>{record.frate_last}%</span>
                } 
            },
            { 
                title: '上线时间', 
                align: 'center',
                dataIndex: 'fpublish_time', 
                key: 'fpublish_time' ,
                render: (text,record) =>{
                    return <span>{parseTime(record.fpublish_time,'{y}-{m}-{d} {h}:{i}')}</span>
                }
            },
            { 
                title: '已筹金额',
                align: 'center',
                dataIndex: 'invMoney', 
                key: 'invMoney' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.invMoney)}万元</span>
                } 
            },
            { 
                title: '筹款进度',
                align: 'center',
                dataIndex: ' ', 
                key: ' ' ,
                render: (text,record) =>{
                    return <span>{loanDelay(record.fcredit_money,record.invMoney)}%</span>
                } 
            },
            { 
                title: '筹款时长', 
                align: 'center',
                dataIndex: 'loanTime', 
                key: 'loanTime' ,
                render: (text,record) =>{
                    return <span>{getTime(record.loanTime)}</span>
                }
            },
            { 
                title: '投资人数', 
                align: 'center',
                dataIndex: 'invCount,', 
                key: 'invCount,' ,
                render: (text,record) =>{
                    return <span>{record.invCount}人</span>
                }
            },
            { 
                title: '状态', 
                align: 'center',
                dataIndex: 'state', 
                key: 'state',
                render: (text,record, index) =>{
                    return <span className="wait-commit">
                            •{getStatu(record.fflag)}
                        </span>
                } 
            },
          ];
        //满标放款     fflag = 11
        const columns11 = [
            { 
                title: '借款金额', 
                align: 'center',
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.fcredit_money)}万元</span>
                } 
            },
            { 
                title: '借款期数',
                align: 'center',
                dataIndex: 'fcredit_month', 
                key: 'fcredit_month' ,
                render: (text,record) =>{
                    return <span>{record.fcredit_month}个月</span>
                } 
            },
            { 
                title: '借款利率', 
                align: 'center',
                dataIndex: 'frate_last', 
                key: 'frate_last' ,
                render: (text,record) =>{
                    return <span>{record.frate_last}%</span>
                } 
            },
            { 
                title: '满标时间', 
                align: 'center',
                dataIndex: 'fcollet_over_time', 
                key: 'fcollet_over_time' ,
                render: (text,record) =>{
                    return <span>{parseTime(record.fcollet_over_time,'{y}-{m}-{d} {h}:{i}')}</span>
                }
            },
            { 
                title: '筹款时长', 
                align: 'center',
                dataIndex: ' ', 
                key: ' ' ,
                render: (text,record) =>{
                    return <span>{getTime(record.fpublish_time,record.fcollet_over_time)}</span>
                }
            },
            { 
                title: '投资人数', 
                align: 'center',
                dataIndex: 'invCount,', 
                key: 'invCount,' ,
                render: (text,record) =>{
                    return <span>{record.invCount}人</span>
                }
            },
            { 
                title: '放款金额', 
                align: 'center',
                dataIndex: 'invMoney,', 
                key: 'invMoney,' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.invMoney)}万元</span>
                }
            },
            { 
                title: '状态', 
                align: 'center',
                dataIndex: 'state', 
                key: 'state',
                render: (text,record, index) =>{
                    return <span className="wait-commit">
                            •{getStatu(record.fflag)}
                        </span>
                } 
            },
          ];
        //按月还款  fflag = 12
        const columns12 = [
            { 
                title: '借款金额', 
                align: 'center',
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.fcredit_money)}万元</span>
                } 
            },
            { 
                title: '借款期数',
                align: 'center',
                dataIndex: 'fcredit_month', 
                key: 'fcredit_month' ,
                render: (text,record) =>{
                    return <span>{record.fcredit_month}个月</span>
                } 
            },
            { 
                title: '借款利率', 
                align: 'center',
                dataIndex: 'frate_last', 
                key: 'frate_last' ,
                render: (text,record) =>{
                    return <span>{record.frate_last}%</span>
                } 
            },
            { 
                title: '放款日期', 
                align: 'center',
                dataIndex: 'fcreate_time', 
                key: 'fcreate_time' ,
                render: (text,record) =>{
                    return <span>{parseTime(record.fcreate_time,'{y}-{m}-{d} {h}:{i}')}</span>
                }
            },
            { 
                title: '状态', 
                align: 'center',
                dataIndex: 'state', 
                key: 'state',
                render: (text,record, index) =>{
                    return <span className="wait-commit">
                            •{getStatu(record.fflag)}
                        </span>
                } 
            },
            { 
                title: '操作', 
                align: 'center',
                dataIndex: '', 
                key: 'x',   
                render: (text,record,index) =>{
                    return <div className="action">
                            <a className="ac-commit" onClick={() => this.payPlan(text,record,index)}>还款计划</a>
                          </div>
                } 
            },
          ];
        //fflag = 13
        const columns13 = [
            { 
                title: '借款金额', 
                align: 'center',
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.fcredit_money)}万元</span>
                }  
            },
            { 
                title: '借款期数',
                align: 'center',
                dataIndex: 'fcredit_month', 
                key: 'fcredit_month',
                render: (text,record) =>{
                    return <span>{record.fcredit_month}个月</span>
                }  
            },
            { 
                title: '借款利率',
                align: 'center',
                dataIndex: 'frate_predict', 
                key: 'frate_predict',
                render: (text,record) =>{
                    return <span>{record.frate_predict}%</span>
                } 
            },
            { 
                title: '还清日期', 
                align: 'center',
                dataIndex: 'fcreate_time', 
                key: 'fcreate_time',
                render: (text,record) =>{
                    return <span>{parseTime(record.fcreate_time,'{y}-{m}-{d} {h}:{i}')}</span>
                }
            },
            { 
                title: '状态', 
                align: 'center',
                dataIndex: 'state', 
                key: 'state',
                render: (text,record, index) =>{
                    return <span className="wait-commit">
                            •{getStatu(record.fflag)}
                        </span>
                } 
            },
            { 
                title: '操作', 
                align: 'center',
                dataIndex: '', 
                key: 'x',   
                render: (text,record,index) =>{
                    return <div className="action">
                            <a className="ac-commit" onClick={() => this.payPlan(text,record,index)}>还款计划</a>
                        </div>
                } 
            },
          ];
        
        this.props.data.map((item,index)=>{
            if(item.fflag === 13 || item.fflag === -1 || item.fflag === -3){
                // alredy.push(item)
            }else{
                doing.push(item)
            }
        })
        this.updatstate(doing);
        const locale = {
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '暂无数据',
          };
        // const info = [];
        const nowStep = [];
        const table = [];
        // const alredytable = [];
        if(this.state.status === 4){
            nowStep.push(<SureLoan></SureLoan>)
        }

        doing.map((item,index)=>{
            table.push(
                <div className="pe personal-rbody" style={{backgroundColor: '#fff',padding:' 30px 15px',marginTop: `${index === 0 ? 0 : '8px'}`}}>
                    <LoanTitle title="我的借款"></LoanTitle>
                    <LoanStep stepdata={item}></LoanStep>
                    <Table
                        bordered size="small"
                        locale={locale}
                        pagination={false}
                        dataSource={this.state.doingData}
                        columns={item.fflag <= 7 ? columns :
                            [8,9,14,15].includes(item.fflag) ? columns8_9 : 
                            item.fflag === 10 ? columns10 :
                            item.fflag === 12 ? columns12:
                            item.fflag === 11 ? columns11:
                            columns13}
                        rowClassName="editable-row"
                        loading={this.props.loading}
                    />
                    {item.fflag === 4 ? '请上传缺少的资料' : ''}
                    {item.fflag === 7 ? <SureLoan suredata={item}></SureLoan>: 
                    (item.fflag === 10 || item.fflag === 11) ? <InvestRecord indata={item}></InvestRecord> : 
                    item.fflag === 14 ? <SendCoupon coudata={item}></SendCoupon> : ''}
                </div>
            )
        })

        return(
            <div className="mineloan">
                {table}    
                {/* 投资咨询 */}
                <ConSult projectId={doing[0].fid}></ConSult>
                <Row className="personal-rbody" style={{marginTop:' 8px',padding: 0,backgroundColor: '#f5f5f5'}}>
                    {/* 公告 */}
                    <Notice projectId={doing[0].fid}></Notice>
                    {/* 历程 */}
                    <MineTimel projectId={doing[0].fid}></MineTimel>
                </Row>
                <DelModal ref="delmodal" visible={this.state.visible} content="确定要删除项目吗？" 
                          loading={this.state.loadingdel} comitDel={() => this.comitdeleteLoan()} 
                          cnacelDel={() => this.cnacelDel()} key="1"
                          sure="确定" cancel="取消"></DelModal>
            </div>
        )
    }
}

export default NoLoan;