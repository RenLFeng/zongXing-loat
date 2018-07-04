import React from 'react';
import LeftMenu from '../../components/UCenterComponent/leftMenu';
import {Steps,Pagination,Icon} from 'antd';
import Platform from '../common/platform';
import { getPlantNotice,getOPlantNotice } from '../../services/api';
import moment from 'moment';

const Step = Steps.Step;

export default class Voucher extends React.Component{
    constructor(props){
      super();
      this.state = {
          pageCurrent:1,
          pageSize:6,
          total:0,
          dataInfo:[],
          detail:[], 
          showMask:false,
      }
    }
    componentDidMount(){
        this.getPlantNotices(this.state.pageCurrent,this.state.pageSize);
    }

    async getPlantNotices(current,size){
        
        const response = await getPlantNotice(current,size);
        console.log('站内消息',response)
        if(response.code === 0){
            this.setState({
                dataInfo:response.data.notices,
                total:response.data.itemCount
            })
        } else{
            response.msg && message.error( response.msg)
        }
    }

  getOPlantNotices(id){
    this.setState({showMask:true});
     for(let i=0;i<this.state.dataInfo.length;i++){
         if(id === this.state.dataInfo[i].fid){
             this.setState({
                detail:this.state.dataInfo[i],
             })    
         }
     }     
   } 

//翻页触发的事件
onchange = (page) => {
    console.log('翻页',page)
    this.setState({
        pageCurrent: page,
    },()=>{
    this.getPlantNotices(this.state.pageCurrent,this.state.pageSize);
    });
  }

//页码数改变触发的事件
onShowSizeChange = (current, pageSize) => {
    console.log('页码改变',current)
    this.setState({
        pageSize: pageSize,
        pageCurrent: current,
    },()=>{
        this.getPlantNotices(this.state.pageCurrent,this.state.pageSize)
    });
  }

  render(){
      const {detail} = this.state
      return(
          
          <div>
              <LeftMenu param={this.props} />
              <div className="fr uc-rbody"  >
                <div style={{fontSize:18,borderBottom:'1px dashed #f0f0f0',marginBottom:40,paddingBottom:7}}>站内消息</div>       
                  {
                      this.state.dataInfo.length > 0 ?  this.state.dataInfo.map((item,index) => {
                         return  <Platform key={index} data={item} getOPlantNotice={()=>this.getOPlantNotices(item.fid)}/>
                      }) : <div style={{textAlign:'center'}}>暂无数据</div>
                  }
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

              {
                this.state.showMask?
                <div className="mask" onClick={()=>{this.setState({showMask:false})}}>
                    <div className="mask_content" onClick={(e)=>{e.stopPropagation()}}>
                    <div className="mask_title">
                        <p className="p1" >
                            <span style={{display:'inline-block'}}>{ detail ? detail.ftitle : ''}</span>
                            <span className="p2">{moment(detail ?detail.fpublishTime:'').format('YYYY-MM-DD HH:mm:ss')}</span> 
                            <Icon type="close" style={{ position: 'absolute',right: 25,top: 36}} onClick={()=>{this.setState({showMask:false})}}/>
                        </p >                    
                    </div>
                    <div className="mask_word">
                        <p className="mask_word1">尊敬的众借帮客户，您好！</p>
                        <p className="mask_word2">{detail ? detail.article.fcontent : null }</p>
                    </div>
                    <div className="logo">
                        <div className="logo_img"><img src={require('../../assets/img/logo2.png')} alt=""/></div>
                        <div className="time">{moment(detail ?detail.fpublishTime:'').format('YYYY-MM-DD')}</div>
                    </div>
                    </div>
                </div> : null
                }
          </div>
      )
  }
}