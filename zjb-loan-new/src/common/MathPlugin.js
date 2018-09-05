import $ from 'jquery';
//保留小数位并且千分位
String.prototype.fm = function (n) {
  try{
    if(!n && n!==0){
       n=2;
    }
    var s = this;
     if (typeof (s) == 'number') {
        s = s.toFixed(n);
    }
    if (s == "" || s == null) return "";
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    if (s * 1 == 0) return "0.00";
    var l = s.split(".")[0].split("").reverse(),
    r = s.split(".")[1];
    var t = "";
    for (var i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    var val = t.split("").reverse().join("").replace("-,", "-") + "." + r;
    if(val=="NaN.undefined"){
      val ="";
    }
    return val;
  }
  catch(err)
  {
    return "";
  }
}
// 千分位不保留，小数
Number.prototype.fmm = function(num) {
  var result = [ ], counter = 0;
  num = (this || 0).toString().split('');
  for (var i = num.length - 1; i >= 0; i--) {
    counter++;
    result.unshift(num[i]);
    if (!(counter % 3) && i != 0) { result.unshift(','); }
  }
  return result.join('');
}

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
///字符转金额
String.prototype.moneyToNumber= function () {
    var str = this;
    if (str == null || str == "" || str == undefined) return 0;
    if (str.length == 1 && str == "-") return 0;
    try {
        str = str.replace(/,/g, "");
        if (isNaN(str)) return 0;
        return Number(str);
    } catch (e) {
        return 0;
    }
};
///百分数格式成浮点型
String.prototype.perenctToDouble = function () {
    var str = this;
    if (str == null || str == "" || str == undefined) return 0;
    var reg = str.match(/^((\d+\.?\d*)|(\d*\.\d+))\%$/);
    var txt = "";
    if (reg != null) {
        txt = reg[0];
    }
    if (txt == "") {
        return 0;
    }
    var val = str.replace("%", "") * 1 / 100;
    if (isNaN(val)) return 0;
    return val;
}

String.prototype.format = function (args) {
    if (arguments.length > 0) {
        var result = this;
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key]);
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] == undefined) {
                    return "";
                }
                else {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    }
    else {
        return this;
    }
}

Array.prototype.remove = function (dx) {
    if (isNaN(dx) || dx > this.length) { return false; }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i]
        }
    }
    this.length -= 1
}

/**
 * 同正同负校验
 * @return {[type]} [description]
 */
var checkSameNumber = function(bus_row){
    var boolpos = false;//正数
    var boolmin = false;//负数
    var Moneys = new Array();
    $(bus_row).find("input.money").each(function(){
        var val = $(this).val().moneyToNumber();
        if(val!=0){
            Moneys.push(val);
        }
    });
    for(var i=0;i<Moneys.length;i++){
        if (Moneys[i] > 0) boolpos = true;
        else if (Moneys[i] < 0) boolmin = true;
    }
    return boolpos && boolmin;
}
/**
 * 返回数组中重复元素
 * [getRepeatData description]
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
var getRepeatData = function(arr){
    var repeat = "";
    var str ="";
    for(var i=0,len = arr.length;i<len;i++){
        if(str.indexOf(arr[i]+"、")>-1){
            if(repeat.indexOf(arr[i]+"、")==-1){
                repeat+=arr[i]+"、"
            }
        }else{
            str+=arr[i]+"、";
        }
    }
    if(repeat.length>0){
        repeat = repeat.substring(0,repeat.length-1);
    }
    return repeat;
}


//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
function accDiv(arg1,arg2){
    var t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}
        r1=Number(arg1.toString().replace(".",""));
        r2=Number(arg2.toString().replace(".",""));
        return parseFloat(((r1/r2)*Math.pow(10,t2-t1)).toFixed(2));
}

//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
function accMul(arg1,arg2)
{
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return parseFloat((Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)).toFixed(2));
}

//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
//返回值：arg1加上arg2的精确结果
function accAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    return parseFloat(((arg1*m+arg2*m)/m).toFixed(2));
}

//减法函数
function accSub(arg1,arg2){
     var r1,r2,m,n;
     try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
     try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
     m=Math.pow(10,Math.max(r1,r2));
     //last modify by deeka
     //动态控制精度长度
     n=(r1>=r2)?r1:r2;
     return parseFloat(((arg2*m-arg1*m)/m).toFixed(2));
}

//乘
Number.prototype.mul = function (arg){
    return accMul(arg, this);
};
//除
Number.prototype.div = function (arg){
    return accDiv(this, arg);
};
///减
Number.prototype.sub = function (arg){
    return accSub(arg,this);
};
//加
Number.prototype.add = function (arg){
    return accAdd(arg,this);
};
