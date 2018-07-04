import React from 'react';
import {Icon, message, Table, Button, Checkbox,Menu, Dropdown } from 'antd';
import '../../../assets/MessageList/messageList.scss';
import {getButtonType, getMessageType, setRead, setAllRead, setDelete} from '../../../services/api.js';
import moment from 'moment';
import {STATION_MESSAGE} from '../../../common/pagePath';
import {pageShows} from '../../../common/systemParam';

export default class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxPage: 0,     //最大页
      arr: [], //消息列表
      arr1:[],  //暂存数据列表
      allCheck:false,
      num:0,  //已选数目
      nums:0,   //项目总个数
      not_num:0,  //未读个数
      buttonArr:[],
      pageIndex:1,  //当前页，初始值为第一页
      pageSize: 15,    //每页可显示的消息条数
      typeNo:''
    }
  }

  componentDidMount() {
    this.ButtonType();
    // this.readNot();
  }

  //获取按钮类型
  async ButtonType(){
    const response = await getButtonType();
    console.log(response);
    if(response.code === 0){
      this.setState({
        buttonArr:response.data,
      },()=>{
        this.setState({
          typeNo:response.data[0].fno,
        });
        this.MessageType(response.data[0].fno, 1)
      })
    } else {
      message.error(response.msg);
    }
  }

  //按类型获取消息列表
  async MessageType(no,page) {
    const response = await getMessageType({pageIndex:page,pageSize:this.state.pageSize,typeNo:no});
    console.log(response);
    if(response.code === 0){
      const maxPage = Math.ceil(response.data.itemCount / this.state.pageSize);
      this.setState({
        maxPage: maxPage,
        pageIndex: page,
        typeNo: no,
        arr: response.data.messages,
        arr1: response.data.messages,
        nums: response.data.messages.length,
      },()=>{
        const list = this.state.arr.filter((item)=>(item.fisRead !== true ));
        this.setState({
          not_num:list.length,
        })
      });
    } else {
      message.error(response.msg);
    }
  }

  //设置已读
  async setRead(){
    let list = this.state.arr1;
    const list1 = list.filter((item)=>(item.checkboxValue === true));
    const id = list1.map((item)=>(item.fid)).toString();
    console.log(id);
    const response = await setRead({fids:id});
    if(response.code ===0){
      this.MessageType(this.state.typeNo, this.state.pageIndex);
      this.setState({
        num:0,
      })
    } else {
      message.error(response.msg);
    }
  }

  //设置全部已读
  async setAllRead() {
    const response = await setAllRead();
    if(response.code ===0){
      this.MessageType(this.state.typeNo, this.state.pageIndex);
    } else {
      message.error(response.msg);
    }
  }

  //删除消息
  async delete() {
    let list = this.state.arr1;
    const list1 = list.filter((item)=>(item.checkboxValue === true));
    const id = list1.map((item)=>(item.fid));
    const response = await setDelete(id);
    if(response.code === 0){
      this.MessageType(this.state.typeNo,this.state.pageIndex);
      this.setState({
        num:0,
      })
    } else {
      message.error(response.msg);
    }
  }

  onChange(e,data, index){
    let list = this.state.arr1;
    list[index].checkboxValue =  e.target.checked;
    this.setState({
      arr1: list,
    },() => {
      let arr_ = this.state.arr1.filter((item) => item.checkboxValue === true);
      this.setState({num:arr_.length});
      if(arr_.length === list.length){
        this.setState({
          allCheck: true,
        });
      } else {
        this.setState({
          allCheck: false,
        });
      }
    });
  }

  handleCheckAll(e) {
    let list = this.state.arr1;
    for( let obj of list) {
      obj.checkboxValue = e.target.checked
  }
    this.setState({
      allCheck: e.target.checked,
      arr1: list,
    },() => {
      let arr_ = list.filter((item)=>(item.checkboxValue ===  true));
      this.setState({
        num:arr_.length,
      });
      console.log(arr_);
    });
    this.forceUpdate();
  }

  handleMenuClick(e) {
    this.MessageType(e.key, 1);
  }

  render() {
    const { arr, arr1, allCheck,buttonArr,pageSize } = this.state;
    //按钮数组前三位
    const arr_3 = buttonArr.slice(0,3);
    //按钮数组第三位以后
    const arr_3_ = buttonArr.slice(3);
    const page_num = pageShows(this.state.pageIndex, this.state.maxPage);

    const menu = (
      <Menu onClick={(e)=>this.handleMenuClick(e)}>
        {
          arr_3_.map((data)=>{
            return(
              <Menu.Item key={data.fno}>{data.fname}</Menu.Item>
              )
          })
        }
      </Menu>
    );
    return (
      <div className="fr uc-rbody" >
        <div className="title">
          <span className="title1">站内消息</span>
          <span className="title2_">共<i>{this.state.nums}</i>条，其中<i>{this.state.not_num}</i>条未读</span>
        </div>
        <div className="content">
          <div className="btns">
            <div className="btn1">
              <Button onClick={()=>this.delete()}>删除</Button>
              {/*<Button onClick={()=>this.setRead()} disabled>标记为已读</Button>*/}
              <Button onClick={()=>this.setRead()} >标记为已读</Button>
              <Button onClick={()=>this.setAllRead()}>已读所有消息</Button>
            </div>
            <div className="btn2">
              {
                buttonArr.length > 3 ?
                  <div className="btnBox">
                    {
                      arr_3.map((item)=>{
                        return(
                          <Button  key={item.fno} onClick={()=>this.MessageType(item.fno, 1)}>{item.fname}</Button>
                        )
                      })
                    }
                    <Dropdown overlay={menu} >
                      <Button style={{ marginLeft: 8 }} className="type_btn" >更多分类 <Icon type="down" /></Button>
                    </Dropdown>
                  </div>
                  :
                    buttonArr.map((data,index)=>{
                    return(
                      <Button onClick={()=>this.MessageType(data.fno, 1)} key={data.fno}>{data.fname}</Button>
                    )
                  })
              }
            </div>
          </div>

          <div className="messageGroup">
            <ul>
              <li className="massageList">
                <span className="massageList_title" >
                  <Checkbox className="check" onChange={(val)=>this.handleCheckAll(val)} checked={this.state.allCheck}>消息内容</Checkbox>
                </span>
                <span className="massageList_time_">时间</span>
              </li>

              { this.state.arr1.length <= 0 ?
              <p className="massageList center">暂无数据</p>:
                this.state.arr1.map((data,index)=>{
                  return(
                    <li className="massageList" key={data.fid}>
                      <Checkbox className="check" onChange={(val,data)=>this.onChange(val,data, index)} checked={data.checkboxValue?data.checkboxValue: false}/>
                      <span className={`${data.fisRead == false ? 'massageList_title1': 'massageList_title'}`}>
                        <Icon type="mail" className={`${data.fisRead == false ? 'icon2': 'icon1'}`}/>
                        <p onClick={() => this.props.history.push(STATION_MESSAGE + `/${data.fid}`)}>{data.ftitle}</p>
                      </span>
                      <span className="massageList_time">{moment(data.fsendTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    </li>
                    )
                })
              }


              <li className="footer_">
                <span>已选<i>{this.state.num}</i>项，共<i>{this.state.nums}</i>项</span>
                <div className="box_">
                  <div className="pagination">
                    {page_num.lastPage ?
                      <a className="num" onClick={() => this.MessageType(this.state.typeNo,this.state.pageIndex - 1)}>&lt;</a> :
                      <a className="num" style={{backgroundColor: '#eee'}}>&lt;</a>}
                    {page_num.firstPage ?
                      <a className={`${1 == this.state.pageIndex ? 'hover_' : ''}`} onClick={() => this.MessageType(this.state.typeNo,1)}>1</a> :
                      null}
                    {page_num.leftEllipsis ?
                      <a>...</a> :
                      null}
                    {page_num.page.map((pageNum) => {
                      return (
                        <a key={pageNum} className={`${pageNum * 1 == this.state.pageIndex ? 'hover_' : ''}`}
                           onClick={() => this.MessageType(this.state.typeNo,pageNum)}>{pageNum}</a>
                      );
                    })}
                    {page_num.rightEllipsis ?
                      <a>...</a> :
                      null}
                    {page_num.finalPage ?
                      <a
                        className={`${this.state.maxPage == this.state.pageIndex ? 'hover_' : ''}`}
                        onClick={() => this.MessageType(this.state.typeNo,this.state.maxPage)}
                      >{this.state.maxPage}</a> :
                      null}
                    {page_num.nextPage ?
                      <a className="num" onClick={() => this.MessageType(this.state.typeNo,this.state.pageIndex + 1)}>&gt;</a> :
                      <a className="num" style={{backgroundColor: '#eee'}}>&gt;</a>
                    }
                  </div>
                </div>
              </li>

            </ul>
          </div>
        </div>
      </div>





    );
  }
}
