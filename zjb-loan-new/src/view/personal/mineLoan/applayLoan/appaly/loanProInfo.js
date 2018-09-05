

import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, DatePicker, TimePicker, Input, Select, message, Tooltip } from 'antd';

import styles from './loanInfo.scss';
import _ from 'lodash';
import Title from './title'
import Editor from '../../../../../components/editorEdit'

import UploadSingle from './UpLoad/UpLoadSingle';
import UploadPicMultipleFile from './UpLoad/UploadPicMultipleFile';
import UploadVideo from './UpLoad/UploadVideo';

import { Map, Marker } from 'react-amap';
import { EditorState, convertToRaw, ContentState, convertFromRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

import { getCityCode, deleteMoudles } from '../../../../../services/api';
import { MONEY_REG, MUN_INTEGER, ID_CORD, VER_PHONE, TEL_PHONE, BANK_CARD, E_MAIL, IMG_BASE_URL } from '../../../../../common/SystemParam';
const { Option } = Select;
const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: { span: 20 },
};

const RequireLabel = ({ children, notRequire }) => (
  <div className="span_require_div">
      <span className="span_require_div_right" style={notRequire?{color: '#333'}:null}>{children}</span>
      {notRequire ? null:
      <img src={require('../../../../../assets/img/apply/ic_star.png')} className="span_require_div_left"/>}
  </div>
);

class Loaninfo extends React.Component {
  state = {
    markerPosition: { longitude: 120, latitude: 30 },
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
  first = 1;

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data.flocation !== nextProps.data.flocation) {
      if (nextProps.data.flocation) {
        if (this.mapInstance) {
          this.mapInstance.setZoomAndCenter(15, nextProps.data.flocation.split(','));
          this.setState({
            markerPosition: { longitude: nextProps.data.flocation.split(',')[0], latitude: nextProps.data.flocation.split(',')[1] },
          });
          document.getElementById("lnglat").value = nextProps.data.flocation;
        }
      }
    }
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
        values.flocation = this.state.markerPosition?`${this.state.markerPosition.longitude},${this.state.markerPosition.latitude}`:''
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


