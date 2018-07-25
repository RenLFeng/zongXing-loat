
import React from 'react';
import './index.scss'
import Title from './title'
import Card from './card'
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, message ,Modal} from 'antd';
import { baseService } from '../../../services/api';
import { PERSONAL_PAGE } from '../../../common/SystemParam';

const FormItem = Form.Item;
const Option = Select.Option;

export default  class Loaninfo extends React.Component{
     constructor(props){
         super(props)
         this.state={
             commissionShow:false,
             data:{},
             commisson:{},   //表单提交返回的数据
             loading:false
         }
     }

     componentDidMount(){
         this.payCommission();
     }

     
   //是否缴纳佣金
   async payCommission(){
       const res = await baseService.payCommission();
       console.log('555555555',res)
       if(res.code === 0){
          if(res.data === null){
           this.setState({
            commissionShow:false,
           })
          } else {
              this.setState({
                commissionShow:true,
                data:res.data
              })
          }
       } else {
           res.msg && message.error(res.msg)
       }
   }

   async commission(){
    let param = {
       billId:this.state.data.billId,
       notifyUrl:PERSONAL_PAGE
    }
    this.setState({loading:true})
    const res = await baseService.putCommission(param);
    console.log('缴费佣金',res);
    if(res.code === 0){
      this.setState({
        commisson:res.data,
        loading:false
      }, ()=> {
        Modal.confirm({
            title: '提示',
            content: '确认缴纳佣金吗?',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => this.submitMoney()
          });
      })
      
    } else {
        this.setState({loading:false})
        res.msg && message.error(res.msg);
    }
  }

  submitMoney() {
    this.formId.submit();
  }

    render(){
        const {commisson} = this.state;
        return(
            <div  className="recharge-info">                   
                {
                    this.state.commissionShow ? 
                    <div>
                        <p className="recharge-title line">佣金  <span className="recharge-title-child">>  收取佣金</span></p>
                        <div className="commission">
                            <div className="commission_content">
                                <p style={{marginBottom:25}}><span>佣金金额：</span><span style={{fontSize:30,color:'#0063FF',fontWeight:'bold',marginLeft:20,display:'inline-block',paddingBottom:8,borderBottom:'1px solid #f0f0f0'}}>￥{this.state.data.kickbackAmount}</span></p>
                                <p style={{color:'#999'}}><span >项目编号：</span><span style={{marginLeft:20}}>{this.state.data.projectNo}</span></p>
                                <p style={{color:'#999'}}><span >项目名称：</span><span style={{marginLeft:20}}>{this.state.data.projectName}</span></p>
                                <p style={{color:'#999'}}><span >项目放款金额：</span><span style={{marginLeft:20}}>{this.state.data.loanAmount}</span></p>
                                <p style={{color:'#999'}}><span >项目评级：</span><span style={{marginLeft:20}}>{this.state.data.projectLevel}</span></p>
                                <p style={{color:'#999'}}><span >佣金费率：</span><span style={{marginLeft:20}}>{this.state.data.kickbackRate}</span></p>
                                
                                <Button type="primary" onClick={()=>{this.commission()}} loading={this.state.loading}>提交</Button>
                            </div>
                        </div>
            
                        <form ref={ref => this.formId = ref} id="form1" name="form1" action={commisson.submitURL} method="post" target="_blank">
                            <input id="Action" name="Action" value={commisson.action} type="hidden" />
                            <input id="ArrivalTime" name="ArrivalTime" value={commisson.arrivalTime} type="hidden" />
                            <input id="LoanJsonList" name="LoanJsonList" value={commisson.loanJsonList} type="hidden" />
                            <input id="NeedAudit" name="NeedAudit" value={commisson.needAudit} type="hidden" />
                            <input id="PlatformMoneymoremore" name="PlatformMoneymoremore" value={commisson.platformMoneymoremore} type="hidden" />
                            <input id="RandomTimeStamp" name="RandomTimeStamp" value={commisson.randomTimeStamp} type="hidden" />
                            <input id="TransferAction" name="TransferAction" value={commisson.transferAction} type="hidden" />
                            <input id="TransferType" name="TransferType" value={commisson.transferType} type="hidden" />
                            <input id="RandomTimeStamp" name="RandomTimeStamp" value={commisson.randomTimeStamp} type="hidden" />
                            <input id="Remark1" name="Remark1" value={commisson.remark1} type="hidden" />
                            <input id="Remark2" name="Remark2" value={commisson.remark2} type="hidden" />
                            <input id="Remark3" name="Remark3" value={commisson.remark3} type="hidden" />
                            <input id="ReturnURL" name="ReturnURL" value={commisson.returnURL} type="hidden" />
                            <input id="NotifyURL" name="NotifyURL" value={commisson.notifyURL} type="hidden" />
                            <input id="SignInfo" name="SignInfo" value={commisson.signInfo} type="hidden" />
                        </form>
                    </div> : 
                    <div>
                        <Title types={this.props.types} />
                        <Card  types={this.props.types}/> 
                    </div>
                }
                
            </div>
        )
    }
}
