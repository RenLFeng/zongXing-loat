
import React from 'react';
import './index.scss'
import { Link } from 'dva/router';
import { accountService,baseService} from '../../../../services/api'
import { Card, Row, Col, Checkbox, Button, AutoComplete, Modal,message } from 'antd';
import { connect } from 'dva';
import Recharge from '../recharge'
import Account from '../accountWithdrawals/accountWithdrawals'
import BindCard from './bindcard/bindCard'
import Path from '../../../../common/PagePath'
import { PERSONAL_PAGE } from '../../../../common/SystemParam';

export default class Loaninfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            card: [],
            activeObj: [],
            allModelVisible: false,
            modalWidth: 500,

            commissionShow:false,
            data:[],
            commisson:{},   //表单提交返回的数据
            loading:false
        }
    }
    handlerClcikLable(item) {
        this.setState({
            activeObj: item,
        })
    }
    componentDidMount() {
        this.getinit();

        this.payCommission();
    
    }

    //获取银行卡信息
  async  getinit() {
        //获取银行卡
        const response = await accountService.getBankCardList();
        if (response.code === 0) {
            if(response.data.length>0){
                this.setState({
                    card: response.data,
                    activeObj:  response.data[0]
                });
            }
        } else {
            message.error(response.msg);
        }
    }
    handleOk = (e) => {
        this.setState({
            allModelVisible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            allModelVisible: false,
        });
    }
    subs(val){
      if(val ==null){
        return ' '
      }else{
          return val.substring(0,4)+"**** ****"+val.substring(val.length-4);
         
      }
    }


    //是否缴纳佣金
   async payCommission(){
    const res = await baseService.payCommission();
    if(res.code === 0){
       if(res.data === null){
        this.setState({
         commissionShow:false,
        })
       } else if (res.data.length > 0) {
           this.setState({
             commissionShow:true,
             data:res.data
           },()=>{this.props.getcommision(this.state.commissionShow)})
       } else {
        this.setState({
            commissionShow:false,
           })
       }
    } else {
        res.msg && message.error(res.msg)
    }
}

    async commission(id){
        if(this.state[`loading${id}`]){
            return
        }
        let param = {
            billId:id,
            notifyUrl:PERSONAL_PAGE
        }
        this.setState({[`loading${id}`]:true})
        return;
        const res = await baseService.putCommission(param);
        this.setState({[`loading${id}`]:false})
        if(res.code === 0){
        this.setState({
            commisson:res.data
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
            res.msg && message.error(res.msg);
        }
    }

    submitMoney() {
        this.formId.submit();
    }

    render() {
        const {commisson} = this.state;
        return (
            <div className="card-info">
                <Row >
                    {
                        this.props.types === '1' ? 
                        <div>
                            <center> </center>
                            <center> </center> 
                            <center> </center>
                            <div className="card-logo-recharge">
                                {/* <span className="card-logo-recharge-add"  ><Link to="/index/uCenter/bindCard" > +使用新卡充值</Link> </span>
                                <span className="card-logo-recharge-tip">（只支持储蓄卡）</span> */}
                            </div>
                            <Recharge param={this.state.activeObj} />
                        </div>
                        : 
                        (this.state.commissionShow) ? 
                         <div>
                             <div className="commission">
                             {
                                 this.state.data.length > 0 ? 
                                 this.state.data.map((item)=>{
                                    return (
                                       <div className="commission_content" key={item.billId}>
                                           <div style={{marginBottom:20}}>
                                                <p style={{color:'#999'}}><span >项目编号：</span><span style={{color:'#333'}}>{item.projectNo}</span></p>
                                                <p style={{color:'#999'}}><span >项目名称：</span><span style={{color:'#333'}}>{item.projectName}</span></p>
                                           </div>
                                            
                                            <div>
                                                <p><span style={{color:'#999'}}>佣金金额：</span><span style={{color:'#0063FF',display:'inline-block',marginLeft:10}}>￥{item.kickbackAmount}</span></p>
                                                <p style={{color:'#999'}}><span >项目放款金额：</span><span style={{color:'#333',marginLeft:10}}>{item.loanAmount}</span></p>
                                                <p style={{color:'#999'}}><span >项目评级：</span><span style={{color:'#333',marginLeft:10}}>{item.projectLevel}</span></p>
                                                <p style={{color:'#999'}}><span >佣金费率：</span><span style={{color:'#333',marginLeft:10}}>{item.kickbackRate}%</span></p>
                                            </div>
                                            <Button type="primary" onClick={()=>{this.commission(item.billId)}} loading={this.state[`loading${item.billId}`]}>提交</Button>
                                        </div>
                                    )
                                 }) : null
                             }    
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
                         </div>
                        :
                        <div>
                            <center>请选择到账银行卡</center>
                            <div className="css_div">
                            {this.state.card.map((item, index) => {
                                return  (
                                    <div className="card_div" key={index} onClick={()=>this.setState({activeObj: item})}>
                                        <div className="IDCard">
                                            <div>
                                                <div className="card_info">
                                                <div className="card_img">
                                                    {/* <img src={`${data.flogo}`}/> */}
                                                </div>
                                                <div className="card_text">
                                                    <p title={item.fbank} >{item.fbank}</p>
                                                    {/* <span>{data.fcardType}</span> */}
                                                    <span>储蓄卡</span>
                                                </div>
                                                </div>
                                                <span className="id_num">
                                                {item.fbankcard.substring(0, 4)} **** **** {item.fbankcard.substring(item.fbankcard.length - 4, item.fbankcard.length)}
                                                </span>
                                            </div>  
                                        </div>
                                    </div>
                                )
                            })}
                            </div>

                            <div className="card-logo-recharge">
                                <span className="card-logo-recharge-add"><Link to="/index/uCenter/bindCard" > +使用新卡提现</Link> </span>
                                <span className="card-logo-recharge-tip">（只支持储蓄卡）</span>
                            </div>
                                            
                            {
                                this.props.types === '2' ? 
                                <div>
                                <img src={require('../../mineLoan/img/u904.png')} ></img>
                                    <Account param={this.state.activeObj} />
                                </div>
                                : null
                            }
                        </div>
                        
                    }
                </Row>
              
               
            </div>
        )
    }
}
