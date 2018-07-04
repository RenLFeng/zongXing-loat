import React from 'react';
import { Link } from 'dva/router';
import { Icon, Input, Button, message, Spin } from 'antd';
import '../../assets/ucenter/realName.scss';
import { verifyIdcard } from '../../services/api';
import Path from '../../common/pagePath';

export default class BindSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countDownTiem: 5,
      realName: '',
    };
    let timeDown = null;
  }
  componentDidMount() {
    this.timeDown = setInterval(()=> {
      this.setState({
        countDownTiem: this.state.countDownTiem-1
      }, ()=> {
        if (!this.state.countDownTiem) {
          clearInterval(this.timeDown);
        }
      })
    }, 1000);
  }

  componentWillUnmount() {
    if (this.timeDown) {
      clearInterval(this.timeDown);
    }
    
  }

  render() {
    const { userName } = this.state;

    return (
      <div className="pages">
        <div>
          <div className="real_title_">
            <span className="safeCenter_">实名认证</span>
            <span style={{fontSize: 16}}> &gt; 身份认证 &gt; 身份认证成功</span>
          </div>
          { this.state.realName ? 
            <div className="bind_success_div">
              <div className="bind_success_tip">
                <i className={`zjb zjb-duihao duihao_icon`}></i>
                <p className="bind_success_title">{'姓名'},恭喜您已通过身份认证</p>
              </div>
              <p className="bind_success_title_sub">下一步：前往开通资金托管账户</p>
              <a className="bind_success_path">{this.state.countDownTiem}秒后自动跳转</a>
            </div> : null
          }
          {/* { this.state.realName ? 
            <div className="bind_success_div">
              <div className="bind_success_tip">
                <i className={`zjb zjb-duihao duihao_icon`}></i>
                <p className="bind_success_title">{'姓名'},恭喜您已通过身份认证</p>
              </div>
              <p className="bind_success_title_sub">下一步：前往开通资金托管账户</p>
              <a className="bind_success_path">{this.state.countDownTiem}秒后自动跳转</a>
            </div> : null
          } */}
        </div>
      </div>
    );
  }
}
