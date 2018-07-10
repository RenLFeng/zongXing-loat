import {req} from '../utils/request'; 
  
export const POSITION_KEY = 'd5bf6909751ae65e4406e1bf656ecb59'; // 高德地图key

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
    
};

// 账户服务
export const accountService={
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
    getInvestmentPlan:async(param)=>req.get('/invRecord/MyInvRecord/plan',param)
    
}