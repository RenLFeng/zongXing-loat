/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:17:00 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-11 09:40:35
 * 有借款记录
 */
import React from 'react';
import LoanTitle from './loanTitle';
import LoanStep from './loanStep';
import SureLoan from './sureLoan';
import MineTimel from '../minetime/minetimeline';
import InvestRecord from '../investRecord/investRecord';
import {connect} from 'dva';
import SendCoupon from './sendCoupon';
import Notice from '../notice/notice';
import ConSult from '../consult/consult';
import {Row, Col} from 'antd';
import {parseTime, returnFloat, getTime} from '../dateformat/date';
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
            return '待配置问题';
        case 5:
            return '待背调';   
        case 6:
            return '待委员会审核';
        case 7:
            return '待确认借款';
        case 8:
            return '待排版发布';
        case 9:
            return '待客户确认排版';
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
    constructor(props){
        super(props);
        this.state = {

        }
    };

    submitLoan(text,record,index){
        console.log(text,record,index)
    }

    editLoan(text,record,index){
        console.log(text,record,index)
    }

    deleteLoan(text,record,index){
        console.log(text,record,index)
    }
    componentDidMount(){
       
    }

    getbgimg(item){
        if(item.fflag === 13){
            return  `url(${require('../img/re.png')})`
        }else if(item.fflag === -1){
            return  `url(${require('../img/lb.png')})`
        }else{
            return  `url(${require('../img/zz.png')})`
        }
    }

    render(){
        const alredy = [];
        const doing = [];
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
                            { record.fflag === 0 ?
                                <div>
                                    <a className="ac-commit" onClick={() => this.submitLoan(text,record,index)}>提交</a>
                                    <span>|</span>
                                    <a className="ac-edit" onClick={() => this.editLoan(text,record,index)}>编辑</a>
                                    <span>|</span>
                                    <a className="ac-del" onClick={() => this.deleteLoan(record.key)}>删除</a>
                                </div>:
                                ''
                            }
                        </div>
                } 
            },
          ];
        //上线筹款  
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
                    return <span>{Math.floor(((record.fcredit_money - record.invMoney) / record.fcredit_money) * 100 / 100) * 100}%</span>
                } 
            },
            { 
                title: '筹款时长', 
                align: 'center',
                dataIndex: 'fcreate_time', 
                key: 'fcreate_time' ,
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
        //满标放款  
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
        //按月还款
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
                            <a className="ac-commit" onClick={() => this.submitLoan(text,record,index)}>还款计划</a>
                          </div>
                } 
            },
          ];
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
                        </div>
                } 
            },
          ];
        const columnsi1 = [
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
                title: '上线时间', 
                align: 'center',
                dataIndex: 'fcreate_time', 
                key: 'fcreate_time',
                render: (text,record) =>{
                    return <span>{parseTime(record.fcreate_time,'{y}-{m}-{d} {h}:{i}')}</span>
                }
            },
            { 
                title: '已筹金额',
                align: 'center',
                dataIndex: 'fcredit_month', 
                key: 'fcredit_month',
                render: (text,record) =>{
                    return <span>{record.fcredit_month}个月</span>
                }  
            },
            { 
                title: '筹款进度',
                align: 'center',
                dataIndex: 'frate_predict', 
                key: 'frate_predict',
                render: (text,record) =>{
                    return <span>{record.frate_predict}%</span>
                } 
            }, 
            { 
                title: '筹款时长',
                align: 'center',
                dataIndex: 'frate_predict', 
                key: 'frate_predict',
                render: (text,record) =>{
                    return <span>{parseTime(record.fcreate_time,'{d} {h}:{i}:{s}')}</span>
                } 
            }, 
            { 
                title: '投资人数',
                align: 'center',
                dataIndex: 'invCount', 
                key: 'invCount',
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
                    return <span style={{color:'red'}}>
                            •{getStatu(record.fflag)}
                        </span>
                } 
            },
          ];
        const columnsi3 = [
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
                title: '创建时间', 
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
                        </div>
                } 
            },
          ];

        this.props.data.map((item,index)=>{
            if(item.fflag === 13 || item.fflag === -1 || item.fflag === -3){
                alredy.push(item)
            }else{
                doing.push(item)
            }
        })
        const locale = {
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '暂无数据',
          };
        // const info = [];
        const nowStep = [];
        const isConsult = [];
        const table = [];
        const alredytable = [];
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
                        dataSource={[item]}
                        columns={item.fflag <= 7 ? columns : 
                            item.fflag == 10 ? columns10 :
                            item.fflag == 12 ? columns12:
                            item.fflag == 11 ? columns11:
                            columns13}
                        rowClassName="editable-row"
                        loading={this.props.loading}
                    />
                    {item.fflag === 7 ? <SureLoan suredata={item}></SureLoan>: 
                      item.fflag === 10 ? <InvestRecord indata={item}></InvestRecord> : 
                      item.fflag === 11 ? <SendCoupon coudata={item}></SendCoupon> : ''}
                </div>
            )
        })

        alredy.map((item,index)=>{
            alredytable.push(
                    <div style={{ margin:' 20px 0'}}>
                        <LoanStep stepdata={item} type={0}></LoanStep>
                        <Table
                            bordered size="small"
                            locale={locale}
                            pagination={false}
                            dataSource={[item]}
                            columns={item.fflag === 13 ? columns13 : (item.fflag === -1 ? columnsi1 : (item.fflag === -3 ? columnsi3 : columns) )}
                            rowClassName="editable-row"
                            loading={this.props.loading}
                        />
                        <div className="zhang" style={{backgroundImage:`${this.getbgimg(item)}`}}></div>
                    </div>
            )
        })

        return(
            <div className="mineloan">
                {table}    
                <ConSult></ConSult>
                <Row className="personal-rbody" style={{marginTop:' 8px',padding: 0,backgroundColor: '#f5f5f5'}}>
                    {/* <Col span={16}> */}
                <Notice></Notice>
                    {/* </Col> */}
                    {/* <Col span={8}> */}
                <MineTimel></MineTimel>
                    {/* </Col> */}
                </Row>
                <div className="pe personal-rbody" style={{backgroundColor: '#fff',padding:' 30px 15px',marginTop: '8px'}}>
                    <LoanTitle title="历史记录"></LoanTitle>
                    {alredytable}
                </div>
            </div>
        )
    }
}

export default NoLoan;