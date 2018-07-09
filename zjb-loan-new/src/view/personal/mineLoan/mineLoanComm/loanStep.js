/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:20:00 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-06 17:51:32
 * 步骤条
 */
import React from 'react';
import {stepDate} from './stepDate';
import {Icon} from 'antd';
import {connect} from 'dva';
import '../mineloan.scss';

@connect((state)=>({
    mineloan: state.mineloan,
    data: state.mineloan.data
}))
class LoanStep extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            states: 1,
        }
    }
    componentDidMount(){
     
    }
    render(){
        console.log(this.props.stepdata,'ppp')
        const {fname,fproject_no,fflag} = this.props.stepdata;
        let step = [];
        let num = 0; 
        for(let i of stepDate){
            if(fflag === i.state){
                step.push(<div key={i.state} className='ready-bag'>
                <p className='ready'>{i.name}</p> 
             </div>)
            }else{
                step.push(<div key={i.state} className='unready-bag'>
                       <p className={num === 0 ? 'unready-fir' : 'unready'}>{i.name}
                       {num < stepDate.length-1 ? <Icon type="caret-right" style={{fontSize:' 12px'}} /> : ''}</p> 
                    </div>)
            }
            num ++;
        }
        return(
            <div className="loan-step" >
                {this.props.type === 0 ? '' : step}
                <p>项目编号:<span>{fproject_no}</span></p>
                <p>项目名称:<span>{fname}</span><span></span></p>
            </div>
        )
    }
}

export default LoanStep;