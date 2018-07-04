import React from 'react';
import { Icon, Button,Modal,message  } from 'antd';
import '../../assets/ucenter/realName.scss';
import OpenAccount from './openAccount';
import { getUserBaseData, commitOpenAccount} from '../../services/api';
import { TURN_BACK } from '../../common/systemParam';
import { connect } from 'dva';
@connect((state)=> ({
  openStatus: state.account.openStatus
}))
export default class OpenQAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPage: 'mmmpage-warn',
      realName: '',
      idcard: '',
      submitParam: {
        reqParam: {

        }
      },
      param: null
    };
  }

  componentDidMount() {
    console.log('this.state', this.state);
    console.log('this.state.showPage', this.state.showPage);
    this.getUserPhone();
  }

   // 获取用户手机号
   async getUserPhone() {
    const response = await getUserBaseData();
    console.log(response);
    if (response.code === 0) {
      if (response.data) {
        let param = {
          mobile: response.data.fmobile,
          realName: response.data.freal_name,
          identificationNo: response.data.fidcard_No,
          accountType: '0',
          notifyPageUrl: `${TURN_BACK}#/index/uCenter/bindCard`
        }
        this.setState({param});
      }
    }
  }

  // 提交数据
  async handleSubmitParam() {
    if (this.state.loading) {
      return;
    }
    this.setState({loading: true});
    const response = await commitOpenAccount(this.state.param);
    // this.setState({loading: false});
    if (response.code === 0) {
      if (response.data) {
        this.setState({
          submitParam: response.data,
          loading: false
        }, ()=>{
          this.formId.submit();
        })
      }
    } else {
      this.setState({loading: false});
      response.msg && message.error(response.msg);
    }
  }

  handSubmit = (param) => {
    console.log("submitParam:",param);
    this.setState({showPage: 'mmmpage-warn'});
  }

  render() {
    console.log('this.state.showPage', this.state.showPage);
    console.log("submitParam:",this.state.submitParam);
    const { realName, submitParam } = this.state;
    const suffix = realName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    let formRef = null;
      return(
        <div className="pages" style={{}}>
          {
            this.state.showPage === 'mmmpage-warn' ?
              <div>
                <div className="real_title_">
                  <span className="safeCenter_" onClick={()=>this.props.history.push('/index/uCenter/realName')}>实名认证</span>
                  <span style={{fontSize: 16}}>&gt; 开通乾多多资金托管账户 &gt; 发起开通申请</span>
                </div>
                <div className="page_content">
                  <div className="openingHints">
                    <img alt="" src={require('../../assets/img/ucenter/u4288.jpg')} />   
                  </div>
                  <div className="titleWord">
                    <p >开通资金托管账户，将投资人、借款人、平台三者的资金完全隔离</p>
                    <p style={{marginTop:15}}>保障您的资金安全</p>
                  </div>
                  <div className="buttonGroup">
                    <Button type="primary" className="open" disabled={!this.state.param} loading={this.state.loading} onClick={() => this.handleSubmitParam()}>申请开通</Button>
                  </div>
                 
                </div>
                <form ref={ref => { this.formId = ref}} action={submitParam.submitUrl} method="post" target="_blank" style={{ display: 'none' }}>
                  <input id="AccountType" name="AccountType" value={0} />
                  <input id="Email" name="Email" value={submitParam.reqParam.Email} />
                  <input id="IdentificationNo" name="IdentificationNo" value={submitParam.reqParam.IdentificationNo} />
                  <input id="LoanPlatformAccount" name="LoanPlatformAccount" value={submitParam.reqParam.LoanPlatformAccount} />
                  <input id="Mobile" name="Mobile" value={submitParam.reqParam.Mobile} />
                  <input id="NotifyURL" name="NotifyURL" value={submitParam.reqParam.NotifyURL} />
                  <input id="PlatformMoneymoremore" name="PlatformMoneymoremore" value={submitParam.reqParam.PlatformMoneymoremore} />
                  <input id="RandomTimeStamp" name="RandomTimeStamp" value={submitParam.reqParam.RandomTimeStamp} />
                  <input id="RealName" name="RealName" value={submitParam.reqParam.RealName} />
                  <input id="RegisterType" name="RegisterType" value={submitParam.reqParam.RegisterType} />
                  <input id="Remark1" name="Remark1" value={submitParam.reqParam.Remark1} />
                  <input id="Remark2" name="Remark2" value={submitParam.reqParam.Remark2} />
                  <input id="Remark3" name="Remark3" value={submitParam.reqParam.Remark3} />
                  <input id="ReturnURL" name="ReturnURL" value={submitParam.reqParam.ReturnURL} />
                  <input id="SignInfo" name="SignInfo" value={submitParam.reqParam.SignInfo} />
                </form>
              </div> : null
          }
        </div>
      );
  }
}
