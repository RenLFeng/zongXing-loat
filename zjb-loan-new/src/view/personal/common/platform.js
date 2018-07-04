import React from 'react';
import '../../assets/component/common/plantform.scss';
import moment from 'moment';
import { getOPlantNotice } from '../../services/api';

class Platform extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            data :this.props.data ,
        }     
    }
    componentWillReceiveProps(nextprops){
        this.setState({
            data:nextprops.data
        })
       
    }
   
    render() {    
        return (  
            <div className='plat_warp'>
               <p className="time">{moment(this.state.data? this.state.data.fpublishTime:'').format('YYYY/MM/DD HH:mm')}</p>
               <div className="plat_content">
                   <i className="spot"></i> 
                   <div className="p_title" onClick={()=>{this.props.getOPlantNotice()}}>{this.state.data?this.state.data.ftitle:''}</div>
                   <div className="p_word" style={{ borderLeft:'1px solid $f90'}}>{this.state.data?this.state.data.article.fcontent:''}</div>
               </div>
            </div>

         )
    }
}
 
export default Platform;
