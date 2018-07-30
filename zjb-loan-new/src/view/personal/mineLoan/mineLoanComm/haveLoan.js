/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:17:00 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-27 16:05:55
 * 有借款记录
 */
import React from 'react';
import LoanTitle from './loanTitle';
import LoanStep from './loanStep';
import SureLoan from './sureLoan';
import MineTimel from '../minetime/minetimeline';
import InvestRecord from '../investRecord/investRecord';
import DelModal from './deleteModal/deleteModal';
import UploadFile from '../applayLoan/appaly/UpLoad/UploadFile';
import {mineloan} from '../../../../services/api';
import {connect} from 'dva';
import {IMG_BASE_URL, NOTIFY_URL} from '../../../../common/SystemParam';
import SendCoupon from './sendCoupon';
import Notice from '../notice/notice';
import ConSult from '../consult/consult';
import {Row, Col, message, Spin} from 'antd';
import {parseTime, returnFloat, getTime, loanDelay} from '../dateformat/date';
import { Table,Modal } from 'antd';
import '../mineloan.scss';
import Appalyloan from './projectDetails/detailEdit';

function getStatu(flag){
    switch(flag){
        case 0:
            return '待提交';
        case 1:
            return '项目初审(待初审)';
        case 2:
            return '待缴费';       
        case 3:
            return '待大数据风控';
        case 4:
            return '项目背调';//'待配置问题';
        case 5:
            return '待补充资料';   
        case 6:
            return '项目终审';
        case 7:
            return '待委员会定价';
        case 8:
            return '待确认借款';
        case 9:
            return '待发放优惠券';
        case 10:
            return '待项目排版审核';
        case 11:
            return '待完善项目信息';       
        case 12:
            return '待排期上线';
        case 13:
            return '筹款中';
        case 14:
            return '待放款';   
        case 15:
            return '还款中';
        case 16:
            return '完成';
        case -1:
            return '流标';
        case -2:
            return '风控打回';           
        case -3:
            return '终止';
        case -4:
            return '逾期';      
        case -5:
            return '坏账';                   
        default:
            return ''                                     
    }
}

@connect((state)=>({
    mineloan: state.mineloan,
    data: state.mineloan.data,
    loading: state.mineloan.loading,
}))
class NoLoan extends React.Component{
    fileData = {
        type: "file/",
        baseUrl: IMG_BASE_URL
    };
    constructor(props){
        super(props);
        this.state = {
            loadingdel: false,
            loadingpay: false,
            delId: '',
            visible: false,
            upfile: {},
            doingData: [],
            timeLong: '',
            isGoing: false,
        }
    };

    submitLoan(text,record,index){
        console.log(text,record,index)
    }

    editLoan(text,record,index){
        console.log(text,record,index)
    }

    deleteLoan(text,record,index){
        this.setState({
            delId: record.fid,
            visible: true
        })

    }
    cnacelDel(){
        this.setState({
            delId: '',
            visible: false
        })
    }
    //删除项目
    async comitdeleteLoan(){
        let data = {
            projectId: this.state.delId
        }
        this.setState({
            loadingdel: true
        })
        let res = await mineloan.delProject(data);
        if(res.code === 0){
            this.props.dispatch({
                type: 'mineloan/getMineLoan',
                payload: ''
            })
            this.setState({
                loadingdel: false,
                visible: false
            })
        }else{
            this.setState({
                loadingdel: false
            })
            message.error(res.msg)
        }
    }

    componentDidMount(){
       
    }
    //提交补充资料
    async commitData(fid) {
        let data = {
          projectId: fid,
        }
        this.setState({loading: true})
        let res = await mineloan.commitwsInfo(data);
        if(res.code === 0){
          this.props.dispatch({
            type: 'mineloan/getMineLoan',
            payload: ''
          })
          this.setState({loading: false})
        }else{
          message.error(res.msg);
          this.setState({loading: false})
        }
      }
    //缴费
    async pay(text,record,index){
        console.log('缴费',text,record,index)
        this.setState({
            loadingpay: true
        })
        let data = {
            projectId: record.fid,
            notifyPageUrl: `${NOTIFY_URL}/index/uCenter/mineLoan`
        }
        let res = await mineloan.payLoan(data);
        if(res.code === 0){
            console.log(res,'----')
            this.setState({
                loadingpay: false,
                upfile:res.data
            }, ()=> {
                Modal.confirm({
                    title: '提示',
                    content: '确认缴费吗?',
                    okText: '确认',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk: () => this.submitMoney()
                  });
              })
            this.props.dispatch({
                type: 'mineloan/getMineLoan',
                payload: ''
            })
        }else{
            message.error(res.msg);
            this.setState({
                loadingpay: false
            })
        }
    }

    
  submitMoney() {
    this.formId.submit();
  }

