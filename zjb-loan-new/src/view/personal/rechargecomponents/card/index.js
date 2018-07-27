
import React from 'react';
import './index.scss'
import { Link } from 'dva/router';
import { accountService} from '../../../../services/api'
import { Card, Row, Col, Checkbox, Button, AutoComplete, Modal,message } from 'antd';
import { connect } from 'dva';
import Recharge from '../recharge'
import Account from '../accountWithdrawals/accountWithdrawals'

import BindCard from './bindcard/bindCard'
import Path from '../../../../common/PagePath'

export default class Loaninfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            card: [],
            activeObj: [],
            allModelVisible: false,
            modalWidth: 500,
        }
    }
    handlerClcikLable(item) {
        this.setState({
            activeObj: item,

        })
        console.log(item, this.state.activeObj)
    }
    componentDidMount() {
        this.getinit();
    
    }

    //获取银行卡信息
  async  getinit() {
        //获取银行卡
        const response = await accountService.getBankCardList();
        console.log('提现银行卡接口', response);
        if (response.code === 0) {
            if(response.data.length>0){
                this.setState({
                    card: response.data,
                    activeObj:  response.data[0]
                });
            }
        } else {
            message.error(response.msg);
        }
    }
    handleOk = (e) => {
        console.log(e);
        this.setState({
            allModelVisible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            allModelVisible: false,
        });
    }
    subs(val){
      if(val ==null){
        return ' '
      }else{
          return val.substring(0,4)+"**** ****"+val.substring(val.length-4);
         
      }
    }
    render() {
        return (
            <div className="card-info">
                <Row >
                    {
                        this.props.types === '1' ? <center> </center> : <center>请选择到账银行卡</center>
                    }

                    {
                         this.props.types === '1' ? <center> </center> :
                         <div className="css_div">
                        {this.state.card.map((item, index) => {
                            return  (
                                <div className="card_div" key={index} onClick={()=>this.setState({activeObj: item})}>
                                    <div className="IDCard">
                                        <div>
                                            <div className="card_info">
                                            <div className="card_img">
                                                {/* <img src={`${data.flogo}`}/> */}
                                            </div>
                                            <div className="card_text">
                                                <p>{item.fbank}</p>
                                                {/* <span>{data.fcardType}</span> */}
                                                <span>借记卡</span>
                                            </div>
                                            </div>
                                            <span className="id_num">
                                            {item.fbankcard.substring(0, 4)} **** **** {item.fbankcard.substring(item.fbankcard.length - 4, item.fbankcard.length)}
                                            </span>
                                        </div>  
                                    </div>
                                </div>
                            )
                        })}
                        </div>
                    }
                </Row>
                {
                    this.props.types === '1' ? 
                    <div className="card-logo-recharge">
                        {/* <span className="card-logo-recharge-add"  ><Link to="/index/uCenter/bindCard" > +使用新卡充值</Link> </span>
                        <span className="card-logo-recharge-tip">（只支持储蓄卡）</span> */}
                    </div>
                     : <div className="card-logo-recharge">
                            <span className="card-logo-recharge-add"><Link to="/index/uCenter/bindCard" > +使用新卡提现</Link> </span>
                            <span className="card-logo-recharge-tip">（只支持储蓄卡）</span>
                        </div>
                }
               
                {
                    this.props.types === '2' ? 
                    <div>
                     <img src={require('../../mineLoan/img/u904.png')} ></img>
                        <Account param={this.state.activeObj} />
                    </div>
                    : null
                }
                {
                    this.props.types === '1' ? <Recharge param={this.state.activeObj} /> : null
                }

            </div>
        )
    }
}
