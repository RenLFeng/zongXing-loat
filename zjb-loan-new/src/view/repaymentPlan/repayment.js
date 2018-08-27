import React from 'react';
import LeftMenu from '../../components/leftmenu/leftMenu';
import {Button,message,Checkbox,Modal,Spin } from 'antd';
import {personal,baseService} from '../../services/api';
import './repayment.scss';
import moment from 'moment';
import { NOTIFY_URL } from '../../common/SystemParam'


export default class Repayment extends React.Component {
    constructor(props){
      super();
      this.state = {
        paymentArr:[],
        recentRepay:[],
        project:{},
        date:null,
        word:'',
        check:true,   //第一个选框的状态
        project_:false,

        check_:true,   //前一个可选的选框的状态
        payMoney:'',
        repayInfo:{},//手动还款
        loading:false,
        visible:false,
        money:'',
        rate:'',
        monthL:'',
        Loading:false,
        earlyPay:{},   //提前还款
      }
    }

    componentDidMount(){
    this.getBorrowPlan();
       this.getTime()
    }


    getTime(){
        let myDate = new Date();//获取系统当前时间
        this.setState({
            date:moment(myDate.getTime()).format('YYYY/MM/DD HH:mm')
        })
    }

    //获取还款计划列表
    async getBorrowPlan (){
        const response = await baseService.getRepaymentPlan();
        console.log('还款计划',response)
        if(response.code === 0){
           this.setState({
            paymentArr:response.data.bills,
            recentRepay:response.data.RecentlyBorrows,
            project:response.data.project,
            payMoney:response.data.earlyPay,
           })
        }
        else if(response.code === 2){
           this.setState({
              project_:true
           })
        }
        else {
            response.msg && message.error(response.msg)
        }
    }

    onChange(e,index) {  
        console.log(`checked = ${e.target.checked}`);
        if (!e.target.checked) {
            for (let i = index ; i < this.state.recentRepay.length ; i++) {
                this.state.recentRepay[i].check = false;
            }
        }
        this.state.recentRepay[index].check = e.target.checked;
        this.setState({
            recentRepay: this.state.recentRepay
        })
      }
      
     //批量手动还款
      async getRepay(){
          let Arr=[];
          for(let i=0;i<this.state.recentRepay.length;i++){
             if(this.state.recentRepay[i].check === true){
                Arr.push({projectId:this.state.project.fid,forPayTime:this.state.recentRepay[i].forPayTime});
             }
          }
          if(Arr.length === 0){
              message.info('至少请选择一条数据');
              return;
          }
          this.manualReimbursement(Arr) 
      }

      //提前还款-获取还款金额
      async earlyPaymentGetInfo(){
          console.log(111111111111111)
          this.setState({visible:true})
          let id = {
            projectId:this.state.project.fid
          }
          const res  = await baseService.earlyRepayment(id);
          if(res.code === 0){
            this.setState({
                money:res.data.principalAmount,
                rate:res.data.interestAmount,
                month:res.data.fsurplus_phase,
              })
          } else {
              res.msg && message.error(res.msg)
          }  
      }
   
      //提前还款
      async earlyRepayment(){
          this.setState({Loading:true})
          let param = {
            projectId:this.state.project.fid,
            notifyPageUrl:`${NOTIFY_URL}/index/uCenter/receivePlan`,
          }
          const res  = await baseService.earlyPayment(param);
          console.log('提前还款',res)
          if(res.code === 0){
              this.setState({
                earlyPay:res.data,
                Loading:false,
                visible:false
              },()=>{
                this.formIds.submit();
                this.getBorrowPlan();
              })
          } else {
              this.setState({Loading:false})
              res.msg && message.error(res.msg)
          }
      }

