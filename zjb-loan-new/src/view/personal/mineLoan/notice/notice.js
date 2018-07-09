/*
 * @Author: wfl 
 * @Date: 2018-07-09 11:30:58 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-09 13:49:21
 */
import React from 'react';
import {Icon} from 'antd';
import LoanTitle from '../mineLoanComm/loanTitle';
import {IMG_BASE_URL} from '../../../../common/SystemParam';
import UploadImg from '../../../../components/imgupload/ImgUpload';
import './notice.scss';
import { Input, Modal } from 'antd';
const { TextArea } = Input;


export default class Notice extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modal2Visible: false,
            notice: ''
        }
        this.data = {
            className: "ant-upload",
            type: "images/",
            divClassName: "upload-div",
            baseUrl: IMG_BASE_URL
          };
    }
    //添加
    addNotice(){
        this.setState({
            modal2Visible: true
        })
    }
    //显示模态框
    addnewNotice(){

    }
    //取消
    cancelAdd(){
        this.setState({
            modal2Visible: false,
            notice: '',
        })
        this.refs.upload.handleCancel();
    }
    onChange(val){
        console.log(val,'notice')
    }
    render(){
        return(
            <div className="pe personal-rbody" style={{marginTop: '8px'}}>
                <LoanTitle title="项目公告">
                    <a onClick={() => this.addNotice()} className="add-notice"><Icon type="plus" />添加</a>
                </LoanTitle>

                <Modal
                    mask={false}
                    closable={false}
                    visible={this.state.modal2Visible}
                    onOk={() => this.addnewNotice()}
                    onCancel={() => this.cancelAdd()}
                    >
                    <TextArea rows={4} vlaue={this.state.notice} onChange={(e) => this.setState({notice: e.target.value})}/>
                    <UploadImg ref="upload" {...this.data} prefix={'personal/'} tipText="上传照片" onChange={this.onChange.bind(this)}/>
                </Modal>
            </div>
        )
    }
} 