  amapEvents = {
    created: (mapInstance) => {
      this.mapInstance = mapInstance;
      mapInstance.setZoom(15);
      // 确认第一次点击
      mapInstance.on('click', (e) => {
        this.setState({
          markerPosition: { longitude: e.lnglat.getLng(), latitude: e.lnglat.getLat() },
        })
        document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
         // 确认第一次点击 否则不出来点位坐标
        if (this.first === 1) {
          mapInstance.setZoom(14);
          this.first += 1
        }
      });
      window.AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
          var autoOptions = {
              input: "tipinput"//使用联想输入的input的id
          };
          const autocomplete= new AMap.Autocomplete(autoOptions);
          var placeSearch = new AMap.PlaceSearch({
              map:mapInstance
          })
          window.AMap.event.addListener(autocomplete, "select", function(e){
              //TODO 针对选中的poi实现自己的功能
              if (e.poi && e.poi.location) {
                mapInstance.setZoom(15);
                mapInstance.setCenter(e.poi.location);
              }
          });
      });
    }
  };

  markerEvents = {
    created: (markerInstance) => {
    }
  };

  render() {
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { cityList } = this.state;
    const dataPath = this.props.companyNo + '/';
    const { visible, data } = this.props;
    const formItemLayoutUser = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    };
    return (
      <div className="applone-pro-info">
        <Title Title="借款项目信息" />
        <div>
          <Form layout="vertical" hideRequiredMark>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayoutUser} label={<RequireLabel>项目名称</RequireLabel>}>
                  {/* <div>
                  <Tooltip title={<p>填写说明：<br/>参考：<br/>XXX店或XXX店XXX分店<br/>
                    字数不得超过16字。</p>}><Icon type="question-circle-o" className={styles.toolTip} style={{left:80,top:-26}}/></Tooltip>
                  </div> */}
                  {getFieldDecorator('projectName', {
                    initialValue: data.projectName ? data.projectName : '',
                    rules: []
                  })(<Input placeholder="请输入" size='large' style={{ width: '302px', fontSize: '14px' }} maxLength={14}/>)}
                </Form.Item>
              </Col>
              {/* <span className="video-tip-grays">只支持mp4 /  rmvb /  avi 格式视频上传</span> */}
              <Col span={11}>
                <Form.Item {...formItemLayoutUser} label={<RequireLabel></RequireLabel>} className="video_tip" >
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
          <div style={{ borderTop: '1px dashed #e6e2e2', marginBottom: 20, paddingTop: 20 }} className="second-img-uploads">
            <Form hideRequiredMark>
              <Row >
                <Col span={12}>
                  <Form.Item style={{marginLeft: 55}} label={<RequireLabel>借款项目展示封面图</RequireLabel>}>
                    {getFieldDecorator('fcard_pic_path', {
                      initialValue: data.fcard_pic_path ? data.fcard_pic_path : '',
                      rules: [],
                    })(
                      <UploadSingle {...this.data} prefix={dataPath} tipText="借款项目展示封面图" className="second-img-uploads-mag" />
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item style={{marginLeft: 55}} label={<RequireLabel>经营场所实景图</RequireLabel>} >
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
          <div style={{ marginBottom: 20,paddingBottom: 20 }}>
            {
              this.state.dataList.map((item, index) => {
                return (
                  <Row key={item.fid} style={{paddingBottom: 20,marginBottom: 20, borderBottom: `${this.state.dataList.length === index+1?'0px solid #f0f0f0':'1px solid #f0f0f0'}`}} >
                    <Col span={24}>
                      {item.ftype == 1 ? 
                          <Row>
                            <Col span={4}>
                              <RequireLabel>{item.ftitle}</RequireLabel>
                            </Col>
                            <Col span={20}>
                            <Form.Item>
                              <Editor
                                ref={ref => this[`editor${index}`] = ref}
                                value={item.fcontent ? item.fcontent : ''}
                              />
                            </Form.Item>
                            </Col>
                          </Row> : 
                        <div>
                          <Row>
                            <Form.Item label={'栏目名称'} {...formItemLayout}>
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
                                  maxLength={20}
                                  size='large'
                                  style={{width: '297px', fontSize: 14}}
                                />
                              )}
                            </Form.Item>
                          </Row>
                          <Row>
                            <Col span={4}/>
                            <Col span={20}>
                              <Form.Item>
                                <Editor
                                  ref={ref => this[`editor${index}`] = ref}
                                  value={item.fcontent ? item.fcontent : ''}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                      }
                        <Row>
                          <Col span={4}/>
                          <Col span={20}>
                            <Form.Item>
                              {
                                getFieldDecorator(`pictures${item.fid}`, {
                                rules: [],
                                initialValue: item.fpictures ? JSON.parse(item.fpictures): []})
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
                                    })
                                  }}
                                >项目详情图片</UploadPicMultipleFile>
                                )
                              }
                            </Form.Item>
                          </Col>
                        </Row>
                      {index === this.state.dataList.length - 1 ?
                      <Row>
                        <Col span={4}>
                        </Col>
                        <Col span={20} style={{paddingLeft: 16}}>
                          <Button style={{width: '82%'}} type="dashed" onClick={this.add} >
                            <Icon type="plus" /> 增加项目详情模块
                          </Button> 
                        </Col>
                      </Row>: null
                      }
                    </Col>
                  </Row>
                );
              })}
          </div>
          <Card type="inner" title="项目经营位置信息(平台获取经纬度)" style={{ marginBottom: 20 }}>
            <Row>
              <Col style={{ height: 500 }}>
                <div id="container" style={{width: '100%', height: 500}}>
                  <Map amapkey={'58195b2aee5f18c85bf15134f7b56ce7'} events={this.amapEvents}>
                    <Marker position={this.state.markerPosition} events={this.markerEvents} />
                  </Map>
                </div>
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
