/*
 * @Author: wfl
 * @Date: 2018-07-05 11:48:42
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-12 14:20:31
 * 发放优惠券
 */
import React from 'react';
import {connect} from 'dva';
import './coupon.scss';
import {mineloan} from '../../../services/api';
import {IMG_BASE_URL,VER_PHONE} from '../../../common/SystemParam';
import UploadImg from '../../../components/imgupload/ImgUpload';
import {getYears, getMonths, getDays} from '../../personal/mineLoan/yearMonthDay/ymday';
import { Input, InputNumber, Row, Col, Select, message,Button , Radio, Spin} from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;

const year = getYears();
const month = getMonths();
@connect((state)=>({

}))
class SendCoupon extends React.Component{
    constructor(props){
        super(props);
        let y = Number.parseInt(new Date().getMonth() + 1) + 6 > 12 ? year[1] : year[0];
        let m = Number.parseInt(new Date().getMonth() + 7) > 12 ? Number.parseInt(new Date().getMonth() + 7) - 12 : Number.parseInt(new Date().getMonth() + 7);
        let day = Number.parseInt(new Date().getDate());
        this.state = {
            losedateErrin: false,//投资失效日期是否合法
            losedateErrver: false,//游客失效日期是否合法
            yerr: y,
            merr: m,
            dayerr: day,
            loading: false,
            ploading: false,
            saveAddress: [],
            radioChoose: -1,
            provnices: [],//省
            citys: [],//市
            areas: [],//区
            provnice: '',
            city: '',
            area: '',
            provnicena: '',
            cityna: '',
            areana: '',
            invest:{
                name: this.props.project.fname,
                value: 50,//面值
                rule: 150,//满150减？
                num:20,
                inrule: 500,//投资150发放一张
                year: y,
                month: m,
                day: day,
                imgsrc: '',
               
            },
            tourist:{
                name: this.props.project.fname,
                value: 30,//面值
                rule: 100,//满150减？
                num: 50,//多少张
                year: y,
                month: m,
                day: day,
                imgsrc: '',
            },
            deiladdress: [],
            phone: '',
            couponnum: 0,
            edit:false
        };
        this.data = {
            className: "ant-upload",
            type: "images/",
            divClassName: "upload-div",
            baseUrl: IMG_BASE_URL
          };
    }
    componentDidMount(){
        this.getProvince();
    }

    async getProvince(){
        this.setState({ploading: true})
        let res = await mineloan.getProvince();
        if(res.code === 0){
            this.setState({
                provnices: res.data,
                ploading: false
            })
        }else{
            message.error(res.msg)
            this.setState({ ploading: false})
        }
    }
    async getCity(id){
        this.setState({
            ploading: true
        })
        let data = {
            parentNo: id
        }
        let res = await mineloan.getCity(data);
        if(res.code === 0){
            this.setState({
                citys: res.data,
                ploading: false
            })
        }else{
            this.setState({
                ploading: false
            })
            message.error(res.msg)
        }
    }

    async getArea(id){
        this.setState({
            ploading: true
        })
        let data = {
            parentNo: id
        }
        let res = await mineloan.getArea(data);
        if(res.code === 0){
            this.setState({
                areas: res.data,
                ploading: false
            })
        }else{
            this.setState({
                ploading: false
            })
            message.error(res.msg)
        }
    }

    getLoseDate(data){
        let month = data.month > 9 ? data.month : '0'+data.month;
        let day = data.day > 9 ? data.day : '0'+data.day;
        return data.year + '-' + month + '-' + day;
    }

    async onChange(statu,val){
        await this.setState({
                    invest: {
                        ...this.state.invest,
                        imgsrc: val
                    } ,
                    tourist: {
                        ...this.state.tourist,
                        imgsrc: val
                    }              
                 })
    }

    async validateYear(val,statu){
        if(statu === 'invest'){
           if((val.year+val.month+val.day) < (this.state.yerr+this.state.merr+this.state.dayerr)){
              await this.setState({
                   losedateErrin: true
               })
           }else{
            await this.setState({
                losedateErrin: false
            })
           }
        }else{
            if((val.year+val.month+val.day) < (this.state.yerr+this.state.merr+this.state.dayerr)){
                await  this.setState({
                    losedateErrver: true
                })
            }else{
                await  this.setState({
                    losedateErrver: false
                })
            }
        }
    }

