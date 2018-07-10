import React from 'react';
import LeftMenu from '../../components/leftmenu/leftMenu';

export default class MyCoupon extends React.Component {
    render(){
        return(
         <div>
              <LeftMenu param={this.props} />
              <div className="">
              </div>
         </div>
        )
    }
}
