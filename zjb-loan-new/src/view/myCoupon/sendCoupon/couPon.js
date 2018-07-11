import React from 'react';
import { Form, Input,InputNumber , Button, Select, Radio, DatePicker, Cascader, Spin,Checkbox,Row, Col,Upload, Icon, message } from 'antd';

const FormItem = Form.Item;
export default class Coupon extends React.Component {

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
              <Input placeholder="5" style={{width:'45px',textAlign:'center'}} />*
              <InputNumber min={5} max={20} defaultValue={5}/>
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
              <Input placeholder="5" style={{width:'45px',textAlign:'center'}} />*
              <InputNumber min={5} max={20} defaultValue={5}/>
            </FormItem>
          </Form>
        </div>
      </div>
    )}
}
