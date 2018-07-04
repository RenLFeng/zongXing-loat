
//个人中心--项目收藏页


import React from 'react';
import LeftMenu from '../../components/UCenterComponent/leftMenu';
import '../../assets/ucenter/projectcollection.scss';
import {Input,Button, Pagination} from 'antd';
import moment from 'moment';
import { startAnimate } from '../../assets/home/index';
import { knobsmall } from '../../assets/common/module/knob';
import { getCollectionProjectNew, getCollectionCount } from '../../services/api';
import { IMG_BASE_URL } from '../../common/systemParam';
import Path from '../../common/pagePath';

class projectcollection extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            count: {},
            param: {
                flag: null,
                projectName: '',
                pageParam: {
                    pageCurrent: 1,
                    pageSize: 9
                }
            },
            totalNum: 0,
            collectionList: []
         }
    }
    componentDidMount() {
        this.getCount();
        this.getCollectPro();
    }
    async getCount() {
        const response = await getCollectionCount();
        console.log('getCollectionCount', response);
        if (response.code === 0) {
            let obj = {};
            for (let val of response.data) {
                obj[val.fflag] = val.count;
            }
            this.setState({count: obj}, ()=>console.log(this.state.count));
        } 
    }

    async getCollectPro() {
        if (this.state.loading) {
            return;
        }
        this.setState({loading: true});
        const response = await getCollectionProjectNew(this.state.param);
        console.log('getCollectPro', response);
        this.setState({loading: false});
        if (response.code === 0) {
            this.setState({
                collectionList: response.data.infoList,
                totalNum: response.data.totalNumber,
                allNum: !this.state.param.flag?response.data.totalNumber:this.state.allNum
            }, ()=> {
                if (this.state.collectionList.length > 0) {
                    knobsmall();
                }
            })
        } else {
            this.setState({ collectionList: [] })
            response.msg && message.error(response.msg);
        }
    }
    handleClick(type) {
        if (type == this.state.param.flag) {
            return;
        }
        this.setState({
            param: {
                flag: type,
                projectName: '',
                pageParam: {
                    pageCurrent: 1,
                    pageSize: 9
                }
            }
        }, () => {
            this.getCollectPro();
            this.getCount();
        })
    }
    handlerPageChange = (page) => {
        this.setState({  
            param:{
                ...this.state.param,
                pageParam: {
                    pageCurrent: page,
                    pageSize: 99
                }
            },
          },()=>{
            this.getCollectPro();
          });  
    }
    handlerSearchClick=()=> {
       this.getCollectPro();
    }
    render() { 
        const {count, param} = this.state;
        return (
            <div>
                <LeftMenu  param={this.props}/>
                <div className='fr pc-project-collection'> 
                    <div className='search-area'>
                        <p className='top-title'>项目收藏 </p>
                        <ul className='search-tag'>
                            <li className={`${param.flag?'': 'active'}`} onClick={()=>this.handleClick(null)}>全部{this.state.allNum?`(${this.state.allNum})`: ''}</li>
                            <li className={`${param.flag==10?'active': ''}`} onClick={()=>this.handleClick(10)}>筹款中{count[10]?`(${count[10]})`:''}</li>
                            <li className={`${param.flag==11?'active': ''}`} onClick={()=>this.handleClick(11)}>待放款{count[11]?`(${count[11]})`:''}</li>
                            <li className={`${param.flag==12?'active': ''}`} onClick={()=>this.handleClick(12)}>回款中{count[12]?`(${count[12]})`:''}</li>
                            <li className={`${param.flag==13?'active': ''}`} onClick={()=>this.handleClick(13)}>已结清{count[13]?`(${count[13]})`:''}</li>
                            <li className={`${param.flag==-1?'active': ''}`} onClick={()=>this.handleClick(-1)}>已流标{count[-1]?`(${count[-1]})`:''}</li>
                            <li className='error' onClick={()=>this.handleClick(-4)}>回款异常{count[-4]?`(${count[-4]})`:''}</li>
                        </ul> 
                        {/* 搜索文本区域 */}
                        <div className='search-text'>
                            <span>项目名称</span>
                            <Input className='sarch-input' value={this.state.param.projectName} onChange={(e)=>this.setState({param: {...this.state.param,projectName:e.target.value.trim()}})}/>
                            <Button onClick={this.handlerSearchClick}>查询</Button>
                        </div>
                    </div> 
                    <p>共{this.state.totalNum}条记录</p>
                    <div className='project-list box99'>
                        
                        {
                            this.state.collectionList.length===0?<span className="collection_empty_text">暂无数据</span>:null
                        }
                        {
                            this.state.collectionList.map(item=>{
                                const path = item.fcard_pic_path
                                return (
                                    <div className="colect_div" key={item.fproject_id} onClick={()=>this.props.history.push(Path.PROJECT_DETAIL+`/${item.fproject_id}`)}>
                                    {/* <div className='li-title'>
                                        {
                                            this.state.data.projectFlag===this.state.fstate.ckz?
                                            <span className='state ckz'>筹款中</span> :null
                                        }
                                        {
                                            this.state.data.projectFlag===this.state.fstate.dfk?
                                            <span className='state dfk'>待放款</span> :null
                                        }
                                        {
                                            this.state.data.projectFlag===this.state.fstate.hkz||
                                            this.state.data.projectFlag===this.state.fstate.hkyc?
                                            <span className='state hkz'>回款中</span> :null
                                        }
                                        {
                                            this.state.data.projectFlag===this.state.fstate.yjq?
                                            <span className='state yjq'>已结清</span> :null
                                        }
                                        {
                                            this.state.data.projectFlag===this.state.fstate.ylb?
                                            <span className='state ylb'>已流标</span> :null
                                        } 
                                    </div> */}
                                        <span className="pro_colect_Title">项目编号：&nbsp;<span style={{color: '#333'}}>{item.fproject_no}</span></span>
                                        <div className="colect_item" style={{ cursor:'pointer' }}>
                                            <div className="pic_box"><img className="pic" src={`${IMG_BASE_URL}${item.fcard_pic_path}`} /></div>
                                            <p className="name">{item.fname}</p>
                                            <div className="circle" data-value={item.ratio}/>
                                            <i className="price">￥{item.loanMoney}</i>
                                            <i className="city"><span className="high">{item.fcredit_month}<i>借款期限</i></span>个月 | {item.cityName}</i>
                                            <div className="line"/>
                                            <i className="botic botic1">年化利率<em>{item.frate_last}%</em></i>
                                            <span className="colect_desc">按月等额本息</span>
                                            <i className="level">{item.fleve_name}</i>
                                        </div>
                                        <div className="collection_botton_div">
                                            <span style={{color: '#b8b8b8', float: 'left'}}>已有<span style={{color: '#ff9900'}}>{item.userCount}</span>人投标</span>
                                            <span style={{color: '#b8b8b8', float: 'right'}}>发标时间: {moment(item.fapply_time).format('YYYY-MM-DD')}</span>
                                        </div>
                                    </div>
                                )
                            })
                        } 
                        {
                            Math.ceil(this.state.totalNum/this.state.param.pageParam.pageSize)>1?
                            <div className='collection-paging'>
                                <Pagination   current={this.state.param.pageParam.pageCurrent} pageSize={this.state.param.pageParam.pageSize} onChange={this.handlerPageChange} total={this.state.totalNum} />
                            </div>:null
                        } 
                    </div>
                </div> 
            </div>
         )
    }
}
 
export default projectcollection;