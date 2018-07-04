import React from 'react';
import {Icon, message, Row, Col} from 'antd';
import '../../assets/myInvest/income.scss';
import { getIncomePlan } from '../../services/api.js';
import moment from 'moment';
import LeftMenu from '../../components/UCenterComponent/leftMenu';



export default class IncomePlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      incomeList: [],
      principal: 0, //本金
      total_money: 0, //本金加利息
      earnings: 0, //利息
    }
  }

  componentDidMount() {
    try {
      // 从上个页面获取 projectId 和要计算的金额
      let projectId = this.props.history.location.query.projectId;
      let money = this.props.history.location.query.money;
      // 调取接口
      this.getIncomeAjax({projectId, money});
    } catch(e) {
      // 刷新页面会拿不到projectId， money所以需要跳转页面回去
      this.props.history.push('/index/uCenter/myInvest');
    }
  }

  // 获取收益计划接口
  async getIncomeAjax({projectId, money}) {
    const response = await getIncomePlan(projectId, money);
    if (response.code === 0) {
      if (response.data && Array.isArray(response.data)) {
        let principal= 0; //总本金
        let earnings= 0;// 利息
        let total_money= 0; //收益总金额
        // 计算总值
        for (let obj of response.data) {
          principal = principal.add(obj.principal);
          earnings = earnings.add(obj.earnings);
          total_money = total_money.add(obj.total_money);
        }
        this.setState({
          principal,
          earnings,
          total_money,
          incomeList: response.data
        })
      }
      console.log(response);
    } else {
      response.msg && message.error(response.msg);
    }
  }



  render() {
    const { arr,showMask,detail } = this.state;
    return (
      <div>
        <LeftMenu param={this.props}/>
        <div className="fr uc-rbody" >
          <div className="title33" style={{position: 'relative'}}>
            <span className="title1">收益计划</span>
            <div className="unit-yuan">
              <span style={{fontSize: 14, margin: '0 auto'}}>单位：元</span>
            </div>
          </div>
          <div className="content_">
            <Row style={{marginBottom: 20}}>
              <Col span={8} style={{textAlign: 'center'}}>
                <b style={{fontSize: 16}}>总本金&nbsp;<b style={{fontSize: 20,color: '#FF9900'}}>{`${this.state.principal}`.fm()}</b></b>
              </Col>
              <Col span={8} style={{textAlign: 'center'}}>
                <b style={{fontSize: 16}}>总收益&nbsp;<b style={{fontSize: 20,color: '#FF9900'}}>{`${this.state.total_money}`.fm()}</b></b>
              </Col>
              <Col span={8} style={{textAlign: 'center'}}>
                <b style={{fontSize: 16}}>总利息&nbsp;<b style={{fontSize: 20,color: '#FF9900'}}>{`${this.state.earnings}`.fm()}</b></b>
              </Col>
            </Row>
            <div className="investGroup">
              <ul >
                <li className="investList">
                  <span className="income_num"><p style={{cursor: 'auto'}}>期数</p></span>
                  <span className="income_get">收益</span>
                  <span className="income_capital">本金</span>
                  <span className="income_Interest">利息</span>
                </li>
                {
                  this.state.incomeList.map((data,index)=> (
                    <li className="investList" key={index}>
                      <span className="income_num">{data.earningsDate}</span>
                      <span className="income_get"><b style={{color: '#FF9900'}}>{`${data.total_money}`.fm()}</b></span>
                      <span className="income_capital"><b style={{color: '#FF9900'}}>{`${data.principal}`.fm()}</b></span>
                      <span className="income_Interest"><b style={{color: '#FF9900'}}>{`${data.earnings}`.fm()}</b></span>
                    </li>
                  ))
                }

              </ul>
            </div>
          </div>
        </div>
      </div>
      
    );
  }
}
