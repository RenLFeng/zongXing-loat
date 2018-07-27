/*
 * @Author: wfl 
 * @Date: 2018-07-06 16:20:43 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-27 15:10:19
 * @des: 日历 - 日期  金钱相关方法
 */

//保留两位小数 方法 单位：万
export function returnFloat(value){
	// let values = Math.round(parseFloat(value / 10000)*100)/100;
	// let s=values.toString().split(".");
	// if(s.length==1){
	// 	values=values.toString()+".00";
	// 	return values;
	// }
	// if(s.length>1){
	// 	if(s[1].length<2){
	// 		values=values.toString()+"0";
	// 	}
	// 	return values;
    // }
    return value
}

//保留两位小数 方法 单位：元
export function returnff(value){
	let values = Math.round(parseFloat(value*100))/100;
    let s=values.toString().split(".");
	if(s.length==1){
		values=values.toString()+".00";
		return values;
	}
	if(s.length>1){
		if(s[1].length<2){
			values=values.toString()+"0";
		}
		return values;
	}
}

//日期格式化
export function parseTime(time, cFormat) {
	if (!time) {
		time = new Date();
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
	let date;
	if (typeof time == 'object') {
		date = time;
	} else {
		if (('' + time).length === 10)
			time = parseInt(time) * 1000;
		date = new Date(time);
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	};
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key];
		if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
		if (result.length > 0 && value < 10) {
			value = '0' + value;
		}
		return value || 0;
	});
	return time_str;
}

//上一月
export function lastMonth(date) {
    let arr = date.split("-");
    let year = arr[0]; //获取当前日期的年份
    let month = arr[1]; //获取当前日期的月份
    let year2 = year;
    let month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    if (month2 < 10) {
        month2 = "0" + month2;
    }
    let t2 = year2 + "-" + month2;
    return t2;
}

//下一月
export function nextMonth(date) {
    let dates = new Date();
    let y = dates.getFullYear();
    let m = dates.getMonth() + 1;
    let arr = date.split("-");
    let year = arr[0]; //获取当前日期的年份
    let month = arr[1]; //获取当前日期的月份
    let year2 = year;
    let month2 = parseInt(month) + 1;
    if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
    }
    if (month2 < 10) {
        month2 = "0" + month2;
    }
    let t2 = year2 + "-" + month2;
    return t2;
}

//获取每月的第一天是星期几
export function firstDayWeek(date) {
    let day = date + '-01'
    let myDatesss = new Date(day);
    return myDatesss.getDay()
}

//获取每月的几号是星期几
export function MonthDayWeek(day, state = false) {
    let myDatesss = new Date(day);
    let week = myDatesss.getDay();
    if (state) {
        switch (week) {
            case 0:
                return '星期日';
            case 1:
                return '星期一';
            case 2:
                return '星期二';
            case 3:
                return '星期三';
            case 4:
                return '星期四';
            case 5:
                return '星期五';
            case 6:
                return '星期六';
        }
    } else {
        switch (week) {
            case 0:
                return '周日';
            case 1:
                return '周一';
            case 2:
                return '周二';
            case 3:
                return '周三';
            case 4:
                return '周四';
            case 5:
                return '周五';
            case 6:
                return '周六';
        }
    }
}

//获取每月的天数
export function getMonDay(date) {
    let days = date.split('-')
    let day = new Date(days[0], days[1], '0');
    return Number.parseInt(day.getDate());
}

//获得整理后的数据
export function reorganizeDate(allday, firstDay) {
    //所有天数
    let allDays = [];
    //j  周几
    let j = firstDay;
    for (let i = 1; i <= allday; i++) {
        //初始数组中无值直接push  
        if (allDays.length === 0) {
            allDays.push({
                day: i,
                week: firstDay
            });
            j++;
        } else {
            //满7天重新从周一开始  
            if (j === 7) {
                j = 0;
            }
            allDays.push({
                day: i,
                week: j
            });
            j++;
        }
    }
    //如果第一天不是周一 则添加空补全
    if (firstDay !== 1) {
        let add = [];
        //如果是周天  push 6条补全 
        if (firstDay === 0) {
            add = pushDay(6);
            //否则 是周几push 几-1条补全
        } else {
            add = pushDay(firstDay - 1);
        }
        allDays = [...add, ...allDays];
    }
    //将得到的数组按7条为一组拆开重组
    let outDay = [];
    let outDays = [];
    let m = 0;
    for (let i = 0; i < allDays.length; i++) {
        if (m < 7) {
            outDay.push(allDays[i]);
            m++;
            //最后一组
            if (i === allDays.length - 1) {
                outDays.push(outDay);
            }
        } else {
            outDays.push(outDay);
            m = 0;
            i--;
            outDay = [];
        }
    }
    //拆完重组得到的数组 [[],[],[],[],[]]  
    return [...outDays];
}

//不是周一补全
function pushDay(num) {
    let add = [];
    for (let i = 0; i < num; i++) {
        add.push({
            day: -1,
            week: ""
        });
    }
    return add;
}

//将一年按月份每组三个划分[[1,2,3],[4,5,6],[7,8,9],[10,11,12]]
export function yearToMonth() {
    let arrs = [];
    let m = 1;
    for (let i = 0; i < 4; i++) {
        let arr = [];
        for (let j = 0; j < 3; j++) {
            arr.push({
                name: `${m}月`,
                id: m,
            })
            m++;
        }
        arrs.push(arr);
    }
    return arrs;
}

export function nowDay() {
    let date = new Date();
    let formetDate = date;
    let Year = 0;
    let Month = 0;
    let Day = 0;
    let CurrentDate = "";
    Year = formetDate.getFullYear(); //ie火狐下都可以
    Month = formetDate.getMonth() + 1;
    Day = formetDate.getDate();
    CurrentDate += Year + "-";
    if (Month >= 10) {
        CurrentDate += Month + "-";
    } else {
        CurrentDate += "0" + Month + "-";
    }
    if (Day >= 10) {
        CurrentDate += Day;
    } else {
        CurrentDate += "0" + Day;
    }
    return CurrentDate;
}


//筹款时长
export function getTime(time){
        let date3 = time; //时间差秒
        //计算出相差天数
        let days=Math.floor(date3/(24*3600));
        //计算出小时数
        let leave1=date3%(24*3600);  //计算天数后剩余的毫秒数
        let hours=Math.floor(leave1/3600);
        //计算相差分钟数
        let leave2=leave1%(3600);        //计算小时数后剩余的毫秒数
        let minutes=Math.floor(leave2/60);
        //计算相差秒数
        let leave3=leave2%60;     //计算分钟数后剩余的毫秒数
        let seconds=Math.round(leave3);
        return (days > 0 ? days +'天' : '' )+ (hours > 9 ? hours : '0' + hours ) + ":" + (minutes > 9 ? minutes : '0' + minutes )  + ":" + (seconds > 9 ? seconds : '0' + seconds ) 
}


//筹款进度
export function loanDelay(money1, money2){
   let jindu = Math.floor((money2 / money1) * 100 / 100) * 100;
   if(jindu === 0){
       if(money2 !== 0){
           jindu = 1;
       }
   }else if(jindu === 100){
       if(money1 - money2 !== 0){
           jindu = 99
       }
   }
   return jindu;
}


