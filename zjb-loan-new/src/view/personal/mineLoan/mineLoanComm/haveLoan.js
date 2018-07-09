/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:17:00 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-09 13:55:14
 * 有借款记录
 */
import React from 'react';
import LoanTitle from './loanTitle';
import LoanStep from './loanStep';
import SureLoan from './sureLoan';
import {connect} from 'dva';
import SendCoupon from './sendCoupon';
import Notice from '../notice/notice';
import ConSult from '../consult/consult';
import {columns,columnsi1,columns13, columnsi3} from './tableCloumes/tablecloumes'

import { Table } from 'antd';
import '../mineloan.scss'

@connect((state)=>({
    mineloan: state.mineloan,
    data: state.mineloan.data,
}))
class NoLoan extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            // data: [{
            //     howmang: '14.50万元',
            //     howlong: '8个月',
            //     states: 1,
            //     createtime: '2018-02-25 12:25:26',
            //     state: '项目初审',
            // }]
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
        console.log(columns,'columns')
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
                        columns={item.fflag <= 7 ? columns : columns13}
                        rowClassName="editable-row"
                        loading={this.state.loading}
                    />
                    {item.fflag === 7 ? <SureLoan suredata={item}></SureLoan> : ''}
                </div>
            )
        })

        alredy.map((item,index)=>{
            alredytable.push(
                <div className="pe personal-rbody" style={{backgroundColor: '#fff',padding:' 30px 15px',marginTop: '8px'}}>
                    <LoanTitle title="我的借款"></LoanTitle>
                    <LoanStep stepdata={item} type={0}></LoanStep>
                    <Table
                        bordered size="small"
                        locale={locale}
                        pagination={false}
                        dataSource={[item]}
                        columns={item.fflag === 13 ? columns13 : (item.fflag === -1 ? columnsi1 : (item.fflag === -3 ? columnsi3 : columns) )}
                        rowClassName="editable-row"
                        loading={this.state.loading}
                    />
                    <div className="zhang" style={{backgroundImage:`${this.getbgimg(item)}`}}></div>
                </div>
            )
        })

        return(
            <div className="mineloan">
                {table}    
                <ConSult></ConSult>
                <Notice></Notice>
                {alredytable}
            </div>
        )
    }
}

export default NoLoan;