    async yearChange(val,statu){
        if(statu === 'invest'){
            await  this.setState({
                invest:{
                    ...this.state.invest,
                    year: val
                }
            })
            this.validateYear(this.state.invest, statu)
        }else{
            await  this.setState({
                tourist:{
                    ...this.state.tourist,
                    year: val
                }
            })
            this.validateYear(this.state.tourist, statu)
        }
    }
    async monthChange(val,statu){
        if(statu === 'invest'){
            await this.setState({
                invest:{
                    ...this.state.invest,
                    month: val
                }
            })
            this.validateYear(this.state.invest, statu)
        }else{
            await this.setState({
                tourist:{
                    ...this.state.tourist,
                    month: val
                }
            })
            this.validateYear(this.state.tourist, statu)
        }
    }
    async dayChange(val,statu){
        if(statu === 'invest'){
           await this.setState({
                invest:{
                    ...this.state.invest,
                    day: val
                }
            })
            this.validateYear(this.state.invest, statu)
        }else{
            await  this.setState({
                tourist:{
                    ...this.state.tourist,
                    day: val
                }
            })
            this.validateYear(this.state.tourist, statu)
        }
    }

    provniceChange(val){
        let data = this.state.provnices.filter((item) => item.fareaNo === val);
        this.setState({
            provnice: val,
            provnicena: data[0].fareaName,
            city: '',
            area: '',
            areas: []
        })
        if(data[0].ftypeName === '市'){
            this.setState({
                citys: data
            })
        }else{
            this.getCity(val);
        }
    }
    cityChange(val){
        let data = this.state.citys.filter((item) => item.fareaNo === val);
        this.setState({
            city: val,
            cityna: data[0].fareaName,
            area: '',
        })
        this.getArea(val)
    }
    areaChange(val){
        let data = this.state.areas.filter((item) => item.fareaNo === val);
        this.setState({
            area: val,
            areana:  data[0].fareaName,
        })
    }
    //保存
    saveCou(){
        let {invest, tourist, saveAddress, losedateErrin, losedateErrver} = this.state;
        let places = [];
        let citys = [];
        let lidu1 = invest.value / 0.1 >= invest.rule;
        let lidu2 = tourist.value / 0.1 >= tourist.rule;
        if(invest.value % 5 !== 0 || tourist.value % 5 !== 0 || losedateErrin || losedateErrver || !lidu1 || !lidu2){
            message.info('请正确填写优惠券信息')
            return
        }
        if(invest.value / invest.rule < tourist.value / tourist.rule){
            message.info('游客的优惠券力度不能大于投资人的优惠券力度，请修改游客优惠券的使用规则')
            return
        }
        if(invest.imgsrc === ''){
            message.info('请上传商家图片')
            return
        }
        if(saveAddress.length === 0){
            message.info('请选择地址并保存')
            return
        }
        if(tourist.num < 50){
            message.info('优惠券数量不能少于50张')
            return
        }
        saveAddress.map((item,index) =>{
            places.push({
                fprovince: item.provnicena,
                fcity: item.cityna,
                fdistrict: item.areana,
                fplace: item.deiladdress,
                fmobile: item.phone
            })
            citys.push(item.cityna)
        })
        let param = {
            investorCoupon:{
                    fname: invest.name,
                    finvMoney: invest.inrule,
                    ffullSubCondition: invest.rule,
                    ffullSubMoney: invest.value,
                    fprojectId: this.props.project.fid,
                    fendTime: new Date(`${invest.year}/${invest.month > 9 ? invest.month : '0' + invest.month}/${invest.day > 9 ? invest.day : '0'+invest.day}`),
                    flogoPic: invest.imgsrc,
                    fnumber: invest.num,//发放数量（类型为给游客时有）
                    fuserPlace: citys.toString(),
            },
            touristCoupon:{
                    fname: tourist.name,//优惠券名
                    flogoPic: tourist.imgsrc,
                    ffullSubCondition: tourist.rule,
                    ffullSubMoney: tourist.value, //满减金额(面值)
                    fprojectId: this.props.project.fid,//代金券发行项目
                    fendTime: new Date(`${tourist.year}/${tourist.month > 9 ? tourist.month : '0' + tourist.month}/${tourist.day > 9 ? tourist.day : '0'+tourist.day}`),
                    fuserPlace: citys.toString(),//使用地点
                    fnumber: tourist.num,//发放数量（类型为给游客时有）
                    // fsurplusNum: tourist.num,//剩余数量（类型为给游客时有）   
            }  ,
            couponUsePlaces: places,
            type:1    
        }
        this.toSaveCou(param);
    }
    async toSaveCou(data){
        if(this.state.loading){
           return
        }
        this.setState({loading: true})
        let res = await mineloan.saveCou(data);
        if(res.code === 0){
            this.setState({
                loading: false
            })
            this.props.close();
        }else{
            message.error(res.msg);
            this.setState({
                loading: false
            })
        }
    }

