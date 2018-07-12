
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
        debugger

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
                        this.state.card.map(item => {
                            return <div>
                                <Col span={8}>
                                    <Card style={{ background: '#0b69fd', cursor: 'pointer', marginLeft: 16, marginRight: 16, marginBottom: 8 }} onClick={this.handlerClcikLable.bind(this, item)}>
                                        <div className='card-logo '>
                                            <img src={item.flogo} className="logo-img"></img>
                                        </div>
                                        <div className='card-logo-info'>
                                            <p className="card-logo-back" >{item.fbank}</p>
                                            <p className="card-logo-type">{item.fcardType}</p>
                                            <p className="card-logo-num">{this.subs(item.fbankcard)}</p>
                                        </div>
                                    </Card>
                                </Col>
                            </div>
                        })
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
