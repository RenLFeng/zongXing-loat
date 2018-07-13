
import Title from './title'
import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, DatePicker, TimePicker, Input, Select, message, Tooltip } from 'antd';

import styles from './loanInfo.scss';
import _ from 'lodash';

import Editor from '../../../../../components/editorEdit'

import UploadSingle from './UpLoad/UpLoadSingle';
import UploadPicMultipleFile from './UpLoad/UploadPicMultipleFile';
import UploadVideo from './UpLoad/UploadVideo';

import { EditorState, convertToRaw, ContentState, convertFromRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

import { getCityCode, deleteMoudles } from '../../../../../services/api';
import { MONEY_REG, MUN_INTEGER, ID_CORD, VER_PHONE, TEL_PHONE, BANK_CARD, E_MAIL, IMG_BASE_URL } from '../../../../../common/SystemParam';
const { Option } = Select;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: { span: 3 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 21 },
    sm: { span: 21 },
  },
};

const RequireLabel = ({ children }) => (
  <div>
    <span style={{ color: 'red', display: 'inline-block', verticalAlign: 'sub', marginRight: 5 }}>{`* `}</span>
    <span style={{ display: 'inline-block', verticalAlign: 'middle' }}> {children}</span>
  </div>
);
class Loaninfo extends React.Component {
  state = {
    width: '100%',
    cityList: [],
    num: 5,
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
    address: '请输入关键字：(选定后搜索)',
    latLng: '',
    flag: 0
  };
  data = {
    className: "ant-upload",
    type: "images/",
    divClassName: "upload-div",
    baseUrl: IMG_BASE_URL
  };
  fileData = {
    type: "file/",
    baseUrl: IMG_BASE_URL
  };
  marker = null;

