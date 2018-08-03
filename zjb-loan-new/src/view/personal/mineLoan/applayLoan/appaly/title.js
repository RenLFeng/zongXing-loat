
import React from 'react';
import {Row, Col} from 'antd';
 import '../appalyloan.scss'
class LoanTitle extends React.Component{
    render(){
        return(
            <Row className="applone-title">
              <Col span={4}>
                <span className="apply_title_span">{this.props.Title}</span>
              </Col>
              <Col span={20}>
                <div className="apply_title_line"/>
              </Col>
            </Row>
        )
    }
}

export default LoanTitle;