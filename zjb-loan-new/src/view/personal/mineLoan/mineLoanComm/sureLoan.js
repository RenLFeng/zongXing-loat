/*
 * @Author: wfl 
 * @Date: 2018-07-04 18:42:28 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-11 17:46:53
 * 我的借款--确认借款 
 */
import React from 'react';
import './sureloan.scss';
import {connect} from 'dva';
import {parseTime, returnFloat} from '../dateformat/date';
import { Table, message } from 'antd';
import {mineloan} from '../../../../services/api';

class SureLoan extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            suredata: []
        }
    }

    componentDidMount(){
        this.getSureDate();
    }

    async getSureDate(){
        let data = {
            projectId: '7e67a4e04bce4fdaa3251a766853c7a5',//this.props.suredata.fid
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
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money',
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
                dataIndex: 'frate_predict', 
                key: 'frate_predict',
                render: (text,record) =>{
                    return <span>{record.frate_predict}%</span>
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
                dataIndex: 'fcreate_time', 
                key: 'fcreate_time',
                render: (text,record) =>{
                    return <span>{parseTime(record.fcreate_time,'{y}-{m}-{d} {h}:{i}')}</span>
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
                        dataSource={[this.props.suredata]}
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