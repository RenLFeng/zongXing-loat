import React from 'react';
import './detailsOne.scss';
import {Card, Button, Row, Col, Layout, Divider, Table, Icon, Input, message} from 'antd';
import Imgs from './Img/img';
import ShowPicMultipleFile from '../../common/showPicMultipleFile';
import {wsbaseService} from '../../services/api';
import moment from 'moment';
import {IMG_BASE_URL} from '../../common/SystemParam';


const { TextArea } = Input;

export default class DetailOne extends React.Component{
    constructor(props){
      super();
      this.state = {
        information: {},
        dataCode: 'error',
        Arr:[],
      }
    }
    fileData = {
        type:"file/",
        baseUrl: IMG_BASE_URL
      };
    
      data = {
        className:"ant-upload",
        type:"images/",
        divClassName:"upload-div",
        baseUrl: IMG_BASE_URL
      };

    componentDidMount(){
        this.getDetail();
    }

    async getDetail(){
        let param = {
            // projectId:this.props.id,
            projectId:'b80876f488fa4b6aa13ae4cbf455310f'    
        }
        const response = await wsbaseService.getPDetail(param);
        if (response.code === 0) {
            const create_tiem = response.data.fcreate_time;
            if (create_tiem) {
              this.setState({
                dataCode: moment(create_tiem).format('YYYY') + moment(create_tiem).format('MM')
              });
            }
            this.setState({
              information: response.data,
              Arr:response.data.projectModules
            });
            this.props.getData ? this.props.getData(this.state.information) : null
        } else {
            response.msg && message.error(response.msg)
        }
    }

    getChannel(val) {
        switch (val * 1) {
          case 0:
            return '网络搜索';
          case 1:
            return '熟人推荐分享';
          case 2:
            return '线下宣传';
          default:
            return '网络搜索'
        }
      }