    //数据授权
    async dataLicense(text,record,index){
        await this.props.dispatch({
            type: 'mineloan/gotoRealName',
            payload: true
        })
        await this.props.history.push('/index/uCenter/realName');
    }
    //确认借款
    sureBorrow(text,record,index){
        console.log(text,record,index)
    }

    //上传补充资料
    uploadInfo(){
        
    }
    
    //还款计划
    payPlan(){
        this.props.history.push('/index/uCenter/receivePlan')
    }

    //上传资料
    async onChange(val,item){
        console.log(val,item,'-----')
        if(val.length === 0){
            message.info('请上传补充资料！');
            return;
        }
        this.setState({
            loadingpay: true
        })
        let data = {
            remark: item[0].fileurl,
            projectId: val.fid
        }
        let res = await mineloan.upbcInfo(data);
        if(res.code === 0){
            this.setState({
                loadingpay: false
            })
            this.props.dispatch({
                type: 'mineloan/getMineLoan',
                payload: ''
            })
        }else{
            this.setState({
                loadingpay: false
            })
        }
    }

    //完善项目信息
    fullProjectInfo(){
        
    }

    async updatstate(val){
        let time = val[0].loanTime;
        await setInterval(()=>{
            this.setState({
                doingData: [{
                    ...this.state.doingData,
                    loanTime: time++
                }]
            },1000)
        })
    }

    goingTime(val){
        let time = val;
        setInterval(()=>{
           this.setState({
                timeLong: getTime(time),
                isGoing: true
            })
            time = time+1;
        },1000)
    }

