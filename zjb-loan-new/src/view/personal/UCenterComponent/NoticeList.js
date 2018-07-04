import React from 'react';
import {Icon, message, Table, Button, Checkbox} from 'antd';
import '../../assets/MessageList/messageList.scss';
import {getPlantNotice, getOPlantNotice} from '../../services/api.js';
import moment from 'moment';
import {STATION_MESSAGE} from '../../common/pagePath';
import {pageShows} from '../../common/systemParam';  //分页组件
import LeftMenu from '../../components/UCenterComponent/leftMenu';

export default class NoticeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCurrent: 1, //当前页，初始值为第一页
      pageSize: 5,    //每页可显示的消息条数
      maxPage: 0,     //最大页
      arr: [],
      showMask:false,
      detail:'',
      num:0,  //总条数
      pageIndex:1,
    }
  }

  componentDidMount() {
    this.getPlantNotice(1);  //调用请求
  }

  //获取公告列表
  async getPlantNotice(page) {
    const response = await getPlantNotice(page,this.state.pageSize);
    console.log(response);
    if(response.code ===0){
      const maxPage = Math.ceil(response.data.itemCount / this.state.pageSize);
      this.setState({
        maxPage: maxPage,
        pageIndex: page,
        arr:response.data.notices,
        num:response.data.notices.length,
      })
    }  else {
      message.error(response.msg);
    }
  }

//获取单个公告
  async getOPlantNotice(id) {
    this.setState({
      showMask:true
    });
    const response = await getOPlantNotice(id);
    console.log(response);
    if(response.code ===0){
       this.setState({
         detail:response.data,
       })
    }
  }
  render() {
    const { arr,showMask,detail } = this.state;
    const page_num = pageShows(this.state.pageIndex, this.state.maxPage);
    return (
      <div>
        <LeftMenu param={this.props}/>
        <div className="fr uc-rbody" >
          <div className="title">
            <span className="title1">站内公告</span>
          </div>

          <div className="content_">
            <div className="messageGroup">
              <ul >
                <li className="massageList">
                  <span className="massageList_title"><p>公告标题</p></span>
                  <span className="massageList_time">时间</span>
                </li>

                { arr.length <= 0?
                  <p style={{textAlign: 'center',paddingTop:15,color: '#B9B9B9'}}>暂无数据</p>:
                  arr.map((data)=>{
                    return(
                      <li className="massageList" key={data.fid}>
                        <span className="massageList_title">
                          <p onClick={()=> this.getOPlantNotice(data.fid)}>{data.ftitle}</p>
                          {
                          data.ftype === "WARN" ? <Icon type="exclamation-circle-o" className="icon_"/> :null
                          }
                        </span>
                        <span className="massageList_time">{moment(data.fpublishTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                      </li>
                    )
                  })
                }

                <li className="footer_">
                  <span>共<i>{this.state.num}</i>项</span>
                  <div className="box_">
                    <div className="pagination">
                      {page_num.lastPage ?
                        <a className="num" onClick={() => this.getPlantNotice(this.state.pageIndex - 1)}>&lt;</a> :
                        <a className="num" style={{backgroundColor: '#eee'}}>&lt;</a>}
                      {page_num.firstPage ?
                        <a className={`${1 == this.state.pageIndex ? 'hover_' : ''}`} onClick={() => this.getPlantNotice(1)}>1</a> :
                        null}
                      {page_num.leftEllipsis ?
                        <a>...</a> :
                        null}
                      {page_num.page.map((pageNum) => {
                        return (
                          <a key={pageNum} className={`${pageNum * 1 == this.state.pageIndex ? 'hover_' : ''}`}
                            onClick={() => this.getPlantNotice(pageNum)}>{pageNum}</a>
                        );
                      })}
                      {page_num.rightEllipsis ?
                        <a>...</a> :
                        null}
                      {page_num.finalPage ?
                        <a
                          className={`${this.state.maxPage == this.state.pageIndex ? 'hover_' : ''}`}
                          onClick={() => this.getPlantNotice(this.state.maxPage)}
                        >{this.state.maxPage}</a> :
                        null}
                      {page_num.nextPage ?
                        <a className="num" onClick={() => this.getPlantNotice(this.state.pageIndex + 1)}>&gt;</a> :
                        <a className="num" style={{backgroundColor: '#eee'}}>&gt;</a>
                      }
                    </div>
                  </div>
                </li>

              </ul>
            </div>
        </div>
      </div>
      

        {
          showMask?
          <div className="mask" onClick={()=>{this.setState({showMask:false})}}>
            <div className="mask_content">
              <div className="mask_title">
                <p className="p1">{detail.ftitle}<p className="p2">{moment(detail.fpublishTime).format('YYYY-MM-DD HH:mm:ss')}</p></p >
              </div>
              <div className="mask_word">
                <p className="mask_word1">尊敬的众借帮客户，您好！</p>
                <p className="mask_word2">{detail.article ? detail.article.fcontent : null }</p>
              </div>
              <div className="logo">
                <div className="logo_img"><img src={require('../../assets/img/logo2.png')} alt=""/></div>
                <div className="time">{moment(detail.fpublishTime).format('YYYY-MM-DD')}</div>
              </div>
            </div>
          </div> : null
        }
      </div>
    );
  }
}
