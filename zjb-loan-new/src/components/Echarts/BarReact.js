
import React from 'react'
import echarts from 'echarts/lib/echarts' //必须
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/chart/bar'

export default class BarReact extends React.Component {

  constructor(props) {
    super(props);
    this.initPie = this.initPie.bind(this)
  }

  initPie() {
    const { option={} } = this.props; //外部传入的data数据
    let myChart = echarts.init(this.ID) //初始化echarts

    //设置options
    myChart.setOption(option);
    window.onresize = function() {
      myChart.resize()
    }
  }

  componentDidMount() {
    this.initPie()
  }

  componentDidUpdate() {
    this.initPie()
  }

  render() {
    const { width="100%", height="200px", margin='0'} = this.props;
    return(
        <div>
          <h2>
            优惠券使用情况
          </h2>
          <div ref={ID => this.ID = ID} style={{width, height, margin}}>
          </div>
        </div>
      )

  }
}
