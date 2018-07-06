/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:17:00 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-04 18:51:10
 * 有借款记录
 */
import React from 'react';
import LoanTitle from './loanTitle';
import LoanStep from './loanStep';
import SureLoan from './sureLoan';
import { Table } from 'antd';
import '../mineloan.scss'

class NoLoan extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            status: 4,
            data: [{
                howmang: '8.00万元',
                howlong: '11个月',
                createtime: '2018-06-25 12:25:26',
                states: 0,
                state: '待提交'
            },{
                howmang: '14.50万元',
                howlong: '8个月',
                states: 1,
                createtime: '2018-02-25 12:25:26',
                state: '项目初审',
            }]
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
        setTimeout(() => {
            this.setState({
                loading: false
            })
        },2000)
    }
    render(){
        const locale = {
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '暂无数据',
          };
        const columns = [
            { 
                title: '要借多钱', 
                align: 'center',
                dataIndex: 'howmang', 
                key: 'howmang' 
            },
            { 
                title: '要借多久',
                align: 'center',
                dataIndex: 'howlong', 
                key: 'howlong' 
            },
            { 
                title: '创建时间', 
                align: 'center',
                dataIndex: 'createtime', 
                key: 'createtime' 
            },
            { 
                title: '状态', 
                align: 'center',
                dataIndex: 'state', 
                key: 'state',
                render: (text,record, index) =>{
                    if(record.states === 0){
                        return <span className="wait-commit">•{record.state}</span>
                    }else if(record.states === 1){
                        return <p><span className="wait-apply">•{record.state}</span>(待初审)</p>
                    }
                } 
            },
            { 
                title: '操作', 
                align: 'center',
                dataIndex: '', 
                key: 'x',   
                render: (text,record,index) =>{
                    return <div className="action">
                            <a className="ac-commit" onClick={() => this.submitLoan(text,record,index)}>提交</a>
                            <span>|</span>
                            <a className="ac-edit" onClick={() => this.editLoan(text,record,index)}>编辑</a>
                            <span>|</span>
                            <a className="ac-del" onClick={() => this.deleteLoan(record.key)}>删除</a>
                        </div>
                } 
            },
          ];
        
        const info = [];
        const nowStep = [];
        if(this.state.status === 4){
            nowStep.push(<SureLoan></SureLoan>)
        }
        return(
            <div className="mineloan">
                <div className="pe personal-rbody" style={{backgroundColor: '#fff',padding:' 30px 15px'}}>
                    <LoanTitle></LoanTitle>
                    <LoanStep></LoanStep>
                        <Table
                            bordered size="small"
                            locale={locale}
                            pagination={false}
                            dataSource={this.state.data}
                            columns={columns}
                            rowClassName="editable-row"
                            loading={this.state.loading}
                        />
                    {info}    
                    {nowStep}
                </div>
            </div>
        )
    }
}

export default NoLoan;