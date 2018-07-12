import React from 'react';
import BarReact from '../../components/Echarts/BarReact';

export default class BarE extends React.Component{
    constructor(props){
      super(props);
      this.state = {
      barOption:{
        color: ['#E97234', '#18A9EC'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['投资人', '游客']
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                axisTick: {show: false},
                data: ['未使用', '已使用', '已失效']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '投资人',
                type: 'bar',
                barGap: 0,
                data: [0,0,0]
            },
            {
                name: '游客',
                type: 'bar',
                data: [0,0,0]
            },          
        ]
      },   
      }
    }
  
    componentDidMount() {
        if (this.props.useStatistics) {
            this.setValue(this.props.useStatistics);
        }
    }

    componentWillReceiveProps(nextProps){
        if (this.props.useStatistics !== nextProps.useStatistics && nextProps.useStatistics) {
            this.setValue(nextProps.useStatistics);
            
        }
    }

    setValue(data) {
        let investors = [data.unused.investors,data.used.investors,data.failures.investors];
        let tourists = [data.unused.tourists,data.used.tourists,data.failures.tourists];
        this.setState({
            barOption:{
                color: ['#E97234', '#18A9EC'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['投资人', '游客']
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    left: 'right',
                    top: 'center',
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {show: false},
                        data: ['未使用', '已使用', '已失效']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '投资人',
                        type: 'bar',
                        barGap: 0,
                        data: investors
                    },
                    {
                        name: '游客',
                        type: 'bar',
                        data: tourists
                    },                  
                ]
              }
        })

    }

    render() {
       return(
        <BarReact
          height="400px"
          width="850px"
          option={this.state.barOption}
        />
       )
    }
}