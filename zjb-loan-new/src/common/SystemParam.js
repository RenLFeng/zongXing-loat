


// 部署替换
let build = 'local';  // production 是远端 test 是测试端 local 是本地端

let PIC_BUCKET = 'zjb-test-1255741041'; //zjb 测试服务器用
let REGION = 'ap-guangzhou'; // 图片上传服务器区域配置 测试服务器用
let IMG_BASE_URL = 'https://zjb-test-1255741041.picgz.myqcloud.com/'; //图片上传回显地址 测试服务器用
let TURN_BACK = 'http://testmanage.5izjb.com'; // 从大众网页跳到企业后台管理页 面的地址 测试服务器配置
let LIMIT_MOENY = true;  // 金额限制 true进行限制 false不进行限制
let AUTH_ADDRESS = 'http://test.moneymoremore.com:88/main/' // 乾多多地址
let SOCKET_URL = 'http://192.168.1.36:8899';
/*测试楼下配置*/
if (build === 'production') {
  // 远端
  PIC_BUCKET = 'zjb-test-1255741041'; //zjb 测试服务器用
  REGION = 'ap-guangzhou'; // 图片上传服务器区域配置 测试服务器用
  IMG_BASE_URL = 'https://zjb-test-1255741041.picgz.myqcloud.com/'; //图片上传回显地址 测试服务器用
  TURN_BACK = 'http://test.5izjb.com/zjbindex.html'; // 从大众网页跳到企业后台管理页 面的地址 测试服务器配置
  LIMIT_MOENY = true;
  AUTH_ADDRESS = 'https://my.moneymoremore.com/';
  SOCKET_URL = 'http://192.168.1.36:8899';
} else if (build === 'test') {
  //  测试
  IMG_BASE_URL = 'http://zjb01-1255741041.picsh.myqcloud.com/'; //图片上传回显地址 开发服务器用
  REGION = 'ap-shanghai'; // 图片上传服务器区域配置 开发 服务器用
  PIC_BUCKET = 'zjb01-1255741041'; //zjb 开发服务器用
  TURN_BACK = 'http://dev3manage.zjb188.com:7956'; // 从大众网页跳到企业后台管理页 面的地址 测试服务器配置
  LIMIT_MOENY = false;
  AUTH_ADDRESS = 'http://test.moneymoremore.com:88/main/';
  SOCKET_URL = 'http://192.168.1.36:8899';
} else if (build === 'local') {
  /*开发配置*/
  IMG_BASE_URL = 'http://zjb01-1255741041.picsh.myqcloud.com/'; //图片上传回显地址 开发服务器用
  REGION = 'ap-shanghai'; // 图片上传服务器区域配置 开发 服务器用
  PIC_BUCKET = 'zjb01-1255741041'; //zjb 开发服务器用
  TURN_BACK = 'http://192.168.1.192:8001'; // 从大众网页跳到企业后台管理页 面的地址 测试服务器配置
  LIMIT_MOENY = false;
  AUTH_ADDRESS = 'http://test.moneymoremore.com:88/main/';
  SOCKET_URL = 'http://192.168.1.173:8001';
}

// 导出环境变量配置
export {PIC_BUCKET,REGION,IMG_BASE_URL,TURN_BACK,build,LIMIT_MOENY, SOCKET_URL,AUTH_ADDRESS};

// 个人账户页面
export const PERSONAL_PAGE = `http://${window.location.host}/#/index/uCenter/personAccount`;

// 授权页面地址
export const AUTH_PAGE_URL = `http://${window.location.host}/#/index/uCenter/safeCenter`;

// 手机号验证正则
export const VER_PHONE = /^1([38][0-9]|5[012356789]|4[579]|7[0135678]|9[89])[0-9]{8}$/;
// 身份证号正则
export const ID_CORD = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

//真实姓名验证正则
export const NAME_REG_ = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;

//qq号验证正则
export const QQ_REG = /[1-9][0-9]{4,14}/;

//微信号验证正则
export const WeChat_REG = /^[a-zA-Z\d_]{5,}$/;

//家庭住址验证正则
export const ZHUZHI_REG = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;

//校验个人爱好正则
export const HOBBY_REG = /[\u4e00-\u9fa5a-zA-Z]{2,}/;

//链接正则
export const URL_REG = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;

//验证含数字，字母，中文的正则
export const reg_REG = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;

//验证含中文，英文的正则
export const reg_REG1 = /^[\u4E00-\u9FA5A-Za-z]+$/;

//只包含汉字的正则
export const china_REG = /^[\u4E00-\u9FA5]+$/;

// 用户名正则
export const USER_REG = /^[a-zA-Z0-9_-]{2,16}$/;

// 营业执照号正则
export const LICENSE = /^([0-9a-zA-Z]{18}$|\d{15}$)/;

// 邮箱验证正则
export const E_MAIL =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
// 座机电话正则
export const TEL_PHONE = /^[\d\-]*$/;;



// 银行卡号正则
export const BANK_CARD = /^\d{11,25}$/;

