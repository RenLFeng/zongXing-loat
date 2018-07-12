import React from 'react';
import { Timeline, Icon, Modal, message, Input, Spin} from 'antd';
import {parseTime} from '../dateformat/date';
import './timeline.scss';
import LoanTitle from '../mineLoanComm/loanTitle';
import {IMG_BASE_URL} from '../../../../common/SystemParam';
import UploadImg from '../../../../components/imgupload/ImgUpload';
import {mineloan} from '../../../../services/api';
import {connect} from 'dva';
const { TextArea } = Input;

const imgurl = 'https://zjb-test-1255741041.picgz.myqcloud.com/'
@connect((state)=>({
    projectId: state.mineloan.projectId,
    projectName: state.mineloan.projectName,
}))
class MineTimel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            timeDate: [],
            loading: false,
            loadingadd: false,
            modal2Visible: false,
            fContent: '',
            fPicJson: '',
            fid: '',
            edit: false,
            editDate: {}
        }
        this.data = {
            className: "ant-upload",
            type: "images/",
            divClassName: "upload-div",
            baseUrl: IMG_BASE_URL
          };
    }

    componentDidMount(){
        this.getTimeLine()
    }

    //获取历程
    async getTimeLine(){
        this.setState({
            loading: true
        })
        let data = {
            projectId: this.props.projectId,
        }
        let res = await mineloan.getTimeLine(data)
        if(res.code === 0){
            this.setState({
                timeDate: res.data,
                loading: false
            })
        }else{
            this.setState({
                loading: false
            })
            message.error(res.msg);
        }
    }

    //添加
    addCourse(){
        this.setState({
            modal2Visible: true
        })
    }
    //取消
    async cancelAdd(){
        await this.setState({
            fContent: '',
            modal2Visible: false,
            edit: false
        })
        this.refs.upload.handleCancel();
    }
    //新增历程
    async saveCourse(){
        let data = {}
        this.setState({
            loadingadd: true
        })
        if(this.state.edit){
            data = this.state.editDate;
            data.fProjectId = this.props.projectId;
            data.fContent = this.state.fContent;
            data.fPicJson = this.state.fPicJson;
            data.fId = data.fid
            data.fTime = data.ftime
        }else{
            data = {
                fProjectId: this.props.projectId,
                fContent: this.state.fContent,
                fPicJson: this.state.fPicJson,
                ftype: '1',
            }
        }
        let res = await mineloan.addTimeLine(data);
        if(res.code === 0){
            this.cancelAdd();
            this.getTimeLine();
            this.setState({
                loadingadd: false
            })
        }else{
            message.error(res.msg);
            this.setState({
                loadingadd: false
            })
        }
    }
    //修改历程
    async editCourse(item){
       await this.setState({
            fid: item.fid,
            fContent: item.fcontent,
            fPicJson: item.fpic_json,
            modal2Visible: true,
            ftype: '1',
            edit: true,
            editDate: item
        })
        this.refs.upload.setPicture(item.fpic_json)
    }
    //删除历程
    delCourse(item){
        console.log(item,'item')
    }
    onChange(val){
        console.info(val,'val')
        this.setState({
            fPicJson: val
        })
    }
    render(){
        let timeline = [];
        this.state.timeDate.map((item,index)=>{
            timeline.push(
                <Timeline.Item key={index}>
                    <p style={{color: '#ddd'}}>{parseTime(item.ftime,'{y}-{m}-{d} {h}:{i}')}</p>
                    <div>
                        <div className="line-content">
                            {item.fcontent}
                            { item.ftype === 1 ?
                                <div className="line-icon">
                                    <Icon type="edit"  onClick={this.editCourse.bind(this,item)}/>
                                    <Icon type="delete" onClick={this.delCourse.bind(this,item)}/>
                                </div> : 
                                ''
                            }
                        </div>
                        {
                            item.fpic_json ? <img src={imgurl+item.fpic_json} className="line-img"/> : ''
                        }
                    </div>
                </Timeline.Item>
              )
        })
        let { fContent } = this.state; 
        return(
            <div className="pe time-line" style={{backgroundColor: '#fff',padding: '30px',marginTop: '8px'}}>
                <LoanTitle title="项目历程">
                    <a onClick={() => this.addCourse()} className="add-minet"><Icon type="plus" />添加</a>
                </LoanTitle>
                <div style={{maxHeight: 800,overflowY: 'auto'}}>
                    <Spin spinning={this.state.loading}>
                        <Timeline>
                            {timeline}
                        </Timeline>
                    </Spin>
                </div>
                <Modal
                    mask={false}
                    closable={false}
                    visible={this.state.modal2Visible}
                    onOk={() => this.saveCourse()}
                    onCancel={() => this.cancelAdd()}
                    okText="提交"
                    cancelText="取消"
                    className="notice-modal"
                    maskClosable={false}
                >
                    <Spin spinning={this.state.loadingadd}>
                        <TextArea value={fContent} onChange={(e)=> this.setState({fContent: e.target.value})} rows={4}
                                style={{marginBottom: '8px'}}/>
                        <UploadImg ref="upload" {...this.data} prefix={'personal/'} tipText="上传照片" onChange={this.onChange.bind(this)}/>
                    </Spin>
                </Modal>
            </div>
        )
    }
}

export default MineTimel;
