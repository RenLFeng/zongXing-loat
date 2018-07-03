import React from 'react';
import {loanQa} from './LoanQa';
import './qa.scss';
 
export default class Qa extends React.Component {
  state = {
    answerArr: loanQa[0].data
  }

  chooseType (data) {
    for (let obj of loanQa) {
      if (obj.type === data) {
        this.setState({
          answerArr: obj.data
        });
        break;
      }
    }
  }

  render() {
    return (
      <div className="section sec-qa">
        <div className="w clearfix">
          <div className="fl shadow center">
            <p className="t1 allTitle" >全部问题</p>
            {loanQa.map((data, index)=>{
              return (
                <p className="t2" key={index}  >
                  <a   onClick={()=>this.chooseType(data.type)}>{data.type}</a>
                </p>
              )
            })}
          </div>
          <div className="fr shadow" >
            <p className="c6">很高兴您来到众借帮借款人手册，我们希望它能帮助你开始你的借款项目，任何新的生活，都来源于你的想象力。</p>
            {
              this.state.answerArr.map((data,index)=>{
                return (
                  <div>
                    <p className="q" key={index}>{`${index+1}. ${data.question}`}<i className="dl"/></p>
                    <p className="a">
                      {data.answer.map((data,index)=>{
                        return (<p key={index} >{data}</p>)
                      })}
                    </p>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}