    render(){
        const { Header, Content, Footer, Sider } = Layout;

        const {information, myImg, projectImg} = this.state;
        const dataPath = `${IMG_BASE_URL}`;
    
        // 视频链接生成
        let video = '';
        if (information.fvideo_path) {
          const tempArr = JSON.parse(information.fvideo_path);
          if (tempArr.length > 0) {
            video = tempArr[0].url;
          }
        }
    
        //企业银行流水
        let file1 = '';
        let name1 = '';
        let bankArr = information.fstatement_file ? JSON.parse(information.fstatement_file):[];
        if(information.fstatement_file) {
          const tempArr = JSON.parse(information.fstatement_file);
          if(tempArr.length > 0){
            file1 = tempArr[0].url;
            name1 = tempArr[0].name;
          }
        }
    
        // 个人征信报告
        let file5 = '';
        let name5 = '';
        let presentationArr = information.fcredit_report ? JSON.parse(information.fcredit_report):[];
        if(information.fcredit_report) {
          const tempArr = JSON.parse(information.fcredit_report);
          if(tempArr.length > 0){
            file5 = tempArr[0].url;
            name5 = tempArr[0].name;
          }
        }
    
        // 个人交易流水
        let file6 = '';
        let name6 = '';
        let tradingArr = information.fdeal_log ? JSON.parse(information.fdeal_log):[];
        if(information.fdeal_log) {
          const tempArr = JSON.parse(information.fdeal_log);
          if(tempArr.length > 0){
            file6 = tempArr[0].url;
            name6 = tempArr[0].name;
          }
        }
    
        //公司内部治理
        let file2 = '';
        let name2 = '';
        let guArr = information.fcompany_govern?JSON.parse(information.fcompany_govern):[];
        if(information.fcompany_govern) {
          const tempArr = JSON.parse(information.fcompany_govern);
          if(tempArr.length > 0){
            file2 = tempArr[0].url;
            name2 = tempArr[0].name;
          }
        }
    
        //经营场地租赁合同
        let file3 = '';
        let name3 = '';
        let placeArr = information.fplace_lease?JSON.parse(information.fplace_lease):[];
        if(information.fplace_lease) {
          const tempArr = JSON.parse(information.fplace_lease);
          if(tempArr.length > 0){
            file3 = tempArr[0].url;
            name3 = tempArr[0].name;
          }
        }
    
        //企业加盟合同
        let file4 = '';
        let name4 = '';
        let joinArr = information.fjoin_file? JSON.parse(information.fjoin_file):[];
        if(information.fjoin_file) {
          const tempArr = JSON.parse(information.fjoin_file);
          if(tempArr.length > 0){
            file4 = tempArr[0].url;
            name4 = tempArr[0].name;
          }
        }
    
        //其他资产证明
        let file7 = '';
        let name7 = '';
        let somethingArr = information.fother_pic_json? JSON.parse(information.fother_pic_json):[];
        if(information.fother_pic_json) {
          const tempArr = JSON.parse(information.fother_pic_json);
          if(tempArr.length > 0){
            file7 = tempArr[0].url;
            name7 = tempArr[0].name;
          }
        }
    
        //六个月员工工资清单
        let file8 = '';
        let name8 = '';
        let recordArr = information.femployee_record? JSON.parse(information.femployee_record):[];
        if(information.femployee_record) {
          const tempArr = JSON.parse(information.femployee_record);
          if(tempArr.length > 0){
            file8 = tempArr[0].url;
            name8 = tempArr[0].name;
          }
        }
    
        //六个月企业纳税记录
        let file9 = '';
        let name9 = '';
        let taxArr = information.fratepaying_record? JSON.parse(information.fratepaying_record):[];
        if(information.fratepaying_record) {
          const tempArr = JSON.parse(information.fratepaying_record);
          if(tempArr.length > 0){
            file9 = tempArr[0].url;
            name9 = tempArr[0].name;
          }
        }
    
        //六个月水电缴费凭证
        let file10 = '';
        let name10 = '';
        let payArr = information.fliving_payment? JSON.parse(information.fliving_payment):[];
        if(information.fliving_payment) {
          const tempArr = JSON.parse(information.fliving_payment);
          if(tempArr.length > 0){
            file10 = tempArr[0].url;
            name10 = tempArr[0].name;
          }
        }

        //财务报表
        let file11 = '';
        let name11 = '';
        let auditArr = information.faudit_file ? JSON.parse(information.faudit_file):[];
        if(information.faudit_file) {
          const tempArr = JSON.parse(information.faudit_file);
          if(tempArr.length > 0){
            file11 = tempArr[0].url;
            name11 = tempArr[0].name;
          }
        }

        //股东会议决议/授权书
        let file12 = '';
        let name12 = '';
        let topshArr = information.ftopsh_file ? JSON.parse(information.ftopsh_file):[];
        if(information.ftopsh_file) {
          const tempArr = JSON.parse(information.ftopsh_file);
          if(tempArr.length > 0){
            file12 = tempArr[0].url;
            name12 = tempArr[0].name;
          }
        }
    
        //其他文件
        let fileArr = information.fother_file1?JSON.parse(information.fother_file1): [];
    
        //模板数组
        let modelArr = information.projectModules;
        let obj = {
          1:"同事",
          2:"母亲",
          3:"父亲",
          4:"其他亲属",
          5:"朋友",
          6:"配偶",
          7:"其他",
          8:"子女",
          9:"上下游供应商",
          10:"合伙人",
        };
        const infoColumns = [{
          title: '类型',
          dataIndex: 'type',
          key: 'type',
        }, {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: '身份证号',
          dataIndex: 'ID',
          key: 'ID',
        }, {
          title: '手机号码',
          dataIndex: 'phone',
          key: 'phone',
        }, {
          title: '社会关系',
          dataIndex: 'socialRelation',
          key: 'socialRelation',
          render: (val) => `${obj[val]}`
        }];
    
        const info = []
        if(information.tlo1Name) {
          const obj1 = {
            type: '第一联系人',
            name: information.tlo1Name,
            ID: information.tlo1Idcard,
            phone: information.tlo1phone,
            socialRelation: information.tlo1relation
          }
          info.push(obj1);
        }
        if(information.tlo2Name) {
          const obj2 = {
            type: '商业伙伴',
            name: information.tlo2Name,
            ID: information.tlo2Idcard,
            phone: information.tlo2phone,
            socialRelation: information.tlo2relation
          }
          info.push(obj2);
        }
        if(information.tlo3Name) {
          const obj3 =  {
            type: '朋友',
            name: information.tlo3Name,
            ID: information.tlo3Idcard,
            phone: information.tlo3phone,
            socialRelation: information.tlo3relation
          }
          info.push(obj3);
        }
    


        return(
          <div style={{width:'inherit',marginTop:20}} className="detail"> 
             <Card title="借款信息" style={{marginBottom:20}}>
                <Row style={{marginBottom: 16}}>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span>要借多钱：</span>
                        <span>{information.fcredit_money ? (information.fcredit_money + '').fm() + '元' : null}</span>
                    </Col>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span >要借多久：</span>
                        <span>{information.fcredit_month ? information.fcredit_month+'月' : null}</span>
                    </Col>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span >所在城市：</span>
                        <span>{information.fcity_name}</span>
                    </Col>
                </Row>
                <Row style={{marginBottom: 16}}>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span>借款用途：</span>
                        <span>{information.fcredit_use}</span>
                    </Col>
                    <Col span={8}>
                        <span className="text">期望利率：</span>
                        <span>{information.frate_predict ? information.frate_predict + '%' : null}</span>
                    </Col>
                    <Col span={8}>
                        <span className="text">获客渠道：</span>
                        <span>{information.fchannel ? this.getChannel(information.fchannel) : null}</span>
                    </Col>
                </Row>
             </Card>
             <Card title="借款人信息" style={{marginBottom:20}}>
                <Row style={{marginBottom: 16}}>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span >姓名：</span>
                        <span>{information.lenderName}</span>
                    </Col>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span >手机号：</span>
                        <span>{information.fmobile}</span>
                    </Col>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span >QQ号：</span>
                        <span>{information.fqq}</span>
                    </Col>
                </Row>
                <Row style={{marginBottom: 16}}>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span >身份证号：</span>
                        <span>{information.fidcard_no}</span>
                    </Col>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span >婚姻状况：</span>
                        <span>{ (information.fmarriage ? "已婚" : "未婚")}</span>
                    </Col>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span >微信号：</span>
                        <span>{information.fweichat}</span>
                    </Col>
                </Row>
                <Row style={{marginBottom: 16}}>
                    <Col span={8}>
                        <span className="text">银行卡号：</span>
                        <span>{information.fbank_no}</span>
                    </Col>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span >学历：</span>
                        <span>{information.feducation}</span>
                    </Col>
                    <Col span={8}>
                        <span className="text">电子邮箱：</span>
                        <span>{information.fcompany_email}</span>
                    </Col>
                </Row>
                <Row style={{marginBottom: 16}}>
                    <Col span={8}>
                        <span className="text">开户银行：</span>
                        <span>{information.fbank_name}</span>
                    </Col>
                    <Col span={8}>
                        <span className="text">座机：</span>
                        <span>{information.ftelephone}</span>
                    </Col>
                    
                </Row>
                <Row style={{marginBottom: 16}}>
                    <Col span={24}>
                    <i className="zjb zjb-bixutian icon"/><span >家庭住址：</span>
                        <span>{information.faddress}</span>
                    </Col>
                    
                </Row>

                <Divider style={{marginBottom: 32}}/>

                <Table
                    style={{marginBottom: 32}}
                    pagination={false}
                    dataSource={info}
                    columns={infoColumns}
                />
                <div className="imgBox"> 
                  <Row style={{marginBottom: 20}}>
                      <Col span={8}>
                      <i className="zjb zjb-bixutian icon img_title"/><span >身份证正面照</span>
                        <div className="img_box">
                          <div className="box">
                            <Imgs src={`${dataPath}${information.fidcard_pic1}`}/>
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                      <i className="zjb zjb-bixutian icon img_title"/><span >身份证反面照</span>
                        <div className="img_box">
                            <div className="box">
                                <Imgs src={`${dataPath}${information.fidcard_pic2}`}/>
                            </div>
                        </div>
                      </Col>
                      <Col span={8}>
                      <i className="zjb zjb-bixutian icon img_title"/><span >手持身份证</span>
                        <div className="img_box">
                            <div className="box">
                                <Imgs src={`${dataPath}${information.fidcard_pic3}`}/>
                            </div>
                        </div>
                      </Col>
                  </Row>
                  <Row>
                      <Col span={8}>
                        <span className="img_title">车辆行驶证</span>
                        <div className="img_box">
                          <div className="box">
                            <Imgs src={`${dataPath}${information.fcar_pic}`}/>
                          </div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <span className="img_title">房产证明</span>
                        <div className="img_box">
                            <div className="box">
                                <Imgs src={`${dataPath}${information.fhouse_pic1}`}/>
                            </div>
                        </div>
                      </Col>
                  </Row>
                </div>
                <Divider style={{marginBottom: 32}}/>
                <div className="file" style={{marginBottom: 16}}>
                    <div className="file_">
                        <p><i className="zjb zjb-bixutian icon"/><span>个人征信报告</span><Icon type="question-circle-o" className="icon p_icon"/></p>
                        {
                            presentationArr.length >0 ? 
                            <div className="files"><Icon type="link" /><a href={file5} target="_blank">{name5}</a><Icon type="close" className="close"/></div>:
                            <div className="noFile">暂无文件</div>
                        }
                        
                    </div>
                    <div className="file_">
                        <p><i className="zjb zjb-bixutian icon"/><span>个人交易流水</span><Icon type="question-circle-o" className="icon p_icon"/></p>
                        {
                            tradingArr.length > 0?
                            <div className="files"><Icon type="link" /><a href={file6} target="_blank">{name6}</a><Icon type="close" className="close"/></div>:
                            <div className="noFile">暂无文件</div>
                        }
                        
                    </div>
                    <div className="file_">
                        <p><span className="text">其他财产证明</span><Icon type="question-circle-o" className="icon p_icon"/></p>
                        {
                            somethingArr.length > 0?
                            <div className="files"><Icon type="link" /><a href={file7} target="_blank">{name7}</a><Icon type="close" className="close"/></div>:
                            <div className="noFile">暂无文件</div>
                        }
                        
                    </div>
                </div>
             </Card>

             <Card title="借款企业信息" style={{marginBottom:20}}>
                <Row style={{marginBottom: 16}}>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span >企业名称：</span>
                        <span>{information.companyName}</span>
                    </Col>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span >统一社会信用代码：</span>
                        <span>{information.fsocial_credit_code}</span>
                    </Col>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span >公司座机：</span>
                        <span>{information.fctelephone}</span>
                    </Col>
                </Row>
                <Row style={{marginBottom: 16}}>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span >企业开户行：</span>
                        <span>{information.fcbank_name}</span>
                    </Col>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span >企业对公银行账号：</span>
                        <span>{information.fcbank_no}</span>
                    </Col>
                    <Col span={8}>
                        <span className="text">经营行业：</span>
                        <span>{information.ftype_name}</span>
                    </Col>
                </Row>
                <Row style={{marginBottom: 16}}>
                    <Col span={8}>
                    <i className="zjb zjb-bixutian icon"/><span >实际经营地址：</span>
                        <span>{information.fbus_address}</span>
                    </Col>
                </Row>

                <Divider style={{marginBottom: 32}}/>

                <div className="imgBox"> 
                  <Row style={{marginBottom: 20}}>
                      <Col span={12}>
                      <i className="zjb zjb-bixutian icon img_title"/><span >营业执照</span>
                        <div className="img_box">
                          <div className="box">
                            <Imgs src={`${dataPath}${information.fbus_license}`}/>
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                      <i className="zjb zjb-bixutian icon img_title"/><span >银行开户许可证</span>
                        <div className="img_box">
                            <div className="box">
                                <Imgs src={`${dataPath}${information.fbank_permit}`}/>
                            </div>
                        </div>
                      </Col>
                  </Row>
                </div>

                <Divider style={{marginBottom: 32}}/>
                <div className="file" >
                    <div className="file_">
                        <p><i className="zjb zjb-bixutian icon"/><span>企业六个月银行流水</span><Icon type="question-circle-o" className="icon p_icon"/></p>
                        {
                            bankArr.length >0 ? <div className="files"><Icon type="link" /><a href={file1} target="_blank">{name1}</a><Icon type="close" className="close"/></div>
                            :<div className="noFile">暂无文件</div>
                        }
                        
                    </div>
                    <div className="file_">
                        <p><i className="zjb zjb-bixutian icon"/><span>经营地址证明</span><Icon type="question-circle-o" className="icon p_icon"/></p>
                        {
                            placeArr.length > 0 ? <div className="files"><Icon type="link" /><a href={file3} target="_blank">{name3}</a><Icon type="close" className="close"/></div>:
                            <div className="noFile">暂无文件</div>
                        }
                        
                    </div>
                    <div className="file_">
                        <p><span>六个月水电气费缴费记录</span><Icon type="question-circle-o" className="icon p_icon"/></p>
                        {
                            payArr.length>0 ? <div className="files"><Icon type="link" /><a href={file10} target="_blank">{name10}</a><Icon type="close" className="close"/></div>:
                            <div className="noFile">暂无文件</div>
                        }
                        
                    </div>
                </div>
                <div className="file">
                    <div className="file_">
                        <p><span>企业加盟合同-附件</span><Icon type="question-circle-o" className="icon p_icon"/></p>
                        {
                            joinArr.length>0 ? <div className="files"><Icon type="link" /><a href={file4} target="_blank">{name4}</a><Icon type="close" className="close"/></div>:
                            <div className="noFile">暂无文件</div>
                        }  
                    </div>
                    <div className="file_">
                        <p><span>公司内部治理文件</span><Icon type="question-circle-o" className="icon p_icon"/></p> 
                        {
                            guArr.length > 0?<div className="files"><Icon type="link" /><a href={file2} target="_blank">{name2}</a><Icon type="close" className="close"/></div>:
                            <div className="noFile">暂无文件</div>
                        }   
                    </div>
                    <div className="file_">
                        <p><span>股东会议决议/授权书</span><Icon type="question-circle-o" className="icon p_icon"/></p>
                        {
                            topshArr.length > 0?<div className="files"><Icon type="link" /><a href={file12} target="_blank">{name12}</a><Icon type="close" className="close"/></div>:
                            <div className="noFile">暂无文件</div>
                        }   
                         
                    </div>
                </div>
                <div className="file" >
                    <div className="file_">
                        <p><span>六个月企业纳税、开票记录</span><Icon type="question-circle-o" className="icon p_icon"/></p> 
                        {
                            taxArr.length>0 ? <div className="files"><Icon type="link" /><a href={file9} target="_blank">{name9}</a><Icon type="close" className="close"/></div>:
                            <div className="noFile">暂无文件</div>
                        } 
                    </div>
                    <div className="file_">
                        <p><span>财务报表</span><Icon type="question-circle-o" className="icon p_icon"/></p>
                        {
                            auditArr.length>0 ? <div className="files"><Icon type="link" /><a href={file11} target="_blank">{name11}</a><Icon type="close" className="close"/></div>:
                            <div className="noFile">暂无文件</div>
                        }     
                    </div>
                    <div className="file_">
                        <p><span>其他资质文件</span><Icon type="question-circle-o" className="icon p_icon"/></p> 
                        {
                            fileArr.length > 0 ?
                                fileArr && fileArr.map((data)=>{
                                return(
                                <div className="files" key={data.uid}><Icon type="link" /><a href={data.url} target="_blank">{data.name}</a><Icon type="close" className="close"/></div>
                                )
                            }) : <div className="noFile">暂无文件</div>
                        }   
                    </div>
                </div>
                <div className="file" >
                    <div className="file_">
                        <p><span>六个月员工工资清单、社保缴费记录</span><Icon type="question-circle-o" className="icon p_icon"/></p> 
                        {
                            recordArr.length>0 ? <div className="files"><Icon type="link" /><a href={file8} target="_blank">{name8}</a><Icon type="close" className="close"/></div>:
                            <div className="noFile">暂无文件</div>
                        } 
                    </div>
                    
                </div>
             </Card>

             <Card title="借款项目信息" style={{marginBottom: 20}}>
                    <Row >
                        <Col span={12}>
                        <i className="zjb zjb-bixutian icon"/><span >项目名称：</span>
                            <span>{information.projectName}</span>
                        </Col>
                        <Col span={12}>
                        <i className="zjb zjb-bixutian icon"/><span >借款视频：</span>
                            <div id="V"><video src={video} controls="controls" style={{padding:'10px 30px'}}></video></div>
                        </Col>
                    </Row>
                    <Divider />
                    <div className="imgBox"> 
                        <Row style={{marginBottom: 20}}>
                            <Col span={12}>
                            <i className="zjb zjb-bixutian icon img_title"/><span >借款项目展示封面图</span>
                                <div className="img_box">
                                <div className="box">
                                    <Imgs src={`${dataPath}${information.fcard_pic_path}`}/>
                                </div>
                                </div>
                            </Col>
                            <Col span={12}>
                            <i className="zjb zjb-bixutian icon img_title"/><span >经营场所实景图</span>
                                <div className="img_box">
                                    <div className="box">
                                        <Imgs src={`${dataPath}${information.fbanner_pic_path}`}/>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Divider />
                    {
                        modelArr && modelArr.map((data)=>{
                            let arr = [];
                            if (data.fpictures) {
                            arr = JSON.parse(data.fpictures)
                            }
                            return(
                                <div className="textBox" key={data.fid}> 
                                <p className="title"><i className="zjb zjb-bixutian icon"/>{data.ftitle}<Icon type="question-circle-o" className="icon p_icon"/></p>
                                <div className="text_">
                                  <TextArea style={{minHeight:200}} value={data.fcontent}/>
                                </div>
                                <div className="img">
                                  <ShowPicMultipleFile  value={arr}/>
                                </div>
                              </div>
                            )
                        })
                    }
                
                <Card type="inner" title="项目经营位置信息" style={{marginTop: 25}}>
                    <div id="container" style={{width:'100%',height: 400}}/>
                </Card>

            </Card>
          </div>
        )
    }
}