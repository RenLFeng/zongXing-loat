import React from 'react';
import { Link } from 'dva/router';
import { Icon, Input, Button, message, Spin } from 'antd';
import { verifyIdcard } from '../../services/api';
import Path from '../../common/pagePath';
import '../../assets/ucenter/recharge.scss';

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
     <div className={`card_bank_component ${this.props.className||''}`} style={this.props.style} onClick={()=>{console.log(11111)}}>
       <div className="card_info">
         <div className="card_img"></div>
         <div className="card_text">
          <p>{this.props.cardName}</p>
          <span>储蓄卡</span>
         </div>
       </div>
       <p className="card_num">{this.props.cardId}</p>
     </div>
    );
  }
}
