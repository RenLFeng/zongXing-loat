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
import {IMG_BASE_URL} from '../../../common/SystemParam';
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
                num: 100,//多少张
                year: y,
                month: m,
                day: day,
                imgsrc: '',
            },
            deiladdress: [],
            phone: '',
            couponnum: 0,
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
        this.getSendCou();
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
        if(statu === 'invest'){
           await this.setState({
                invest: {
                    ...this.state.invest,
                    imgsrc: val
                }
               
             },()=>{ console.log('000000000000000000000000000000',this.state.invest.imgsrc)})
        }else{
            await this.setState({
                tourist: {
                    ...this.state.tourist,
                    imgsrc: val
                }
             })
        }
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
        let data = {
            cashCoupon:{
                fname: invest.name,
                ftype: 1,
                finvMoney: invest.inrule,
                ffullSubCondition: invest.rule,
                ffullSubMoney: invest.value,
                // fprojectId: this.props.fid,
                fprojectId: '50616b665fc440aeb1d6cbe659b7e428',
                fendTime: new Date(`${invest.year}-${invest.month > 9 ? invest.month : '0' + invest.month}-${invest.day > 9 ? invest.day : '0'+invest.day}`),
                flogoPic: invest.imgsrc,
                fnumber: invest.num,//发放数量（类型为给游客时有）
                fuserPlace: citys.toString(),
            },
            couponUsePlaces: places
        }
        let datas = {
            cashCoupon:{
                fname: tourist.name,//优惠券名
                ftype: 2,//类型1.给投资者，2.给游客
                ffullSubCondition: tourist.rule,
                ffullSubMoney: tourist.value, //满减金额(面值)
                // fprojectId: this.props.fid,//代金券发行项目
                fprojectId: '50616b665fc440aeb1d6cbe659b7e428',
                fendTime: new Date(`${tourist.year}-${tourist.month > 9 ? tourist.month : '0' + tourist.month}-${tourist.day > 9 ? tourist.day : '0'+tourist.day}`),
                fuserPlace: citys.toString(),//使用地点
                fnumber: tourist.num,//发放数量（类型为给游客时有）
                fsurplusNum: tourist.num,//剩余数量（类型为给游客时有）
            },
            couponUsePlaces: places
        }
        this.toSaveCou(data);
        this.toSaveCou(datas);
    }
    async toSaveCou(data){
        this.setState({
            loading: true
        })
        let res = await mineloan.saveCou(data);
        console.log('youhiuiuiuiusd111111111111',res)
        if(res.code === 0){
            this.setState({
                loading: false
            })
        }else{
            message.error(res.msg);
            this.setState({
                loading: false
            })
        }
    }
    //获取
    async getSendCou(){
        let data = {
            // projectId: this.props.coudata.fid
            projectId:'50616b665fc440aeb1d6cbe659b7e428'
        }
        let res = await mineloan.getSendCou(data);
        if(res.code === 0){

        }else{
            message.error(res.msg);
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
        console.log('地址',arr)
        let arrs = this.state.saveAddress.length === 0 ? arr : [...this.state.saveAddress,...arr]
        await this.setState({
            saveAddress: arrs
        })
    }

    editAddress(index){
        let arr = this.state.saveAddress;
        let obj = arr[index];
        arr.splice(index,1)
        this.getCity(obj.provnice);
        this.getArea(obj.city);
        this.setState({
            provnice: obj.provnice,
            city: obj.city,
            area: obj.area,
            deiladdress: obj.deiladdress,
            phone: obj.phone,
            saveAddress: arr
        },()=>{

        })
    }

    change(value){
      console.log('value',value)
    }
    render(){
        console.log('props',this.props)
        const {invest, tourist, address, deiladdress, phone, provnices, citys, areas, saveAddress, radioChoose} = this.state;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
          };
        let couCard = [];
        let radiogroup = [];
                couCard.push(<Col span={12} className="send-coupon1" key="invest">
                  <span className="num">123456</span>
                        <p className="t-img">
                            <img className="t-imgs" src={require('../../personal/mineLoan/img/u1162.png')}/>
                        </p>
                        <span className="per-type">投资人</span>
                        <Row className="info">
                            <Col className="coupon-info" >
                                <p style={{color:'#ff3b35',textAlign:'left',marginTop:0}}>{invest.name}</p>
                                <p className="coupon-name coupon-info-p">{invest.name}</p>
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
                                  <span style={{display:'block',position:'relative',top:-30,right:9,fontSize:10,color:'#fff'}}>上传商家图片</span>
                                  
                                </div>
                            </Col>
                           

                            
                            <div className="send-form" >
                                <div className="send-form-div">
                                    <span className="fir-span">优惠券面值:</span>
                                    <Input className="form-item" value={invest.value}
                                            placeholder="请输入5的倍数"
                                        onChange={(e)=> this.setState({invest:{...invest,value: e.target.value}})}
                                        style={{display: 'inline-block',width: '200px'}}/>
                                        <p className="error-imput">{invest.value % 5 === 0 ? '' : '请输入5的倍数！'}</p>
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">使用规则:</span>
                                    满 <InputNumber className="form-item" value={invest.rule} min={0} max={invest.value / 0.1}
                                                    onChange={(e)=> this.setState({invest:{...invest,rule: e}})} step={10}
                                                    style={{ marginLeft:'14px'}}/>
                                    <span className="full-jie">满{invest.rule}减{invest.value}元</span>
                                    <p className="error-imput">{invest.value / 0.1 >= invest.rule ? '' : `优惠券力度不得小于10%，当前可填写最大金额不能超过${Number.parseInt(invest.value / 0.1)}元`}</p>
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">优惠券数量:</span>
                                    {/* 投资 <InputNumber className="form-item" value={invest.inrule} min={0} max={1000}
                                                    onChange={(e)=> this.setState({invest:{...invest,inrule: e}})} step={10}
                                                    />
                                    <span className="full-ff">元发放1张优惠券</span> */}
                                    <Input style={{width:55}} value={this.props.project.invCount ? this.props.project.invCount : 0} disabled/> * <InputNumber  value={invest.num} onChange={(e)=> this.setState({invest:{...invest,num: e}},()=>{console.log(this.state.invest.num)})} />
                                <p style={{paddingLeft:0,marginLeft:-20}}>优惠券数量{invest.num}张</p>
                                {/* <p className="error-imput">不能超过1000元</p> */}
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">失效日期:</span>
                                    <Select defaultValue={invest.year} showSearch style={{ width: 90 }} onChange={(e) => this.yearChange(e,'invest')}>
                                        {
                                            year.map((item,index) => {
                                                return <Option value={item} key={index}>{item}年</Option>
                                            })
                                        }
                                    </Select>
                                    <Select defaultValue={invest.month} showSearch style={{ width: 80, margin: '0 3px' }} onChange={(e) => this.monthChange(e,'invest')}>
                                        {
                                            month.map((item,index) => {
                                                return <Option value={item} key={index+ 'a'}>{item}月</Option>
                                            })
                                        }
                                    </Select>
                                    <Select defaultValue={invest.day} showSearch style={{ width: 80 }} onChange={(e) => this.dayChange(e,'invest')}>
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
                  
                    <span className="num">123456</span>
                        <p  className="t-img">
                            <img className="t-imgs" src={require('../../personal/mineLoan/img/u1162.png')}/>
                        </p>
                    <span className="per-type">游客</span>
                    <Row className="info">
                        <Col className="coupon-info">
                            <p style={{color:'#ff3b35',textAlign:'left',marginTop:0}}>{invest.name}</p>
                            <p className="coupon-name coupon-info-p">{tourist.name}</p>
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
                                     <img  className="img" src={require('../../../assets/img/logo-small.png')} />
                                  </div>
                                </div>
                        </Col>
                
                        <div  className="send-form" >
                                <div className="send-form-div">
                                    <span className="fir-span">优惠券面值:</span>
                                    <Input className="form-item" value={tourist.value}
                                            placeholder="请输入5的倍数"
                                        onChange={(e)=> this.setState({tourist:{...tourist,value: e.target.value }})}
                                        style={{display: 'inline-block',width: '200px'}}/>
                                        <p className="error-imput">{tourist.value % 5 === 0 ? '' : '请输入5的倍数！'}</p>
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">使用规则:</span>
                                    满 <InputNumber className="form-item" value={tourist.rule}  min={0} max={1000}
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
                                        style={{display: 'inline-block',width: '123px'}}/>
                                        <span style={{paddingLeft: '10px'}}>张</span>
                                        <p className="error-imput" style={{paddingLeft:85}}>{tourist.num >= 50 ? '' : '优惠券发放数量不能低于50张'}</p>
                                </div>
                                <div className="send-form-div" style={{marginTop:' 31px'}}>
                                    <span className="fir-span">失效日期:</span>
                                    <Select defaultValue={tourist.year} showSearch style={{ width: 90 }} onChange={(e) => this.yearChange(e,'tourist')}>
                                        {
                                            year.map((item,index) => {
                                                return <Option value={item} key={index+ 'c'}>{item}年</Option>
                                            })
                                        }
                                    </Select>
                                    <Select defaultValue={tourist.month} showSearch style={{ width: 80, margin: '0 8px' }} onChange={(e) => this.monthChange(e,'tourist')}>
                                        {
                                            month.map((item,index) => {
                                                return <Option value={item} key={index + 'd'}>{item}月</Option>
                                            })
                                        }
                                    </Select>
                                    <Select defaultValue={tourist.day} showSearch style={{ width: 80 }} onChange={(e) => this.dayChange(e,'tourist')}>
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
                                    <Select value={this.state.provnice} showSearch style={{ width: 100,marginLeft:' 25px' }} onChange={(e) => this.provniceChange(e)}>
                                        {
                                            provnices.map((item,index) => {
                                                return <Option value={item.fareaNo} key={index+ 'f'}>{item.fareaName}</Option>
                                            })
                                        }
                                    </Select>
                                    <Select value={this.state.city} showSearch style={{ width: 100, margin: '0 3px' }}
                                            onChange={(e) => this.cityChange(e)} notFoundContent=''>
                                        {
                                            citys.map((item,index) => {
                                                return <Option value={item.fareaNo} key={index+ 'g'}>{item.fareaName}</Option>
                                            })
                                        }
                                    </Select>

                                    <Select showSearch value={this.state.area}  notFoundContent='' style={{ width: 100 }} onChange={(e) => this.areaChange(e)}>
                                        {
                                            areas.map((item,index) => {
                                                return <Option value={item.fareaNo} key={index+ 'h'}>{item.fareaName}</Option>
                                            })
                                        }
                                    </Select>
                                <Input className="form-item" value={deiladdress}
                                        placeholder= "详细地址"
                                        onChange={(e)=> this.setState({deiladdress: e.target.value })}
                                        style={{display: 'inline-block',width: '180px',margin: '0 3px'}}/>
                                <Input className="form-item" value={phone}
                                        placeholder= "联系电话"
                                        onChange={(e)=> this.setState({phone: e.target.value })}
                                        style={{display: 'inline-block',width: '123px'}}/>
                                <a onClick={() => this.saveAddress()} className="save-address">+保存地址</a>
                                <p className="error-imput" style={{paddingLeft: '82px'}}>{deiladdress.length < 6 ? '详细信息请具体到门牌号' : (!/^1\d{10}$/.test(phone) && !/0\d{2}-\d{7,8}/.test(phone)) ? '联系电话格式不正确' : '' }</p>
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
                        <Button onClick={() => this.saveCou()} >保存</Button>
                    </div>
                </Spin>
              </Row>
          </div>
           
        )
    }
}

export default SendCoupon;
