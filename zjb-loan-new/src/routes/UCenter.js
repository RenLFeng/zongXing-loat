import React from 'react';
import $ from 'jquery';

import { Switch, Route, withRouter } from 'dva/router';
import './ucenter/index';
import PersonAccount from '../view/personAccount/personAccount';
import LoginInfo from '../view/personal/loginInfo/loginInfo';
import Path from '../common/PagePath';
import MineLoan from '../view/personal/mineLoan/mineLoan';
// import AppalyLoan from '../view/personal/mineLoan/applayLoan/appalyloan';

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
		$('.uc-lbody>.navbox').on('click', '.hd>a,.folder>a', function() {
			$(this).parent().toggleClass('hover');
		});
	};

	render() {
		const {
			match,
			nickName,
			showMask
		} = this.props;

		return(
			<div className="body2">
        		<LoginInfo history={this.props.history}/> 
        	<div className="w clearfix"> 
            <Switch>
                  {/* 账户总览 */}
                  <Route path={Path.PERSONAL_ACCOUNT} exact component={PersonAccount} />
                  {/* 资金动态 */}
                  <Route path={Path.ACCOUNT_STATEMENT} exact component={AccountStatement} />
                  {/* 我的借款 */}
                  <Route path={Path.MINE_LOAN} exact component={MineLoan} />
                  {/* 邮箱绑定 */}
                  {/* <Route path={Path.BIND_EMAIL} component={BindEmail} />     */}
                  {/* 变更邮箱绑定 */}
                  {/* <Route path={Path.CHANGE_BINDEMAIL} component={ChangeBindEmail} />    */}
                  {/*申请借款*/}
                  {/* <Route path={Path.APPALY_LOAN} exact component={AppalyLoan} /> */}
            </Switch>
        </div>
      </div>
		);
	}
}