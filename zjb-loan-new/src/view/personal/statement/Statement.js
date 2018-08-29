import React from 'react';
import './statement.scss';
import moment from 'moment';
class Statement extends React.Component {
    constructor(props) {
        super(props); 
        this.setPageData(props);
    }
    componentWillReceiveProps(props){
        this.setPageData(props);
    }
    setPageData(props){
        let typeName =''
        if(this.props.data.busType==='1201'){
            typeName='充值';
        }else if(this.props.data.busType==='1301'){
            typeName='提现';
        }else if(this.props.data.busType==='1404'){
            typeName='投资';
        }else if(this.props.data.busType==='1405'){
            typeName='还款';
        }else{
          typeName = this.props.data.busName;
        }
        this.state={
            data : this.props.data,
            typeName:typeName,
        } 
    }
    //业务类型码: 
    //1201:充值
    //1301：提现
    //1405：还款
    //1404：投资 
    render() { 
        console.log('this.state.data',this.state.data)
        return (  
            <div className='cp-sm'>
               <div className='sm-left'> 
                    {
                        this.props.showTitle?<p>可用余额</p>:<p>&nbsp;</p>
                    } 
                    <p>￥{this.state.data.fendMoney}</p>
               </div> 
               <div className='sm-right'> 
                    <p>{this.state.data.ftime?moment(this.state.data.ftime).format('YYYY/MM/DD HH:mm'):'----/--/--/ --:--'}</p>
                    <p>{this.state.data.finMoney > 0 ? '+' + this.state.typeName : '-' + this.state.typeName}</p>
                    <div className='text1'>
                        {/* 金额 */}
                        {
                            //充值 提现
                            //this.state.data.busType==='1201'|| this.state.data.busType==='1301'?  <span className='span1'>￥{String(this.state.data.resultObj.famount).fm()}</span>:null
                        } 
                        {
                            //投资
                            //this.state.data.busType==='1404'&& this.state.data.resultObj ? <span  className='span1'>￥{String(this.state.data.resultObj.invAmount).fm()}</span>:null
                        } 
                        { <span className='span1'>￥{this.state.data.finMoney > 0 ? String(this.state.data.finMoney).fm() : this.state.data.foutMoney}</span>}
                        
                        {
                            //提现银行卡卡号
                           this.state.data.busType==='1301'?
                           <span className='span2'>{this.state.data.resultObj && this.state.data.resultObj.bankName||''}  尾号{this.state.data.resultObj.fcardNo.substring(this.state.data.resultObj.fcardNo.length-4)}</span>
                           :null
                        } 

                        {/* 结果 */}
                        {
                            this.state.data.resultCode && this.state.data.resultCode==='88'? <span className='msg success'>成功</span>:null
                        }
                        {
                            this.state.data.resultCode && this.state.data.resultCode==='90'&&this.state.data.busType !='1405'? <span className='msg todo'>正在处理中…… </span>:null
                        }
                        {
                            this.state.data.resultCode && this.state.data.resultCode !='88' && this.state.data.resultCode !='90' ? <span className='msg error'>失败（{this.state.data.resultMessage}）</span>:null
                        } 
                  
                    </div>
                    {
                        this.state.data.busType==='1301' && this.state.data.famount && this.state.data.fuserFeeWithdraw?
                        <div className='sm-tx'> 
                            <p>手续费：￥{this.state.data.fuserFeeWithdraw?(String(this.state.data.fuserFeeWithdraw).fm()||'0'):''}</p>
                            <p>到账金额：￥{String(this.state.data.famount -  this.state.data.fuserFeeWithdraw).fm()||'0'}</p>
                        </div>:null
                    } 
                    {
                        this.state.data.busType==='1405'&&this.state.data.resultObj?
                        <div className='text2'>
                            <span style={{width:120,color:'#999'}}>{this.state.data.resultObj.periods}/{this.state.data.resultObj.totalPeriods}期还款</span>
                            <span style={{width:150,color:'#999'}}>本金:￥{String(this.state.data.resultObj.fprincipal).fm()||'0'}</span>  
                            <span style={{width:150,color:'#999'}}>利息:￥{String(this.state.data.resultObj.finterest).fm()||'0'}</span> 
                            <span style={{width:150,color:'#FF0000'}}>逾期费:￥{String(this.state.data.resultObj.sumOverdueAmount).fm()||'0'}</span> 
                        </div>:null
                    } 
                   
                    {
                       this.state.data.busType==='1403'&& this.state.data.resultObj?
                       <div className='sm-tz'>
                            <p>项目借款金额:￥{String(this.state.data.resultObj.loanAmount).fm() || '0'}</p>
                            <p>项目编号：{this.state.data.resultObj.projectNo}</p>
                            <p>项目名称：{this.state.data.resultObj.projectName}</p>
                        </div> :null
                   } 
                   {
                       this.state.data.busType==='1405'&& this.state.data.resultObj?
                       <div className='sm-tz'>
                            <p>项目编号：{this.state.data.resultObj.projectNo}</p>
                            <p>项目名称：{this.state.data.resultObj.projectName}</p>
                        </div> :null
                   } 
                    <i></i>
               </div>
            </div>

         )
    }
}
 
export default Statement;