    async saveAddress(){
        let arr = [{
            provnice: this.state.provnice,
            provnicena: this.state.provnicena,
            city: this.state.city,
            cityna: this.state.cityna,
            area: this.state.area,
            areana: this.state.areana,
            deiladdress: this.state.deiladdress,
            phone: this.state.phone,
        }]
        if(arr[0].provnicena === '' || arr[0].cityna === '' ||  arr[0].areana === ''|| arr[0].deiladdress.trim().length < 6 || (!/^1\d{10}$/.test(arr[0].phone) && !/0\d{2,3}-\d{7,8}/.test(arr[0].phone))){
            message.info('请完善地址信息！');
            return
        }
        let arrs = this.state.saveAddress.length === 0 ? arr : [...this.state.saveAddress,...arr]
        this.setState({
            saveAddress: arrs
        },()=>{
            this.setState({
                provnice: '',
                provnicena: '',
                city: '',
                cityna: '',
                area: '',
                areana: '',
                deiladdress: [],
                phone: '',
            })  
        })
    }

    editAddress(index){
        let arr = this.state.saveAddress;
        let obj = arr[index];
        arr.splice(index,1)
        this.getCity(obj.provnice);
        this.getArea(obj.city);
        this.setState({
            provnice: obj.provnicena,
            provnicena: obj.provnicena,
            city: obj.cityna,
            cityna: obj.cityna,
            area: obj.areana,
            areana:obj.areana,
            deiladdress: obj.deiladdress,
            phone: obj.phone,
            saveAddress: arr,
            edit:true
        })
    }

    clearData(){
        if(this.state.edit){
            this.setState({
                edit:false
            })
        }    
    }

