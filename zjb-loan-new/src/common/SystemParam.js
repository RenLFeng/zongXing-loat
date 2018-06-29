// 部署替换
let build = 'production';  // production 是远端 test 是测试端 local 是本地端

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
