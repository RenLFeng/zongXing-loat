import React from 'react';
import LeftMenu from '../../components/leftmenu/leftMenu';
import {Button,message,Checkbox } from 'antd';
import {personal,baseService} from '../../services/api';
import './repayment.scss';
import moment from 'moment';


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
        check_:true   //前一个可选的选框的状态
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

    async getBorrowPlan (){
        const response = await baseService.getRepaymentPlan();
        console.log('还款计划',response)
        if(response.code === 0){
           this.setState({
            paymentArr:response.data.bills,
            recentRepay:response.data.RecentlyBorrows,
            project:response.data.project,
           },()=>console.log(JSON.stringify(this.state.recentRepay)))
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
        }, ()=>{
            console.log(this.state.recentRepay)
        })
      }

      getRepay(){
          let Arr=[];
          for(let i=0;i<this.state.recentRepay.length;i++){
             if(this.state.recentRepay[i].check === true){
                Arr.push(this.state.recentRepay[i]);
             }
          }
          console.log('Arr',Arr)
          return Arr;
      }

    render(){
        const {paymentArr,recentRepay,project}  = this.state;
        return(
            <div>
                <LeftMenu param={this.props} />
                {
                         this.state.project_ ? 
                         <p style={{textAlign:"center",color:'#999',margin:'80px 0px '}}>您当前没有还款记录，立即<span style={{color:'#ff9900',cursor:'pointer'}}>前往投资</span></p>
                         :

                         <div className="fr uc-rbody F">
                         <div className="real_title">
                             <span className="safeCenter_">还款计划</span>
                         </div>
                         {
                           this.state.recentRepay.length > 0 ? 
                             <p >
                                 <span>近期应还</span>
                                 <Button className="btn1" onClick={()=>this.getRepay()}>手动还款</Button>
                             </p> : null}
                         {
                           this.state.recentRepay.length > 0 ? 
                           this.state.recentRepay.map((item,index)=>{
                               if (index!=0) {
                                console.log('index-1',!this.state.recentRepay[index-1].check)
                               }
                            
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
                                         {item.fsort}/{project.fcreditMonth}期
                                         <span style={{ margin: '0 5px 0 8px'}}>|</span>
                                         <span style={{color:'#f29827'}}> ￥{item.borrowInterest}</span>    
                                     </div>
                                     <span style={{marginLeft:55}}>本金：<span style={{width:100,display:'inline-block'}}>{item.principal}</span></span>
                                     <span >利息：<span style={{width:100,display:'inline-block'}}>{item.interest}</span></span>
                                     <span style={{color:'#ff3b35'}}>逾期费：<span style={{width:100,display:'inline-block'}}>{item.overdueMoney}</span></span>
                                 <p className="info" >
                                     <span className="date">{this.state.date}</span>
                                     <span style={{marginLeft:40}}>{item.fsort}/{project.fcreditMonth}期还款已逾期<span style={{color:'#ff3b35'}}>{item.overdue}天</span>，逾期费用<span style={{color:'#ff3b35'}}>{recentRepay.overdueMoney}元</span>，为了不影响您的征信，请及时还款</span>
                                 </p>
                             </div>
                             )
                         }) : <p style={{textAlign:"center",color:'#999'}}>您当前所有的还款已完成</p>
                        }
                         {/* <div className="repay"> 
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
                             
                              </span>
                             <p className="info" >
                                 <span className="date">{this.state.date}</span>
                                 <span style={{marginLeft:40}}>{recentRepay.fsort}/{project.fcreditMonth}期还款已逾期<span style={{color:'#ff3b35'}}>{recentRepay.overdue}天</span>，逾期费用<span style={{color:'#ff3b35'}}>{recentRepay.overdueMoney}元</span>，为了不影响您的征信，请及时还款</span>
                             </p>
                         </div> */}
                        
                        
                        {
                           this.state.recentRepay.length > 0 ? 
                             <p style={{float:'right',color:'#ff3b35',marginTop:15,cursor:'pointer'}}><i className="zjb zjb-jinggao1" style={{fontSize:16,verticalAlign: 'middle',fontWeight:'bold',marginRight:5}}></i>逾期处罚措施</p> :null}  
                     </div>

                        
                }
               
                

                {
                    this.state.project_ ? null :

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
                }
            </div>
        )
    }
}



