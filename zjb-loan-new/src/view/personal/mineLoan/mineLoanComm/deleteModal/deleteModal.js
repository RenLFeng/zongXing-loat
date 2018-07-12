import React from 'react';
import $ from 'jquery';
import {Icon, Spin, Modal} from 'antd';
import './delModal.scss';

export default class DelModal extends React.Component{

    constructor(props){
        super(props)
    }
    cnacelDel(){
        this.props.cnacelDel();
    }
    sureDel(){
        this.props.comitDel();
    }

    showModal(){
    }
    render(){
        return(
            <div className="del-modal" key={this.props.key}>
                    <Modal
                        visible={this.props.visible}
                        title="确认删除"
                        onOk={this.sureDel.bind(this)}
                        width={360}
                        onCancel={this.cnacelDel.bind(this)}
                        maskClosable={false}
                        mask={false}
                        footer={[
                            <div className="del-modal-btn">
                                <Spin spinning={this.props.loading}>
                                    <a className="btn-sure" onClick={this.sureDel.bind(this)} >{this.props.sure}</a>
                                    <a className="btn-cancel" onClick={this.cnacelDel.bind(this)} >{this.props.cancel}</a>
                                </Spin>
                            </div>
                        ]}
                        >
                            <div className="del-modal-content">{this.props.content}</div>
                    </Modal>
            </div>
        )
    }
}