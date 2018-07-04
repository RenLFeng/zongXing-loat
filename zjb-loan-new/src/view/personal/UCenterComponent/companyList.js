import React from 'react';
import {Icon, message, Table, Badge, Button, Modal, Form, Input } from 'antd';
const FormItem = Form.Item;

import '../../assets/MessageList/messageList.scss';
import {pageShows, LICENSE, TURN_BACK, VER_PHONE} from '../../common/systemParam';
import {saveCompany, getCompanyByAccount,UpdataOrDele} from '../../services/api';
import LeftMenu from '../../components/UCenterComponent/leftMenu';

export default class LoanList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      maxPage:0,
      current: 1,
      total: 0,
      pageSize: 20,
      dataSource: [],
      visible: false,
      createLoading: false,
      companyN:'',   //企业名称
      sCode:'',   //社会代码
      messages:''  //修改内容时的提示语
    };
  }

  componentDidMount() {
    this.fetchData(1);

  }

  async fetchData(page) {
    this.setState({
      loading: true,
      current: page
    });
    try {
      const response = await getCompanyByAccount({pageCurrent:page,pageSize: this.state.pageSize});
      this.setState({loading: false});
      console.log(response);
      if (response.code === 0) {
        const maxPage = Math.ceil(response.data.totalNumber / this.state.pageSize);
        this.setState({
          total: response.data.totalNumber,
          dataSource: response.data.infoList,
          maxPage:maxPage,
          current:page
        });
      } else {
        this.setState({dataSource: []});
        message.error(response.msg);
      }
    } catch(e) {
      this.setState({
        loading: false,
        dataSource: []
      });
      if (typeof e === 'object' && e.name === 288) {
        message.error('未登录或登录超时');
        localStorage.removeItem('accessToken');
        this.props.history.push('/index/login');
      }
      console.log(e);
    }
  }

  handleCancel = () => {
    this.setState({visible: false});
    this.createCompany.resetFields();
  };

  handleCreate =  () => {
    const form = this.createCompany;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      if (values.companyName.trim().length === 0) {
        message.error('企业名称不能为空');
        return;
      } else if (values.fsocialCreditCode.trim().length === 0) {
        message.error('统一社会信用代码不能为空');
        return;
      }
      try {
        this.setState({createLoading: true});
        const response = await saveCompany({
          companyName: values.companyName.trim(),
          fsocialCreditCode: values.fsocialCreditCode.trim()
        });
        console.log(response);
        this.setState({createLoading: false});
        if (response.code === 0) {
          this.fetchData(1);
          localStorage.setItem('companyToken', response.token);
          localStorage.setItem('companyName', response.companyName);
        } else {
          message.error(response.msg)
        }
      } catch (e) {
        this.setState({createLoading: false});
        if (typeof e === 'object' && e.name === 288) {
          message.error('未登录或登录超时');
          localStorage.removeItem('accessToken');
          this.props.history.push('/index/login');
          this.props.dispatch({
            type: 'login/logoutData'
          });
        }
      }
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  //修改或删除企业列表
  async UpdataOrDele(id,name,flag,code) {
    if(flag === 1){       //修改操作
      if(name.trim().length === 0 && code.trim().length === 0){
        message.error('公司名,统一社会信用代码不能为空');
        return
      }
      if(name.trim().length === 0){
        message.error('公司名不能为空');
        return
      }
      if(code.trim().length === 0){
        message.error('统一社会信用代码不能为空');
        return
      }
      if (!LICENSE.test(code)) {
        message.error('请输入正确的统一社会信用代码');
        return;
      }
      const response = await UpdataOrDele({companyId:id, companyName:name.trim(), flag:flag, fsocialCreditCode:code.trim()});
      console.log(response);
      if(response.code === 0){
        this.setState({
          companyN:'',
          sCode:'',
        },()=>{
          this.fetchData(1);
        });
      } else {
        response.msg && message.error(response.msg);
      }
    } else {  //删除操作
      const response = await UpdataOrDele({companyId:id, companyName:name, flag:flag, fsocialCreditCode:code});
      console.log(response);
      if(response.code === 0){
        this.setState({
          companyN:'',
          sCode:'',
        },()=>{
          this.fetchData(1);
        })
      } else {
        response.msg && message.error(response.msg);
      }
    }
  }

  //修改列表内容
  change(data) {
    console.log(data);
    data.inputStatus = true;
    this.setState({
      companyN:data.fname,
      sCode:data.fsocialCreditCode,
    });
    this.forceUpdate();
  }

  //获取修改后的企业名称
  changeValue(val){
    console.log(val);
   this.setState({
     companyN:val
   })
  }

//获取修改后的社会统一信用代码
  changeValue1(val){
    console.log(val);
    this.setState({
      sCode:val
    })
  }

  render() {
    const {dataSource,messages} = this.state;
    const page_num = pageShows(this.state.current, this.state.maxPage);
    return (
      <div>
        <LeftMenu param={this.props}/>
        <div className="fr uc-rbody">
          <Button type="primary" style={{marginBottom: 30}} onClick={()=>this.setState({visible: true})}>新建企业</Button>
          <div className="content_">
            <div className="messageGroup">
              <ul >
                <li className="massageList">
                  <span className="massageListtime">企业名称</span>
                  <span className="massageListtime1">统一社会信用代码</span>
                  <span className="massageListtime2">操作</span>
                </li>

                { dataSource.length <= 0 ?
                  <p style={{textAlign: 'center',paddingTop:15,color: '#B9B9B9'}}>暂无数据</p>:
                  dataSource.map((data)=>{
                    return(
                      <li className="massageList" key={data.fid}>
                        {
                          data.inputStatus? <Input className="inp" defaultValue={data.fname} onChange={(e)=>this.changeValue(e.target.value)}/> :<span className="massageListtime">{data.fname}</span>
                        }
                        {
                          data.inputStatus? <Input className="inp1" defaultValue={data.fsocialCreditCode} onChange={(e)=>this.changeValue1(e.target.value)}/> :  <span className="massageListtime1">{data.fsocialCreditCode}</span>
                        }

                        <span className="massageListtime2">
                          <a onClick={async () => {
                          window.location.href = `${TURN_BACK}?token=${JSON.parse(localStorage.getItem('accessToken')).webToken}&id=${data.fid}`; // 开发使用
                        }}>进入后台</a>
                          {
                            !data.accountId ?
                              <i>
                                {data.inputStatus ? <a onClick={()=>this.UpdataOrDele(data.fid, this.state.companyN,1, this.state.sCode)}>保存</a>:<a onClick={()=>this.change(data)}>修改</a>}

                              <a onClick={()=>this.UpdataOrDele(data.fid, this.state.companyN,0, this.state.sCode)}>删除</a>
                            </i> : null
                          }
                        </span>
                      </li>
                    )
                  })
                }

                <li className="footer_">
                  <span>共<i>{this.state.total}</i>项</span>
                  <div className="box_">
                    <div className="pagination">
                      {page_num.lastPage ?
                        <a className="num" onClick={() => this.fetchData(this.state.current - 1)}>&lt;</a> :
                        <a className="num" style={{backgroundColor: '#eee'}}>&lt;</a>}
                      {page_num.firstPage ?
                        <a className={`${1 == this.state.current ? 'hover_' : ''}`} onClick={() => this.fetchData(1)}>1</a> :
                        null}
                      {page_num.leftEllipsis ?
                        <a>...</a> :
                        null}
                      {page_num.page.map((pageNum) => {
                        return (
                          <a key={pageNum} className={`${pageNum * 1 == this.state.current ? 'hover_' : ''}`}
                            onClick={() => this.fetchData(pageNum)}>{pageNum}</a>
                        );
                      })}
                      {page_num.rightEllipsis ?
                        <a>...</a> :
                        null}
                      {page_num.finalPage ?
                        <a
                          className={`${this.state.maxPage == this.state.current ? 'hover_' : ''}`}
                          onClick={() => this.fetchData(this.state.maxPage)}
                        >{this.state.maxPage}</a> :
                        null}
                      {page_num.nextPage ?
                        <a className="num" onClick={() => this.fetchData(this.state.current + 1)}>&gt;</a> :
                        <a className="num" style={{backgroundColor: '#eee'}}>&gt;</a>
                      }
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <CreateCompany
            ref={(ref)=>this.createCompany = ref}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            loading={this.state.createLoading}
          />
        </div>
      </div>
     
    );
  }
}


class CreateCompanyComponent extends React.Component {

  validateName =(rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && /^[0-9]*$/.test(value)) {
      callback('不能为纯数字');
    }
    callback();
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const formItemsLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const { visible, onCancel, onCreate, form, loading } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="创建企业"
        okText="创建"
        cancelText="取消"
        onCancel={onCancel}
        confirmLoading={loading}
        onOk={onCreate}
      >
        <Form layout="horizontal" style={{width: '100%'}}>
          <FormItem label="企业名称" {...formItemLayout} whitespace>
            {getFieldDecorator('companyName', {
              rules: [{ required: true, message: '企业名称不能为空' }
                ,{validator: this.validateName},
              ],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="统一社会信用代码" {...formItemsLayout}>
            {getFieldDecorator('fsocialCreditCode', {
              rules: [{ required: true, message: '统一社会信用代码不能为空' },
                {pattern: LICENSE, message: '统一社会信用代码格式不正确'},
                ],
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const CreateCompany = Form.create()(CreateCompanyComponent);