    render(){
        const doing = [];
        // fflag = 其它
        const columns = [
            { 
                title: '要借多钱', 
                align: 'center',
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.fcredit_money)}元</span>
                } 
            },
            { 
                title: '要借多久',
                align: 'center',
                dataIndex: 'fcredit_month', 
                key: 'fcredit_month' ,
                render: (text,record) =>{
                    return <span>{record.fcredit_month}个月</span>
                } 
            },
            { 
                title: '创建时间', 
                align: 'center',
                dataIndex: 'fcreate_time', 
                key: 'fcreate_time' ,
                render: (text,record) =>{
                    return <span>{parseTime(record.fcreate_time,'{y}-{m}-{d} {h}:{i}')}</span>
                }
            },
            { 
                title: '状态', 
                align: 'center',
                dataIndex: 'state', 
                key: 'state',
                render: (text,record, index) =>{
                    return <p className="wait-commit">
                            •{getStatu(record.fflag)} {record.fflag === 4 ? <span style={{color: '#000'}}>(待背调)</span>: ''}
                        </p>
                } 
            },
            { 
                title: '操作', 
                align: 'center',
                dataIndex: '', 
                key: 'x',   
                render: (text,record,index) =>{
                    return <div className="action">
                            { record.fflag == 0 ?
                                <div>
                                    <a className="ac-commit" onClick={() => this.props.history.push('/index/uCenter/appalyloan')}>提交</a>
                                    <span>|</span>
                                    <a className="ac-edit" onClick={() => this.props.history.push('/index/uCenter/appalyloan')}>编辑</a>
                                    <span>|</span>
                                    <a className="ac-del" onClick={() => this.deleteLoan(text,record,index)}>删除</a>
                                </div>:
                                record.fflag === 2 ? 
                                    <a className="ac-commit" onClick={() => this.pay(text,record,index)}>缴费</a>:
                                record.fflag === 3 ?    
                                    <a className="ac-commit" onClick={() => this.dataLicense(text,record,index)}>数据授权</a>:
                                record.fflag === 5 ?    
                                    <div>
                                        <UploadFile {...this.fileData} prefix={'person/'} onChange={this.onChange.bind(this,record)} className="loaninfo-up">上传补充资料</UploadFile>
                                        <p>上传资料可以是word文档、图片 ，只允许上传一个文档，多个文档压缩上传；</p>
                                    </div>
                                    :
                                record.fflag === 8 ?  
                                    <a className="ac-commit" onClick={() => this.sureBorrow(text,record,index)}>确认借款</a>:
                                ''    
                            }
                        </div>
                } 
            },
          ];
        const columns8_9 = [
            { 
                title: '借款金额', 
                align: 'center',
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.fcredit_money)}元</span>
                }  
            },
            { 
                title: '借款期数',
                align: 'center',
                dataIndex: 'fcredit_month', 
                key: 'fcredit_month',
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
                title: '创建日期', 
                align: 'center',
                dataIndex: 'fcreate_time', 
                key: 'fcreate_time',
                render: (text,record) =>{
                    return <span>{parseTime(record.fcreate_time,'{y}-{m}-{d} {h}:{i}')}</span>
                }
            },
            { 
                title: '状态', 
                align: 'center',
                dataIndex: 'state', 
                key: 'state',
                render: (text,record, index) =>{
                    return <span className="wait-commit">
                            •{getStatu(record.fflag)}
                        </span>
                } 
            },
            { 
                title: '操作', 
                align: 'center',
                dataIndex: '', 
                key: 'x',   
                render: (text,record,index) =>{
                    return <div className="action">
                            {
                                record.fflag === 11 ? 
                                <a className="ac-commit" onClick={() => this.fullProjectInfo(text,record,index)}>完善项目信息</a>:
                                ''
                            }
                            
                        </div>
                } 
            },
          ];
        //上线筹款    fflag = 10
        const columns10 = [
            { 
                title: '借款金额', 
                align: 'center',
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.fcredit_money)}元</span>
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
                dataIndex: 'frate_last', 
                key: 'frate_last' ,
                render: (text,record) =>{
                    return <span>{record.frate_last}%</span>
                } 
            },
            { 
                title: '上线时间', 
                align: 'center',
                dataIndex: 'fpublish_time', 
                key: 'fpublish_time' ,
                render: (text,record) =>{
                    return <span>{parseTime(record.fpublish_time,'{y}-{m}-{d} {h}:{i}')}</span>
                }
            },
            { 
                title: '已筹金额',
                align: 'center',
                dataIndex: 'invMoney', 
                key: 'invMoney' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.invMoney)}元</span>
                } 
            },
            { 
                title: '筹款进度',
                align: 'center',
                dataIndex: ' ', 
                key: ' ' ,
                render: (text,record) =>{
                    return <span>{loanDelay(record.fcredit_money,record.invMoney)}%</span>
                } 
            },
            { 
                title: '筹款时长', 
                align: 'center',
                dataIndex: 'loanTime', 
                key: 'loanTime' ,
                render: (text,record) =>{
                    // return getTime(record.loanTime)
                    return this.state.timeLong
                }
            },
            { 
                title: '投资人数', 
                align: 'center',
                dataIndex: 'invCount,', 
                key: 'invCount,' ,
                render: (text,record) =>{
                    return <span>{record.invCount}人</span>
                }
            },
            { 
                title: '状态', 
                align: 'center',
                dataIndex: 'state', 
                key: 'state',
                render: (text,record, index) =>{
                    return <span className="wait-commit">
                            •{getStatu(record.fflag)}
                        </span>
                } 
            },
          ];
        //满标放款     fflag = 11
        const columns11 = [
            { 
                title: '借款金额', 
                align: 'center',
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.fcredit_money)}元</span>
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
                dataIndex: 'frate_last', 
                key: 'frate_last' ,
                render: (text,record) =>{
                    return <span>{record.frate_last}%</span>
                } 
            },
            { 
                title: '满标时间', 
                align: 'center',
                dataIndex: 'fcollet_over_time', 
                key: 'fcollet_over_time' ,
                render: (text,record) =>{
                    return <span>{parseTime(record.fcollet_over_time,'{y}-{m}-{d} {h}:{i}')}</span>
                }
            },
            { 
                title: '筹款时长', 
                align: 'center',
                dataIndex: ' ', 
                key: ' ' ,
                render: (text,record) =>{
                    return <span>{getTime(record.fpublish_time,record.fcollet_over_time)}</span>
                }
            },
            { 
                title: '投资人数', 
                align: 'center',
                dataIndex: 'invCount,', 
                key: 'invCount,' ,
                render: (text,record) =>{
                    return <span>{record.invCount}人</span>
                }
            },
            { 
                title: '放款金额', 
                align: 'center',
                dataIndex: 'invMoney,', 
                key: 'invMoney,' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.invMoney)}元</span>
                }
            },
            { 
                title: '状态', 
                align: 'center',
                dataIndex: 'state', 
                key: 'state',
                render: (text,record, index) =>{
                    return <span className="wait-commit">
                            •{getStatu(record.fflag)}
                        </span>
                } 
            },
          ];
        //按月还款  fflag = 12
        const columns12 = [
            { 
                title: '借款金额', 
                align: 'center',
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.fcredit_money)}元</span>
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
                dataIndex: 'frate_last', 
                key: 'frate_last' ,
                render: (text,record) =>{
                    return <span>{record.frate_last}%</span>
                } 
            },
            { 
                title: '放款日期', 
                align: 'center',
                dataIndex: 'fpublish_time', 
                key: 'fpublish_time' ,
                render: (text,record) =>{
                    return <span>{parseTime(record.fpublish_time,'{y}-{m}-{d} {h}:{i}')}</span>
                }
            },
            { 
                title: '状态', 
                align: 'center',
                dataIndex: 'state', 
                key: 'state',
                render: (text,record, index) =>{
                    return <span className="wait-commit">
                            •{getStatu(record.fflag)}
                        </span>
                } 
            },
            { 
                title: '操作', 
                align: 'center',
                dataIndex: '', 
                key: 'x',   
                render: (text,record,index) =>{
                    return <div className="action">
                            <a className="ac-commit" onClick={() => this.payPlan(text,record,index)}>还款计划</a>
                          </div>
                } 
            },
          ];
        //fflag = 13
        const columns13 = [
            { 
                title: '借款金额', 
                align: 'center',
                dataIndex: 'fcredit_money', 
                key: 'fcredit_money' ,
                render: (text,record) =>{
                    return <span>{returnFloat(record.fcredit_money)}元</span>
                }  
            },
            { 
                title: '借款期数',
                align: 'center',
                dataIndex: 'fcredit_month', 
                key: 'fcredit_month',
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
                title: '还清日期', 
                align: 'center',
                dataIndex: 'fcreate_time', 
                key: 'fcreate_time',
                render: (text,record) =>{
                    return <span>{parseTime(record.fcreate_time,'{y}-{m}-{d} {h}:{i}')}</span>
                }
            },
            { 
                title: '状态', 
                align: 'center',
                dataIndex: 'state', 
                key: 'state',
                render: (text,record, index) =>{
                    return <span className="wait-commit">
                            •{getStatu(record.fflag)}
                        </span>
                } 
            },
            { 
                title: '操作', 
                align: 'center',
                dataIndex: '', 
                key: 'x',   
                render: (text,record,index) =>{
                    return <div className="action">
                            <a className="ac-commit" onClick={() => this.payPlan(text,record,index)}>还款计划</a>
                        </div>
                } 
            },
          ];
        
        this.props.data.map((item,index)=>{
            if(item.fflag === 16 || item.fflag === -1 || item.fflag === -3){
                // alredy.push(item)
            }else{
                doing.push(item)
            }
        })
        // this.updatstate(doing);
        const locale = {
            filterTitle: '筛选',
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '暂无数据',
          };
        // const info = [];
        const nowStep = [];
        const table = [];
        // const alredytable = [];
        if(this.state.status === 4){
            nowStep.push(<SureLoan></SureLoan>)
        }

        doing.map((item,index)=>{
            table.push(
                <div className="pe personal-rbody" style={{backgroundColor: '#fff',padding:' 30px 15px',marginTop: `${index === 0 ? 0 : '8px'}`}}>
                    <LoanTitle title="我的借款"></LoanTitle>
                    <LoanStep stepdata={item}></LoanStep>
                    <Spin spinning={this.state.loadingpay}>
                    <Table
                        bordered size="small"
                        locale={locale}
                        pagination={false}
                        dataSource={[item]}
                        columns={item.fflag <= 7 ? columns :
                            [9,10,11,12].includes(item.fflag) ? columns8_9 : 
                            item.fflag === 13 ? columns10 :
                            item.fflag === 15 ? columns12:
                            item.fflag === 14 ? columns11:
                            columns13}
                        rowClassName="editable-row"
                        loading={this.props.loading}
                    />
                    </Spin>
                    {item.fflag === 0 ? item.fis_pass && !item.fis_pass ? 
                                        <p className="loan-cs-bh">{parseTime(item.fcreate_time,'{y}-{m}-{d} {h}:{i}')}
                                        <span>初审驳回：{item.fremark}</span></p> : '' : ''}
                    { [4,5].includes(item.fflag) ? !item.fis_pass ? 
                                        <p className="loan-cs-bh">{parseTime(item.fcreate_time,'{y}-{m}-{d} {h}:{i}')}
                                        <span>{item.fremark}</span></p> : '' : ''}
                    {item.fflag === 8 ? <SureLoan suredata={item}></SureLoan>: 
                    (item.fflag === 13 || item.fflag === 14) ? <InvestRecord indata={item}></InvestRecord> : 
                    item.fflag === 9 ? <SendCoupon coudata={item}></SendCoupon> : ''}
                    {item.fflag === 9 && !item.fis_pass ? 
                                        <p className="loan-cs-bh">{parseTime(item.fcreate_time,'{y}-{m}-{d} {h}:{i}')}
                                        <span>优惠券审核不通过：{item.fremark}</span></p> : ''}

                    {item.fflag === 11 ? <Appalyloan projectId={item.fid} commitData={this.commitData.bind(this)}>
                                        </Appalyloan> : ''}
                </div>
            )
           
        })
        if(doing[0].fflag === 13){
            if(!this.state.isGoing){
                this.goingTime(doing[0].loanTime);
            }
       
        }
        const {upfile} = this.state;
        return(
            <div className="mineloan">
                {table}
                {/* 投资咨询 */}
                <ConSult projectId={doing[0].fid}></ConSult>
                <Row className="personal-rbody" style={{marginTop:' 8px',padding: 0,backgroundColor: '#f5f5f5'}}>
                    {/* 公告 */}
                    <Notice projectId={doing[0].fid}></Notice>
                    {/* 历程 */}
                    <MineTimel projectId={doing[0].fid}></MineTimel>
                </Row>
                <DelModal ref="delmodal" visible={this.state.visible} content="确定要删除项目吗？" 
                          loading={this.state.loadingdel} comitDel={() => this.comitdeleteLoan()} 
                          cnacelDel={() => this.cnacelDel()} key="1"
                          sure="确定" cancel="取消"></DelModal>

                        <form ref={ref => this.formId = ref} id="form1" name="form1" action={upfile.submitURL} method="post" target="_blank">
                            <input id="Action" name="Action" value={upfile.action} type="hidden" />
                            <input id="ArrivalTime" name="ArrivalTime" value={upfile.arrivalTime} type="hidden" />
                            <input id="LoanJsonList" name="LoanJsonList" value={upfile.loanJsonList} type="hidden" />
                            <input id="NeedAudit" name="NeedAudit" value={upfile.needAudit} type="hidden" />
                            <input id="PlatformMoneymoremore" name="PlatformMoneymoremore" value={upfile.platformMoneymoremore} type="hidden" />
                            <input id="RandomTimeStamp" name="RandomTimeStamp" value={upfile.randomTimeStamp} type="hidden" />
                            <input id="TransferAction" name="TransferAction" value={upfile.transferAction} type="hidden" />
                            <input id="TransferType" name="TransferType" value={upfile.transferType} type="hidden" />
                            <input id="RandomTimeStamp" name="RandomTimeStamp" value={upfile.randomTimeStamp} type="hidden" />
                            <input id="Remark1" name="Remark1" value={upfile.remark1} type="hidden" />
                            <input id="Remark2" name="Remark2" value={upfile.remark2} type="hidden" />
                            <input id="Remark3" name="Remark3" value={upfile.remark3} type="hidden" />
                            <input id="ReturnURL" name="ReturnURL" value={upfile.returnURL} type="hidden" />
                            <input id="NotifyURL" name="NotifyURL" value={upfile.notifyURL} type="hidden" />
                            <input id="SignInfo" name="SignInfo" value={upfile.signInfo} type="hidden" />
                        </form>
            </div>
        )
    }
}

export default NoLoan;