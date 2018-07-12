/*
 * @Author: wfl 
 * @Date: 2018-07-10 10:56:56 
 * @Last Modified by:   wfl 
 * @Last Modified time: 2018-07-10 10:56:56 
 */
import {parseTime, returnFloat} from '../../dateformat/date';

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

export const columns = [
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
export const columns10 = [
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
        dataIndex: 'fcredit_month', 
        key: 'fcredit_month' ,
        render: (text,record) =>{
            return <span>{record.fcredit_month}%</span>
        } 
    },
    { 
        title: '筹款时长', 
        align: 'center',
        dataIndex: 'fcreate_time', 
        key: 'fcreate_time' ,
        render: (text,record) =>{
            return <span>{parseTime(record.fcreate_time,'{y}-{m}-{d} {h}:{i}')}</span>
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

//按月还款
export const columns12 = [
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

export const columns13 = [
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

export const columnsi1 = [
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

export const columnsi3 = [
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