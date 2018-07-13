import React from 'react';
import './Sideslip.css';
import { Card } from 'antd';
//import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
/**
 * 组件还未完成
 * 还需要补充调用方式
*/
class Sideslip extends React.Component {
    closeModal = () => {
        this.props.closeModal();
    };
    render() {
        const Child =
        this.props.visable ?
        <div className="mask" onClick={()=>{this.closeModal()}}>
            <div className="contentBox">
            <Card  bordered={false} className="content" onClick={(e)=>{e.stopPropagation()}}>
            {this.props.children}
            </Card>
            </div>
        </div>
        : null;
        /**
         * transitionName 需要匹配的样式名称,他会按照需要的  transitionAppear   transitionEnter   transitionLeave 三种状态去添加后缀匹配样式
         * transitionAppear  组件初次加载  transitionName-appear
         * transitionEnter 组件渲染 transitionName-enter
         * transitionLeave 组件销毁 transitionName-leave
         * 注意  过渡动画时长不要超过500ms
        */
       /*<ReactCSSTransitionGroup
                transitionName='show'
                transitionAppear={true}
                transitionEnter={true}
                transitionLeave={true}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
            >
            {Child}
            </ReactCSSTransitionGroup>*/
        return (
          null
        )
    }
}

export default Sideslip;
