
import React from 'react';
 import '../appalyloan.scss'
class LoanTitle extends React.Component{
    render(){
        return(
            <div  className="applone-title" style={{borderBottom: '1px dashed #e6e2e2'}}>
                <p className="applone-loan" style={{paddingBottom: 10}}>{this.props.Title}    
                 <span  className={this.props.Title === '借款人信息' ? '' : 'hides'} style={{fontSize:14,marginLeft:50,color:'#ff9900'}}>借款人必须为法人代表或持股20%以上股东</span>
                </p>
            </div>
        )
    }
}

export default LoanTitle;