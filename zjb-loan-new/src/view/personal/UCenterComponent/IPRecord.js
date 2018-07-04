import React from 'react';
import LeftMenu from '../../components/UCenterComponent/leftMenu';
import {Table,Pagination  } from 'antd';
import { getIPRecord } from '../../services/api';
import moment from 'moment';


export default class IpRecord extends React.Component{
  constructor(props){
    super();
    this.state = {
        dataSource:[],
        pageCurrent:1,
        pageSize:10,
        pagination:0,
    }
  }
  componentDidMount(){
      this.getIPRecord();
  }
   
  async getIPRecord(){
      let param = {
        pageCurrent:this.state.pageCurrent,
        pageSize:this.state.pageSize
      }
      const response = await getIPRecord(param);
      console.log('444',response)
      if(response.code === 0){
         this.setState({
            dataSource:response.data.infoList,
            pagination:response.data.totalNumber
         })
      }
  }

//翻页触发的事件
onchange = (page) => {
    this.setState({
        pageCurrent: page,
    },()=>{
    this.getIPRecord({pageCurrent:this.state.pageCurrent,pageSize:this.state.pageSize});
    });
  }

//页码数改变触发的事件
onShowSizeChange = (current, pageSize) => {
    this.setState({
        pageSize: pageSize,
        pageCurrent: current,
    },()=>{
        this.getIPRecord({pageCurrent:this.state.pageCurrent,pageSize:this.state.pageSize})
    });
  }
    
    render(){
        const columns = [{
            title: '序号',
            dataIndex: 'fsort',
            key: 'fsort',
            align:'center',    
            render:function(text,record,index){
                return index+1;
              } 
          }, {
            title: 'IP地址',
            dataIndex: 'flogin_ip',
            key: 'age',
            align:'center'
          }, {
            title: '登录时间',
            dataIndex: 'flogin_time',
            key: 'flogin_time',
            align:'center',
            render:(val) => moment(val ).format('YYYY-MM-DD HH:mm:ss'),
          }, {
            title: '登录结果',
            dataIndex: 'flogin_result',
            key: 'address',
            align:'center'
          }, {
            title: '登录城市',
            dataIndex: 'flogin_city',
            key: 'flogin_city',
            align:'center',
            render: (text) => <a style={{color:'#669bff'}}>{text}</a>,
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
                    <div style={{fontSize:18,borderBottom:'1px dashed #f0f0f0',marginBottom:30,paddingBottom:7}}>IP记录</div>
                    
                    <Table 
                    dataSource={this.state.dataSource}
                    columns={columns}
                    locale = {locale}
                    pagination={false}   
                    bordered
                    size="small"
                    style={{padding:'0 !important' }}
                    />
                   {
                       Math.ceil(this.state.pagination/this.state.pageSize) > 1 ?  
                       <Pagination 
                        total={this.state.pagination} 
                        current={this.state.pageCurrent}
                        pageSize={this.state.pageSize}
                        onChange={this.onchange}
                        onShowSizeChange={this.onShowSizeChange}
                        style={{marginTop:30,textAlign:'center'}}
                        /> :null
                   }
                   
                </div>
            </div>
        )
    }
}