    render(){
        const {invest, tourist, address, deiladdress, phone, provnices, citys, areas, saveAddress, radioChoose} = this.state;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
          };
        let couCard = [];
        let provniceArr = [{fareaNo:this.state.provniceCode,fareaName:this.state.provnice}];  //回显的省份数组
        let cityArr = [{fareaNo:this.state.cityCode,fareaName:this.state.city}];
        let areaArr = [{fareaNo:this.state.areaCode,fareaName:this.state.area}];
        let radiogroup = [];
                couCard.push(<Col span={12} className="send-coupon1" key="invest">
                  <span className="num" style={{left:0}}>{this.props.project.fprojectNo}</span>
                        <p className="t-img">
                            <img className="t-imgs" src={require('../../personal/mineLoan/img/u1162.png')}/>
                        </p>
                        <span className="per-type">投资人</span>
                        <Row className="info">
                            <Col className="coupon-info" >
                                <p style={{color:'#ff3b35',textAlign:'left',marginTop:0}}>{invest.name}</p>
                                <p className="coupon-rule coupon-info-p">投资满{invest.inrule}发一张</p>
                                <div className="coupon-info-div">
                                    <p className="coupon-deno coupon-info-p">￥<span>{invest.value}</span>YUAN</p>
                                    <ul>
                                        <li>使用规则: 满{invest.rule}减{invest.value}</li>
                                        <li>失效日期: {this.getLoseDate(invest)}</li>
                                    </ul>
                                </div>
                                <div className="fr clearfix">
                                  <div className="">
                                    {/* <img  className="" src={require('../../../assets/img/logo-small.png')} /> */}
                                    <UploadImg {...this.data} prefix={'personal/'} tipText="" onChange={this.onChange.bind(this,'invest')} className="img"/>
                                  </div>
                                  <span style={{display:'block',position:'relative',top:-45,right:9,fontSize:10,color:'#fff'}}>上传商家图片</span>
                                  
                                </div>
                            </Col>
                            
                            <div className="send-form" >
                                <div className="send-form-div">
                                    <span className="fir-span">优惠券面值:</span>
                                    <Input className="form-item" value={invest.value}
                                            placeholder="请输入5的倍数"
                                        onChange={(e)=> this.setState({invest:{...invest,value: e.target.value}})}
                                        style={{display: 'inline-block',width: '200px'}} maxLength={5}/>
                                        <p className="error-imput">{invest.value % 5 === 0 ? '' : '请输入5的倍数！'}</p>
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">使用规则:</span>
                                    满 <InputNumber className="form-item" value={invest.rule} min={1} max={invest.value / 0.1}
                                                    onChange={(e)=> this.setState({invest:{...invest,rule: e}})} step={10}
                                                    style={{ marginLeft:'14px'}} maxLength={6}/>
                                    <span className="full-jie">满{invest.rule}减{invest.value}元</span>
                                    <p className="error-imput">{invest.value / 0.1 >= invest.rule ? '' : `优惠券力度不得小于10%，当前可填写最大金额不能超过${Number.parseInt(invest.value / 0.1)}元`}</p>
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">优惠券数量:</span>
                                   
                                    <Input style={{width:55}} value={this.props.projects.invCount ? this.props.projects.invCount : 0} disabled/> * <InputNumber  value={invest.num} onChange={(e)=> this.setState({invest:{...invest,num: e}})} min={1} max={9999} maxLength={7}/>
                                <p style={{paddingLeft:0,marginLeft:-20}}>优惠券数量{invest.num}张</p>
                                {/* <p className="error-imput">不能超过1000元</p> */}
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">失效日期:</span>
                                    <Select value={invest.year} showSearch style={{ width: 90 }} onChange={(e) => this.yearChange(e,'invest')}>
                                        {
                                            year.map((item,index) => {
                                                return <Option value={item} key={index}>{item}年</Option>
                                            })
                                        }
                                    </Select>
                                    <Select value={invest.month} showSearch style={{ width: 80, margin: '0 3px' }} onChange={(e) => this.monthChange(e,'invest')}>
                                        {
                                            month.map((item,index) => {
                                                return <Option value={item} key={index+ 'a'}>{item}月</Option>
                                            })
                                        }
                                    </Select>
                                    <Select value={invest.day} showSearch style={{ width: 80 }} onChange={(e) => this.dayChange(e,'invest')}>
                                        {
                                            getDays(invest.year+'-'+invest.month).map((item,index) => {
                                                return <Option value={item} key={index+ 'b'}>{item}日</Option>
                                            })
                                        }
                                    </Select>
                                    <p className="error-imput">{this.state.losedateErrin ? '优惠券有效期不能短于6个月' : '' }</p>
                                </div>
                            </div>
                        </Row>

                    </Col>)

