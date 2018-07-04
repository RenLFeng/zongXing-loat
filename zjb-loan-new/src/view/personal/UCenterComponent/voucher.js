import React from 'react';
import LeftMenu from '../../components/UCenterComponent/leftMenu';
import {Table,Pagination  } from 'antd';
import { getVoucher } from '../../services/api';
import moment from 'moment';


export default class Voucher extends React.Component{
    constructor(props){
        super();
        this.state = {
            pageCurrent:1,
            pageSize:10,
            dataSource:[],
            total:0,
        }
    }
    componentDidMount(){
        this.getVoucher()
    }

    async getVoucher(){
        const response = await getVoucher({pageCurrent:this.state.pageCurrent,pageSize:this.state.pageSize});
        console.log('券额明细',response)
       
        if(response.code === 0){
            this.setState({
                dataSource:response.data.infoList,
                total:response.data.totalNumber
            }) 
            console.log('555',response.data.infoList.ffull_sub_money)  
        } else {
            response.msg && message.error( response.msg)
        }
    }

    
//翻页触发的事件
onchange = (page) => {
    this.setState({
        pageCurrent: page,
    },()=>{
    this.getVoucher({pageCurrent:this.state.pageCurrent,pageSize:this.state.pageSize});
    });
  }

//页码数改变触发的事件
onShowSizeChange = (current, pageSize) => {
    this.setState({
        pageSize: pageSize,
        pageCurrent: current,
    },()=>{
        this.getVoucher({pageCurrent:this.state.pageCurrent,pageSize:this.state.pageSize})
    });
  }

  render(){
      
    const columns = [{
        title: '日期',
        dataIndex: 'ftime',
        key: 'ftime',
        align:'center',
        render:(val) => moment(val ).format('YYYY-MM-DD HH:mm:ss'),
      }, {
        //0：兑换券额，1：兑换优惠券
        title: '交易行为',
        dataIndex: 'ftype',
        key: 'ftype',
        align:'center',
        render:(val) => {
            return(
                val === 0 ? '兑换券额': '兑换优惠券'
            )  
        },
      }, {
        title: '数量',
        dataIndex: 'fnum',
        key: 'fnum',
        align:'center',
      }, {
        title: '券额面值',
        dataIndex: 'ffull_sub_money',
        key: 'ffull_sub_money',
        align:'center',
        render:(val) => val+'元'
      }, {
        title: '券额总额',
        dataIndex: 'famount',
        key: 'famount',
        align:'center',
        render:(val) => val+'元'
      }, {
        title: '券额余额',
        dataIndex: 'fmoney',
        key: 'fmoney',
        align:'center',
        render:(val) => val+'元'
       
      }, {
        title: '项目编号',
        dataIndex: 'fproject_no',
        key: 'fproject_no',
        align:'center'
      }, {
        title: '项目名称',
        dataIndex: 'fname',
        key: 'fname',
        align:'center',
      }];

      const locale = {
		filterTitle: '筛选',
		filterConfirm: '确定',
		filterReset: '重置',
		emptyText: '暂无数据',
	};

      return(
          <div>
              <LeftMenu param={this.props} />

              <div className="fr uc-rbody">
                    <div style={{borderBottom:'1px dashed #f0f0f0',marginBottom:30,paddingBottom:7}}>
                       <p style={{fontSize:18,display:'inline-block'}}>券额明细</p>
                       <span  style={{fontSize:12,display:'inline-block',float:'right',background:'#F0F0F0',color:'#989898',borderRadius:30,width: 67,height: 30,textAlign: 'center',lineHeight:'30px'}}>单位：元</span>
                    </div> 
                    <p style={{color:'#C3C3C3',margin:'10px 0'}}>共<span>{this.state.total}</span>条记录</p>
                    <Table 
                    dataSource={this.state.dataSource}
                    columns={columns}
                    pagination={false}   
                    bordered
                    size="small"
                    style={{padding:'0 !important' }}
                    locale={locale}
                    />
                   {
                        Math.ceil(this.state.total/this.state.pageSize) > 1 ?  
                        <Pagination 
                        total={this.state.total} 
                        current={this.state.pageCurrent}
                        pageSize={this.state.pageSize}
                        onChange={this.onchange}
                        onShowSizeChange={this.onShowSizeChange}
                        style={{marginTop:30,textAlign:'center'}}
                        /> : null
                   }
                    
                </div>
          </div>
      )
  }
}