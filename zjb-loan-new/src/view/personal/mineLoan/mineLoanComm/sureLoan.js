/*
 * @Author: wfl 
 * @Date: 2018-07-04 18:42:28 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-05 10:26:17
 * 我的借款--确认借款 
 */
import React from 'react';
import './sureloan.scss';
import {connect} from 'dva';
import { Table } from 'antd';

class SureLoan extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            data: [
                {
                    howmang: '10.00万元',
                    howlong: '3个月',
                    rate: '9%',
                    rank: 'A',
                    time: '2018-06-06 11:56:34',
                }
            ]
        }
    }

    agree(){

    }

    unagree(){

    }

    stopSubject(){

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
                title: '借款金额', 
                align: 'center',
                dataIndex: 'howmang', 
                key: 'howmang' 
            },
            { 
                title: '借款期数',
                align: 'center',
                dataIndex: 'howlong', 
                key: 'howlong' 
            },
            { 
                title: '借款利率', 
                align: 'center',
                dataIndex: 'rate', 
                key: 'rate' 
            },
            { 
                title: '项目评级', 
                align: 'center',
                dataIndex: 'rank', 
                key: 'rank',
            },
            { 
                title: '评级时间', 
                align: 'center',
                dataIndex: 'time', 
                key: 'time',
            },
          ];

        return(
            <div className="sure-loan">
                <p>项目编号:<span>P18060006</span></p>
                <p>项目名称:<span>海底捞火锅新店扩张</span></p>
                <div className="table-bg">
                    <Table
                        bordered size="small"
                        locale={locale}
                        pagination={false}
                        dataSource={this.state.data}
                        columns={columns}
                        rowClassName="editable-row"
                        loading={this.state.loading}
                    />
                </div>
                <p>备注:<span>这是备注</span></p> 
                <div className="ac-button">
                    <a className="agree" onClick={this.agree()}>同意</a>
                    <a className="unagree" onClick={this.unagree()}>不同意</a>
                    <a className="stop" onClick={this.stopSubject()}>终止项目</a>
                </div>
            </div>
        )
    }
}
export default SureLoan;