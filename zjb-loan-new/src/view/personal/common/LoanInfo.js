// 长条借款项目 
import React from 'react';
import '../../assets/component/common/loaninfo.scss';
import {Button,Steps,Table,message} from 'antd';
import moment from 'moment'; 
import {accountService}  from '../../services/api2';

class LoanInfo extends React.Component {
  constructor(props) {
	super(props); 
	this.setStateData(props);
  }
  componentWillReceiveProps(props){
	  this.setStateData(props);
  }
  setStateData(props){
	let data = this.props.data; 
	if(!data.stateData){
		data.stateData = [];
	}
	let len = data.stateData.length;
	if(data.projectFlag===5){
		len=0;
	}
    this.state = {
		fstate:{
			ckz:10,//筹款中
			dfk:11,//待放款
			hkz:12,//回款中
			yjq:13,//已结清
			ylb:-1,//已流标
			hkyc:-4,//还款异常
		}, 
		data:data,
		visableTable:false,
		tableData:[],
		loading:false,
		projectId:'',
	}
  }
 //查看回款明细
  handllerHKClick(projectId){ 
	this.setState({
		visableTable:!this.state.visableTable,
		projectId:projectId,
	},()=>{
		if(this.state.visableTable &&(this.state.tableData || this.state.tableData.length==0)){
			this.searchDetail();
		}
	}); 
 }
 //查询回款明细
  searchDetail(){
	this.setState({
		loading:true,
	},async ()=>{
		let param = {
			projectId:this.state.projectId
		};  
		const rest =  await accountService.getInvestmentPlan(param); 
		this.setState({ 
			loading:false,
		});
		if(rest.code===0){
			this.setState({
				tableData:rest.data, 
			});
		}else{
			message.error(rest.msg);
		}
	}) 
 }

 handllerHTClick = async ()=>{
	alert('查看安心签投资合同')
 }