  componentDidMount() {
    // console.log(window,"-4154545454545445")
    // const AMap = window.AMap;
    // let map = new AMap.Map("container", {
    //   resizeEnable: true,
    //   zoom: 10
    // });
    // //为地图注册click事件获取鼠标点击出的经纬度坐标
    // this.marker = new AMap.Marker({
    //   icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
    // });
    // this.marker.setMap(map);
    // let clickEventListener = map.on('click', (e) => {
    //   document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
    //   this.marker.setPosition([e.lnglat.getLng(), e.lnglat.getLat()]);
    //   this.setState({
    //     latLng: `${e.lnglat.getLng()},${e.lnglat.getLat()}`
    //   })
    // });
    // let auto = new AMap.Autocomplete({
    //   input: "tipinput"
    // });
    // AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
    // function select(e) {
    //   if (e.poi && e.poi.location) {
    //     map.setZoom(15);
    //     map.setCenter(e.poi.location);
    //   }
    // }
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.data.flocation !== nextProps.data.flocation) {
    //   if (nextProps.data.flocation) {
    //     this.marker.setPosition(nextProps.data.flocation.split(','));
    //     this.setState({
    //       latLng: nextProps.data.flocation
    //     })
    //   }
    // }
    if (this.props.dataList !== nextProps.dataList) {
      this.setState({ dataList: nextProps.dataList });
    }
  }
  componentWillUnmount() {

  }
  getChildData = () => {
    let val = null;
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        values.fvideo_path = typeof values.fvideo_path !== 'string' ? JSON.stringify(values.fvideo_path) : values.fvideo_path;
        // 拿到富文本编辑器的值，整理值
        let modulesArr = this.state.dataList;
        for (let i = 0; i < modulesArr.length; i++) {
          modulesArr[i].fcontent = draftToHtml(convertToRaw(this[`editor${i}`].returnValue().getCurrentContent()));
        }
        let arr = _.cloneDeep(modulesArr);
        let i = 0;
        for (let obj of arr) {
          if (typeof obj.fid === 'number') {
            obj.fid = null;
          }
          obj.fsort = i;
          i++
        }
        values.projectModules = arr;
        values.flocation = this.state.latLng;
        val = values;
      } else {
        val = null;
      }
    });
    return val;
  }


  validateNumber = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (MONEY_REG.test(value) && (value * 1 < 100000 || value * 1 > 1000000)) {
      callback('金额应为10万到100万之间');
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback()
  };

  validateTime = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (MONEY_REG.test(value) && value * 1 < 3 || value * 1 > 12) {
      callback('期数应为3月到12月之间');
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback()
  };

  validateStr = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (value && /^[0-9]*$/.test(value)) {
      callback('家庭住址不能纯数字');
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback()
  };

  add = () => {
    let arr = this.state.dataList;
    arr.push({
      fid: this.state.num,
      ftitle: '',
      fcontent: '',
      fpictures: '',
      ftype: 0
    });
    this.setState({
      dataList: arr,
      num: this.state.num + 1
    })
  };

  upIndex = (index) => {
    if (index === 0) {
      return;
    }
    const arr = this.state.dataList;
    let temp = null;
    temp = arr[index];
    arr[index] = arr[index - 1];
    arr[index - 1] = temp;
    this.setState({
      dataList: arr
    });
    this.forceUpdate();
  };

  downIndex = (index) => {
    // if (index === this.state.dataList.length - 1) {
    //   return;
    // }
    const arr = this.state.dataList;
    let temp = null;
    temp = arr[index];
    arr[index] = arr[index + 1];
    arr[index + 1] = temp;
    this.setState({
      dataList: arr
    });
    this.forceUpdate();
  };

  delIndex = async (id) => {
    if (typeof id === 'number') {
      const arr = this.state.dataList;
      this.setState({
        dataList: arr.filter((item) => item.fid !== id)
      });
      this.forceUpdate();
    } else {
      if (this.state[`loading${id}`]) {
        return;
      }
      this.setState({
        [`loading${id}`]: true
      });
      const response = await deleteMoudles(id);
      this.setState({
        [`loading${id}`]: false
      });
      if (response.code === 0) {
        const arr = this.state.dataList;
        this.setState({
          dataList: arr.filter((item) => item.fid !== id)
        });
        this.forceUpdate();
      } else {
        response.msg && message.error(response.msg);
      }
    }
  };

  help(title) {
    if (title === '我的自述') {
      return (
        <div style={{display: 'inline-block',position: 'absolute', right: -20}}>
          <Tooltip title={<p>填写说明：<br />1、可以从个人基本信息开始，包括姓名、籍贯、个人经历，个人特长、创业经历等； <br />2、照片上传为个人生活照。</p>}><Icon type="question-circle-o" className={styles.toolTip} style={{ right: -40, top: 10 }} /></Tooltip>
        </div>
      )
    } else if (title === '我的项目') {
      return (
        <div style={{display: 'inline-block',position: 'absolute', right: -20}}>
          <Tooltip title={<p>填写说明：<br />对项目做个简单介绍，包括但不局限于店铺的名称、位置、项目起源、开始项目的机缘、包括个人对于该项目的观点分析以及未来发展前景、项目的优势、未来的发展机遇等。</p>}><Icon type="question-circle-o" className={styles.toolTip} style={{ right: -40, top: 10 }} /></Tooltip>
        </div>
      )
    } else if (title === '为何众借') {
      return (
        <div style={{display: 'inline-block',position: 'absolute', right: -20}}>
          <Tooltip title={<p>填写说明：<br />1、可以从项目的基本规划开始，从投入资金角度进行分析，比如项目计划总投资、自有资金、已筹措资金、预计资金缺口；<br />2、介绍目前已到位资金使用情况，已使用资金用在了哪些板块，项目进度目前如何。</p>}><Icon type="question-circle-o" className={styles.toolTip} style={{ right: -40, top: 10 }} /></Tooltip>
        </div>
      )
    } else if (title === '还款计划') {
      return (
        <div style={{display: 'inline-block',position: 'absolute', right: -20}}>
          <Tooltip title={<p>填写说明：<br />1、还款来源主要以经营现金流为主，请您简要介绍一下经营计划，例如大致营业开始时间、预估计营业额、利润率等；<br />2、投资人做出承诺，及时还款；<br />3、优惠券发放方案。</p>}><Icon type="question-circle-o" className={styles.toolTip} style={{ right: -40, top: 10 }} /></Tooltip>
        </div>
      )
    }
  }
  submit() {
    const val = this.getChildData();
    if (val == null) {
        message.error('请检查数据格式');
        return;
    } else {
        this.props.changeOldData(val, 'SAVE');
    }
  }

  commmitSubmit() {
    const val = this.getChildData();
    if (val == null) {
        message.error('请检查数据格式');
        return;
    } else {
        this.props.changeOldData(val, 'COMMIT');
    }
  }

  render() {
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { cityList } = this.state;
    const dataPath = this.props.companyNo + '/';
    const { visible, data } = this.props;

    return (
      <div className="applone-pro-info">
        <Title Title="借款项目信息" />
        <div>
          <div style={{ borderTop: '1px dashed #e6e2e2' }}>
            <Form layout="vertical" hideRequiredMark style={{ margin: '30px 0' }}>
              <Row gutter={16}>
                <Col lg={13} md={13} sm={24}>
                  <Form.Item label={<RequireLabel>项目名称</RequireLabel>}>
                    {/* <div>
                    <Tooltip title={<p>填写说明：<br/>参考：<br/>XXX店或XXX店XXX分店<br/>
                     字数不得超过16字。</p>}><Icon type="question-circle-o" className={styles.toolTip} style={{left:80,top:-26}}/></Tooltip>
                    </div> */}
                    {getFieldDecorator('projectName', {
                      initialValue: data.projectName ? data.projectName : '',
                      rules: []
                    })(<Input placeholder="请输入" maxLength={15} />)}
                  </Form.Item>
                </Col>
                {/* <span className="video-tip-grays">只支持mp4 /  rmvb /  avi 格式视频上传</span> */}
                <Col lg={11} md={11} sm={24}>
                  <Form.Item label={<RequireLabel></RequireLabel>} className="video_tip" >
                    {getFieldDecorator('fvideo_path', {
                      initialValue: data.fvideo_path ? JSON.parse(data.fvideo_path) : [],
                      rules: [],
                    })(
                      
                        <UploadVideo {...this.fileData} prefix={dataPath}  >借款视频</UploadVideo>
                    )}

                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <div style={{ borderTop: '1px dashed #e6e2e2', marginBottom: 20, paddingTop: 20 }} className="second-img-uploads">
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={<RequireLabel>借款项目展示封面图</RequireLabel>}>
                    {/* <div><Tooltip title={<p>填写说明：<br />1、可展示该项目最具代表性的图片<br />2、裁剪成适当的大小。</p>}><Icon type="question-circle-o" className={styles.toolTip} style={{ left: 150, top: -26 }} /></Tooltip></div> */}
                    {getFieldDecorator('fcard_pic_path', {
                      initialValue: data.fcard_pic_path ? data.fcard_pic_path : '',
                      rules: [],
                    })(
                      <UploadSingle {...this.data} prefix={dataPath} tipText="借款项目展示封面图" className="second-img-uploads-mag" />
                    )}
                  </Form.Item>
                </Col>
                <Col lg={8} md={12} sm={24}>
                  <Form.Item label={<RequireLabel>经营场所实景图</RequireLabel>} >
                    {/* <div><Tooltip title={<p>填写说明：<br />对于项目封面图和经营场所实景图，图片选择可参考首页部分展示项目。</p>}><Icon type="question-circle-o" className={styles.toolTip} style={{ left: 150, top: -26 }} /></Tooltip></div> */}
                    {getFieldDecorator('fbanner_pic_path', {
                     initialValue: data.fbanner_pic_path ? data.fbanner_pic_path : '',
                      rules: [],
                    })(
                      <UploadSingle {...this.data} prefix={dataPath} tipText="经营场所实景图" className="second-img-uploads-mag" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <div style={{ borderTop: '1px dashed #e6e2e2', marginBottom: 20 }}>
            <div style={{paddingTop: 20}}>
              <RequireLabel>经营场所实景图</RequireLabel>
            </div>
          </div>
          <div style={{ borderTop: '1px dashed #e6e2e2', marginBottom: 20 }}>
            {
              this.state.dataList.map((item, index) => {
                return (
                  <Row key={item.fid} >
                    <Col xl={{ span: 12 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                      <Card type="inner" style={{ width: '200%', marginBottom: 10, position: 'relative' }}>
                        {item.ftype == 1 ? null :
                          <div style={{ position: 'absolute', right: 10, zIndex: 10 }}>
                            {index !== 1 ?
                              <Icon type="arrow-up" style={{ fontSize: 16, paddingRight: 5, cursor: 'pointer' }} onClick={() => this.upIndex(index)} /> : null}
                            {index !== this.state.dataList.length - 1 ?
                              <Icon type="arrow-down" style={{ fontSize: 16, paddingRight: 5, cursor: 'pointer' }} onClick={() => this.downIndex(index)} /> : null}
                            <Icon type="close" style={{ fontSize: 16, paddingRight: 5, cursor: 'pointer' }} onClick={() => this.delIndex(item.fid)} />
                          </div>
                        }
                        <Row>
                          <Form.Item label={'项目详情标题'} {...formItemLayout}>
                            {this.help.call(this, item.ftitle)}
                            {getFieldDecorator(`title${item.fid}`, {
                              rules: [],
                              initialValue: item.ftitle ? item.ftitle: '',
                            })(
                              <Input
                                placeholder='请输入'
                                disabled={item.ftype == 1}
                                onChange={(e) => {
                                  let arr = this.state.dataList;
                                  arr[index].ftitle = e.target.value;
                                  this.setState({
                                    dataList: arr
                                  })
                                }}
                              />
                            )}
                          </Form.Item>
                        </Row>
                        <Row>
                          <Form.Item label={'项目详情正文'} {...formItemLayout}>
                            <Editor
                              ref={ref => this[`editor${index}`] = ref}
                              value={item.fcontent ? item.fcontent : ''}
                            />
                          </Form.Item>
                        </Row>
                        <Row>
                          <Form.Item label={'项目详情图片'} {...formItemLayout}>
                            {
                                  getFieldDecorator(`pictures${item.fid}`, {
                                  rules: [],
                                  initialValue: item.fpictures ? JSON.parse(item.fpictures): []
                                }
                              )
                              (
                              <UploadPicMultipleFile
                                {...this.data}
                                prefix={dataPath}
                                onChange={(e)=> {
                                  let arr = this.state.dataList;
                                  let valArr = _.cloneDeep(e);
                                  for (let i = 0; i<valArr.length; i++) {
                                    if (valArr[i].status !== 'done') {
                                      valArr.splice(i, 1);
                                    }
                                  }
                                  arr[index].fpictures = JSON.stringify(valArr);
                                  this.setState({
                                    dataList: arr
                                  }, () => {
                                    console.log(this.state.dataList);
                                  })
                                }}
                              >项目详情图片</UploadPicMultipleFile>
                              )
                            }
                          </Form.Item>
                        </Row>
                      </Card>
                      {index === this.state.dataList.length - 1 ?
                        <Button type="dashed" onClick={this.add} style={{ width: '200%' }}>
                          <Icon type="plus" /> 增加项目详情模块
                        </Button> : null
                      }
                    </Col>
                  </Row>
                );
              })}
          </div>
          <Card type="inner" title="项目经营位置信息(平台获取经纬度)" style={{ marginBottom: 20 }}>
            <Row>
              <Col style={{ height: 500 }}>
                {/* <div id="container" style={{width: '100%', height: 500}}/> */}
                <div id="myPageTop">
                  <table>
                    <tr>
                      <td>
                        <label>按关键字搜索：</label>
                      </td>
                      <td className="column2">
                        <label>左击获取经纬度：</label>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <input type="text" placeholder="请输入关键字进行搜索" id="tipinput" />
                      </td>
                      <td className="column2">
                        <input type="text" readOnly="true" id="lnglat" />
                      </td>
                    </tr>
                  </table>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
        {this.props.hasUnfinishProject ? null: 
        <div style={{width: '100%',textAlign: 'center',marginTop: 20}}>
          <Button style={{width: 140, marginRight: '50px'}} type={'primary'} onClick={this.submit.bind(this)} loading={this.props.loading}>保存</Button>
          <Button style={{width: 140}} type={'primary'} onClick={this.commmitSubmit.bind(this)} loading={this.props.loading}>提交</Button>
        </div>}
      </div>
    )
  }
}
export default Form.create()(Loaninfo);
