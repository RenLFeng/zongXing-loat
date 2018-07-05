/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:20:00 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-04 18:39:52
 * 步骤条
 */
import React from 'react';
import {stepDate} from './stepDate';
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
        for(let i of stepDate){
            step.push(<div>
                       <p className={this.state.states === i.state ? 'ready' : 'unready'}>• {i.name} </p> 
                       <img src={this.state.states === i.state ? require('../img/u973.png') : require('../img/u971.png')}/>
                    </div>)
        }
        return(
            <div className="loan-step">
                {step}
                <p>项目编号:<span>P18060006</span></p>
                <p>项目名称:<span>海底捞火锅新店扩张</span></p>
            </div>
        )
    }
}

export default LoanStep;