  render() { 
	const Step = Steps.Step;
	
	//投资
    const tableColumn = [{
        title: '期数', 
        align:'center',
			width:50,
			dataIndex: 'fsort',
      }, {
        title: '回款日期',
        dataIndex: 'ffor_pay_time',
        align:'center',
        render:function(text,record,index){
          return text?moment(text).format('YYYY/MM/DD HH:mm'):'';
        }
      }, {
        title: '本金',
        dataIndex: 'fprincipal',
        align:'right',
        render:function(text,record,index){
          return String(text).fm();
        }
      }, {
        title: '利息',
        dataIndex: 'finterest',
        align:'right',
        render:function(text,record,index){
          return String(text).fm();
        }
      }, {
        title: '佣金',
        dataIndex: 'fkick_back',
        align:'right',
        render:function(text,record,index){
          return String(text).fm();
        }
      }, {
        title: '当期回款总额',
        dataIndex: 'allMoney',
        align:'right',
        render:function(text,record,index){
          return String(text).fm();
        }
      }, {
        title: '回款状态',
        dataIndex: 'fispay',
        align:'center',
        render:function(text,record,index){
          if(text){
			  return '已回款';
		  }else{
			  return '待回款';
		  }
        }
      }, {
        title: '到账日期',
        dataIndex: 'fpay_time',
        align:'center',
				render:function(text,record,index){
					return text?moment(text).format('YYYY/MM/DD HH:mm'):'';
				}
      }]; 
	const locale = {
		filterTitle: '筛选',
		filterConfirm: '确定',
		filterReset: '重置',
		emptyText: '暂无数据',
	};
	  
    return (  
      <div className='li-content'>
         {/* 顶部标题 */}
         <p>
           <span>项目编号：</span>
           <span style={{color:'#999'}}>{this.state.data.projectNo||''}</span>
           <span>{this.state.data.companyName||''}</span> 
         </p>
		{/* 中间内容 */}
		<div className='li-middle'>
		{/* 上   */} 
		<div className='li-top'>
				{/* 左  logo*/}
			<div className='li-left'>
				<img  src={'http://zjb01-1255741041.picsh.myqcloud.com/'+this.state.data.cardPicPath||'https://zjb-test-1255741041.cos.ap-guangzhou.myqcloud.com/base/defut-head.jpg'} />
				<span> {this.state.data.leveName} </span>
			</div>
				{/* 中 */}
			<div className='li-center'>  
				<div className='li-title'>
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
					<a className='pname'  title='进入项目详情页面' onClick={this.props.handllerMXClick?this.props.handllerMXClick.bind(this,this.state.data.projectId,this.state.data):()=>{alert('请绑定handllerMXClick事件，跳转到项目详细界面！');}}>{this.state.data.projectName||''} 
						{
							this.state.data.projectFlag===this.state.fstate.hkyc?<i className='zjb zjb-jinggao'></i>:null
						} 
					</a>
				</div>
				<div className='text li-nh'>
					<span>年化收益率</span>
					<p>{this.state.data.rate}<span>%</span></p> 
					<span className='tip'>{this.state.data.cityName}/
						{
							this.state.data.busType==='xcy'?'新餐饮':''
						}
						{
							this.state.data.busType==='xfw'?'新服务':''
						}
						{
							this.state.data.busType==='xls'?'新零售':''
						}
						{
							this.state.data.busType==='xny'?'新农业':''
						}
						{
							this.state.data.busType==='xyl'?'新娱乐':''
						}
						{
							this.state.data.busType==='other'?'其他':''
						} 
					</span>
				</div>
				<div className='text li-qx'>
					<span>投资期限</span>
					<p>{this.state.data.month}<span>个月</span></p>
					
				</div>
				<div className='text li-je'>
					<span>借款金额</span>
					<p>{this.state.data.practicalLoanMoney}<span>万</span></p> 
					<span className='tip'>按月等额本息还款</span>
				</div> 
			</div>
			{/* 右 */}
			<div className='li-right'>
				<div className='line'>&ensp;</div> 
				{
					this.state.data.projectFlag ===this.state.fstate.ckz?
					<Steps size="small" current={0} progressDot direction="vertical"> 
						<Step   title={`项目上线：${this.state.data.upLineDate?moment(this.state.data.upLineDate).format('YYYY/MM/DD HH:mm'):''}`} />
					</Steps>:null
				} 
				{
					this.state.data.projectFlag ===this.state.fstate.dfk?
					<Steps size="small" current={1} progressDot direction="vertical"> 
						<Step   title={`项目上线：${this.state.data.upLineDate?moment(this.state.data.upLineDate).format('YYYY/MM/DD HH:mm'):''}`} />
						<Step   title={`项目满标：${this.state.data.fullDate?moment(this.state.data.fullDate).format('YYYY/MM/DD HH:mm'):''}`} /> 
					</Steps>:null
				}  
				{
					this.state.data.projectFlag ===this.state.fstate.hkz?
					<Steps size="small" current={2} progressDot direction="vertical"> 
						<Step   title={`项目上线：${this.state.data.upLineDate?moment(this.state.data.upLineDate).format('YYYY/MM/DD HH:mm'):''}`} />
						<Step   title={`项目满标：${this.state.data.fullDate?moment(this.state.data.fullDate).format('YYYY/MM/DD HH:mm'):''}`} /> 
						<Step   title={`项目计息：${this.state.data.loanDate?moment(this.state.data.loanDate).format('YYYY/MM/DD HH:mm'):''}`} /> 
					</Steps>:null
				} 
				{
					this.state.data.projectFlag ===this.state.fstate.yjq?
					<Steps size="small" current={3} progressDot direction="vertical"> 
						<Step   title={`项目上线：${this.state.data.upLineDate?moment(this.state.data.upLineDate).format('YYYY/MM/DD HH:mm'):''}`} />
						<Step   title={`项目满标：${this.state.data.fullDate?moment(this.state.data.fullDate).format('YYYY/MM/DD HH:mm'):''}`} /> 
						<Step   title={`项目计息：${this.state.data.loanDate?moment(this.state.data.loanDate).format('YYYY/MM/DD HH:mm'):''}`} /> 
						<Step   title={`项目结清：${this.state.data.finishDate?moment(this.state.data.finishDate).format('YYYY/MM/DD HH:mm'):''}`} />  
					</Steps>:null
				} 
				{
					this.state.data.projectFlag ===this.state.fstate.ylb?
					<Steps size="small" current={0} progressDot direction="vertical"> 
						<Step   className='normary' title={`项目流标${this.state.data.upLineDate?moment(this.state.data.upLineDate).format('YYYY/MM/DD HH:mm'):''}`} />  
					</Steps>:null
				} 
			</div> 
		</div> 
		{/* 下 */}
		<div className='li-down'>
			{/* 底部统计信息 */} 
				<span>
					{
						this.state.data.projectFlag===this.state.fstate.ckz?
						<span>
							<span>已投资金额：</span> 
							<span className='money'>{String(this.state.data.invMoney||0).fm()}元</span>
							<i className='split'>|</i>
							<span>可用代金券：</span>
							<span className='money'>{this.state.data.couponCount}张</span>
						</span>:null 
					}
					{
						this.state.data.projectFlag===this.state.fstate.dfk||
						this.state.data.projectFlag===this.state.fstate.ylb?
						<span>
							<span>总投资金额：</span> 
							<span className='money'>{String(this.state.data.allMoney||0).fm()}元</span>
							<i className='split'>|</i>
							<span>可用代金券：</span>
							<span className='money'>{this.state.data.couponCount}张</span>
						</span>:null
					}
					{
						this.state.data.projectFlag===this.state.fstate.hkz||
						this.state.data.projectFlag===this.state.fstate.hkyc||
						this.state.data.projectFlag===this.state.fstate.yjq?
						<span>
							<span>总投资金额：</span> 
							<span className='money'>{String(this.state.data.allMoney||0).fm()}元</span>
							<i className='split'>|</i>
							<span>总投利息收益：</span> 
							<span className='money'>{ String(this.state.data.allInterest||0).fm()}元</span>
							<i className='split'>|</i> 
							<span>待收本金：</span> 
							<span className='money'>{String(this.state.data.principal||0).fm()}元</span>
							<i className='split'>|</i>
							<span>待收利息：</span> 
							<span className='money'>{String(this.state.data.interest||0).fm()}元</span>
							<i className='split'>|</i>
							<span>可用代金券</span>
							<span className='money'>{this.state.data.couponCount}张</span>
						</span>:null
					} 
				</span> 
			{ 
				/* 右侧按钮 */
				this.state.data.projectFlag===this.state.fstate.ckz ?<a className='btn'  onClick={this.props.handllerTZClick?this.props.handllerTZClick.bind(this,this.state.data.fid,this.state.data):()=>{alert('请绑定handllerTZClick事件！');}}> 继续投资 </a>:null 
			}
			{ 
				/* 右侧按钮 */
				this.state.data.projectFlag===this.state.fstate.hkz||
				this.state.data.projectFlag===this.state.fstate.hkyc||
				this.state.data.projectFlag===this.state.fstate.yjq ?
				<a className='btn2' onClick={this.handllerHKClick.bind(this,this.state.data.projectId)}> 查看回款明细 </a>:null 
			}
			
			</div>
		</div>
		<div className={`detail ${this.state.visableTable?'':'hide'}`}>
			<Table columns={tableColumn} locale={locale} dataSource={this.state.tableData} loading={this.state.loading} pagination={false} bordered size="small" /> 
		</div>
		<a  onClick={this.handllerHTClick.bind(this,this.state.data.projectId)}>《查看投资合同》</a>
				 
      </div>
    );
  }
}
 
export default LoanInfo;


