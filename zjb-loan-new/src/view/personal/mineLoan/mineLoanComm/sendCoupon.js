/*
 * @Author: wfl
 * @Date: 2018-07-05 11:48:42
 * @Last Modified by: wfl
 * @Last Modified time: 2018-08-02 10:40:49
 * 发放优惠券
 */
import React from 'react';
import {connect} from 'dva';
import './sendcoupon.scss';
import {mineloan} from '../../../../services/api';
import {IMG_BASE_URL} from '../../../../common/SystemParam';
import UploadImg from '../../../../components/imgupload/ImgUpload';
import {getYears, getMonths, getDays, checkTime} from '../yearMonthDay/ymday';
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
        this.state = {
            losedateErrin: false,//投资失效日期是否合法
            losedateErrver: false,//游客失效日期是否合法
            isSave: false, //是否以保存
            haveAddress: false,
            couponUsePlaces: [],//返回的地址
            loading: false,
            ploading: false,
            saveAddress: [],
            radioChoose: -1,
            provnices: [],//省
            citys: [],//市
            areas: [],//区
            provnice: null,
            city: null,
            area: null,
            provnicena: '',
            cityna: '',
            areana: '',
            invest:{
                name: this.props.coudata.fname,
                value: '',//面值
                rule: '',//满150减？
                inrule: '',//投资150发放一张
                year: '',
                month: '',
                day: '',
                imgsrc: '',
            },
            tourist:{
                name: this.props.coudata.fname,
                value: '',//面值
                rule: '',//满150减？
                num: '',//多少张
                year: '',
                month: '',
                day: '',
                imgsrc: '',
            },
            deiladdress: '',
            phone: '',
            couponnum: 0,
            id:null,  //保存修改id
            id_:null,
            edit:false,
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
        this.setState({
            ploading: true
        })
        let res = await mineloan.getProvince();
        if(res.code === 0){
            this.setState({
                provnices: res.data,
                ploading: false
            })
        }else{
            message.error(res.msg)
            this.setState({
                ploading: false
            })
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
                    },
                    tourist: {
                        ...this.state.tourist,
                        imgsrc: val
                    }
                 })
    }

    async validateYear(val,statu){
        let endtime = val.year+'-'+val.month+'-'+val.day
        if(!checkTime(endtime)){
            if(statu === 'invest'){
                await this.setState({
                    losedateErrin: true
                })
            }else{
                    await  this.setState({
                        losedateErrver: true
                    })
            }
        }else{
            if(statu === 'invest'){
                await this.setState({
                    losedateErrin: false
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
    saveCou(fn){
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
        if(invest.imgsrc === '' || tourist.imgsrc === ''){
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
                fprojectId: this.props.coudata.fid,
                fendTime: new Date(`${invest.year}-${invest.month > 9 ? invest.month : '0' + invest.month}-${invest.day > 9 ? invest.day : '0'+invest.day}`),
                flogoPic: invest.imgsrc,
                fuserPlace: citys.toString(),
                fid:this.state.id,
            },
            touristCoupon:{
                fname: tourist.name,//优惠券名
                ffullSubCondition: tourist.rule,
                ffullSubMoney: tourist.value, //满减金额(面值)
                fprojectId: this.props.coudata.fid,//代金券发行项目
                fendTime: new Date(`${tourist.year}-${tourist.month > 9 ? tourist.month : '0' + tourist.month}-${tourist.day > 9 ? tourist.day : '0'+tourist.day}`),
                flogoPic: tourist.imgsrc,//企业logo
                fuserPlace: citys.toString(),//使用地点
                fnumber: tourist.num,//发放数量（类型为给游客时有）
                fsurplusNum: tourist.num,//剩余数量（类型为给游客时有）
                fid:this.state.id_
            },
            couponUsePlaces: places,
            type:0 
        }
        this.toSaveCou(param,fn);
    }
    //保存
    async toSaveCou(data,fn){
        this.setState({
            loading: true
        })
        let res = await mineloan.saveCou(data);
        if(res.code === 0){
            this.setState({
                loading: false
            })
            fn && fn();
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
            projectId: this.props.coudata.fid
        }
        let res = await mineloan.getSendCou(data);
        if(res.code === 0){
            if(res.data.length > 0){
                let arr = [];
                for(let i of res.data[0].couponUsePlaces){
                    arr.push({
                        provnice: '',
                        city: '',
                        area: '',
                        provnicena: i.fprovince,
                        cityna: i.fcity,
                        areana: i.fdistrict,
                        deiladdress: i.fplace,
                        phone: i.fmobile,
                    })
                }
                this.setState({
                    isSave: true,
                    id: res.data[0].couponId,
                    id_:res.data[1].couponId,
                    // couponUsePlaces:[{
                    //     fprovince: res.data[0].fprovince,
                    //     fcity: res.data[0].fcity,
                    //     fdistrict: res.data[0].fdistrict,
                    //     fplace: res.data[0].fplace,
                    //     fmobile: res.data[0].fmobile
                    // }],
                    address:res.data[0].userPlace,
                    saveAddress: arr,
                    invest:{
                        name: this.props.coudata.fname,
                        value: res.data[0].fullSubMoney,//面值
                        inrule: res.data[0].invMoney ? res.data[0].invMoney : 0 ,//投资150发放一张
                        rule: res.data[0].fullSubCondition,//满减？
                        // num: res.data[0].couponNum ? res.data[0].couponNum : 50,//多少张
                        year: new Date(res.data[0].endTime).getFullYear(),
                        month: new Date(res.data[0].endTime).getMonth() + 1,
                        day: new Date(res.data[0].endTime).getDate(),
                        imgsrc:  res.data[0].logo,
                    },
                    tourist:{
                        name: this.props.coudata.fname,
                        value: res.data[1].fullSubMoney,//面值
                        rule: res.data[1].fullSubCondition,//满减？
                        // inrule: res.data[1].invMoney ? res.data[1].invMoney : 0 ,//投资150发放一张
                        num: res.data[0].couponNum ? res.data[0].couponNum : 50,//多少张
                        year: new Date(res.data[1].endTime).getFullYear(),
                        month: new Date(res.data[1].endTime).getMonth() + 1,
                        day: new Date(res.data[1].endTime).getDate(),
                        imgsrc: res.data[1].logo,
                    },
                })
            }
        }else{
            message.error(res.msg);
        }
    }

    //提交
    async commitCou(){
        let data = {
            projectId: this.props.coudata.fid,
            remark: '',
            isPass: ''
        }
        this.setState({
            loading: true
        })
        console.log('保存了')
        let res = await mineloan.commitCou(data);
        if(res.code === 0){
            this.setState({
                loading: false
            })
            this.props.dispatch({
                type: 'mineloan/getMineLoan',
                payload: ''
            })
        }else{
            message.error(res.msg);
            this.setState({
                loading: false
            })
        }
    }

    //保存地址
    async saveAddress(){
        console.log(this.state.provnice);
        if(this.state.provnice === '' || this.state.city === '' || this.state.area === '' || this.state.deiladdress.trim().length < 6  || (!/^1\d{10}$/.test(this.state.phone) && !/0\d{2}-\d{7,8}/.test(this.state.phone))){
            message.info('请完善地址信息！');
            return;
        }
        let arr = [{
            provnice: this.state.provnice,
            provnicena: this.state.edit ? this.state.provnice : this.state.provnicena,
            city: this.state.city,
            cityna: this.state.edit ? this.state.city : this.state.cityna,
            area: this.state.area,
            areana: this.state.edit ? this.state.area : this.state.areana,
            deiladdress: this.state.deiladdress,
            phone: this.state.phone,
        }]
        this.setState({
            couponUsePlaces: []
        })
        let arrs = this.state.saveAddress.length === 0 ? arr : [...this.state.saveAddress,...arr]
        await this.setState({
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
                Phone:''
            })  
        })
    }

    editAddress(index){
            let arr = this.state.saveAddress;
            this.setState({
                deiladdress:arr[index].deiladdress,
                phone:arr[index].phone,
                provnice:arr[index].provnicena,
                area:arr[index].areana,
                city:arr[index].cityna,
                edit:true
            })
            if(arr[index].provnice === ''){
                arr.splice(index,1);
                this.setState({
                    saveAddress: arr
                })
                return;
            }else{
                let obj = arr[index];
                arr.splice(index,1);
                this.getCity(obj.provnice);
                this.getArea(obj.city);
                this.setState({
                    ...obj,
                    saveAddress: arr
                })
            }
    }

    clearData(){
        if(this.state.edit){
            this.setState({
                provnice:'',
                city:'',
                area:'',
                Address:'',
                Phone:'',
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
        let provniceArr = [{fareaNo:this.state.Provnice,fareaName:this.state.Provnice}];  //回显的省份数组
        let cityArr = [{fareaNo:this.state.City,fareaName:this.state.City}];
        let areaArr = [{fareaNo:this.state.Area,fareaName:this.state.Area}];
        let radiogroup = [];
                couCard.push(<Col span={12} className="send-coupon1" key="invest">
                  <span className="num">{this.props.coudata.fproject_no}</span>
                        <p className="t-img">
                            <img className="t-imgs" src={require('../img/u1162.png')}/>
                        </p>
                        <span className="per-type">投资人</span>
                        <Row className="info">
                            <Col span={16} className="coupon-info">
                                <p className="coupon-name coupon-info-p" style={{fontSize:14}}>{invest.name}</p>
                                <p className="coupon-rule coupon-info-p" style={{fontSize:12}}>投资满{invest.inrule}发一张</p>
                                <div className="coupon-info-div">
                                    <p className="coupon-deno coupon-info-p">￥<span>{invest.value}</span>YUAN</p>
                                    <ul>
                                        <li style={{fontSize:10}}>使用规则: 满{invest.rule}减{invest.value}</li>
                                        <li style={{fontSize:10}}>失效日期: {this.getLoseDate(invest)}</li>
                                        <li style={{fontSize:10}}>使用地址: {this.state.saveAddress.length> 0 ? this.state.saveAddress.map(item => item.cityna).join('、') : '' }</li>
                                    </ul>
                                </div>
                            </Col>
                            <Col span={8} className="business-img">
                                {/* <div className="sj-logo"> */}
                                    <UploadImg {...this.data} prefix={'personal/'} value={invest.imgsrc !== '' ? invest.imgsrc : ''} tipText="上传商家图片" onChange={this.onChange.bind(this,'invest')}/>
                                {/* </div> */}
                            </Col>
                            <div className="send-form" style={{marginTop: 175}}>
                                <div className="send-form-div">
                                    <span className="fir-span">优惠券面值:</span>
                                    <Input className="form-item" value={invest.value}
                                            placeholder= "请输入5的倍数"
                                        onChange={(e)=> this.setState({invest:{...invest,value: e.target.value}})}
                                        style={{display: 'inline-block',width: '200px'}} maxLength={6}/>
                                        <p className="error-imput">{invest.value % 5 === 0 ? '' : '请输入5的倍数！'}</p>
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">使用规则:</span>
                                    满 <InputNumber className="form-item" value={invest.rule} min={0} max={invest.value / 0.1}
                                                    onChange={(e)=> this.setState({invest:{...invest,rule: e}})} step={10}
                                                    style={{ marginLeft:'14px'}} maxLength={6}/>
                                    <span className="full-jie">满{invest.rule}减{invest.value}元</span>
                                    <p className="error-imput">{invest.value / 0.1 >= invest.rule ? '' : `优惠券力度不得小于10%，当前可填写最大金额不能超过${Number.parseInt(invest.value / 0.1)}元`}</p>
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">优惠券数量:</span>
                                    投资 <InputNumber className="form-item" value={invest.inrule} min={0} max={9999} maxLength={4}
                                                    onChange={(e)=> this.setState({invest:{...invest,inrule: e}})} step={10}
                                                    />
                                    <span className="full-ff">元发放1张优惠券</span>
                                    <p>  </p>
                                {/* <p className="error-imput">不能超过1000元</p> */}
                                </div>
                                <div className="send-form-div"  style={{ marginTop: 0}}>
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
                    <span className="num">{this.props.coudata.fproject_no}</span>
                        <p  className="t-img">
                            <img className="t-imgs" src={require('../img/u1162.png')}/>
                        </p>
                    <span className="per-type">游客</span>
                    <Row className="info">
                        <Col span={16} className="coupon-info">
                            <p className="coupon-name coupon-info-p" style={{fontSize:14}}>{tourist.name}</p>
                            <p className="coupon-rule coupon-info-p" style={{fontSize:12}}>共{tourist.num}张</p>
                            <div className="coupon-info-div">
                                <p className="coupon-deno coupon-info-p">￥<span>{tourist.value}</span>YUAN</p>
                                <ul>
                                    <li style={{fontSize:10}}>使用规则: 满{tourist.rule}减{tourist.value}元</li>
                                    <li style={{fontSize:10}}>失效日期: {this.getLoseDate(tourist)}</li>
                                    <li style={{fontSize:10}}>使用地址:  {this.state.saveAddress.length> 0 ? this.state.saveAddress.map(item => item.cityna).join('、') : '' }</li>
                                </ul>
                            </div>
                        </Col>
                        <Col span={8} className="business-img">
                            <div className="img-BOX">
                                <img  className="img" src={tourist.imgsrc ? IMG_BASE_URL + tourist.imgsrc : require('../../../../assets/img/logo-small.png')} />
                            </div>        
                        </Col>
                        <div  className="send-form" style={{marginTop: 175}}>
                                <div className="send-form-div">
                                    <span className="fir-span">优惠券面值:</span>
                                    <Input className="form-item" value={tourist.value}
                                            placeholder= "请输入5的倍数"
                                        onChange={(e)=> this.setState({tourist:{...tourist,value: e.target.value }})}
                                        style={{display: 'inline-block',width: '200px'}} maxLength={6}/>
                                        <p className="error-imput">{tourist.value % 5 === 0 ? '' : '请输入5的倍数！'}</p>
                                </div>
                                <div className="send-form-div">
                                    <span className="fir-span">使用规则:</span>
                                    满 <InputNumber className="form-item" value={tourist.rule}  min={0} maxLength={6}
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
                                        <p className="error-imput">{tourist.num >= 50 ? '' : '优惠券发放数量不能低于50张'}</p>
                                </div>
                                <div className="send-form-div">
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
                                        {
                                            this.state.edit ?
                                            provniceArr.map((item,index) => {
                                                return <Option value={item.fareaNo} key={index+ 'f'}>{item.fareaName}</Option>
                                            }): 
                                            provnices.map((item,index) => {
                                                return <Option value={item.fareaNo} key={index+ 'f'}>{item.fareaName}</Option>
                                            })
                                        }
                                    </Select>
                                    <Select value={this.state.city} showSearch style={{ width: 100, margin: '0 3px' }}
                                            onChange={(e) => this.cityChange(e)} notFoundContent='' optionFilterProp="children" filterOption={(input, option) => option.props.children.indexOf(input) >= 0} onFocus={()=>this.clearData()}>
                                        {
                                            this.state.edit ?
                                            cityArr.map((item,index) => {
                                                return <Option value={item.fareaNo} key={index+ 'g'}>{item.fareaName}</Option>
                                            }):
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
                                <Input className="form-item" value={deiladdress }
                                        placeholder= "详细地址"
                                        onChange={(e)=> this.setState({deiladdress: e.target.value })}
                                        style={{display: 'inline-block',width: '310px',margin: '0 3px'}} onFocus={()=>this.clearData()}/>
                                <Input className="form-item" value={phone }
                                        placeholder= "联系电话"
                                        onChange={(e)=> this.setState({phone: e.target.value })}
                                        style={{display: 'inline-block',width: '123px'}} onFocus={()=>this.clearData()}/>
                                        {
                                            saveAddress.length < 3 ?  <a onClick={() => this.saveAddress()} className="save-address">+保存地址</a> : null
                                        }
                               
                                {
                                    deiladdress.length < 6  && deiladdress.length > 0? 
                                     <p className="error-imput" style={{paddingLeft: '82px'}}> 详细信息请具体到门牌号</p> : 
                                     (phone.length > 0 && !/^1\d{10}$/.test(phone) && !/0\d{2}-\d{7,8}/.test(phone)) ? 
                                     <p className="error-imput" style={{paddingLeft: '82px'}}>联系电话格式不正确</p> :
                                     <p className="error-imput" style={{paddingLeft: '82px'}}></p>
                                }
                        </Spin>
                    </div>
                )
                  
                        saveAddress.map((item, index) =>{
                            radiogroup.push(
                            <Radio value={index} key={index} style={radioStyle}>
                                {`${item.provnicena}${item.cityna}${item.areana}${item.deiladdress}   ${item.phone}`}
                                {radioChoose === index ? <a className="edit-address" onClick={this.editAddress.bind(this,index)}>编辑</a> : ''}
                            </Radio>
                            )
                        })
                 
        return(
            <Row className="send-coupon" type="flex" justify="center">
            <Spin spinning={this.state.loading}>
                {couCard}
                <RadioGroup className="radio-group-coupon" onChange={(e) => this.setState({radioChoose: e.target.value})}>
                    {radiogroup}
                </RadioGroup>
                <div className="coupon-btn">
                    <Button onClick={() => this.saveCou()} style={{margin: '0 8px'}}>保存</Button>
                    <Button type="primary" onClick={() => this.saveCou(this.commitCou.bind(this))}>提交</Button>
                </div>
            </Spin>
            </Row>
        )
    }
}

export default SendCoupon;
