import React from 'react';
import './detailsOne.scss';
import {Card, Button, Row, Col, Layout, Divider, Table, Icon, Input, message} from 'antd';
import UploadVideo from './video/uploadVideo';
import ImgUpload from './Img/uploadImg';
import UploadPicMultipleFile from './Img/UploadPicMultipleFile';
import {wsbaseService} from '../../../../../services/api';
import { EditorState, convertToRaw, ContentState, convertFromRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import Editor from './edit'
import _ from 'lodash';

import {IMG_BASE_URL, TURN_BACK, HOME_INDEX} from '../../../../../common/SystemParam';

const { TextArea } = Input;

export default class DetailEdit extends React.Component{
    constructor(props){
        super();
        this.state = {
            information:{},
            loading: false,
            pic1Url:'',
            pic2Url:'',
            projectArr:[],
        }
        this.fileData = {
            type:"file/",
            baseUrl: IMG_BASE_URL
          };
        this.data = {
            className: "ant-upload",
            type: "images/",
            divClassName: "upload-div",
            baseUrl: IMG_BASE_URL
          };
        
    }
    componentDidMount(){
        this.getEditDetail();
    }

    onChange(val){
        this.setState({
            pic1Url:val
        })
    }
  
    onChange_(val){
        this.setState({
            pic2Url:val
        })
    }

    upIndex = (index) => {
        if (index === 0) {
          return;
        }
        const arr = this.state.projectArr;
        let temp = null;
        temp = arr[index];
        arr[index] = arr[index-1];
        arr[index-1] = temp;
        this.setState({
          projectArr: arr,
        });
        this.forceUpdate();
      };
    
    downIndex = (index) => {
        if (index === this.state.projectArr.length - 1) {
          return;
        }
        const arr = this.state.projectArr;
        let temp = null;
        temp = arr[index];
        arr[index] = arr[index+1];
        arr[index+1] = temp;
        this.setState({
          projectArr: arr
        });
        this.forceUpdate();
    };

      async getEditDetail(){
          let param = {
            projectId: this.props.projectId
          }
          const response = await wsbaseService.getEditDetail(param);
          if(response.code === 0){
             this.setState({
                 information:response.data,
                 projectArr:response.data.projectModules,
                pic1Url:response.data.fcard_pic_path,
                pic2Url:response.data.fbanner_pic_path,
                // param:response.data.projectModules.fcontent
                video:response.data.fvideo_path?JSON.parse(response.data.fvideo_path):[]
             })
          }
      }

      async saveDetail(){
        let arr = this.state.projectArr;
        for (let i = 0; i < arr.length; i++) {
          arr[i].fsort = i;
          arr[i].fcontent = draftToHtml(convertToRaw(this[`editor${i}`].returnValue().getCurrentContent()));
        }
          let param = {
              projectInfo:{
                fpeojectId:this.state.information.fpeoject_id,
                fcardPicPath:this.state.pic1Url,
                fbannerPicPath:this.state.pic2Url,
                fvideoPath:JSON.stringify(this.state.video),
                fcoupon:'',
                flocation:'',
                fpictureJson:''
              },
              projectModules : this.state.projectArr,
          }
          const response = await wsbaseService.saveEditDetail(param);
          if(response.code === 0){
              message.info('保存成功')
          } else {
              response.msg && message.error(response.msg)
          }
      }

    render(){
        const dataPath_ = this.state.information.fcompany_no+'/';
        const {pic1Url,pic2Url,information,loading} = this.state;

        return(
            <div className="edit">
                <div className="content"> 
                    <Row>
                        <Col span={12}>
                            <i className="zjb zjb-bixutian icon"/><span >项目名称：</span>
                            <Input value={information.fname} disabled style={{width:350}}/>
                        </Col>
                        <Col span={10} style={{marginLeft:'5%'}}>
                            <i className="zjb zjb-bixutian icon"/>
                            <UploadVideo {...this.fileData} prefix={dataPath_}  value={this.state.video} onChange={(e)=>this.setState({video:e})}>借款视频</UploadVideo>
                        </Col>
                    </Row>
                    <Divider />
                    <div className="imgBox"> 
                        <Row style={{marginBottom: 20}}>
                            <Col span={12}>
                            <i className="zjb zjb-bixutian icon img_title"/><span >借款项目展示封面图</span>
                                <div className="img_box">
                                    <div className="box">
                                        <img src={IMG_BASE_URL+pic1Url}/> 
                                        <div className="imgMask">
                                           <div className="videoBox">
                                           <ImgUpload {...this.data} prefix={'personal/'} tipText="" onChange={this.onChange.bind(this)}/> 
                                           </div>
                                        </div> 
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                            <i className="zjb zjb-bixutian icon img_title"/><span >经营场所实景图</span>
                                <div className="img_box">
                                    <div className="box">
                                        <img src={IMG_BASE_URL+pic2Url}/>
                                        <div className="imgMask">
                                            <div className="videoBox">
                                                <ImgUpload {...this.data} prefix={'personal/'} tipText="" onChange={this.onChange_.bind(this)}/>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Divider />

                    {
                        this.state.projectArr.map((data,index)=>{
                            return(
                            <div key={index} className={index === 0 ? 'info-div-box textBox' : 'textBox'}> 
                                <p className="title" style={{position:"relative"}}>
                                    <i className="zjb zjb-bixutian icon"/>{data.ftitle}<Icon type="question-circle-o" className="icon p_icon"/>
                                    {index === 0 ?
                                        null  :
                                        ( (index === 1)?
                                            <div style={{position: 'absolute', right: 10, zIndex: 10, top:0}}>
                                            <Icon type="arrow-down" style={{fontSize: 16, paddingRight: 5,cursor:'pointer'}} onClick={()=>this.downIndex(index)}/>
                                        </div>:
                                        (index ===  this.state.projectArr.length -1 ) ?
                                        <div style={{position: 'absolute', right: 10, zIndex: 10, top:0}}>
                                            <Icon type="arrow-up" style={{fontSize: 16, paddingRight: 5,cursor:'pointer'}} onClick={()=>this.upIndex(index)}/>
                                        </div>:
                                        <div style={{position: 'absolute', right: 10, zIndex: 10, top:0}}>
                                            <Icon type="arrow-up" style={{fontSize: 16, paddingRight: 5,cursor:'pointer'}} onClick={()=>this.upIndex(index)}/>
                                            <Icon type="arrow-down" style={{fontSize: 16, paddingRight: 5,cursor:'pointer'}} onClick={()=>this.downIndex(index)}/>
                                        </div>
                                        )
                                    }
                                </p>
                                <div className="text_">
                                    <Editor 
                                        ref={ref => this[`editor${index}`] = ref}
                                        value={data.fcontent ? data.fcontent: ''}
                                    />
                                </div>
                                <div className="img">
                                    <UploadPicMultipleFile
                                        {...this.data}
                                        prefix={dataPath_}
                                        onChange={(e)=> {
                                            let arr = this.state.projectArr;
                                            let valArr = _.cloneDeep(e);
                                            for (let i = 0; i<valArr.length; i++) {
                                            if (valArr[i].status !== 'done') {
                                                valArr.splice(i, 1);
                                            }
                                            }
                                            arr[index].fpictures = JSON.stringify(valArr);
                                            this.setState({
                                                projectArr: arr
                                            })
                                        }}
                                        value={data.fpictures?JSON.parse(data.fpictures):[]}
                                        >项目详情图片</UploadPicMultipleFile>
                    
                                </div>
                            </div>
                            )
                        })
                    }
                </div>

                <div className="btnGroup">
                  <Button style={{background:'#2088FC'}} loading={loading} onClick={()=>this.saveDetail()}>保存</Button>
                  <Button style={{background:'#19C61E'}} loading={loading} onClick={()=>this.props.commitData(this.props.projectId)}>提交</Button>
                </div>    
            </div>
        )
    }
}