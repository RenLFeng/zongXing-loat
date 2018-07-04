import React from 'react';
import {Button, Icon, Modal} from 'antd';
import {Link} from 'dva/router'
import '../../assets/ucenter/bankCard.scss';
import Path from '../../common/pagePath';
import LeftMenu from '../../components/UCenterComponent/leftMenu';

const confirm = Modal.confirm;

export default class BankCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bankCard: [{id:1},{id:2}]
    };
  }

  deleteBankCard() {
    confirm({
      title: '提示',
      content: '您确定要删除已绑定银行卡吗？',
      center: 'center',
      okText: '确认',
      okType: 'danger',
      cancelText: '暂不删除',
      onOk() {
        console.log('OK');
      },
    });
  }

  render() {
    return(
      <div>
        <LeftMenu param={this.props}/>
          <div className="fr uc-rbody">
          <div className="backCard">
            { this.state.bankCard.map((data)=>{
              return (
                  <div
                    key={data.id}
                    className="bankCardDiv"
                    onMouseOut={()=>this.setState({[data.id]: false})}
                    onMouseOver={()=>this.setState({[data.id]: true})}
                    style={{border: `1px solid ${this.state[data.id]? '#FF7E10': '#F0F0F0'}`}}>
                    <div className="mt">
                      <span className="bank">中国银行</span>
                      <span className="tail-number">尾号3258</span>
                      <span className="type">
                        <span className="saving">储蓄卡</span>
                      </span>
                    </div>
                    <div className="mc">
                      <div className="item">
                        <span>持卡人姓名: *云峰</span>
                      </div>
                      <div className="item">
                        <span>手机号: 156****9171</span>
                        <a
                          style={{display:`${this.state[data.id]? 'inline': 'none'}`}}
                          onClick={this.deleteBankCard.bind(this, data.id)}
                        >删除</a>
                      </div>
                    </div>
                  </div>
              );
              })
            }
          </div>
        </div>
      </div>
      
    );
  }
}
