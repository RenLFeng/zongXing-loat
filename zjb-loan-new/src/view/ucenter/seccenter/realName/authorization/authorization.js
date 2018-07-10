import React from 'react';
import Modal from '../../../../../common/Sideslip/Sideslip';
import './authorization.scss';

export default class AddModal extends React.Component{
    closeModal = () => {
        this.props.operateModal();
    }
    render(){
        return(
            <Modal visable={this.props.visable} closeModal={this.closeModal} >
              <div className="modal_warp">
                <div className="content">
                  {/* <iframe src="https://open.shujumohe.com/box/jd?box_token=310CF7ACA225403FA765BA9A7DE3590A" className="h5_iframe" id="h5_iframe" style={{width:'100%',height:'100%'}} > */}
                  <iframe src="www.baidu.com" className="h5_iframe" id="h5_iframe" style={{width:'100%',height:'100%'}} >
                  </iframe>
                </div>
              </div>
            </Modal>
        )
    }
}