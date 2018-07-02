import React from 'react';
import {loanQa} from '../../common/LoanQa';
const styles = {
  allTitle: {
    fontSize: '30px',
    fontWeight: 700,
    lineHeight: '70px',
    paddingTop: '6px',
    color: '#333',
    textAlign: 'center'
  },
  center: {
    width: '258px',
    padding: '0 26px',
    minHeight: '570px',

  },
  fr: {
    width: '900px',
    fontSize: '22px',
    backgroundColor: '#f5f5f5',
    paddingBottom: '240px',
    height: '655px',
    overflowY: 'scroll',
  },
  t2: {
    fontSize: '24px',
    lineHeight: '50px',
    borderBottom: '1px solid #ccc',
    color: '#333'
  }
}

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
          <div className="fl shadow center" style={styles.center}>
            <p className="t1" style={styles.allTitle}>全部问题</p>
            {loanQa.map((data, index)=>{
              return (
                <p className={"t2"} key={index} style={styles.t2} >
                  <a style={{cursor: 'pointer'}} onClick={()=>this.chooseType(data.type)}>{data.type}</a>
                </p>
              )
            })}
          </div>
          <div className="fr shadow" style={styles.fr}>
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
