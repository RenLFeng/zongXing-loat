/*
 * @Author: wfl 
 * @Date: 2018-07-09 11:30:58 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-12 14:49:06
 */
import React from 'react';
import {Icon, message, Row, Col} from 'antd';
import {mineloan} from '../../../../services/api';
import {parseTime} from '../dateformat/date';
import LoanTitle from '../mineLoanComm/loanTitle';
import {connect} from 'dva';
import DelModal from '../mineLoanComm/deleteModal/deleteModal';
import {IMG_BASE_URL} from '../../../../common/SystemParam';
import UploadImg from '../../../../components/imgupload/ImgUpload';
import './notice.scss';
import { Input, Modal, Spin } from 'antd';
const { TextArea } = Input;

const imgurl = 'https://zjb-test-1255741041.picgz.myqcloud.com/'

@connect((state)=>({
    // projectId: state.mineloan.projectId,
    // projectName: state.mineloan.projectName,
}))

export default class Notice extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modal2Visible: false,
            delModal: false,
            loading: false,
            loadingadd: false,
            loadingdel: false,
            visible: false,
            notice: '',
            noticeDate: [],
            fPicJson: '',
            edit: false,
            fId: '',
            fTime: '',
            fTitle: '',
            fProjectId: '',
            fContent: '',
            fCardPic: '',
            delId: '',
        }
        this.data = {
            className: "ant-upload",
            type: "images/",
            divClassName: "upload-div",
            baseUrl: IMG_BASE_URL
          };
    }

    componentDidMount(){
        this.getNotice();
    }

    //获取公告
    async getNotice(){
        this.setState({
            loading: true
        })
        let data = {
            projectId: this.props.projectId
        }
        let res = await mineloan.getNotice(data);
        if(res.code === 0){
            this.setState({
                noticeDate: res.data,
                loading: false
            })
        }else{
            message.error(res.msg);
            this.setState({
                loading: false
            })
        }
    }
    //保存 - 修改公告
    async saveNotice(){
        let data = {}
        const {fTitle, fContent, fPicJson} = this.state;
        if(fTitle.trim().length === 0){
            message.info('请输入标题');
            return
        }
        if(fContent.trim().length === 0){
            message.info('请输入内容');
            return
        }
        if(fPicJson === ''){
            message.info('请上传图片');
            return
        }
        this.setState({
            loadingadd: true
        })
        if(this.state.edit){
            data = {
                fId: this.state.fId,
                fTitle: fTitle,
                fProjectId: this.props.projectId,
                fContent: fContent,
                fCardPic: fPicJson,
                fTime:  this.state.fTime,
            }
        }else{
            data = {
                fTitle: fTitle,
                fProjectId: this.props.projectId,
                fContent: fContent,
                fCardPic: fPicJson,
            }
        }
        let res = await mineloan.saveNotice(data);
        if(res.code === 0){
            this.getNotice();
            this.cancelAdd();
            this.setState({
                loadingadd: false,
                edit: false
            })
        }else{
            this.setState({
                loadingadd: false
            })
            message.error(res.msg);
        }
    }

    //添加
    addNotice(){
        this.setState({
            modal2Visible: true
        })
    }
    //显示模态框
    addnewNotice(){
        this.saveNotice();
    }
    //取消
    async cancelAdd(){
        await  this.setState({
            fContent: '',
            fTitle: '',
            fPicJson: '',
            modal2Visible: false,
            edit: false
        })
        this.refs.upload.handleCancel();
    }
    onChange(val){
        this.setState({
            fPicJson: val
        })
    }
    //修改公告
    async editCourse(item){
       await this.setState({
            fId: item.fId,
            fTime: item.fTime,
            fTitle: item.fTitle,
            fProjectId: item.fProjectId,
            fContent: item.fContent,
            fPicJson: item.fCardPic,
            modal2Visible: true,
            edit: true,
        })
        this.refs.upload.setPicture(item.fCardPic)
    }
    cnacelDel(){
        this.setState({
            visible: false
        })
    }
    //确认删除
    async comitDel(){
        let data = {
            fid: this.state.delId
        }
        this.setState({
            loadingdel: true
        })
        let res = await mineloan.delNotice(data);
        if(res.code === 0){
            this.getNotice();
            this.setState({
                loadingdel: false,
                visible: false
            })
            this.refs.delmodal.cnacelDel();
        }else{
            this.setState({
                loadingdel: false,
            })
            message.error(res.msg);
        }
    }
    //删除
    delNotice(item){
        this.setState({
            delId: item.fId,
            visible: true
        })
    }
    render(){
        const {fContent,fTitle} = this.state;
        let noticelist = [];
        this.state.noticeDate.map((item,index) =>{
            noticelist.push(
                    <Col span={12} style={{padding: '15px'}} key={index}> 
                        <div className="notice-title">
                            {item.fTitle}
                        </div>
                        <div className="notice-photo">
                           <img src={imgurl+item.fCardPic}/> 
                        </div>
                        <div className="notice-info">
                            <div className="line-content">{parseTime(item.fTime,'{y}-{m}-{d} {h}:{i}')}</div>
                            <div className="line-icon">
                                <Icon type="edit"  onClick={this.editCourse.bind(this,item)}/>
                                <Icon type="delete" onClick={this.delNotice.bind(this,item)}/>
                            </div>
                        </div>
                    </Col>
                )})
        return(
            <div className="pe notice-no" style={{backgroundColor: '#fff',padding: '30px'}}>
                <LoanTitle title="项目公告">
                    <a onClick={() => this.addNotice()} className="add-notice"><Icon type="plus" />添加</a>
                </LoanTitle>
                <Modal
                    destroyOnClose={true}
                    mask={false}
                    closable={false}
                    visible={this.state.modal2Visible}
                    onOk={() => this.addnewNotice()}
                    onCancel={() => this.cancelAdd()}
                    okText="提交"
                    cancelText="取消"     
                    className="notice-modal"
                    maskClosable={false}
                    >
                    <Spin spinning={this.state.loadingadd}>
                        <Input placeholder="请输入标题" value={fTitle} onChange={(e)=> this.setState({fTitle: e.target.value})} maxLength={10}/>
                        <TextArea placeholder="请输入内容" value={fContent} onChange={(e)=> this.setState({fContent: e.target.value})} rows={4}
                                style={{margin: '8px 0'}}/>
                        <UploadImg ref="upload" {...this.data} value={this.state.fPicJson} prefix={'personal/'} tipText="上传照片" onChange={this.onChange.bind(this)}/>
                    </Spin>
                </Modal>

                <DelModal ref="delmodal" visible={this.state.visible} content="确定要删除公告吗？" 
                          loading={this.state.loadingdel} comitDel={() => this.comitDel()} 
                          cnacelDel={() => this.cnacelDel()} key="2"
                          sure="确定" cancel="取消"></DelModal>

                <Spin spinning={this.state.loading}>
                    <Row>
                        {noticelist}
                    </Row>
                </Spin>
            </div>
        )
    }
} 