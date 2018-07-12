import React from 'react';
import $ from 'jquery';
import {Icon, Spin} from 'antd';
import './delModal.scss';

export default class DelModal extends React.Component{

    constructor(props){
        super(props)
    }//loadingdel
    cnacelDel(){
        $('.del-modal').css('display','none');
    }
    sureDel(){
        this.props.comitDel();
    }

    showModal(){
        $('.del-modal').css('display','block');
    }
    render(){
        return(
            <div className="del-modal">
                <Spin spinning={this.props.loading}>
                    <p className="del-header">
                    <span onClick={()=>this.cnacelDel()}>
                        <Icon type="close" />
                    </span>
                    </p>
                    <div className="del-content">
                        {this.props.content}
                    </div>
                <div className="del-btn">
                        <a className="btn-sure" onClick={this.sureDel.bind(this)}>{this.props.sure}</a>
                        <a className="btn-cancel" onClick={()=>this.cnacelDel()}>{this.props.cancel}</a>
                </div>
               </Spin>     
            </div>
        )
    }
}