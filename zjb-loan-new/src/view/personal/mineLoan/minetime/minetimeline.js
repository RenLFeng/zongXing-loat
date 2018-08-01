import React from 'react';
import { Timeline, Icon, Modal, message, Input, Spin} from 'antd';
import {parseTime} from '../dateformat/date';
import './timeline.scss';
import LoanTitle from '../mineLoanComm/loanTitle';
import {IMG_BASE_URL} from '../../../../common/SystemParam';
import UploadImg from '../../../../components/imgupload/ImgUpload';
import DelModal from '../mineLoanComm/deleteModal/deleteModal';
import {mineloan} from '../../../../services/api';
import {connect} from 'dva';
const { TextArea } = Input;

@connect((state)=>({
    
}))
class MineTimel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            delId: '',
            timeDate: [],
            loading: false,
            loadingadd: false,
            loadingdel: false,
            modal2Visible: false,
            visible: false,
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
            fPicJson: '',
            edit: false
        })
        this.refs.upload.handleCancel();
    }
    //新增历程
    async saveCourse(){
        let data = {}
        const { fContent, fPicJson } = this.state;
        if(fContent.trim().length === 0){
            message.info('请输入内容')
            return
        }
        if(fPicJson === ''){
            message.info('请上传图片')
            return
        }

        this.setState({
            loadingadd: true
        })
        if(this.state.edit){
            data = this.state.editDate;
            data.fprojectId = this.props.projectId;
            data.fcontent = fContent;
            data.fpicJson = fPicJson;
            data.fid = data.fid
            data.ftime = data.ftime
        }else{
            data = {
                fprojectId: this.props.projectId,
                fcontent: fContent,
                fpicJson: fPicJson,
                ftype: '1',
            }
        }
        let res = await mineloan.addTimeLine(data);
        if(res.code === 0){
            message.success(res.msg)
            this.cancelAdd();
            this.getTimeLine();
            this.setState({
                loadingadd: false,
                edit: false
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
        this.setState({
            delId: item.fid,
            visible: true
        })
    }
    cnacelDel(){
        this.setState({
            delId: '',
            visible: false
        })
    }
    //确认删除
    async delTimeLine(){
        let data = {
            fid: this.state.delId
        }
        this.setState({
            loadingdel: true,
            visible: true
        })
        let res = await mineloan.delTimeLine(data);
        if(res.code === 0){
            message.success(res.msg)
            this.getTimeLine();
            this.setState({
                loadingdel: false,
                fid: '',
                visible: false
            })
        }else{
            this.setState({
                loadingdel: false,
            })
            message.error(res.msg);
        }
    }

    onChange(val){
        this.setState({
            fPicJson: val
        })
    }
    render(){
        let timeline = [];
        this.state.timeDate.map((item,index)=>{
            console.log(item);
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
                            item.fpic_json ? <img src={IMG_BASE_URL+item.fpic_json} className="line-img"/> : ''
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
                    destroyOnClose={true}
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
                <DelModal ref="delmodal" visible={this.state.visible} content="确定要删除该历程吗？" 
                          loading={this.state.loadingdel} comitDel={() => this.delTimeLine()} 
                          cnacelDel={() => this.cnacelDel()} key="3"
                          sure="确定" cancel="取消"></DelModal>
            </div>
        )
    }
}

export default MineTimel;
