import React from 'react';
import Modal from '../../../../../common/Sideslip/Sideslip';
import './authorization.scss';

export default class AddModal extends React.Component{
    closeModal = () => {
        this.props.operateModal();
    }

    getUrl(){
        for(let obj of this.props.url){
           obj.id = this.props.id
        }
    }
    render(){
        const {url} = this.props;
        return(
            <Modal visable={this.props.visable} closeModal={this.closeModal} >
              <div className="modal_warp">
                <div className="content">
                  <iframe src={this.props.url.url} className="h5_iframe" id="h5_iframe" style={{width:'100%',height:'100%'}} >
                 
                  </iframe>
                </div>
              </div>
            </Modal>
        )
    }
}