                couCard.push(<Col className="send-coupon2" key="tourist">
                  
                    <span className="num" style={{left:0}}>{this.props.project.fprojectNo}</span>
                        <p  className="t-img">
                            <img className="t-imgs" src={require('../../personal/mineLoan/img/u1162.png')}/>
                        </p>
                    <span className="per-type">游客</span>
                    <Row className="info">
                        <Col className="coupon-info">
                            <p style={{color:'#ff3b35',textAlign:'left',marginTop:0}}>{invest.name}</p>
                            <p className="coupon-rule coupon-info-p">共{tourist.num}张</p>
                            <div className="coupon-info-div">
                                <p className="coupon-deno coupon-info-p">￥<span>{tourist.value}</span>YUAN</p>
                                <ul>
                                    <li>使用规则: 满{tourist.rule}减{tourist.value}元</li>
                                    <li>失效日期: {this.getLoseDate(tourist)}</li>
                                </ul>
                            </div>
                            <div className="fr clearfix">
                                  <div className="">
                                     <img  className="img" src={tourist.imgsrc ? IMG_BASE_URL+tourist.imgsrc : require('../../../assets/img/logo-small.png')} />
                                  </div>
                                </div>
                        </Col>
                
                        <div  className="send-form" >
                                <div className="send-form-div">
                                    <span className="fir-span">优惠券面值:</span>
                                    <Input className="form-item" value={tourist.value}
                                            placeholder="请输入5的倍数"
                                        onChange={(e)=> this.setState({tourist:{...tourist,value: e.target.value }})}
                                        style={{display: 'inline-block',width: '200px'}} maxLength={5}/>
                                        <p className="error-imput">{tourist.value % 5 === 0 ? '' : '请输入5的倍数！'}</p>
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">使用规则:</span>
                                    满 <InputNumber className="form-item" value={tourist.rule}  min={1} maxLength={6}
                                                    onChange={(e)=> this.setState({tourist:{...tourist,rule: e}})} step={10}
                                                    style={{ marginLeft:'14px'}}/>
                                    <span className="full-jie">满{tourist.rule}减{tourist.value}元</span>
                                    <p className="error-imput">{tourist.value / 0.1 >= tourist.rule ? '' : `优惠券力度不得小于10%，当前可填写最大金额不能超过${Number.parseInt(tourist.value / 0.1)}元`}</p>
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">优惠券数量:</span>
                                    <Input className="form-item" value={tourist.num}
                                            placeholder= "请输入优惠券数量"
                                        onChange={(e)=> this.setState({tourist:{...tourist,num: e.target.value}})}
                                        style={{display: 'inline-block',width: '123px'}} maxLength={4}/>
                                        <span style={{paddingLeft: '10px'}}>张</span>
                                        <p className="error-imput" style={{paddingLeft:85}}>{tourist.num >= 50 ? '' : '优惠券发放数量不能低于50张'}</p>
                                </div>
                                <div className="send-form-div" style={{marginTop:' 31px'}}>
                                    <span className="fir-span">失效日期:</span>
                                    <Select value={tourist.year} showSearch style={{ width: 90 }} onChange={(e) => this.yearChange(e,'tourist')}>
                                        {
                                            year.map((item,index) => {
                                                return <Option value={item} key={index+ 'c'}>{item}年</Option>
                                            })
                                        }
                                    </Select>
                                    <Select value={tourist.month} showSearch style={{ width: 80, margin: '0 8px' }} onChange={(e) => this.monthChange(e,'tourist')}>
                                        {
                                            month.map((item,index) => {
                                                return <Option value={item} key={index + 'd'}>{item}月</Option>
                                            })
                                        }
                                    </Select>
                                    <Select value={tourist.day} showSearch style={{ width: 80 }} onChange={(e) => this.dayChange(e,'tourist')}>
                                        {
                                            getDays(tourist.year+'-'+tourist.month).map((item,index) => {
                                                return <Option value={item} key={index + 'e'}>{item}日</Option>
                                            })
                                        }
                                    </Select>
                                    <p className="error-imput">{this.state.losedateErrver ? '优惠券有效期不能短于6个月' : '' }</p>
                                </div>
                            </div>
                    </Row>
                </Col>)

