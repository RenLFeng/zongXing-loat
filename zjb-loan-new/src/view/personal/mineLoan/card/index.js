
import React from 'react';

import './index.scss'
import { Row, Col,Icon,Button} from 'antd';

export default class Loaninfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            proObj :props.param,
        }
    }
    // edit
    handlerClcikEdit(item){
alert(1)
    }
    // dell
    handlerClcikDel(item){
        alert(2)
    }
 
    render() {
        return (
            <div>
                        <div className="pro-active-containers">
                            <Row  style={{ background: '#fff' }}>
                           {
                                this.state.proObj.map((item, index) => {
                                return <Col span={12} style={{ padding: 16 ,margin:'8px 0'}}>
                                    <p className="pro-active-container-title" >
                                        {item.title}
                                    </p>
                                    <img src={item.img} width='100%' height="150px" />
                                    <p>{item.time}</p>
                                    <p className="btn-tightss">
                                    <a class="btn edits" onClick={this.handlerClcikEdit.bind(this,item)}> <Icon type="edit" /></a>
                                    <a class="btn" onClick={this.handlerClcikDel.bind(this,item)} > <Icon type="delete" /></a>
                                    </p>
                                </Col>             
                                })
                            } 
                            </Row>
                        </div>
            </div>
        )
    }
}
