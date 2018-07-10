import React from 'react';
import LeftMenu from '../../components/leftmenu/leftMenu';
import {Button,message,Checkbox } from 'antd';
import {personal} from '../../services/api';
import './repayment.scss';
import moment from 'moment';


export default class Repayment extends React.Component {
    constructor(props){
      super();
      this.state = {
        paymentArr:[],
        recentRepay:{},
        project:{},
        date:null,
      }
    }

    componentDidMount(){
        this.getBorrowPlan();
       this.getTime()
    }


    getTime(){
        let myDate = new Date();//获取系统当前时间
        myDate.getTime();
        console.log('0000',moment(myDate.getTime()).format('YYYY/MM/DD HH:mm:ss'))
        this.setState({
            date:moment(myDate.getTime()).format('YYYY/MM/DD HH:mm')
        })
    }

    async getBorrowPlan (){
        const response = await personal.borrowPlan();
        console.log('response',response)
        if(response.code === 0){
           this.setState({
            paymentArr:response.data.bills,
            recentRepay:response.data.recentBill,
            project:response.data.project,
           })
        } else {
            response.msg && message.error(response.msg)
        }
    }

    onChange(e) {
        console.log(`checked = ${e.target.checked}`);
      }

    render(){
        const {paymentArr,recentRepay,project}  = this.state;
        return(
            <div>
                <LeftMenu param={this.props} />
                <div className="fr uc-rbody F">
                    <div className="real_title">
                        <span className="safeCenter_">还款计划</span>
                    </div>
                    <p >
                        <span>近期应还</span>
                        <Button className="btn1">手动还款</Button>
                    </p>
                    <div className="repay"> 
                         <Checkbox onChange={this.onChange} style={{marginLeft:10}}></Checkbox>
                         <span className="time">{moment(recentRepay.forPayTime).format('YYYY/MM/DD')}</span> 
                         <span className="btns">
                         {
                             recentRepay.ispay ? '已还款' : '待还款'
                         }
                         </span>
                         <div className="data">
                             {recentRepay.fsort}/{project.fcreditMonth}期
                             <span style={{ margin: '0 5px 0 8px'}}>|</span>
                             <span style={{color:'#f29827'}}> ￥{recentRepay.borrowInterest}</span>    
                         </div>
                         <span style={{marginLeft:55}}>本金：<span style={{width:100,display:'inline-block'}}>{recentRepay.principal}</span></span>
                         <span >利息：<span style={{width:100,display:'inline-block'}}>{recentRepay.interest}</span></span>
                         <span style={{color:'#ff3b35'}}>逾期费：<span style={{width:100,display:'inline-block'}}>{recentRepay.overdueMoney}</span></span>
                         <span className="a">
                         {/* {
                             recentRepay.canPay ? '手动还款':''
                         } */}
                         </span>
                        <p className="info" >
                            <span className="date">{this.state.date}</span>
                            <span style={{marginLeft:40}}>{recentRepay.fsort}/{project.fcreditMonth}期还款已逾期<span style={{color:'#ff3b35'}}>{recentRepay.overdue}天</span>，逾期费用<span style={{color:'#ff3b35'}}>{recentRepay.overdueMoney}元</span>，为了不影响您的征信，请及时还款</span>
                        </p>
                    </div>

                    <div className="repay"> 
                         <Checkbox onChange={this.onChange} style={{marginLeft:10}}></Checkbox>
                         <span className="time">{moment(recentRepay.forPayTime).format('YYYY/MM/DD')}</span> 
                         <span className="btns">
                         {
                             recentRepay.ispay ? '已还款' : '待还款'
                         }
                         </span>
                         <div className="data">
                             {recentRepay.fsort}/{project.fcreditMonth}期
                             <span style={{ margin: '0 5px 0 8px'}}>|</span>
                             <span style={{color:'#f29827'}}> ￥{recentRepay.borrowInterest}</span>    
                         </div>
                         <span style={{marginLeft:55}}>本金：<span style={{width:100,display:'inline-block'}}>{recentRepay.principal}</span></span>
                         <span >利息：<span style={{width:100,display:'inline-block'}}>{recentRepay.interest}</span></span>
                         <span style={{color:'#ff3b35'}}>逾期费：<span style={{width:100,display:'inline-block'}}>{recentRepay.overdueMoney}</span></span>
                         <span className="a">
                         {/* {
                             recentRepay.canPay ? '手动还款':''
                         } */}
                         </span>
                        <p className="info" >
                            <span className="date">{this.state.date}</span>
                            <span style={{marginLeft:40}}>{recentRepay.fsort}/{project.fcreditMonth}期还款已逾期<span style={{color:'#ff3b35'}}>{recentRepay.overdue}天</span>，逾期费用<span style={{color:'#ff3b35'}}>{recentRepay.overdueMoney}元</span>，为了不影响您的征信，请及时还款</span>
                        </p>
                    </div>
                   
                    <p style={{float:'right',color:'#ff3b35',marginTop:15,cursor:'pointer'}}><i className="zjb zjb-jinggao1" style={{fontSize:16,verticalAlign: 'middle',fontWeight:'bold',marginRight:5}}></i>逾期处罚措施</p>
                </div>

                <div className="fr uc-rbody S" style={{marginTop:10}}>
                   <div className="project">
                     <p><span style={{color:'#666666'}}>项目编号：</span>{project.fprojectNo}</p>
                     <p style={{marginTop:8}}><span style={{color:'#666666'}}>项目名称：</span>{project.fname}</p>
                     <div className="number">
                       <div className="money">
                         <p className="num">{project.fpracticalLoanMoney}</p>
                         <p className="word">借款金额（万元）</p>
                       </div>
                       <div className="money">
                         <p className="num">{project.fcreditMonth}<span style={{fontSize:14,fontWeight:'normal'}}>个月</span></p>
                         <p className="word">借款期数</p>
                       </div>
                       <div className="money">
                         <p className="num">{project.frateLast}<span style={{fontSize:14,fontWeight:'normal'}}>%</span></p>
                         <p className="word">借款利率（年化）</p>
                       </div>
                     </div>
                     <div style={{textAlign:"center"}}>
                        <Button className="button">提前还款</Button>
                        <p style={{paddingBottom:26,color:'#999999'}}>待还款总额：<span style={{color:'#f29827'}}>￥123456.12</span></p>
                     </div>
                   </div>

                   <div>
                       <p style={{color:"#999999",marginTop:18}}><span>计划还款时间</span><span style={{float:"right"}}>实际还款时间</span></p>
                       {
                           paymentArr.length > 0 ?
                           paymentArr.map((data,index)=>{
                               return(
                                   <div key={index}>
                                       { data.canPay ? 
                                            <div className="repays" > 
                                                <span className="time">{moment(data.forPayTime).format('YYYY/MM/DD')}</span> 
                                                {
                                                    data.ispay ?  <span className="btns_">已还款</span> :<span className="btns">待还款</span>
                                                }  
                                                <div className="data">
                                                    {data.fsort}/{project.fcreditMonth}期
                                                    <span style={{ margin: '0 5px 0 8px'}}>|</span>
                                                    <span style={{color:'#f29827'}}> ￥{data.borrowInterest}</span>    
                                                </div>
                                                <span style={{marginLeft:55}}>本金：<span style={{width:80,display:'inline-block'}}>{data.principal}</span></span>
                                                <span >利息：<span style={{width:80,display:'inline-block'}}>{data.interest}</span></span>
                                                {
                                                    data.overdueMoney > 0 ? 
                                                    <span style={{color:'#ff3b35'}}>逾期费：<span style={{width:80,display:'inline-block'}}>{data.overdueMoney}</span></span>:
                                                    null
                                                }
                                                <span className="times">
                                                {
                                                    data.payTime === null ? '': moment( data.payTime).format('YYYY/MM/DD HH:mm:ss')
                                                }
                                                </span>
                                                <span className="a">手动还款</span>
                                               
                                         
                                                     {/* <div > */}
                                                        <p className="info_" >
                                                            <span className="date">{this.state.date}</span>
                                                            <span style={{marginLeft:20}}>{data.fsort}/{project.fcreditMonth}期还款已逾期<span style={{color:'#ff3b35'}}>{data.overdue}天</span>，逾期费用<span style={{color:'#ff3b35'}}>{data.overdueMoney}元</span>，为了不影响您的征信，请及时还款</span>
                                                        </p>
{/*                                                       
                                                        <p style={{float:'right',color:'#ff3b35',cursor:'pointer'}}>
                                                        <i className="zjb zjb-jinggao1" style={{width:23,height:23}}></i>
                                                        逾期处罚措施</p> */}
                                                    {/* </div>    */}
                                            </div> :
                                            <div className="repay_" key={index}> 
                                                <span className="time">{moment(data.forPayTime).format('YYYY/MM/DD')}</span> 
                                                {
                                                    data.ispay ?  <span className="btns_">已还款</span> :<span className="btns">待还款</span>
                                                }  
                                                <div className="data">
                                                    {data.fsort}/{project.fcreditMonth}期
                                                    <span style={{ margin: '0 5px 0 8px'}}>|</span>
                                                    <span style={{color:'#f29827'}}> ￥{data.borrowInterest}</span>    
                                                </div>
                                                <span style={{marginLeft:55}}>本金：<span style={{width:80,display:'inline-block'}}>{data.principal}</span></span>
                                                <span >利息：<span style={{width:80,display:'inline-block'}}>{data.interest}</span></span>
                                                {
                                                    data.overdueMoney > 0 ? 
                                                    <span style={{color:'#ff3b35'}}>逾期费：<span style={{width:80,display:'inline-block'}}>{data.overdueMoney}</span></span>:
                                                    null
                                                }
                                                
                                                <span className="times">
                                                {
                                                    data.payTime === null ? '': moment( data.payTime).format('YYYY/MM/DD HH:mm:ss')
                                                }
                                                </span>
                                               
                                            </div> 

                                }
                                   </div>
                               
                               )
                           }) : <p style={{textAlign:'center',marginTop:30}}>暂无数据</p>
                       }
                        
                       

                   </div>
                </div>

            </div>
        )
    }
}



