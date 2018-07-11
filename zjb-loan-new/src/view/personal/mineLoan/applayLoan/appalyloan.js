import React from 'react';
import { connect } from 'dva';
import LoanInfo from './appaly/loanInfo'
import LoanUserInfo from './appaly/loanUserInfo'
import LoanCompanyInfo from './appaly/loanCompanyInfo'
import LoanProInfo from './appaly/loanProInfo'
import './appalyloan.scss'
import { baseService } from '../../../../services/api';
import {message } from 'antd';

export default class Appalyloan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lables: [{
        lable: '借款信息',
        code: 1
      },
      {
        lable: '借款人信息',
        code: 2
      },
      {
        lable: '借款企业信息',
        code: 3
      },
      {
        lable: '借款项目信息',
        code: 4
      },
      ],
      activeCode: 1,
    };
  }
  handlerClcikLable(item) {
    this.setState({
      activeCode: item,
    });
  }

  componentDidMount() {
    this.getBefore();
  }
  async getBefore() {
    
    const response = await baseService.getLoanInfo();
    console.log(response);
    if (response.code === 0) {
     alert("nadaole")
    } else {
      response.msg && message.error(response.msg);
    }
  }

  render() {
    return (
      <div >
        <div style={{ width: 200, float: 'left' }}>
          <ul className='appalyloan-tag'>
            {
              this.state.lables.map(item => {
                return <div key={item.lable} onClick={this.handlerClcikLable.bind(this, item.code)}
                  className={item.code === this.state.activeCode ? 'appalyactive' : 'notappalyactive'} >
                  <span  className={item.code === this.state.activeCode ? 'activespan' : ''} >{item.code}</span>
                  <p  className={item.code === this.state.activeCode ? 'activep' : ''} >{item.lable}</p>
                </div>
              })
            }
          </ul>
        </div>
        <div className="appalyloan-info">
          <div className={this.state.activeCode === 1 ? '' : 'hides'}>
            <LoanInfo />
          </div>
          <div className={this.state.activeCode === 2 ? '' : 'hides'}>
            <LoanUserInfo />
          </div>
          <div className={this.state.activeCode === 3 ? '' : 'hides'}>
            <LoanCompanyInfo />
          </div>
          <div className={this.state.activeCode === 4 ? '' : 'hides'}>
            <LoanProInfo />
          </div>
        </div>
      </div>
    );
  }
}

