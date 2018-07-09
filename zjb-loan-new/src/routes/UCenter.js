import React from 'react';
import $ from 'jquery';

import { Switch, Route, withRouter } from 'dva/router';
import { connect } from 'dva';
import { Button } from 'antd';

import './ucenter/index';
import PersonAccount from '../view/personAccount/personAccount';
import LoginInfo from '../view/personal/loginInfo/loginInfo';
import Path from '../common/PagePath';
import LeftMenu from '../components/leftmenu/leftMenu';
import MineLoan from '../view/personal/mineLoan/mineLoan';
import AppalyLoan from '../view/personal/mineLoan/applayLoan/appalyloan';
import Recharge from '../view/personal/recharge/recharge'
import Withdrawals from '../view/personal/tixian/tixian'
import BindCard from '../view/ucenter/seccenter/realName/bindCard/bindCard';
import ChangeLPwd from '../view/ucenter/seccenter/realName/changeLoginPwd/changeLoginPwd';
import Repayment from '../view/repaymentPlan/repayment';
import RealName from '../view/ucenter/seccenter/realName/realName';
import OpenAccount from '../view/ucenter/seccenter/realName/openAccount/openAccount';
import MyCoupon from '../view/myCoupon/myCoupon';


import AccountStatement from "../view/personal/accountstatement/accountstatement";
export default class UCenter extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {

		setTimeout(() => {
			this.initPage();
		}, 200);
	}

	initPage() {
		$('.uc-lbody>.navbox').on('click', '.hd>a,.folder>a', function () {
			$(this).parent().toggleClass('hover');
		});
	};

	render() {
		const {
			match,
			nickName,
			showMask
		} = this.props;

		return (
			<div className="body2">
				<LoginInfo history={this.props.history} />
				<div className="w clearfix">
					<Switch>
						{/* 账户总览 */}
						<Route path={Path.PERSONAL_ACCOUNT} exact component={PersonAccount} />
						{/* 资金动态 */}
						<Route path={Path.ACCOUNT_STATEMENT} exact component={AccountStatement} />
						{/*还款计划 */}
						<Route path={Path.RECEIVE_PLAN} exact component={Repayment} />
						{/*我的优惠券*/}
						<Route path={Path.MY_COUPON} exact component={MyCoupon} />
						{/* 我的借款 */}
						<Route path={Path.MINE_LOAN} exact component={MineLoan} />
						{/* 修改登陆密码 */}
						<Route path={Path.CHANGE_LPWD} component={ChangeLPwd} />
						{/* 邮箱绑定 */}
						{/* <Route path={Path.BIND_EMAIL} component={BindEmail} />     */}
						{/* 变更邮箱绑定 */}
						{/* <Route path={Path.CHANGE_BINDEMAIL} component={ChangeBindEmail} />    */}
						{/*申请借款*/}
						<Route path={Path.APPALY_LOAN} exact component={AppalyLoan} />
						<Route path={Path.REALNAME_AUTHENTICATION} component={RealName} />
						<Route path={Path.OPEN_ACCOUNT} component={OpenAccount} />
						{/* 充值 */}
						<Route path={Path.ACCOUNT_RECHARGE} exact component={Recharge} />
						<Route path={Path.ACCOUNT_WITHDRAWALS} exact component={Withdrawals} />
						<Route path={Path.BINDCARD} component={BindCard} />
					</Switch>
				</div>
			</div>
		);
	}
}