import {req} from '../utils/request'; 
  
export const POSITION_KEY = 'd5bf6909751ae65e4406e1bf656ecb59'; // 高德地图key


//通用service
export const CommonService = {
    getPicAuth: async (param) => req.get('/common/sign', param)
};
//优惠券service
export const CouponService = {
    getCouponCount: async ()=> req.get('/coupon/inv/MyCoupon/count'),
    getCoupon:async(param)=>req.post('/coupon/inv/MyCoupon',param),
    // 领取优惠券
    receiveCoupon:async(param)=>req.get('/coupon/receive',param),
    //兑换优惠券
    convertCoupon:async(param)=>req.post('/coupon/convert',param), 
    //获取交换中心中我的优惠券
    getMyConvertCoupon:async(param)=>req.post('/coupon/exchange/centre/top',param), 
    //交换中心
    getCenterCoupon:async(param)=>req.post('/coupon/exchange/centre',param), 
    //券额兑换优惠券
    moneyConvertCoupon:async(param)=>req.post('/coupon/convert/coupon',param), 
    //获取优惠券的地理位置
    getCouponPlace:async() =>req.get('/coupon/place'),
    //优惠券详情
    myCouponDetail:async(param) =>req.get('/coupon/borrower/myCoupon/detail',param),

    getAccountCoupon:async(param) =>req.get('/account/mycoupon',param),
    
};

// 账户服务
export const accountService={
    
    getLoginData:async(param)=>req.get('/login/getData',param),
    //资金动态
    getAccountStatement:async(param)=>req.post('/capital/dynamic',param),
    /**
     * 投资记录
     * pageParam 
     *      pageCurrent
     *      pageSize
     * flag
     * projectName
     */
    getInvestmentRecord:async(param)=>req.post('/invRecord/MyInvRecord',param),
    //获取投资记录条数
    getInvestmentRecordCount:async()=>req.get('/invRecord/MyInvRecord/count'),
    //获取投资回款明细
    getInvestmentPlan:async(param)=>req.get('/invRecord/MyInvRecord/plan',param),
    repayPlan:async(param)=>req.get('/account/getRepayPlan',param),
  // 提交充值信息 获取充值所需数据
    getRecharge:async(param)=>req.post('/account/getRechargeInfo',param),
    // 银行卡绑定
    bindBankCard:async(param)=>req.post('/bankcard/add',param),
    // 银行卡信息校验——聚合数据校验
    verifyBankCard:async(param)=>req.get('/jh/bankCardInfo?bankCard='+param),
    // 获取已绑定的银行卡列表
    getBankCardList:async(param)=>req.get('/bankcard/list/person'),
    //提交提现表单信息接口
    putInformation:async(param)=>req.post('/withdrawals/param',param),
}




export const baseService={
    //获取省份对应的城市
    getCity:async(param)=>req.get('/common/cities?provinceId='+param),
    // 获取项目行业编码类别接口
    getProjectType: async () => req.get('/apply/getProjectCode')
}
  



//登录 dbb
export const doLogin={
	 userLogin:async(param)=>req.post('/login/login',param),
	 
	 //忘记密码获取验证码及检验是否实名认证
	  fp_getCode:async(param)=>req.get('/userInfo/forgetPwd?loginName='+param),
	  //登录-忘记密码时获取验证码
    f_getCode:async(param)=>req.post('/userInfo/sendAuthCode',param),
    //校验用户
    fp_checkInfo:async(param)=>req.post('/userInfo/checkAuthCode',param),
    //修改密码
    changePassword:async(param)=>req.post('/userInfo/updatePwd',param), 
    // 获取用户基础信息的接口
    getUserBaseData:async(param)=>req.get('/userInfo/findOne'),
    //修改登陆密码
    UpdatePass:async(param) => req.post('/zjb-website/userInfo/updatePassword',param),
    changePass:async(param) => req.post('/zjb-website/userInfo/verifyForPassword',param),
 
}






//注册-wfl
export const regiserAccount = {
    // 校验手机号是否存在的接口
    getPhoneExist: async (param) => req.get('/login/check', param),
    // 获取注册验证码的接口
    getAuthCode: async (param) => req.get('/login/sendMessage', param),
    // 注册用户 接口
    regUser: async (param) => req.post('/login/register', param),
}

//个人中心 - wfl
export const personal = {

    //查询平台公告
    getSiteNotice: async (param) => req.get('/notice/getPlatNotice', param),
    //校验邮箱是否存在
    checkEmail:async (param) => req.get('/userInfo/checkEmail',param),
    //邮箱绑定
    bindEmail:async (param) => req.get('/userInfo/bindEmail',param),
    //更改邮箱
    UpdateEmail:async (param) => req.post('/userInfo/updateEmail',param),
    //更改绑定邮箱
    UpdateEmail_:async (param) => req.post('/userInfo/bindingNewEmail',param),
    //获取个人账户.企业账户信息的接口
    getPersonAccountNew: async (param) => req.post('/account/show/info', param),
    //获取有账户的企业信息列表的接口
    getCompanylist: async () => req.get('/account/company/list'),
    // 账户总览优惠券
    getAccountCoupon: async (param) => req.post('/account/mycoupon', param),
    // 获取用户基础信息与login相同
    getLoginData: async () => req.get('/login/getData'),
    //回款计划
    repayPlan: async () => req.get('/account/getRepayPlan'),
     //还款计划
     borrowPlan: async () => req.get('/project/getBorrowPlan'),
}
    

//我的借款
export const mineloan = {
    //
    getMineLoan: async () => req.get('/project/self/project'),
}
//实名认证 - momei
export const securityCentreService = {
  getSafeData: async () => req.get('/securityCenter/findByuserId'),
  createAccount: async(param) => req.post('/account/add', param),
  /** 开户 */
  createAccount: async(param) => req.post('/zjb-dc/account/add', param),
  /** 获取当前用户的企业开户所需信息 */
  getCompanyRealInfo: async() => req.get(''),
  /** 获取企业基本信息 */
  getCompanyBaseData: async() => req.get(''),
  /** 绑定银行卡 */
  bindBankCard: async(param) => req.post('/bankcard/add',param),
  // 获取已绑定的银行卡列表
  getBankCardList: async() => req.get('/bankcard/list/person'),
  /** 解除除银行卡绑定 */
  unbindBankCard: async(param) => req.post('/bankcard/delete',param),

  /** 获取授权所需参数 */
  distribution: async(willStr, companyNo, returnUrl) => req.get(`/author/open?willStr=${willStr}&companyNo=${companyNo}&notifyPageUrl=${returnUrl}`),

  /** 查询已授权的状态 */
  authorizationState: async(companyNo) => req.get(`/author/authorized?companyNo=${companyNo}`),

  /** 取消授权 */
  closeAuthorization: async(willStr,companyNo,returnUrl) => req.get(`/author/close?willStr=${willStr}&companyNo=${companyNo}&notifyPageUrl=${returnUrl}`),

  /** 获取用户基础信息的接口 */
  getUserBaseData: async() => req.get('/zjb-website/userInfo/findOne'),

  /** 为修改密码发送验证码 */
  UpdatePass: async(param) => req.post('/zjb-website/userInfo/updatePassword',param),
  /** 验证修改密码时的验证码 */
  changePass: async(param) => req.post('/zjb-website/userInfo/verifyForPassword',param),
  
  

}
   
