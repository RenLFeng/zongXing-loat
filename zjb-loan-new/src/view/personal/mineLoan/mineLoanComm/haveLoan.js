import React from 'react';
import LoanTitle from './loanTitle';
import { Table } from 'antd';
import '../mineloan.scss'

class NoLoan extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: []
        }
    }
    render(){
        const columns = [
            { 
                title: '要借多钱', 
                dataIndex: 'howmang', 
                key: 'howmang' 
            },
            { 
                title: '要借多久',
                dataIndex: 'howlong', 
                key: 'howlong' },
            { 
                title: '创建时间', 
                dataIndex: 'createtime', 
                key: 'createtime' },
            { 
                title: '状态', 
                dataIndex: 'state', 
                key: 'state' },
            { 
                title: '操作', 
                dataIndex: '', 
                key: 'x', 
                render: function(text,record,index){
                    console.log(text,record,index)
                } 
            },
          ];
        return(
            <div className="mineloan">
                <div className="pe personal-rbody" style={{backgroundColor: '#fff',padding:' 30px 15px'}}>
                    <LoanTitle></LoanTitle>
                        <Table
                            bordered size="small"
                            dataSource={this.state.data}
                            columns={columns}
                            rowClassName="editable-row"
                        />
                </div>
            </div>
        )
    }
}

export default NoLoan;