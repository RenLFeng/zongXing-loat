import React from 'react';
import { connect } from 'dva';
import LoanInfo from './appaly/loanInfo'
import LoanUserInfo from './appaly/loanUserInfo'
import LoanCompanyInfo from './appaly/loanCompanyInfo'
import LoanProInfo from './appaly/loanProInfo'
import './appalyloan.scss'
import { baseService } from '../../../../services/api';
import {message, Alert, Modal } from 'antd';
import moment from 'moment';

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
      dataList: [
        {
          fid: 1,
          ftitle: '我的自述',
          fcontent: '',
          fpictures: '',
          ftype: 1
        },
        {
          fid: 2,
          ftitle: '我的项目',
          fcontent: '',
          fpictures: '',
          ftype: 1
        },
        {
          fid: 3,
          ftitle: '为何众借',
          fcontent: '',
          fpictures: '',
          ftype: 1
        },
        {
          fid: 4,
          ftitle: '还款计划',
          fcontent: '',
          fpictures: '',
          ftype: 1
        }
      ],
      activeCode: 1,
      oldData: {
        hasUnfinishProject: true
      },
      cityList: []
    };
  }
  
  handlerClcikLable(item) {
    let val = null; // 从子组件拿到的数据
    let code = this.state.activeCode;
    if (code == 1) {
      console.log(this.loanInfo);
      val = this.loanInfo.getChildData();
    } else if (code == 2) {
      val = this.userInfo.getChildData();
    } else if (code == 3) {
      val = this.companyInfo.getChildData();
    } else if (code == 4) {
      val = this.proInfo.getChildData();
    }
    console.log(val);
    if (val==null) {
      message.error('请检查填写内容')
      return;
    }
    console.log('下层组件传来的值', val);
    this.setState({
      activeCode: item,
      oldData: {
        ...this.state.oldData,
        ...val
      }
    });
  }

  componentDidMount() {
    this.getBefore();
    this.getCityList();
  }
  // 获取数据
  async getBefore() {
    const response = await baseService.getLoanInfo();
    console.log('获取上一次数据',response);
    if (response.code === 0) {
      const data = response.data;
      if (data.projectId) {
        const res = await baseService.getConfirmResult(data.projectId);
        if (res.data && res.code === 0) {
          this.setState({ message: res.data.fremark, ispass: res.data.ispass})
        }
      }
      if (data.hasFinishProject) {
        this.setState({
          visible: true,
          companyNo: data.fcompany_no,
          oldData: {
            ...data,
            hasUnfinishProject: false
          }
        });
        return;
      }
      this.setState({
        companyNo: data.fcompany_no,
        oldData: data,
        tableData: [{
          key: '1',
          type: '第一联系人',
          fName: data.tlo1Name ? data.tlo1Name : '',
          fIdcardNo: data.tlo1Idcard ? data.tlo1Idcard : '',
          fPhone: data.tlo1phone ? data.tlo1phone : '',
          fRelation: data.tlo1relation ? data.tlo1relation : '亲人',
        }, {
          key: '2',
          type: '商业伙伴',
          fName: data.tlo2Name ? data.tlo2Name : '',
          fIdcardNo: data.tlo2Idcard ? data.tlo2Idcard : '',
          fPhone: data.tlo2phone ? data.tlo2phone : '',
          fRelation: data.tlo2relation ? data.tlo2relation : '',
        }, {
          key: '3',
          type: '朋友',
          fName: data.tlo3Name ? data.tlo3Name : '',
          fIdcardNo: data.tlo3Idcard ? data.tlo3Idcard : '',
          fPhone: data.tlo3phone ? data.tlo3phone : '',
          fRelation: data.tlo3relation ? data.tlo3relation : '',
        }],
        dataList: data.projectModules ? data.projectModules.length > 0 ? data.projectModules
          : [
            {
              fid: 1,
              ftitle: '我的自述',
              fcontent: '',
              fpictures: '',
              ftype: 1
            },
            {
              fid: 2,
              ftitle: '我的项目',
              fcontent: '',
              fpictures: '',
              ftype: 1
            },
            {
              fid: 3,
              ftitle: '为何众借',
              fcontent: '',
              fpictures: '',
              ftype: 1
            },
            {
              fid: 4,
              ftitle: '还款计划',
              fcontent: '',
              fpictures: '',
              ftype: 1
            }
          ]
          : [
            {
              fid: 1,
              ftitle: '我的自述',
              fcontent: '',
              fpictures: '',
              ftype: 1
            },
            {
              fid: 2,
              ftitle: '我的项目',
              fcontent: '',
              fpictures: '',
              ftype: 1
            },
            {
              fid: 3,
              ftitle: '为何众借',
              fcontent: '',
              fpictures: '',
              ftype: 1
            },
            {
              fid: 4,
              ftitle: '还款计划',
              fcontent: '',
              fpictures: '',
              ftype: 1
            }
          ]
      })
    } else if (response.code === -2) {
      this.setState({
        dueError: true,
        dueDate: response.data.dueTime
      });
    } else {
      response.msg && message.error(response.msg);
    }
  }


  // 获取上次完成数据
  async getBeforeData() {
    if (this.state.loadingBefore) {
      return;
    }
    this.setState({loadingBefore: true});
    const response = await baseService.getBeforeProjectData();
    this.setState({loadingBefore: false, visible: false});
    console.log(response);
    const data = response.data;
    if (response.code === 0) {
      console.log('-------------', data.projectId);
      // 如果是回显之前项目的信息，需要获取驳回信息判断是否显示
      if (data.projectId) {
        const res = await baseService.getConfirmResult(data.projectId);
        console.log(res);
        if (res.code === 0) {
          this.setState({ message: res.data.fremark})
        }
      }
      this.setState({
        companyNo: data.fcompany_no,
        oldData: data,
        tableData: [{
          key: '1',
          type: '第一联系人',
          fName: data.tlo1Name ? data.tlo1Name : '',
          fIdcardNo: data.tlo1Idcard ? data.tlo1Idcard : '',
          fPhone: data.tlo1phone ? data.tlo1phone : '',
          fRelation: data.tlo1relation ? data.tlo1relation : '亲人',
        }, {
          key: '2',
          type: '商业伙伴',
          fName: data.tlo2Name ? data.tlo2Name : '',
          fIdcardNo: data.tlo2Idcard ? data.tlo2Idcard : '',
          fPhone: data.tlo2phone ? data.tlo2phone : '',
          fRelation: data.tlo2relation ? data.tlo2relation : '',
        }, {
          key: '3',
          type: '朋友',
          fName: data.tlo3Name ? data.tlo3Name : '',
          fIdcardNo: data.tlo3Idcard ? data.tlo3Idcard : '',
          fPhone: data.tlo3phone ? data.tlo3phone : '',
          fRelation: data.tlo3relation ? data.tlo3relation : '',
        }],
        dataList: data.projectModules ? data.projectModules.length > 0 ? data.projectModules
          : [
            {
              fid: 1,
              ftitle: '我的自述',
              fcontent: '',
              fpictures: '',
              ftype: 1
            },
            {
              fid: 2,
              ftitle: '我的项目',
              fcontent: '',
              fpictures: '',
              ftype: 1
            },
            {
              fid: 3,
              ftitle: '为何众借',
              fcontent: '',
              fpictures: '',
              ftype: 1
            },
            {
              fid: 4,
              ftitle: '还款计划',
              fcontent: '',
              fpictures: '',
              ftype: 1
            }
          ]
          : [
            {
              fid: 1,
              ftitle: '我的自述',
              fcontent: '',
              fpictures: '',
              ftype: 1
            },
            {
              fid: 2,
              ftitle: '我的项目',
              fcontent: '',
              fpictures: '',
              ftype: 1
            },
            {
              fid: 3,
              ftitle: '为何众借',
              fcontent: '',
              fpictures: '',
              ftype: 1
            },
            {
              fid: 4,
              ftitle: '还款计划',
              fcontent: '',
              fpictures: '',
              ftype: 1
            }
          ]
      });
    } else {
      response.msg && message.error(response.msg);
    }
  } 

  async getCityList() {
    const response = await baseService.getProCityList();
    if (response.code === 0) {
      this.setState({
        cityList: response.data
      });
    }
  }
  // 切换表单 上层组件保存数据
  changeOldData = (val, type) => {
    this.setState({
      oldData: {
        ...this.state.oldData,
        ...val
      }
    },() => {
        if (type === 'SAVE') {
          this.saveData();
        } else if (type === 'COMMIT') {
          this.commitData();
        }
    });
  };

  packageData() {
    const oldData = this.state.oldData;
    console.log(oldData);
    let arr = [
      {
        fid: null,
        ftitle: '我的自述',
        fcontent: '',
        fpictures: '',
        ftype: 1,
        fsort: 0,
      },
      {
        fid: null,
        ftitle: '我的项目',
        fcontent: '',
        fpictures: '',
        ftype: 1,
        fsort: 1,
      },
      {
        fid: null,
        ftitle: '为何众借',
        fcontent: '',
        fpictures: '',
        ftype: 1,
        fsort: 2,
      },
      {
        fid: null,
        ftitle: '还款计划',
        fcontent: '',
        fpictures: '',
        ftype: 1,
        fsort: 3,
      }
    ];
    if (oldData.projectModules && oldData.projectModules.length > 0)  {
      arr = oldData.projectModules
    }
    let obj = {
      "同事":1,
      "母亲":2,
      "父亲":3,
      "其他亲属":4,
      "朋友":5,
      "配偶":6,
      "其他":7,
      "子女":8,
      "上下游供应商":9,
      "合伙人":10,
    };
    console.log('oldData', oldData);
    const newData = {
      companyInfo: {
        fname: oldData.companyName,
        fbankName: oldData.fcbank_name,
        fbankNo: oldData.fcbank_no,
        fbusAddress: oldData.fbus_address,
        fbusTrade: oldData.fbus_trade,
        ftelephone: oldData.fctelephone,
        ftopshFile: oldData.ftopsh_file,
        fbusLicense: oldData.fbus_license,
        fbankPermit: oldData.fbank_permit,
        fotherFile1: oldData.fother_file1,
        fauditFile: oldData.faudit_file,
        fstatementFile: oldData.fstatement_file,
        fjoinFile: oldData.fjoin_file,
        fplaceLease: oldData.fplace_lease,
        fcompanyGovern: oldData.fcompany_govern,
        femployeeRecord: oldData.femployee_record,
        fratepayingRecord: oldData.fratepaying_record,
        flivingPayment: oldData.fliving_payment,
      },
      lender: {
        fname: oldData.lenderName,
        fidcardNo: oldData.fidcard_no,
        fmobile: oldData.fmobile,
        ftelephone: oldData.ftelephone,
        fmarriage: oldData.fmarriage,
        fqq: oldData.fqq,
        feducation: oldData.feducation,
        fweichat: oldData.fweichat,
        fbankNo: oldData.fbank_no,
        fbankName: oldData.fbank_name,
        fcompanyEmail: oldData.fcompany_email,
        faddress: oldData.faddress,
        fidcardPic1: oldData.fidcard_pic1,
        fidcardPic2: oldData.fidcard_pic2,
        fidcardPic3: oldData.fidcard_pic3,
        fcarPic: oldData.fcar_pic,
        fhousePic1: oldData.fhouse_pic1,
        fotherPicJson: oldData.fother_pic_json,
        fcreditReport: oldData.fcredit_report,
        fdealLog: oldData.fdeal_log
      },
      project: {
        fid: this.state.projectId?this.state.projectId: oldData.projectId,
        fname: oldData.projectName,
        fcreditMoney: oldData.fcredit_money,
        fbusType: oldData.fbus_trade,
        fcreditUse: oldData.fcredit_use,
        fcreditMonth: oldData.fcredit_month,
        fratePredict: oldData.frate_predict,
        fchannel: oldData.fchannel,
        fcityCode: oldData.fcity_code
      },
      projectInfo: {
        fcardPicPath: oldData.fcard_pic_path? oldData.fcard_pic_path : '',
        fbannerPicPath: oldData.fbanner_pic_path? oldData.fbanner_pic_path : '',
        fvideoPath: oldData.fvideo_path? oldData.fvideo_path: '',
        flocation: oldData.flocation?oldData.flocation: '',
      },
      lenderOtherContactList: [
        {
          ftype: 1,
          fname: oldData.tlo1Name,
          fidcardNo: oldData.tlo1Idcard,
          fphone: oldData.tlo1phone,
          frelation: oldData.tlo1relation
        },
        {
          ftype: 2,
          fname: oldData.tlo2Name,
          fidcardNo: oldData.tlo2Idcard,
          fphone: oldData.tlo2phone,
          frelation: oldData.tlo2relation
        },
        {
          ftype: 3,
          fname: oldData.tlo3Name,
          fidcardNo: oldData.tlo3Idcard,
          fphone: oldData.tlo3phone,
          frelation: oldData.tlo3relation
        },
      ],
      projectModules: arr
    };
    return newData;
  }

  async saveData() {
    if (this.state.loading) {
      return;
    }
    this.setState({loading: true});
    const data = this.packageData();
    const response = await baseService.saveLoanInfo(data);
    console.log(response);
    this.setState({loading: false});
    if (response.code === 0) {
      this.setState({
        projectId: response.data.project.fid,
        oldData: {
          ...this.state.oldData,
          projectModules: response.data.projectModules
        },
        dataList:  response.data.projectModules
      }, ()=>console.log(this.state.oldData));
      message.info(response.msg);
    } else {
      response.msg && message.error(response.msg);
    }
  }

  async commitData() {
    if (this.state.loading) {
      return;
    }
    const data = this.packageData();
    if (!data.project.fcreditMoney) {
      message.error('借款项目中借款金额不能为空');
      return;
    }
    if (!data.project.fcreditMonth) {
      message.error('借款项目中借款期数不能为空');
      return;
    }
    if (!data.project.fcreditUse || (data.project.fcreditUse && data.project.fcreditUse.trim().length === 0)) {
      message.error('借款项目中借款用途不能为空');
      return;
    }
    if (!data.project.fcityCode) {
      message.error('借款项目中所在城市不能为空');
      return;
    }
    if (!data.lender.fname || (data.lender.fname && data.lender.fname.trim().length === 0)) {
      message.error('借款人资料中姓名不能为空');
      return;
    }
    if (!data.lender.fidcardNo || (data.lender.fidcardNo && data.lender.fidcardNo.trim().length === 0)) {
      message.error('借款人资料中身份证号不能为空');
      return;
    }
    if (!data.lender.fmobile || (data.lender.fmobile && data.lender.fmobile.trim().length === 0)) {
      message.error('借款人资料中手机不能为空');
      return;
    }
    if (!data.project.fname || (data.project.fname && data.project.fname.trim().length === 0)) {
      message.error('借款项目资料中项目名称不能为空');
      return;
    }
    if (!data.lenderOtherContactList[0].fname || (data.lenderOtherContactList[0].fname && data.lenderOtherContactList[0].fname.trim().length === 0)
      || !data.lenderOtherContactList[0].fidcardNo || (data.lenderOtherContactList[0].fidcardNo && data.lenderOtherContactList[0].fidcardNo.trim().length === 0)
      || !data.lenderOtherContactList[0].fphone || (data.lenderOtherContactList[0].fphone && data.lenderOtherContactList[0].fphone.trim().length === 0)
      || !data.lenderOtherContactList[0].frelation) {
      message.error('借款人资料中第一联系人内容不能为空');
      return;
    }
    if (!data.companyInfo.fname || (data.companyInfo.fname && data.companyInfo.fname.trim().length === 0)) {
      message.error('借款企业中企业名称不能为空');
      return;
    }
    if (!data.companyInfo.fbankName || (data.companyInfo.fbankName && data.companyInfo.fbankName.trim().length === 0)) {
      message.error('借款企业中企业开户行不能为空');
      return;
    }
    if (!data.companyInfo.fbankNo || (data.companyInfo.fbankNo && data.companyInfo.fbankNo.trim().length === 0)) {
      message.error('借款企业中企业银行账户不能为空');
      return;
    }
    if (!data.companyInfo.fbusAddress || (data.companyInfo.fbusAddress && data.companyInfo.fbusAddress.trim().length === 0)) {
      message.error('借款企业中实际经营地址不能为空');
      return;
    }
    if (!data.lender.fqq || (data.lender.fqq && data.lender.fqq.trim().length === 0)){
      message.error('借款人信息中QQ号不能为空');
      return;
    }
    if (!data.lender.fweichat || (data.lender.fweichat && data.lender.fweichat.trim().length === 0)){
      message.error('借款人信息中微信号不能为空');
      return;
    }
    if (!data.projectInfo.fcardPicPath || data.projectInfo.fcardPicPath.length === 0) {
      message.error('借款项目信息中借款项目展示封面图不能为空');
      return;
    }
    if (!data.projectInfo.fbannerPicPath || data.projectInfo.fbannerPicPath.length === 0) {
      message.error('借款项目信息中经营场所实景图不能为空');
      return;
    }
    if (!data.projectInfo.fvideoPath || (data.projectInfo.fvideoPath && JSON.parse(data.projectInfo.fvideoPath).length === 0)) {
      message.error('借款项目信息中借款视频不能为空');
      return;
    }
    this.setState({loading: true});
    const response = await baseService.commitInfo(data);
    console.log(response);
    this.setState({loading: false});
    if (response.code === 0) {
      message.info(response.msg);
      this.props.history.push('/index/uCenter/personAccount');
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
          {!this.state.ispass ? this.state.message ?
            <Alert message={`该项目被驳回，驳回原因为: ${this.state.message}`} type="warning" showIcon  style={{marginBottom: 10}}/> : null : null
          }
          {this.state.oldData.hasUnfinishProject?
           <Alert message={`您有未完成的借款项目`} type="warning" showIcon  style={{marginBottom: 10}}/> : null}
          {
            this.state.dueError?
            <Alert message={`您上一个项目被终止，${moment(new Date(this.state.dueDate)).format('YYYY年MM月DD日')}才可再次借款`} type="warning" showIcon  style={{marginBottom: 10}}/>:
            <React.Fragment>
              <div className={this.state.activeCode === 1 ? '' : 'hides'}>
                <LoanInfo loading={this.state.loading} hasUnfinishProject={this.state.oldData.hasUnfinishProject} wrappedComponentRef={form => this.loanInfo = form} cityList={this.state.cityList} data={this.state.oldData} changeOldData={this.changeOldData} companyNo={this.state.companyNo}/>
              </div>
              <div className={this.state.activeCode === 2 ? '' : 'hides'}>
                <LoanUserInfo loading={this.state.loading} hasUnfinishProject={this.state.oldData.hasUnfinishProject} wrappedComponentRef={form => this.userInfo = form} data={this.state.oldData} changeOldData={this.changeOldData} companyNo={this.state.companyNo}/>
              </div>
              <div className={this.state.activeCode === 3 ? '' : 'hides'}>
                <LoanCompanyInfo loading={this.state.loading} hasUnfinishProject={this.state.oldData.hasUnfinishProject} wrappedComponentRef={form => this.companyInfo = form} data={this.state.oldData} changeOldData={this.changeOldData} companyNo={this.state.companyNo}/>
              </div>
              <div className={this.state.activeCode === 4 ? '' : 'hides'}>
                <LoanProInfo loading={this.state.loading} hasUnfinishProject={this.state.oldData.hasUnfinishProject} wrappedComponentRef={form => this.proInfo = form} data={this.state.oldData} changeOldData={this.changeOldData} dataList={this.state.dataList} companyNo={this.state.companyNo}/>
              </div>
            </React.Fragment>}
          <Modal
            title="提示"
            visible={this.state.visible}
            onOk={()=>this.getBeforeData()}
            onCancel={()=>this.setState({visible: false})}
            okText="启用"
            maskClosable={false}
            confirmLoading={this.state.loadingBefore}
            cancelText="取消"
          >
            <p>是否启用上次完成项目的借款人信息和借款企业信息?</p>
          </Modal>
        </div>
      </div>
    );
  }
}

