/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:20:00 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-05 17:43:10
 * 步骤条
 */
import React from 'react';
import {stepDate} from './stepDate';
import {Icon} from 'antd';
import {connect} from 'dva';
import '../mineloan.scss';

class LoanStep extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            states: 1,
            
        }
    }
    render(){
        let step = [];
        let num = 0;
        for(let i of stepDate){
            if(this.state.states === i.state){
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
                {step}
                <p>项目编号:<span>P18060006</span></p>
                <p>项目名称:<span>海底捞火锅新店扩张</span></p>
            </div>
        )
    }
}

export default LoanStep;