// 我的投资订单状态
export const ORDER_STATUS = {
  '-1': '失败',
  '0': '待付款',
  '1': '成功',
  '2': '成功',
  '-2': '已退款',
  '4': '处理中'
};

//  我的投资状态列表
export const MY_INCOME_STATUS = {
  '10': '投标中',
  '11': '等待审核',
  '12': '还款中',
  '-4': '还款异常',
  '13': '已结清',
  '-1': '已流标',
};

// 带小数点的正则验证
export const MONEY_REG = /^\d+(\.\d+)?$/;

// 正整数正则
export const MUN_INTEGER = /^[0-9]*[1-9][0-9]*$/;

// 大于2 带小数
export const MONEY_REG_ = /[2-9](\.\d*[1-9]){1}|[1-9]\d+(\.\d*[1-9])?$/

// 大于1 带小数
export const MONEY1_REG_ = /[1-9](\.\d*[1-9]){1}|[1-9]\d+(\.\d*[1-9])?$/;

//身份证号
export const CARD_REG = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

//密码校验
export const pass_reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,15}$/;

//一天多少秒
const DATE_SECONDS = 86400;
//一小时多少秒
const HOURS_SECONDS = 3600;
//一分钟多少秒
const MIN_SECONDS = 60;
//验证码冷却时间
export const AUTH_CODE_TIME = 120;
export const AUTH_CODE_TIME_ = 60;
//已完成项目的一页显示个数
export const COMPLETE_PAGE_SIZE = 8;
// 正在筹款项目一页显示个数
export const ING_PAGE_SIZE = 6;
// 已完成项目 flag3
export const COMPLETE_PROJECT_FLAG = 13;

export const ING_PROJECT_FLAG = 10;
//搜索项目时的默认值 分别是 信用等级 年华收益率 借款周期 项目名称
export const PROJECT_LEAVE_CODE = '';
export const PROJECT_RATE = -1;
export const PROJECT_PERIOD = -1;
export const PROJECT_NAME = '';

//秒换算倒计时 天/小时/分钟/秒
export function conversionTime(initialTime) {
  if (Math.floor(initialTime/DATE_SECONDS) !== 0) {
    return `${Math.floor(initialTime/DATE_SECONDS)}天`;
  }
  if (Math.floor(initialTime/HOURS_SECONDS) !== 0) {
    return `${Math.floor(initialTime/HOURS_SECONDS)}小时`;
  }
  if (Math.floor(initialTime/MIN_SECONDS) !== 0) {
    return `${Math.floor(initialTime/MIN_SECONDS)}分钟`;
  }
  return `${initialTime}秒`;

}

// 项目历程图片后缀
export const COURSE_PROJECT_PIC = 'imageMogr2/thumbnail/200x/interlace/1';

//页数显示的转换 {}
export function pageShow(currentPage, maxPage) {
  const data = {
    lastPage: false,
    leftEllipsis: false,
    page: [],
    rightEllipsis: false,
    nextPage: false,
    firstPage: false,
    finalPage: false
  };
  // 获取显示的页数
  let str = currentPage + '';
  for (let i = 1; i <= 2; i++) {
    if (currentPage - i >= 1) {
      str = `${currentPage - i},${str}`;
    }
    if (currentPage + i <= maxPage) {
      str = `${str},${currentPage + i}`;
    }
  }
  if (currentPage - 4 > 1) {
    data.leftEllipsis = true
  }
  if (currentPage > 1) {
    data.lastPage = true;
  }
  if (currentPage + 4 < maxPage) {
    data.rightEllipsis = true;
  }
  if (currentPage < maxPage) {
    data.nextPage = true;
  }
  if (str.indexOf(',') !== -1) {
    data.page = str.split(',');
  } else {
    data.page = [currentPage];
  }
  return data;
}

//页数显示的转换 {} 前后带第一页 最后一页
export function pageShows(currentPages, maxPages) {
  const currentPage = currentPages *1 ;
  const maxPage = maxPages * 1;
  const data = {
    lastPage: false,
    leftEllipsis: false,
    page: [],
    rightEllipsis: false,
    nextPage: false,
    firstPage: false,
    finalPage: false
  };
  // 获取显示的页数
  let str = currentPage + '';
  for (let i = 1; i <= 2; i++) {
    if (currentPage - i > 1) {
      str = `${currentPage - i},${str}`;
    }
    if (currentPage + i < maxPage) {
      str = `${str},${currentPage + i}`;
    }
  }
  if (currentPage - 3 > 1) {
    data.leftEllipsis = true
  }
  if (currentPage > 1) {
    data.lastPage = true;
    data.firstPage = true;
  }
  if (currentPage + 3 < maxPage) {
    data.rightEllipsis = true;
  }
  if (currentPage < maxPage) {
    data.nextPage = true;
    data.finalPage = true;
  }
  if (str.indexOf(',') !== -1) {
    data.page = str.split(',');
  } else {
    data.page = [currentPage];
  }
  return data;
}

//跳转锚点
export function scrollToAnchor(anchorName) {
  if (anchorName) {
    let anchorElement = document.getElementById(anchorName);
    if(anchorElement) { anchorElement.scrollIntoView(); }
  }
}