                couCard.push(
                    <div className="send-form-address">
                        <Spin spinning={this.state.ploading} >
                            <span className="fir-span">使用地址:</span>
                                    <Select value={this.state.provnice} showSearch style={{ width: 100,marginLeft:' 25px' }} onChange={(e) => this.provniceChange(e)} optionFilterProp="children" filterOption={(input, option) => option.props.children.indexOf(input) >= 0} notFoundContent='无匹配结果' onFocus={()=>this.clearData()}>
                                        {   this.state.edit ? 
                                            provniceArr.map((item,index) => {
                                                return <Option value={item.fareaNo} key={index+ 'f'}>{item.fareaName}</Option>
                                            }) :
                                            provnices.map((item,index) => {
                                                return <Option value={item.fareaNo} key={index+ 'f'}>{item.fareaName}</Option>
                                            })
                                        }
                                    </Select>
                                    <Select value={this.state.city} showSearch style={{ width: 100, margin: '0 3px' }}
                                            onChange={(e) => this.cityChange(e)} notFoundContent='' optionFilterProp="children" filterOption={(input, option) => option.props.children.indexOf(input) >= 0}  onFocus={()=>this.clearData()}>
                                        {
                                             this.state.edit ?
                                             cityArr.map((item,index) => {
                                                return <Option value={item.fareaNo} key={index+ 'g'}>{item.fareaName}</Option>
                                            }) :
                                            citys.map((item,index) => {
                                                return <Option value={item.fareaNo} key={index+ 'g'}>{item.fareaName}</Option>
                                            })
                                        }
                                    </Select>

                                    <Select showSearch value={this.state.area}  notFoundContent='' style={{ width: 100 }} onChange={(e) => this.areaChange(e)} optionFilterProp="children" filterOption={(input, option) => option.props.children.indexOf(input) >= 0} onFocus={()=>this.clearData()}>
                                        {
                                            this.state.edit ?
                                            areaArr.map((item,index) => {
                                                return <Option value={item.fareaNo} key={index+ 'h'}>{item.fareaName}</Option>
                                            }) :
                                            areas.map((item,index) => {
                                                return <Option value={item.fareaNo} key={index+ 'h'}>{item.fareaName}</Option>
                                            })
                                        }
                                    </Select>
                                <Input className="form-item" value={deiladdress}
                                        placeholder= "详细地址"
                                        onChange={(e)=> this.setState({deiladdress: e.target.value })}
                                        style={{display: 'inline-block',width: '180px',margin: '0 3px'}} onFocus={()=>this.clearData()}/>
                                <Input className="form-item" value={phone}
                                        placeholder= "联系电话"
                                        onChange={(e)=> this.setState({phone: e.target.value })}
                                        style={{display: 'inline-block',width: '123px'}} onFocus={()=>this.clearData()} maxLength={12}/>
                                        {
                                            saveAddress.length < 3 ? <a onClick={() => this.saveAddress()} className="save-address">+保存地址</a> : null
                                        }
                                
                                {
                                    deiladdress.length < 6  && deiladdress.length > 0? 
                                     <p className="error-imput" style={{paddingLeft: '82px'}}> 详细信息请具体到门牌号</p> : 
                                     (phone.length > 0 && !VER_PHONE.test(phone)&& !/0\d{2,3}-\d{7,8}/.test(phone)) ? 
                                     <p className="error-imput" style={{paddingLeft: '82px'}}>联系电话格式不正确</p> :
                                     <p className="error-imput" style={{paddingLeft: '82px'}}></p>
                                }
                        </Spin>
                    </div>
                )
                    {
                        saveAddress.map((item, index) =>{
                            radiogroup.push(
                            <Radio value={index} key={index} style={radioStyle}>
                                {`${item.provnicena}${item.cityna}${item.areana}${item.deiladdress}   ${item.phone}`}
                                {radioChoose === index ? <a className="edit-address" onClick={this.editAddress.bind(this,index)}>编辑</a> : ''}
                            </Radio>
                            )
                        })
                    }
        return(
          <div className="coupons_ ">
              <Row className="send-coupons" type="flex" justify="center">
                <Spin spinning={this.state.loading}>
                    {couCard}
                    <RadioGroup className="radio-group-coupon" onChange={(e) => this.setState({radioChoose: e.target.value})}>
                        {radiogroup}
                    </RadioGroup>
                    <div className="coupon-btn" style={{background:'#f0f0f0'}}>
                        <Button onClick={() => this.saveCou()} >发放</Button>
                    </div>
                </Spin>
              </Row>
          </div>
           
        )
    }
}

export default SendCoupon;
