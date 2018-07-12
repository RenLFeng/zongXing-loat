import React from 'react';
import { Form, Input,InputNumber , Button, Select, Radio, DatePicker,Cascader, Spin,Checkbox,Row, Col,Upload, Icon, message } from 'antd';
import {city} from '../../../common/cityData.js'
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['广东省深圳市南山区沙河路XX大厦详细地址  18682056589', '上海浦东新区江江高科XX大厦详细地址  15174698544', '北京海淀区XX某详细地址  13174695545'];
export default class Coupon extends React.Component {

  filter = (inputValue, path) => {
    return (path.some(city => (city.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
  };

  render(){
    return(
      <div>
        <div className="send-coupon-info fl">
          <p className="top-bg"><span>投资人</span></p>
          <div className="coupon-info clearfix">
            <div className="fl">
              <p className="tit">美丽人生现金优惠券</p>
              <p className="t2">投资满150元发一张</p>
              <div>
                <p className="money">￥<span>50</span>元</p>
                <p className="ins">
                  <i>使用规则：满150减50</i>
                  <i>失效日期：2018-07-30</i>
                </p>
              </div>
            </div>
            <div className="fr clearfix">
              <div className="">
                <img  className="" src={require('../../../assets/img/logo-small.png')} />
              </div>
            </div>
          </div>
          <Form>
            <FormItem
              label="优惠券面值："
              >
              <Input placeholder="请输入5的倍数" />
            </FormItem>
            <FormItem
              label="使用规则："
              >
              满<InputNumber min={150} defaultValue={150} style={{marginLeft:'10px'}}/><span className="dec">满150减50元</span>
            </FormItem>
            <FormItem
              label="优惠券数量："
              >
              <Input defaultValue={5} style={{width:'45px',textAlign:'center'}} />*
              <InputNumber min={5} max={20} defaultValue={5}/>
            </FormItem>
            <FormItem
              label="" className="how"
              >
              <Input defaultValue={'优惠券数量666张'} style={{width:'90%',textAlign:'center',color:'#f90',border:'none'}} />
            </FormItem>
            <FormItem
              label="失效日期："
              >
            </FormItem>
          </Form>
        </div>








        <div className="send-coupon-info fl">
          <p className="top-bg"><span style={{marginLeft:'-18px'}}>游客</span></p>
          <div className="coupon-info clearfix">
            <div className="fl">
              <p className="tit">美丽人生现金优惠券</p>
              <p className="t2">共100张</p>
              <div>
                <p className="money">￥<span>50</span>元</p>
                <p className="ins">
                  <i>使用规则：满150减50</i>
                  <i>失效日期：2018-07-30</i>
                </p>
              </div>
            </div>
            <div className="fr clearfix">
              <div className="">
                <img  className="" src={require('../../../assets/img/logo-small.png')} />
              </div>
            </div>
          </div>
          <Form>
            <FormItem
              label="优惠券面值："
              >
              <Input placeholder="请输入5的倍数" />
            </FormItem>
            <FormItem
              label="使用规则："
              >
              满<InputNumber min={150} defaultValue={150} style={{marginLeft:'10px'}}/><span className="dec">满150减50元</span>
            </FormItem>
            <FormItem
              label="优惠券数量："
              >
              <Input defaultValue={5} style={{width:'100px',textAlign:'center'}} />张
            </FormItem>
            <FormItem
              label="" className="how"
              >
              <Input defaultValue={''} style={{width:'90%',textAlign:'center',color:'#f90',border:'none'}} />
            </FormItem>
            <FormItem
              label="失效日期："
              >
            </FormItem>
          </Form>
        </div>
        <div className="adds">
          <FormItem
            label="使用地址:"
            >
            <Cascader options={city} placeholder={'请选择'} showSearch={this.filter} notFoundContent={'无匹配项'}/>
            <Input placeholder="详细地址" />
            <Input placeholder="联系电话" />
            <a>保存地址</a>
          </FormItem>
          <FormItem>
            <CheckboxGroup options={plainOptions} />
          </FormItem>
        </div>
      </div>
    )}
}
