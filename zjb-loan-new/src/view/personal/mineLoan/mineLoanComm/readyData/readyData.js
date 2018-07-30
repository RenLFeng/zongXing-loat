/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:17:00 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-26 13:47:35
 * 有借款记录
 */
import React from 'react';
import LoanTitle from '../loanTitle';
import LoanStep from '../loanStep';
import {connect} from 'dva';
import {parseTime, returnFloat, getTime} from '../../dateformat/date';
import { Table } from 'antd';
import '../../mineloan.scss';
import { conversionTime, sumFundraisingProgress } from '../../../../../common/SystemParam'; 
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

class ReadyData extends React.Component{
    
    getbgimg(item){
        if(item.fflag === 13){
            return  `url(${require('../../img/re.png')})`
        }else if(item.fflag === -1){
            return  `url(${require('../../img/lb.png')})`
        }else{
            return  `url(${require('../../img/zz.png')})`
        }
    }
    render(){
        const locale = {
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '暂无数据',
          };
        //fflag = 13
        const columns13 = [
            { 
                title: '借款金额', 
                align: 'center',
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money' ,
                render: (text,record) =>{
                    if (text) {
                        return <span>{(text/10000).toString().fm()}万元</span>
                    }
                    return <span> </span>
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
        //fflag = -1
        const columnsi1 = [
            { 
                title: '借款金额', 
                align: 'center',
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money' ,
                render: (text,record) =>{
                    if (text) {
                        return <span>{(text/10000).toString().fm()}万元</span>
                    }
                    return <span> </span>
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
                dataIndex: 'fpublish_time', 
                key: 'fpublish_time',
                render: (text,record) =>{
                    return <span>{parseTime(record.fpublish_time,'{y}-{m}-{d} {h}:{i}')}</span>
                }
            },
            { 
                title: '已筹金额',
                align: 'center',
                dataIndex: 'invMoney', 
                key: 'invMoney',
                render: (text,record) =>{
                    if (text) {
                        return <span>{(text/10000).toString().fm()}万元</span>
                    }
                    return <span> </span>
                }  
            },
            { 
                title: '筹款进度',
                align: 'center',
                dataIndex: 'frate_predict', 
                key: 'frate_predict',
                render: (text,record) =>{
                    return <span>{sumFundraisingProgress(record.fcredit_money, record.invMoney)}%</span>
                } 
            }, 
            { 
                title: '筹款时长',
                align: 'center',
                dataIndex: 'loanTime', 
                key: 'loanTime',
                render: (text,record) =>{
                    return <span>{conversionTime(text)}</span>
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
        //fflag = -3
        const columnsi3 = [
            { 
                title: '借款金额', 
                align: 'center',
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money' ,
                render: (text,record) =>{
                    if (text) {
                        return <span>{(text/10000).toString().fm()}万元</span>
                    }
                    return <span> </span>
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
          ];
        const alredy = [];
        const alredytable = [];
        this.props.data.map((item,index)=>{
            if(item.fflag === 13 || item.fflag === -1 || item.fflag === -3){
                alredy.push(item)
            }
        })
        alredy.map((item,index)=>{
            alredytable.push(
                    <div style={{ margin:' 20px 0'}} key={index}>
                        <LoanStep stepdata={item} type={0}></LoanStep>
                        <Table
                            bordered size="small"
                            locale={locale}
                            pagination={false}
                            dataSource={[item]}
                            columns={item.fflag === 13 ? columns13 : (item.fflag === -1 ? columnsi1 : (item.fflag === -3 ? columnsi3 : '') )}
                            rowClassName="editable-row"
                            loading={this.props.loading}
                        />
                        <div className="zhang" style={{backgroundImage:`${this.getbgimg(item)}`}}></div>
                    </div>
            )
        })
        return(
            <div className="mineloan">
            {
               alredytable.length > 0 
               ?  
                    <div className="pe personal-rbody" style={{backgroundColor: '#fff',padding:' 30px',marginTop: '8px'}}>
                            <LoanTitle title="历史借款"></LoanTitle>
                            {/* 历史借款 */}
                            {alredytable}
                    </div>
               :
                    ''
            }
                
            </div>
        )
    }
}

export default ReadyData;