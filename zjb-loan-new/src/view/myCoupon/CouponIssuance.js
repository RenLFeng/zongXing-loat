import React from 'react';
import PieReact from '../../components/Echarts/PieReact';

export default class PieE extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            option :{
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                color:["#18A9EC",'#E97234','#9C9C9C','#15A84C','#FEB825','#9C9C9C','#15A84C','#FEB825'],
                series: [
                    {
                        type:'pie',
                        selectedMode: 'single',
                        radius: ['50%', '50%'],
            
                        label: {
                            normal: {
                                position: 'inner'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[{value:0},{value:0}] //li
                    },
                    {
                        
                        type:'pie',
                        radius: ['50', '50%'],
                        label: {
                            normal: {
                                borderRadius: 4,
                                rich: {
                                    a: {
                                        color: '#999',
                                        lineHeight: 22,
                                        align: 'center'
                                    },
                                    b: {
                                        fontSize: 16,
                                        lineHeight: 33
                                    },
                                    per: {
                                        color: '#eee',
                                   
                                        padding: [2, 4],
                                        borderRadius: 2
                                    }
                                }
                            }
                        },
                        data:[{value:0},{value:0},{value:0},{value:0},{value:0},{value:0}] //wai
                    }
                ]
            },
        };
      }
    
      componentDidMount() {
          let ins=[
            {value:this.props.statistics.tourists, name:'游客', selected:true},
            {value:this.props.statistics.investors, name:'投资'},
           ]
            let outs=[
                {value:this.props.statistics.touristsStateNum?this.props.statistics.touristsStateNum.failuresNum:0, name:'已失效'},
                {value:this.props.statistics.touristsStateNum?this.props.statistics.touristsStateNum.forReceiveNum:0, name:'待领取'},
                {value:this.props.statistics.touristsStateNum?this.props.statistics.touristsStateNum.receivedNum:0, name:'已领取'},
                {value:this.props.statistics.investorsStateNum?this.props.statistics.investorsStateNum.failuresNum:0, name:'已失效'},
                {value:this.props.statistics.investorsStateNum?this.props.statistics.investorsStateNum.forReceiveNum:0, name:'待领取'},
                {value:this.props.statistics.investorsStateNum?this.props.statistics.investorsStateNum.receivedNum:0, name:'已领取'},

            ]
       this.setState({
           option :{
               tooltip: {
                   trigger: 'item',
                   formatter: "{a} <br/>{b}: {c} ({d}%)"
               },
              
               series: [
                   {
                       type:'pie',
                       selectedMode: 'single',
                       radius: [0, '30%'],
           
                       label: {
                           normal: {
                               position: 'inner'
                           }
                       },
                       labelLine: {
                           normal: {
                               show: false
                           }
                       },
                       data:ins //li
                   },
                   {
                       
                       type:'pie',
                       radius: ['40%', '55%'],
                       label: {
                           normal: {
                               borderRadius: 4,
                               rich: {
                                   a: {
                                       color: '#999',
                                       lineHeight: 22,
                                       align: 'center'
                                   },
                                   b: {
                                       fontSize: 16,
                                       lineHeight: 33
                                   },
                                   per: {
                                       color: '#eee',
                                  
                                       padding: [2, 4],
                                       borderRadius: 2
                                   }
                               }
                           }
                       },
                       data:outs //wai
                   }
               ]
           },
       })
    }
      render() {
        return (
          <div >
             <PieReact 
              height="400px"
              width="850px"
              option={this.state.option}
             />
          </div>
        );
      }
}