import {req} from '../utils/request'; 
  
export const POSITION_KEY = 'd5bf6909751ae65e4406e1bf656ecb59'; // 高德地图key


//通用service
export const CommonService = {
    getPicAuth: async (param) => req.get('/zjb-website/common/sign', param)
};
//优惠券service
export const CouponService = {
    getCouponCount: async ()=> req.get('/zjb-website/coupon/inv/MyCoupon/count'),
    getCoupon:async(param)=>req.post('/zjb-website/coupon/inv/MyCoupon',param),
    // 领取优惠券
    receiveCoupon:async(param)=>req.get('/zjb-website/coupon/receive',param),
    //兑换优惠券
    convertCoupon:async(param)=>req.post('/zjb-website/coupon/convert',param), 
    //获取交换中心中我的优惠券
    getMyConvertCoupon:async(param)=>req.post('/zjb-website/coupon/exchange/centre/top',param), 
    //交换中心
    getCenterCoupon:async(param)=>req.post('/zjb-website/coupon/exchange/centre',param), 
    //券额兑换优惠券
    moneyConvertCoupon:async(param)=>req.post('/zjb-website/coupon/convert/coupon',param), 
    //获取优惠券的地理位置
    getCouponPlace:async() =>req.get('/zjb-website/coupon/place'),
    //优惠券详情
    myCouponDetail:async(param) =>req.get('/zjb-website/coupon/borrower/myCoupon/detail',param),
    
};

// 账户服务
export const accountService={
    //资金动态
    getAccountStatement:async(param)=>req.post('/zjb-dc/capital/dynamic',param),
    /**
     * 投资记录
     * pageParam 
     *      pageCurrent
     *      pageSize
     * flag
     * projectName
     */
    getInvestmentRecord:async(param)=>req.post('/zjb-website/invRecord/MyInvRecord',param),
    //获取投资记录条数
    getInvestmentRecordCount:async()=>req.get('/zjb-website/invRecord/MyInvRecord/count'),
    //获取投资回款明细
    getInvestmentPlan:async(param)=>req.get('/zjb-website/invRecord/MyInvRecord/plan',param)
    
}

//登录 dbb
export const doLogin={
	 userLogin:async(param)=>req.post('/zjb-website/login/login',param),
	 
	 //忘记密码获取验证码及检验是否实名认证
	  fp_getCode:async(param)=>req.get('/zjb-website/userInfo/forgetPwd?loginName='+param),
	  //登录-忘记密码时获取验证码
    f_getCode:async(param)=>req.post('/zjb-website/userInfo/sendAuthCode',param),
    //校验用户
    fp_checkInfo:async(param)=>req.post('/zjb-website/userInfo/checkAuthCode',param),
    //修改密码
    changePassword:async(param)=>req.post('/zjb-website/userInfo/updatePwd',param), 
}

//注册-wfl
export const regiserAccount = {
    // 校验手机号是否存在的接口
    getPhoneExist: async (param) => req.get('/zjb-website/login/check', param),
    // 获取注册验证码的接口
    getAuthCode: async (param) => req.get('/zjb-website/login/sendMessage', param),
    // 注册用户 接口
    regUser: async (param) => req.post('/zjb-website/login/register', param),
}