      //手动还款
      async manualReimbursement(val){
          if(this.state.loading){
             return
          }
          let data = null;
          if(Array.isArray(val)){ 
             data = val;
          } else {
             data = [{projectId:this.state.project.fid,forPayTime:val.forPayTime}];
          }
          this.setState({loading:true})
          const res = await baseService.manualReimpayment(encodeURIComponent(`${NOTIFY_URL}/index/uCenter/receivePlan`),data);
          if(res.code === 0){
            this.setState({
                repayInfo:res.data,
                loading:false
            },()=>{
                this.formId.submit();
                Modal.success({
                    title: '提示',
                    content: (
                      <p>请在新页面中完成操作，之后刷新查看结果</p>
                    ),
                    onOk: () => {
                      this.getBorrowPlan();
                    },
                    onText: '确定'
                  });
            })
          } else if (res.code === 1) {
              this.setState({loading:false})
              Modal.success({
                title: '提示',
                content: (
                    <p>还款处理中，请稍后查看</p>
                ),
                onOk: () => {
                    this.getBorrowPlan();
                },
                onText: '确定'
             });
          } else {
            this.setState({loading:false})
            res.msg && message.error(res.msg);
          }
      }

    render(){
        
        const {paymentArr,recentRepay,project,repayInfo,earlyPay}  = this.state;
        return(
            <div>    
                <LeftMenu param={this.props} />
                
                   {
                         this.state.project_ ? 
                         <div className="fr uc-rbody F">
                            <p style={{textAlign:"center",color:'#999'}}>您当前没有还款记录</p>
                         </div>
                         :
                         <div className="fr uc-rbody F">
                         <div className="real_title">
                             <span className="safeCenter_">还款计划</span>
                         </div>
                         <span>近期应还</span>
                         {
                 
                            this.state.recentRepay.length > 0  ? 
                               <Button className="btn1" onClick={()=>this.getRepay()}>手动还款</Button>
                               : null}
                         {
                       
                            this.state.recentRepay.length > 0 ?  
                           
                              this.state.recentRepay.map((item,index)=>{
                                return(
                                      <div className="repay" key={index}> 
                                          <Checkbox checked={item.check} onChange={(e)=>this.onChange(e,index)} style={{marginLeft:10}} disabled={index === 0 ? false : !this.state.recentRepay[index-1].check} ></Checkbox>
                                          <span className="time">{moment(item.forPayTime).format('YYYY/MM/DD')}</span> 
                                          <span className="btns">
                                          {
                                              item.ispay ? '已还款' : '待还款'
                                          }
                                          </span>
                                          <div className="data">
                                              {item.fsort}/{project.fmonthLast}期
                                              <span style={{ margin: '0 5px 0 8px'}}>|</span>
                                              <span style={{color:'#f29827'}}> ￥{item.borrowInterest}</span>    
                                          </div>
                                          <span style={{marginLeft:55}}>本金：<span style={{width:100,display:'inline-block'}}>{item.principal}</span></span>
                                          <span >利息：<span style={{width:100,display:'inline-block'}}>{item.interest}</span></span>
                                          {
                                              item.overdueMoney === 0 ? null : <span style={{color:'#ff3b35'}}>逾期费：<span style={{width:100,display:'inline-block'}}>{item.overdueMoney}</span></span>
                                          }
                                          {
                                               item.overdueMoney === 0 ? 
                                               <p className="info" >&nbsp;</p>: 
                                               <p className="info" >
                                                 <span className="date">{this.state.date}</span>
                                                 <span style={{marginLeft:40}}>{item.fsort}/{project.fmonthLast}期还款已逾期<span style={{color:'#ff3b35'}}>{item.overdue}天</span>，逾期费用<span style={{color:'#ff3b35'}}>{item.overdueMoney}元</span>，为了不影响您的征信，请及时还款</span>
                                              </p>
                                          }
                                     
                                    </div>
                                  )
                            })  : <p style={{textAlign:"center",color:'#999'}}>您当前所有的投资项目皆已回款完毕</p> 
                           
                        }
                       
                        {
                      
                          this.state.recentRepay.filter(item => item.overdueMoney).length > 0 ?
                            <p style={{float:'right',color:'#ff3b35',marginTop:15,cursor:'pointer'}}><i className="zjb zjb-jinggao1" style={{fontSize:16,verticalAlign: 'middle',fontWeight:'bold',marginRight:5}}></i>逾期处罚措施</p> : null
                        }  
                     </div>      
                }
                {
                    this.state.project_ ? null :

                    <div className="fr uc-rbody S" style={{marginTop:10}} >
                    <div className="project">
                      <p><span style={{color:'#666666'}}>项目编号：</span>{project.fprojectNo}</p>
                      <p style={{marginTop:8}}><span style={{color:'#666666'}}>项目名称：</span>{project.fname}</p>
                      <div className="number">
                        <div className="money">
                          <p className="num">{project.fpracticalLoanMoney}</p>

                          <p className="word">借款金额（元）</p>
                        </div>
                        <div className="money">

                          <p className="num">{project.fmonthLast}<span style={{fontSize:14,fontWeight:'normal'}}>个月</span></p>
                          <p className="word">借款期数</p>
                        </div>
                        <div className="money">
                          <p className="num">{project.frateLast}<span style={{fontSize:14,fontWeight:'normal'}}>%</span></p>
                          <p className="word">借款利率（年化）</p>
                        </div>
                      </div>
                      <div style={{textAlign:"center"}}>

                         <Button className="button" onClick={()=>{this.earlyPaymentGetInfo()}}>提前还款</Button>
                         <p style={{paddingBottom:26,color:'#999999'}}>待还款总额：<span style={{color:'#f29827'}}>￥{this.state.payMoney}</span></p>
                      </div>
                    </div>
                   
                        <div>
                        
                            <p style={{color:"#999999",marginTop:18}}><span>计划还款时间</span><span style={{float:"right"}}>实际还款时间</span></p>
                            {
                                paymentArr.length > 0 ?
                               
                                paymentArr.map((data,index)=>{
                                    console.log('paymentArr',data,index,data[index])
                                    return(
                                        <div key={index}>
                                            { data.canPay ? 
                                                <div className="repays" > 
                                                    <span className="time">{moment(data.forPayTime).format('YYYY/MM/DD')}</span> 
                                                    {
                                                        data.ispay ?  <span className="btns_">已还款</span> :<span className="btns">待还款</span>
                                                    }  
                                                    <div className="data">
                                                
                                                        {data.fsort}/{project.fmonthLast}期
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
                                                    <span className="a" onClick={()=>this.manualReimbursement(data)}>手动还款</span> 
                                                    
                                                    {
                                                        data.overdueMoney > 0 ?
                                                        <p className="info_" >
                                                            <span className="date">{this.state.date}</span>
                                                            <span style={{marginLeft:20}}>{data.fsort}/{project.fmonthLast}期还款已逾期<span style={{color:'#ff3b35'}}>{data.overdue}天</span>，逾期费用<span style={{color:'#ff3b35'}}>{data.overdueMoney}元</span>，为了不影响您的征信，请及时还款</span>
                                                        </p> : null
                                                    }
                                                    
                                                </div> :
                                                <div className="repay_" key={index}> 
                                                    <span className="time">{moment(data.forPayTime).format('YYYY/MM/DD')}</span> 
                                                    {
                                                        data.ispay ?  <span className="btns_">已还款</span> :<span className="btns">待还款</span>
                                                    }  
                                                    <div className="data">
                                                    
                                                        {data.fsort}/{project.fmonthLast}期
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
                }


                <form ref={ref => this.formId = ref} id="form1" name="form1" action={repayInfo.submitURL} method="post" target="_blank">
                    <input id="Action" name="Action" value={repayInfo.action} type="hidden" />
                    <input id="ArrivalTime" name="ArrivalTime" value={repayInfo.arrivalTime} type="hidden" />
                    <input id="LoanJsonList" name="LoanJsonList" value={repayInfo.loanJsonList} type="hidden" />
                    <input id="NeedAudit" name="NeedAudit" value={repayInfo.needAudit} type="hidden" />
                    <input id="PlatformMoneymoremore" name="PlatformMoneymoremore" value={repayInfo.platformMoneymoremore} type="hidden" />
                    <input id="RandomTimeStamp" name="RandomTimeStamp" value={repayInfo.randomTimeStamp} type="hidden" />
                    <input id="TransferAction" name="TransferAction" value={repayInfo.transferAction} type="hidden" />
                    <input id="TransferType" name="TransferType" value={repayInfo.transferType} type="hidden" />
                    <input id="RandomTimeStamp" name="RandomTimeStamp" value={repayInfo.randomTimeStamp} type="hidden" />
                    <input id="Remark1" name="Remark1" value={repayInfo.remark1} type="hidden" />
                    <input id="Remark2" name="Remark2" value={repayInfo.remark2} type="hidden" />
                    <input id="Remark3" name="Remark3" value={repayInfo.remark3} type="hidden" />
                    <input id="ReturnURL" name="ReturnURL" value={repayInfo.returnURL} type="hidden" />
                    <input id="NotifyURL" name="NotifyURL" value={repayInfo.notifyURL} type="hidden" />
                    <input id="SignInfo" name="SignInfo" value={repayInfo.signInfo} type="hidden" />
                </form>

                <Modal
                    title="提示"
                    confirmLoading={this.state.Loading}
                    visible={this.state.visible}
                    onOk={() => this.earlyRepayment()}
                    onCancel={() => this.setState({ visible: false })}
                    okText="确认"
                    cancelText="取消"
                    >
                    <p>您确认进行提前还款吗?<br/>总计还款{`${this.state.money + this.state.rate}`.fm()}元,其中本金{`${this.state.money}`.fm()}元,利息{`${this.state.rate}`.fm()}元</p>
                </Modal>
                <form ref={ref => this.formIds = ref} id="form1" name="form1" action={earlyPay.submitURL} method="post" target="_blank">
                    <input id="Action" name="Action" value={earlyPay.action} type="hidden" />
                    <input id="ArrivalTime" name="ArrivalTime" value={earlyPay.arrivalTime} type="hidden" />
                    <input id="LoanJsonList" name="LoanJsonList" value={earlyPay.loanJsonList} type="hidden" />
                    <input id="NeedAudit" name="NeedAudit" value={earlyPay.needAudit} type="hidden" />
                    <input id="PlatformMoneymoremore" name="PlatformMoneymoremore" value={earlyPay.platformMoneymoremore} type="hidden" />
                    <input id="RandomTimeStamp" name="RandomTimeStamp" value={earlyPay.randomTimeStamp} type="hidden" />
                    <input id="TransferAction" name="TransferAction" value={earlyPay.transferAction} type="hidden" />
                    <input id="TransferType" name="TransferType" value={earlyPay.transferType} type="hidden" />
                    <input id="RandomTimeStamp" name="RandomTimeStamp" value={earlyPay.randomTimeStamp} type="hidden" />
                    <input id="Remark1" name="Remark1" value={earlyPay.remark1} type="hidden" />
                    <input id="Remark2" name="Remark2" value={earlyPay.remark2} type="hidden" />
                    <input id="Remark3" name="Remark3" value={earlyPay.remark3} type="hidden" />
                    <input id="ReturnURL" name="ReturnURL" value={earlyPay.returnURL} type="hidden" />
                    <input id="NotifyURL" name="NotifyURL" value={earlyPay.notifyURL} type="hidden" />
                    <input id="SignInfo" name="SignInfo" value={earlyPay.signInfo} type="hidden" />
                </form>
              
            </div>
        )
    }
}



