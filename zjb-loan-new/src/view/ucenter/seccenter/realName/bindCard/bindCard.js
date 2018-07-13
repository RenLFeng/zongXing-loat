import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Icon, Input, Button, message, Row, Col, Form, Select, Checkbox } from 'antd';

import '../realName.scss';
import { securityCentreService } from '../../../../../services/api';
import moneyBank from '../../../../../common/moneyBank';
import moneyCity from '../../../../../common/moneyCity';
import Path from '../../../../../common/PagePath';
/** 银行卡的正则表达式 */
import {BANK_CARD} from '../../../../../common/SystemParam';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 8 },
    sm: { span: 8 },
  },
};
const btnLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

@connect((state) => ({
  safeData: state.safeCenter.safeData,
  safeDataLoading: state.safeCenter.safeDataLoading,
  accountId: state.login.baseData.accountId,
}))
class BindCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      realname: '',
      idcard: '',
      bankCardNo: '', // 银行卡号
      userBaseInfo: {}, // 当前登录用户的信息
      cardType:'借记卡',
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'account/getPersonalAccount',
      payload:{
        showNumInfo:4,
      }
    });
    this.queryUserBaseInfo();
    this.sort();
  }
  // 查询当前登录的用户
  queryUserBaseInfo = async () => {
    let response = await securityCentreService.getUserBaseData();
    console.log("this.state.userBaseInfo",response);
    if (response.code === 0) {
      this.setState({ userBaseInfo: response.data });
    } else {
      response.msg && message.error(response.msg);
    }
  }


  updateRealName = (e) => {
    console.log('updateRealName', e.target.value);
    this.setState({ realName: e.target.value });
  };
  updateIdcard = (e) => {
    console.log('updateIdcard', e.target.value);
    this.setState({ idcard: e.target.value });
  };

  verifyBankCard = () => {
    console.log("verifyBankCard,bankcard:",this.state.bankCardNo);
  }
  updateBankCard = (e) => {
    this.setState({ bankCardNo: e.target.value });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log("submit.value:",values);
      if (!err) {

      }

      this.props.history.push(Path.REALNAME_AUTHENTICATION);
    });
  };

  // 银行卡号校验
  checkBank = async () => {
    this.setState({editing: false});
    if (this.state.checkLoading) {
      return;
    }
    const {bankCard} = this.state;
    if (!bankCard || (bankCard && bankCard.trim().length === 0)) {
      this.setState({
        bankCardImg: '',
        bankCardErr: ''
      });
      return; 
    }
    if (!BANK_CARD.test(bankCard.trim())) {
      this.setState({
        bankCardImg: 'error',
        bankCardErr: '银行卡格式不正确'
      });
      return;
    }else{
      //正确
      let param = {
        realname:this.state.userBaseInfo.freal_name,
        idcard: this.state.userBaseInfo.fidcard_No,
        cardType: '借记卡'
      }
      this.setState({
        ... param,
        bankCardImg: 'success',
        bankCardErr: ''
      });
      return;
    }
    // if (global[bankCard.trim()]) {
    //   this.setState({
    //     ...global[bankCard.trim()]
    //   });
    //   this.chooseCity(global[bankCard.trim()].provinceId);
    //   return;
    // }
    // this.setState({checkLoading: true})
    // const response = await verifyBankCard(bankCard.trim());
    // this.setState({checkLoading: false})
    // if (response.code === 0 && response.data.verifyBankcard3Dto.res === 1) {
    //   //匹配
    //   const jhBankcardcoreDto = response.data.jhBankcardcoreDto;
    //   let result = {
    //     bankCardImg: 'success',
    //     bankCardErr: '',
    //     showBankName: jhBankcardcoreDto.bankname, // 银行名
    //     cardType: jhBankcardcoreDto.cardtype, // 卡类型
    //     tipCityName: `${jhBankcardcoreDto.province?jhBankcardcoreDto.province:''} ${jhBankcardcoreDto.city?jhBankcardcoreDto.city:''}`, // 省市
    //     provinceId: this.judgeProvince(jhBankcardcoreDto.province), //省val
    //     cityId: this.judgeCity(jhBankcardcoreDto.city), // 市val
    //     openName: this.judgeOpenBank(jhBankcardcoreDto.bankname),// 开户银行
    //     fbankType: jhBankcardcoreDto.bankTypeId,
    //     idcard: response.data.verifyBankcard3Dto.idcard, // 身份证
    //     realname: response.data.verifyBankcard3Dto.realname
    //   }
    //   console.log(result.tipCityName);
    //   console.log('result.provinceId', result.provinceId);
    //   this.chooseCity(result.provinceId);
    //   this.setState({
    //     ...result
    //   });
    //   global[bankCard.trim()] = { ...result};
      
    // } else {
    //   let result = {
    //     bankCardImg: 'error',
    //     bankCardErr: response.data.res ? "认证信息不匹配" : response.msg,
    //     showBankName: '', // 银行名
    //     cardType: '', // 卡类型
    //     tipCityName: '', // 省市
    //     provinceId: '', //省val
    //     cityId: '', // 市val
    //     openName: ''// 开户银行
    //   }
    //   this.setState({
    //     ...result
    //   });
    //   if (response.msg !== '系统异常!') {
    //     global[bankCard.trim()] = { ...result };
    //   }
    // }
  }

  // 判断开户银行
  judgeOpenBank(param) {
    if (!param) {
      return '';
    }
    for (let data of moneyBank) {

      if (data.fname === param) {
        return data.fcode;
      }
    }
    return '';
  }

  // 判断省
  judgeProvince(param) {
    if (!param) {
      return '';
    }
    for (let data of moneyCity.provincerList) {
      if (data.fname === param) {
        return data.fcode;
      }
    }
    return '';
  }
  // 判断市
  judgeCity(param) {
    if (!param) {
      return '';
    }

    for (let data of moneyCity.cityList) {
      if (data.fname === param) {
        if(this.state.provinceId){
          return data.fcode;
        }
      }
    }
    return '';
  }
  // 选择省市
  chooseCity(val) {
    console.log('val', val);
    let cityArr = [];
    for (let data of moneyCity.cityList) {
      if (data.fparentCode == val) {
        cityArr.push(data);
      }
    }
    this.setState({
      provinceId: val,
      cityArr,
      cityId: cityArr.length > 0 ? cityArr[0].fcode : ''
    });
  }

  // 绑定银行卡接口
  bindBank = async () => {
    if (this.state.commmitLoading) {
      return;
    }
    this.setState({commmitLoading: true});
    let param = {
      fbankCode: this.state.openName,
      fcityCode: this.state.cityId,
      fprovinceCode: this.state.provinceId,
      fbankType: this.state.fbankType, // 银行类型id
      faccountId: this.props.accountId,
      idcard: this.state.idcard,
      realname: this.state.realname,
      fbankcard: this.state.bankCard.trim(),
      fcardType: this.state.cardType
    }
    console.log("submit param",param);
    const response = await securityCentreService.bindBankCard(param);
    
    this.setState({commmitLoading: false});
    if (response.code === 0) {
      this.props.history.push('/index/uCenter/realName');
    } else {
      response.msg && message.error(response.msg);
    }
  }

  /** 按名称给银行排序 */
  sort(){
    console.log('开户行',moneyBank)
    let array = moneyBank;
    let resultArray = array.sort(
     function compareFunction(param1, param2) {
      return param1.fname.localeCompare(param2.fname,"zh");
     }
    );
    console.log('resultArray',resultArray);
  }
 

  render() {
    console.log("this.props.accountId:",this.props.accountId);
    const { userName } = this.state;
    const suffix = userName ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="pages" style={{padding: '30px', width: '100%'}}>
        <div className="real_title_">
          <span className="safeCenter_" onClick={()=>this.props.history.push('/index/uCenter/realName')}>实名认证</span>
          <span style={{fontSize: 16}}>&gt; 我的银行卡 &gt; 绑定新银行卡</span>
        </div>
        <div className="forms">
          <div className="bind_item_view">
            <span className="name">持卡人姓名</span> 
            <span>{this.state.userBaseInfo.freal_name}</span> 
          </div>
          {/* <i title="绑定手机号" className="zjb zjb-zhengque" style={{color:'green', fontSize: 24}}></i> */}
          <div className="bind_item_view">
            <span>银行卡号</span>
            <Input onFocus={()=>this.setState({editing: true})} size="large" placeholder="请输入银行卡" onChange={(e)=>this.setState({ bankCard: e.target.value.trim() })} onBlur={this.checkBank}/>
            {this.state.bankCardImg==='success'?
             <i className="zjb zjb-zhengque" style={{color:'green', fontSize: 24}}></i> : null
            }
             {this.state.bankCardImg==='error'?
             <i className="zjb zjb-iconfontcuowu" style={{color:'red', fontSize: 20}}></i> : null
            }
          </div>
          <span className="bind_error_msg">{this.state.bankCardErr?this.state.bankCardErr: ''}</span>
          <div className="bind_item_view">
            <span>开户银行</span>
            <Select size="large" value={this.state.openName} placeholder="请选择开户行" onChange={(val)=>this.setState({openName: val})}  showSearch optionFilterProp="children" filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {moneyBank.map((data,index)=>{
                return <Option value={data.fcode} key={data.fcode}>{data.fname}</Option>
              })}
            </Select>
          </div>
          <span className="bind_tip_msg">{this.state.showBankName?this.state.showBankName:''}</span>
          <div className="bind_item_view">
            <span>开户省市</span>
            <Select size="large" placeholder="请选择省份" notFoundContent="暂无数据" value={this.state.provinceId} style={{width: 130,height: 42}} onChange={(val)=>this.chooseCity(val)}>
              {moneyCity.provincerList.map((data,index)=>{
                return <Select.Option value={data.fcode} key={data.fcode}>{data.fname}</Select.Option>
              })}
            </Select>
            <Select size="large" placeholder="请选择城市" notFoundContent="暂无数据" value={this.state.cityId} style={{width: 130,height: 42}} onChange={(val)=>this.setState({cityId: val})}>
              {this.state.cityArr?this.state.cityArr.map((data,index)=>{
                return <Select.Option value={data.fcode} key={data.fcode}>{data.fname}</Select.Option>
              }): null}
            </Select>
          </div>
          <span className="bind_tip_msg">{this.state.tipCityName===' undefined' || this.state.tipCityName==='undefined ' ?'':this.state.tipCityName}</span>
          <div className="bind_item_view">
            <span>卡类型</span>
            <Input size="large" value={this.state.cardType} readOnly/>
          </div>
          <span className="bind_error_msg">{this.state.cardType==='信用卡'?'不支持信用卡':null}</span>
          <div className="bind_item_view">
            <span/>
            <div className="bind_password" style={{paddingLeft: 10}}>
              <i className="zjb zjb-mima2" />
              <input className="zjb-mima2-input" type={this.state.showPwd?'text':'password'} placeholder="请输入登录密码" onChange={(e)=>this.setState({userPassword: e.target.value.trim()})}/>
              <i className="zjb zjb-htmal5icon08" onClick={()=>this.setState({showPwd: !this.state.showPwd })} style={{borderRightWidth: 0, fontSize: 22, cursor: 'pointer' }}/>
            </div>
          </div>
          <div className="bind_item_view">
            <span/>
            <div className="bind_desc">
              <input type="checkbox" onChange={(e) => this.setState({checkboxStatus: !this.state.checkboxStatus})}/>
              <span>同意《<a>用户协议</a>》</span>
            </div>
          </div>
          <div className="bind_item_view">
            <span/>
            <Button 
              disabled={
                this.state.checkLoading||this.state.editing||!this.state.checkboxStatus||
                !this.state.bankCard|| !this.state.openName || !this.state.provinceId || !this.state.cityId
                || !this.state.userPassword || this.state.cardType==='信用卡' || !this.state.bankCardImg ||
                this.state.bankCardImg === 'error'
              } 
              className="bind_btn" loading={this.state.commmitLoading} type="primary" onClick={this.bindBank}>绑定</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(BindCard);
