import React from 'react';
import { Table, Pagination, Modal } from 'antd';
import { message } from "antd/lib/index";
import moment from 'moment';
import LeftMenu from '../../../components/leftmenu/leftMenu';
import { pageShows } from "../../../common/SystemParam";
import { accountService } from '../../../services/api2.js';
import Statement from '../statement/Statement';
import { connect } from 'dva';
import './accountstatement.scss';
/**
 * 资金流水界面
 */
@connect((state) => ({
	openStatus: state.account.openStatus
}))
export default class AccountStatement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeCode: '0000',
			pageCurrent: 1,
			pageSize: 5,
			totalNum: 0,
			//业务类型码:1201:充值，1301：提现，1405：项目还款，1404：项目投资，若为null,则全查
			lables: [{
					lable: '总账',
					code: '0000'
				},
				{
					lable: '充值',
					code: '1201'
				},
				{
					lable: '提现',
					code: '1301'
				},
				{
					lable: '放款',
					code: '1404'
				},
				{
					lable: '还款',
					code: '1405'
				},
			],
			loading: false,
			//资金动态列表
			infoList: [],
			chongzData: [],
			tixianData: [],
			touziData: [],
      huanKuanData: [],
      totalAmount: 0.00, //累计充值/提现/放款金额
      interestAmount: 0.00, //  当期还款总利息
      overdueAmount: 0.00, // 当期还款总逾期金额
		}
	}

	componentDidMount() {
		//  if (this.props.openStatus == 3) {
		//    this.getCapitalDynamics();  //调用请求
		//    this.props.history.push('/index/uCenter/authentication')
		//    return;
		//  }
		// this.jumpAuth()
		this.getCapitalDynamics();  //调用请求
	}
	jumpAuth() {
		var that = this;
		Modal.info({
			title: '您目前还没有开户，请先开户！',
			okText: '去开户',
			onOk() {
				that.props.history.push('/index/uCenter/realName')
			},
		});
	}
	//获取资金动态列表
	async getCapitalDynamics() {
		try {
			this.setState({
				loading: true,
			});
			let param = {
				busTypeCode: this.state.activeCode === '0000' ? null : this.state.activeCode,
				pageCurrent: this.state.pageCurrent,
				pageSize: this.state.pageSize
			};
			//调用后台
			const res = await accountService.getAccountStatement(param);
			
			if(res.code === 0) {
				this.setState({
					totalNum: res.data.totalNumber,
				});
				if(this.state.activeCode === '0000') {
					this.setState({
						infoList: res.data.resPage.infoList,
					});
				} else if(this.state.activeCode === '1201') {
					this.setState({
            totalAmount: res.data.totalAmount,
						chongzData: res.data.resPage.infoList,
					});
				} else if(this.state.activeCode === '1301') {
					this.setState({
            totalAmount: res.data.totalAmount,
						tixianData: res.data.resPage.infoList,
					});
				} else if(this.state.activeCode === '1404') {
					this.setState({
            totalAmount: res.data.totalAmount,
						touziData: res.data.resPage.infoList,
					});
				} else if(this.state.activeCode === '1405') {
					console.log("res",res.data);
					this.setState({
						huanKuanData: res.data.resPage.infoList,
						interestAmount: res.data.interestAmount, //  当期还款总利息
      			        overdueAmount: res.data.overdueAmount, // 当期还款总逾期金额
					});
				}
			} else {
				this.setState({
					totalNum: 0,
					infoList: [],
					chongzData: [],
					tixianData: [],
					touziData: [],
					huanKuanData: []
				});
				if (res.msg === '账户信息不存在') {
					return;
				}
				res.msg && message.error(res.msg);
			}
			this.setState({
				loading: false,
			});
		} catch(e) {
			this.setState({
				loading: false,
			});
			if(typeof e === 'object' && e.name === 288) {
				localStorage.removeItem('accessTokenCompany');
				this.props.history.push('/index/login');
			}
			//console.log(e);
		}
	}
	//方法区域
	// 点击选择类型
	handlerClcikLable = (code) => {
		let pageSize = 15;
		if(code === '0000') {
			pageSize = 5;
		}
		this.setState({
			activeCode: code,
			pageSize: pageSize,
			pageCurrent: 1
		}, () => {
			this.getCapitalDynamics();
		});
	}
	//点击分页
	handlerPageChange = (page) => {
		this.setState({
			pageCurrent: page, //设置为第一页
		}, () => {
			this.getCapitalDynamics();
		});
	}
	render() {
		//充值
		const chongzColumn = [{
			title: '序号',
			align: 'center',
			width: 50,
			render: function(text, record, index) {
				return index + 1;
			}
		}, {
			title: '充值日期',
			dataIndex: 'ftime',
			align: 'center',
			render: function(text, record, index) {
				return text ? moment(text).format('YYYY/MM/DD HH:mm') : '----/--/--/ --:--';
			}
		}, {
			title: '充值金额',
			dataIndex: 'resultObj.famount',
			align: 'center',
			render: function(text, record, index) {
				return String(text).fm();
			}
		}, {
			title: '充值状态',
			dataIndex: 'resultCode',
			align: 'center',
			render: function(text, record, index) {
				if(text == '88') {
					return '成功';
				} else {
					return record.resultMessage;
				}
			}
		}];
		//提现
		const tixianColumn = [{
			title: '序号',
			align: 'center',
			width: 50,
			render: function(text, record, index) {
				return index + 1;
			}
		}, {
			title: '提现日期',
			dataIndex: 'ftime',
			align: 'center',
			render: function(text, record, index) {
				return text ? moment(text).format('YYYY/MM/DD HH:mm') : '----/--/--/ --:--';
			}
		}, {
			title: '手续费',
			align: 'center',
			dataIndex: 'resultObj.fuserFeeWithdraw',
			render: function(text, record, index) {
				if(text) {
					return String(text).fm();
				} else {
					return '';
				}
			}
		}, {
			title: '提现到账金额',
			align: 'center',
			dataIndex: 'resultObj',
			render: function(text, record, index) {
				if(text.famount && text.fuserFeeWithdraw) {
					return String(text.famount - text.fuserFeeWithdraw).fm();
				} else {
					return '';
				}
			}

		}, {
			title: '提现银行卡',
			align: 'center',
			dataIndex: 'resultObj.fcardNo',
			render: function(text, record, index) {
				let text_ = '';
				if(record.resultObj.bankName) {
					text_ = record.resultObj.bankName;
				}
				if(text) {
					text_ += ' 尾号' + text.substring(text.length - 4);
				}
				return text_;
			}
		}, {
			title: '提现状态',
			dataIndex: 'resultCode',
			align: 'center',
			render: function(text, record, index) {
				if(text == '88') {
					return '成功';
				} else {
					return record.resultMessage;
				}
			}
		}];
		//放款
		const fangkColumn = [{
			title: '序号',
			align: 'center',
			width: 50,
			render: function(text, record, index) {
				return index + 1;
			}
		}, {
			title: '放款日期',
			dataIndex: 'ftime',
			align: 'center',
		}, {
			title: '项目借款金额',
			dataIndex: 'resultObj.invAmount',
			align: 'center',
		}, {
			title: '平台收取佣金',
			align: 'center',
		}, {
			title: '最终放款金额',
			align: 'center',
		}, {
			title: '项目编号',
			align: 'center',
		}, {
			title: '项目名称',
			align: 'center',
		}];
		//还款
		const huankColumn = [{
			title: '序号',
			align: 'center',
			width: 50,
			render: function(text, record, index) {
				return index + 1;
			}
		}, {
			title: '还款日期',
			dataIndex: 'ftime',
			align: 'center',
			render: function(text, record, index) {
				return text ? moment(text).format('YYYY/MM/DD HH:mm') : '----/--/--/ --:--';
			}
		}, {
			title: '本金',
			dataIndex: 'resultObj.sumPrincipal',
			align: 'center',
			render: function(text, record, index) {
				return String(text).fm();
			}
		}, {
			title: '利息',
			dataIndex: 'resultObj.sumInterest',
			align: 'center',
			render: function(text, record, index) {
				return String(text).fm();
			}
		}, {
			title: <span className='table_title_span' style={{color: 'red'}}>逾期费</span>,
			dataIndex: 'resultObj.sumOverdueAmount',
			align: 'center',
			render: function(text, record, index) {
				return String(text).fm();
			}
		}, {
			title: '当期还款总金额',
			dataIndex: 'resultObj.sumRepayAmount',
			align: 'center',
			render: function(text, record, index) {
				return String(text).fm();
			}
		}, {
			title: '还款期数',
			dataIndex: 'resultObj.projectNo',
			align: 'center',
			
		}, {
			title: '还款状态',
			dataIndex: 'resultObj.projectName',
			align: 'center',
		}, {
			title: '项目编号',
			dataIndex: 'resultObj.periods',
			align: 'center',
		}, {
			title: '项目名称',
			dataIndex: 'resultObj.periods',
			align: 'center',
		}];

		const locale = {
			filterTitle: '筛选',
			filterConfirm: '确定',
			filterReset: '重置',
			emptyText: '暂无数据',
		};
		return(
			<div>
      <LeftMenu param={this.props}/>
        <div className="fr as-account-statement" >
            {/* 顶部搜索区域 */}
            <div className='search-area'>
                <p className='top-title'>资金流水 </p>
                <ul className='search-tag'>
                    {
                      this.state.lables.map(item=>{
                        return <li key={item.lable} onClick={this.handlerClcikLable.bind(this,item.code)} className={item.code===this.state.activeCode?'active':''} >{item.lable}</li>
                      })
                    }
                </ul>
                <span> 单位（元）</span>
            </div>  
            {/* 内容区域 */}
          <div className='as-list'>
            {/* 总账 */}
            <div className={this.state.activeCode==='0000'?'':'hide'}>
              {
                this.state.infoList.map((item,index)=>{
                  return <Statement key={index} showTitle={index==0} data={item}></Statement>
                })
              }
              {
                this.state.infoList.length===0?<span className='no-data'>暂无数据</span>:null
              }
            </div>
            {/* 充值 */}
            <div className={this.state.activeCode==='1201'?'':'hide'}>
							<div className="statement_table_title">
								<span style={{color: '#999'}}>累计充值金额: <span style={{color: '#ff9900'}}>￥{this.state.totalAmount}</span></span>
							</div>
              <Table columns={chongzColumn} locale={locale} dataSource={this.state.chongzData} loading={this.state.loading} pagination={false} bordered size="small" />
            </div>
            {/* 提现 */}
            <div className={this.state.activeCode==='1301'?'':'hide'}>
							<div className="statement_table_title">
								<span style={{color: '#999'}}>累计提现金额: <span style={{color: '#009900'}}>￥{this.state.totalAmount}</span></span>
							</div>
              <Table columns={tixianColumn} locale={locale}  dataSource={this.state.tixianData} loading={this.state.loading} pagination={false} bordered size="small" />
            </div>
            {/* 放款 */}
            <div className={this.state.activeCode==='1404'?'':'hide'}>
							<div className="statement_table_title">
								<span style={{color: '#999'}}>累计放款金额: <span style={{color: '#ff9900'}}>￥{this.state.totalAmount}</span></span>
							</div>
              <Table columns={fangkColumn} locale={locale} dataSource={this.state.fangkData} loading={this.state.loading} pagination={false} bordered size="small" /> 
            </div>
            {/* 还款 */}
            <div className={this.state.activeCode==='1405'?'':'hide'}>
							<div className="statement_table_title">
								<span className="table_title_left" style={{color: '#999'}}>累积利息支出: <span style={{color: '#ff9900'}}>￥{this.state.interestAmount}</span></span>
								<span className="table_title_right" style={{color: 'red'}}>累积逾期费: <span style={{color: 'red'}}>￥{this.state.overdueAmount}</span></span>
							</div>
              <Table columns={huankColumn} locale={locale} dataSource={this.state.huanKuanData} loading={this.state.loading}  pagination={false}  bordered size="small" /> 
            </div>
             {/* 分页 */}
             {
                Math.ceil(this.state.totalNum/this.state.pageSize)>1?
                <div className='as-paging'>
                  <Pagination   current={this.state.pageCurrent} pageSize={this.state.pageSize} onChange={this.handlerPageChange} total={this.state.totalNum} />
                </div>:null
              } 
          </div> 
        </div>
      </div>
		)
	}
}