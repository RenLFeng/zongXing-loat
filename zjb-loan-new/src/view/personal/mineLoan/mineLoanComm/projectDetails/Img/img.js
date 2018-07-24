import React from 'react';
import styles from './img.scss';

export default class Imgs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show:false,   // 是否显示遮罩
    }
  }

  changeState() {
    this.setState({
      show:true,
    })
  }

  changeState_() {
    this.setState({
      show:false,
    })
  }
  render() {
    return(
      <div className="content">
        <img src={this.props.src} onClick={()=> this.changeState()}/>
        {
          this.state.show ?
            <div className="mask" onClick={()=> this.changeState_()}>
              <img src={this.props.src} alt=""/>
            </div> :null }
      </div>
    )
  }
}
