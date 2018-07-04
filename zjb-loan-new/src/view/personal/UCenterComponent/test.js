
import React from 'react';
import { Link } from 'dva/router';
import {rechargeTest} from '../../services/api';
import LeftMenu from '../../components/UCenterComponent/leftMenu';

export default class UserBasic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
      }
    }
  }

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    const response = await rechargeTest();
    console.log(response);
    this.setState({
      data: response
    });
  }

  render() {
    const {data} = this.state;
    return (
      <div>
        <LeftMenu param={this.props}/>
        <div className="fr uc-rbody">
          <form id="form1" name="form1" action={data.submitURL} method="post" target="_blank">
            <input id="RechargeMoneymoremore" name="RechargeMoneymoremore" value={data.rechargeMoneymoremore} />
            <input id="PlatformMoneymoremore" name="PlatformMoneymoremore" value={data.platformMoneymoremore}  />
            <input id="OrderNo" name="OrderNo" value={data.orderNo} />
            <input id="Amount" name="Amount" value={data.amount}  />
            <input id="RechargeType" name="RechargeType" value={data.rechargeType}  />
            <input id="FeeType" name="FeeType" value={data.feeType}  />
            <input id="CardNo" name="CardNo" value={data.cardNo}  />
            <input id="RandomTimeStamp" name="RandomTimeStamp" value={data.randomTimeStamp}  />
            <input id="Remark1" name="Remark1" value={data.remark1}  />
            <input id="Remark2" name="Remark2" value={data.remark2}  />
            <input id="Remark3" name="Remark3" value={data.remark3}  />
            <input id="ReturnURL" name="ReturnURL" value={data.returnURL}  />
            <input id="NotifyURL" name="NotifyURL" value={data.notifyURL}  />
            <input id="SignInfo" name="SignInfo" value={data.signInfo}  />
            <input type="submit"/>
          </form>
        </div>
      </div>
      
    );
  }
}
