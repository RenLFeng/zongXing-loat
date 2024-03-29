import {req} from '../utils/request'; 
  
export const POSITION_KEY = 'd5bf6909751ae65e4406e1bf656ecb59'; // 高德地图key
export const socketUrl='http://192.168.1.4:8899?clientId='  //socket url  打包记得替换


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
    
    getCouponInfo:async(param)=> req.post('coupon/borrow/mycoupon/statistics',param)
    
    
};

// 账户服务
export const accountService={
    // 获取账户总览首页数据
    getPersonalData: async () => req.get('/account/company/totality/info'), 
    //获取用户登录信息
    getLoginData:async(param)=>req.get('/login/getData',param),
    //资金动态
    getAccountStatement:async(param)=>req.post('/capital/dynamic',param),
    // 获取实名认证状态接口
    getRealAuthByMoneyMore: async ()=>req.get('/account/mmm/state'),
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


// 基础信息 dbb

export const baseService={
    //获取省份对应的城市
    getCity:async(param)=>req.get('/common/cities?provinceId='+param),
    // 获取项目行业编码类别接口

    getProjectType: async () => req.get('/apply/getProjectCode'),
    
    // 获取当前项目的 委员会确认结果
    getConfirmResult: async (param) => req.get('project/getRateAndLevel?projectId='),
      // 获取之前的 借款信息接口
      getLoanInfo: async () => req.get('/apply/getOne'),

    // 还款计划详情
    getDetailPlane:async(param)=>req.get('/project/borrowPlanInfo?projectId='+param.projectId+"&forPayTime="+param.forPayTime),
    // 手动还款接口
    manualReimpayment:async(param,params)=>req.post('/repayment/manually?notifyPageUrl='+param,params),
    // 获取还款计划
    getRepaymentPlan:async()=>req.get('/project/getBorrowPlan'),
    // 保存 借款信息接口
    saveLoanInfo: async (param) => req.post('/apply/save', param),
    // 提交借款信息接口-改状态
    commit: async () => req.get('/apply/submit'),
    //提交借款信息-校验信息
    commitInfo: async (param) => req.post('/apply/submitToZero', param),
    

    // 项目可选城市获取
    getProCityList: async () => req.get('/apply/getCity'),
    //获取之前的项目信息
    getBeforeProjectData: async ()=>req.get('/apply/getFinishProject'),
    // 获取上传视频的签名
    createKey: async ()=>req.get('/getUploadSignature'),

    //提现时判断是否缴纳佣金
    payCommission: async()=>req.get('withdrawals/kickback/bill'),
    
    //提交佣金
    putCommission: async(param)=>req.get('/kickback/mmm/param',param),

    //提前还款获取还款金额
    earlyRepayment: async (param)=>req.get('/project/getAdcanceRepayMoney',param),
    //提前还款
    earlyPayment:async (param)=>req.post('repayment/beforehand',param),

}

  
export const wsbaseService={
   
    //获取风控审核记录
    getAuditRecord: async (param)=>req.post('/projectApproval/getByProjectId',param),
    //获取项目详情
    getPDetail: async (param)=>req.get('/project/getOne',param),
    //获取视频签名
    createKey: async ()=>req.get('/getUploadSignature'),
    // 获取图片签名token
    getAuth: async (param)=>req.get('/common/sign', param),
    //项目排版-项目详情
    getEditDetail:async (param)=>req.get('/projectInfo/getOne',param),
    //项目排版-保存
    saveEditDetail:async (param)=>req.post('/projectInfo/updateProjectInfo',param),
    
    //项目初审
    firstView:async (param)=>req.post('/projectApproval/submitFirstTrial',param),
}

  


//登录 dbb
export const doLogin={

	userLogin:async(param)=>req.post('/company/login',param),	 
    //忘记密码获取验证码及检验是否实名认证
    fp_getCode:async(param)=>req.get('/userInfo/forgetPwd',param),
    //登录-忘记密码时获取验证码
    f_getCode:async(param)=>req.post('/userInfo/sendAuthCode',param),
    //校验用户
    fp_checkInfo:async(param)=>req.post('/userInfo/checkAuthCode',param),
    //修改密码
    changePassword:async(param)=>req.post('/userInfo/updatePwd',param), 
    // 获取用户基础信息的接口
    getUserBaseData:async(param)=>req.get('/userInfo/findOne'),
    //修改登陆密码
    UpdatePass:async(param) => req.post('/userInfo/updatePassword',param),
    changePass:async(param) => req.post('/userInfo/verifyForPassword',param),
 
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

     //发优惠券获取项目信息
     couponGetProject: async () => req.get('/project/getMyLoaningProject'),

     //获取用户id
     getuserID :async () => req.get('/account/userid'),


}
    

//我的借款 - wfl
export const mineloan = {
    //获取项目
    getMineLoan: async () => req.get('/project/self/project'),
    //项目公告
    getNotice: async (param) => req.get('/projectNotice/getOne', param),
    //保存公告
    saveNotice: async (param) => req.post('/projectNotice/save', param), 
    //删除公告
    delNotice: async (param) => req.get('/projectNotice/delete', param),
    //获取项目历程
    getTimeLine: async (param) => req.get('/projectJourney/getOne', param), 
    //添加项目历程
    addTimeLine: async (param) => req.post('/projectJourney/save', param), 
    //删除项目历程
    delTimeLine: async (param) => req.get('/projectJourney/delete', param),  
    //获取项目等级 和利率/project/getRateAndLevel 

    getProjectdl: async (param) => req.get('/project/getRateAndLevel', param),
    //删除项目
    delProject: async (param) => req.get('/project/delete', param), 
    //投前咨询
    getConsult: async (param) => req.post('/projectTopic/getInvConsulting', param),
    //获取投资人列表
    getInvestRecord: async (param) => req.post('/invRecord/getOne', param),
    //提交回复 投后
    saveConsult: async (param) => req.post('/answer/save', param),
    //投前
    saveConsultq: async (param) => req.post('/projectTopicReply/save', param),

    //缴费
    payLoan: async (param) => req.get('/risk/payment', param),
    //获取项目级别
    getSureDate: async (param) => req.get('/project/getRateAndLevel', param), 
    //同意？终止？不同意？
    isAgreeBorrow: async (param) => req.post('/projectApproval/userVerifyRate', param), 
    //补充资料
    upbcInfo:  async (param) => req.post('/projectApproval/updateFile', param),
    /**
     * 
     * 优惠券
     * 
     */
    //省
    getProvince: async () => req.get('/area/getProvince'),
    //市
    getCity: async (param) => req.get('/area/getChild', param),
    //区
    getArea: async (param) => req.get('/area/getChild', param),

    //保存优惠券
    saveCou: (param) => req.post('/coupon/save', param),
    //获取优惠券
    getSendCou: (param) => req.get('/coupon/self/coupon', param),
    //提交优惠券
    commitCou: (param) => req.post('/projectApproval/subCoupon', param),
    //提交完善信息
    commitwsInfo: (param) => req.post('/projectApproval/subPendRelease', param),
    //确认借款，获取安心签短信
    getSign : (param)  => req.get(`/cfca/loan/sendMessage?projectId=${param}`),
    //借款人姓名身份证号校验
    checkUserInfo : async(param) => req.post(`jh/authIdCard`,param)
      

}
//实名认证 - momei
export const securityCentreService = {
  getSafeData: async () => req.get('/securityCenter/findByuserId'),
  createAccount: async(param) => req.post('/account/add', param),
  /** 开户 */
  //createAccount: async(param) => req.post('/zjb-dc/account/add', param),
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
  getUserBaseData: async() => req.get('/userInfo/findOne'),

  /** 为修改密码发送验证码 */
  UpdatePass: async(param) => req.post('/userInfo/updatePassword',param),
  /** 验证修改密码时的验证码 */
  changePass: async(param) => req.post('/userInfo/verifyForPassword',param),
  
  //授权
  getAccredit: async() => req.get('/mohe/getORcode'),
  

}
