import React from 'react';
import $ from 'jquery';
import LeftMenu from '../../components/leftmenu/leftMenu';
import SeeCoupon from './seeCoupon/seeCoupon.js';
import SendCoupon from './sendCoupon/sendCoupon.js';
import BarReact from '../../components/Echarts/BarReact.js';
import './myCoupon.scss';
export default class MyCoupon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      barOption: {
        title:{
          text:'ECharts 数据统计'
        },
        xAxis: [
          {
            data: ["未使用","","","","",""],
            axisLine: {
              lineStyle: {
                type: 'solid',
                width:'2'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#f90'
              }
            }
          },
        ],
        yAxis: {
          splitLine:{ show:false}
        },
        series: [{
          name: '',
          type: 'bar',
          data:[500,200,"",360,100],
          barWidth : 30,
          itemStyle: {
            normal:{
              label: {
                show: true,
                textStyle: {
                  fontWeight: 'bolder',
                  fontSize: '12',
                  fontFamily: '微软雅黑',
                  color:"#666"
                },
                position: 'top'
              },
              color: function (params){
                var colorList = ['rgb(255,153,0)','rgb(42,170,227)','rgb(255,255,255)','rgb(255,153,0)','rgb(42,170,227)'];
                return colorList[params.dataIndex];
              }
            },
            //鼠标悬停时：
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    }
  }
  componentDidMount() {
   $(".see").on("click",function(){
     $(".see-box").removeClass("none");
   })
    $(".send").on("click",function(){
      $(".send-coupon").removeClass("none");
    })
    $(".close").on("click",function(){
      $(".see-box,.send-coupon").addClass("none");
    })
  }
    render(){
        return(
         <div>
              <LeftMenu param={this.props} />
              <div className="fr uc-rbody my-coupon ">
                <SeeCoupon />
                <SendCoupon />
                <div className="graph-box">
                  <div className="tit clearfix">
                    <p className="fl">
                      <span className="act">优惠券使用统计</span>
                      <span>优惠券发放统计</span>
                    </p>
                    <p className="send fr">发优惠券</p>
                  </div>
                  <div className="graph">
                    <BarReact width='600px' height="400px"  option={this.state.barOption}/>
                  </div>
                </div>
                <div className="table-box">
                  <div className="tit">
                    <p className="t1"><span className="bord">未使用</span><span>已使用</span><span>已失效</span></p>
                    <p className="nub">共<span>153</span>张</p>
                  </div>
                  <table border="1">
                    <tr>
                      <td>优惠券编码</td>
                      <td>面值</td>
                      <td>使用规则</td>
                      <td>类型</td>
                      <td>发行日期</td>
                      <td>失效日期</td>
                      <td>状态</td>
                      <td>操作</td>
                    </tr>
                    <tr>
                      <td>项目编号-0001</td>
                      <td>50元</td>
                      <td>满100减</td>
                      <td>投资类</td>
                      <td></td>
                      <td></td>
                      <td className="state">未使用</td>
                      <td className="see">查看</td>
                    </tr>
                  </table>
                </div>
              </div>
         </div>
        )
    }
}
