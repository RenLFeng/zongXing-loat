
import React from 'react';
import { Link } from 'dva/router';
import { Form, Input, Button, Select, Radio, DatePicker, Cascader, Spin,Checkbox,Row, Col,Upload, Icon, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import {USER_REG, VER_PHONE, TEL_PHONE, ID_CORD, NAME_REG_, QQ_REG, WeChat_REG, ZHUZHI_REG, HOBBY_REG, IMG_BASE_URL} from '../../common/systemParam';
import {city} from '../../common/cityData';
import {REALNAME_AUTHENTICATION} from '../../common/pagePath';
import UploadSingle from '../../components/Account/ImgUpload';
import { getJudgeUserName,getUserBaseData,saveUserBase } from '../../services/api';
import LeftMenu from '../../components/UCenterComponent/leftMenu';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
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

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Apple', 'Pear', 'Oranteteteteetg','gfgddhd','tfgfddfg'];
class UserBaseFormInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      fid:null,
      userBase: {

      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.data = {
      className: "ant-upload",
      type: "images/",
      divClassName: "upload-div",
      baseUrl: IMG_BASE_URL
    };
  }

  componentDidMount() {
    this.getUserBase();
    
  }

  componentWillReceiveProps(nextProps) {
    //if (this.props.param.successStatus && !nextProps.param.successStatus) {
    //  this.props.param.dispatch({
    //    type: 'userData/getUserBase'
    //  });
    //}
  }


  // 获取个人基础资料
  async getUserBase() {
    const response = await getUserBaseData();
    console.log(response);
    if(response.code===0){
      if(response.data){
        let base = response.data;
        this.setState({
          fid:base.fid,
          userBase: {
            ...base,
            // fhobby: base.fhobby?JSON.parse(base.fhobby):[]
          }
        });
      }
    } else {
      response.msg && message.error(response.msg)
    }
  }
  async judgeUserName(e) {
    
    const response = await getJudgeUserName(e.target.value.trim());
    if (response.code === 0 ) {
      this.setState({error: false});
    } else {
      this.setState({error: true});
    }
  }
  handleSubmit(e) {
  
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async(err, values) => {
      if (!err) {
        // 数据格式转换 cityCode
        console.log(values)
        let fCityCode = '';
        if (values.fCityCode && values.fCityCode.length > 0) {
          fCityCode = values.fCityCode[values.fCityCode.length - 1];
        }
        // 获得后台需要的数据
        const userBase = {
          user:{
            fid:this.state.fid,
            fheadPic:values.fhead_pic?values.fhead_pic:''
          },
          userInfo: {
            fMarital: values.fMarital * 1,
            fDeucation: values.fDeucation,
            fQQ: values.fQQ,
            fWeichat: values.fweichat,
            fAddress: values.fAddress,
            fGender: values.fGender,
            fCityCode,
            fJob: values.fJob,
            fHobby: values.fHobby.join(',')
          }
        };
        const response = await saveUserBase(userBase);
        if (response.code === 0) { 
          this.props.param.history.push('/index/uCenter/realName');
        } else {
          response.msg && message.error(response.msg);
        }

        console.log(response);

        //this.props.param.dispatch({
        //  type: 'userData/commitUserBase',
        //  payload: userBase
        //});
      }
    });
  }
  filter = (inputValue, path) => {
    return (path.some(city => (city.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
  };
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { userBase } = this.state;
    return (
        <Form onSubmit={this.handleSubmit} className="user_form">
          <FormItem
            {...formItemLayout}
            label="头像" className="upload_box"
            >
            {getFieldDecorator('fhead_pic', {
              initialValue: userBase.fhead_pic?userBase.fhead_pic:null
            })(<UploadSingle {...this.data} prefix={'personal/'} tipText="点击上传"/>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="性别" className="upload_text"
            >
            {getFieldDecorator('fGender', {
              initialValue: userBase.fgender?userBase.fgender: '1'
            })(<Radio.Group >
              <Radio value='1' >男</Radio>
              <Radio value='2'>女</Radio>
            </Radio.Group>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="婚否" className="upload_text"
            >
            {getFieldDecorator('fMarital', {
              initialValue: userBase.fmarital?userBase.fmarital+'':'1'
            })(<Radio.Group >
              <Radio value='1'>未婚</Radio>
              <Radio value='2'>已婚</Radio>
            </Radio.Group>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="学历" className="upload_text"
            >
            {getFieldDecorator('fDeucation', {
              initialValue: userBase.fdeucation?userBase.fdeucation:'',
            })(<Radio.Group >
              <Radio value='本科'>本科</Radio>
              <Radio value='硕士'>硕士</Radio>
              <Radio value='博士'>博士</Radio>
              <Radio value='大专及以下'>大专及以下</Radio>
            </Radio.Group>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="微信号" className="upload_text"
            >
            {getFieldDecorator('fweichat', {
              rules:[{pattern: WeChat_REG, message:'请输入正确的微信号'}],
              initialValue: userBase.fweichat ? userBase.fweichat : null
            })(<Input maxLength={'50'} placeholder={'请输入微信号'}/>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="QQ号" className="upload_text"
            >
            {getFieldDecorator('fQQ', {
              rules:[
                //{ required: true, message: '请输入您QQ号' },
                {pattern: QQ_REG, message: '请输入正确的QQ号'}
              ],
              initialValue: userBase.fqq?userBase.fqq: null
            })(<Input maxLength={'50'} placeholder={'请输入QQ号'}/>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="工作" className="upload_text"
            >
            {getFieldDecorator('fJob', {
              rules:[{pattern: HOBBY_REG, message: '请输入正确的内容'}],
              initialValue: userBase.fjob?userBase.fjob: null,
            })(<Input maxLength={'50'} placeholder={'输入工作职位'}/>)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="所在城市" className="upload_text"
            >
            {getFieldDecorator('fCityCode', {
              initialValue: userBase.fcity_code ? userBase.fcity_code[0]==='0'&& userBase.fcity_code[1]===','?userBase.fcity_code.substring(2, userBase.fcity_code.length).split(','):userBase.fcity_code.split(','): null,
            })(
              <Cascader options={city} placeholder={'请选择'} showSearch={this.filter} notFoundContent={'无匹配项'}/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="家庭住址" className="upload_text"
            >
            {getFieldDecorator('fAddress', {
              rules:[{pattern: ZHUZHI_REG, message:'请输入正确的家庭住址信息' }],
              initialValue: userBase.faddress? userBase.faddress: null
            })(<Input.TextArea autosize={{ minRows: 5, maxRows: 8 }} maxLength={200}/>)}
          </FormItem>
        <FormItem
          {...formItemLayout}
          label="兴趣爱好" className="upload_text"
        >
          {getFieldDecorator('fHobby', {
            initialValue: userBase.fhobby?userBase.fhobby.split(',') : [],
          })(
            <HobbyList hobbyList={this.props.hobbyList}/>
          )}
        </FormItem>

        <FormItem {...btnLayout} className="ant_submit">
          <Button
            style={{width: '230px', marginLeft: -100,fontSize: 16}}
            type="primary" htmlType="submit" loading={this.props.param.loading}>提交</Button>
        </FormItem>
      </Form>
    );
  }
}

const UserBaseForm = Form.create()(UserBaseFormInput);

@connect((state) => ({
  loading: state.userData.userBaseLoading,
  userBase: state.userData.userBaseData,
  successStatus: state.userData.changeDataStatus,
  hobbyList: state.login.hobbyList
}))

export default class UserBasic extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.hobbyList.length === 0) {
      this.props.history.push('/index/uCenter/realName');
    }
  }

  render() {
    return (
      <div>
        <div className="fr uc-rbody user-form-box" style={{width:"100%",float:"none"}}>
          <Spin spinning={this.props.loading} tip="请稍后" size="large">
            <div className="real_title_" style={{marginBottom: '46px'}}>
              <span className="safeCenter_" onClick={()=>this.props.history.push('/index/uCenter/realName')}>实名认证</span>
              <span style={{fontSize: 16}}> &gt; 基础资料</span>
            </div>
            <UserBaseForm param={this.props} hobbyList={this.props.hobbyList}/>
          </Spin>
        </div>
      </div>
    );
  }
}

class HobbyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hobbyList: props.hobbyList
    }
  }

  componentDidMount() {
    for (let obj of this.props.value) {
      for (value of this.state.hobbyList) {
        if (obj == value.fid) {
          value.status= true;
        }
      }
    }
    this.setState({
      hobbyList: this.state.hobbyList
    });
  }

  handleClick(id, status) {
    for (let obj of this.state.hobbyList) {
      if (obj.fid === id) {
        obj.status = !status;
        break;
      }
    }
    let arr = [];
    for (let obj of this.state.hobbyList) {
      if (obj.status) {
        arr.push(obj.fid)
      }
    }
    this.props.onChange(arr);
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      for (let obj of nextProps.value) {
        for (let value of this.state.hobbyList) {
          if (obj == value.fid) {
            value.status= true;
          }
        }
      }
      this.setState({hobbyList: this.state.hobbyList});
    }
  }
  render() {
    return (
      <div className="hobby_list">
        {
          this.state.hobbyList.map((data,index)=> {
            return (
              <span key={index} onClick={()=>this.handleClick(data.fid, data.status)} className={data.status?'hobby_item_choose':'hobby_item'}>
                {data.fhobby}
              </span>
            )
          })
        }
      </div>
    )
  }
}