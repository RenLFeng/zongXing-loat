import React from 'react';
import $ from 'jquery';
import {Icon} from 'antd';
import './delModal.scss';

export default class DelModal extends React.Component{

    constructor(props){
        super(props)
    }
    cnacelDel(){
        $('.del-modal').css('display','none');
    }
    sureDel(){

    }

    showModal(){
        $('.del-modal').css('display','block');
    }
    render(){
        return(
            <div className="del-modal">
                <p className="del-header">
                   <span onClick={()=>this.cnacelDel()}>
                    <Icon type="close" />
                   </span>
                </p>
                <div className="del-content">
                    {this.props.content}
                </div>
               <div className="del-btn">
                    <a className="btn-sure" onClick={()=>this.sureDel()}>{this.props.sure}</a>
                    <a className="btn-cancel" onClick={()=>this.cnacelDel()}>{this.props.cancel}</a>
               </div>     
            </div>
        )
    }
}