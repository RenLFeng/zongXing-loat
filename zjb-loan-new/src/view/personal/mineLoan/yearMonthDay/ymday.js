/*
 * @Author: wfl 
 * @Date: 2018-07-10 09:36:57 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-27 15:44:06
 */
//获取未来15年
export function getYears(){
    let myDate = new Date();
    let y = Number.parseInt(myDate.getFullYear());
    let years = [];
    for(let i = 0; i < 15; i++){
        years.push(y++)
    }
    return years;
}

//12个月
export function getMonths(){
    let months = [];
    for(let i = 0; i < 12; i++){
        // if(i < 9){
            months.push(i+1)
        // }else{
        //     months.push('0' + (i+1))
        // }
    }
    return months;
}

//获取当月天数
export function getDays(date) {
    let d = date.split('-')
    let day = new Date(d[0], d[1], '0');
    let num = Number.parseInt(day.getDate())
    let days = [];
    for(let i = 1; i <= num; i++){
        days.push(i)
    }
    return days;
}

export function checkTime(endtime){
    let y = Number.parseInt(new Date().getFullYear());
    let m = Number.parseInt(new Date().getMonth() + 1);
    let day = Number.parseInt(new Date().getDate());
    let now = y+'-'+m+'-'+day;
    var time1 = new Date(y+'-'+m+'-'+day).getTime();
    var time2 = new Date(endtime).getTime();
    if(time1 > time2){
        return false;
    }
    //判断时间跨度是否大于6个月
    var arr1 = now.split('-');
    var arr2 = endtime.split('-');
    arr1[1] = parseInt(arr1[1]);
    arr1[2] = parseInt(arr1[2]);
    arr2[1] = parseInt(arr2[1]);
    arr2[2] = parseInt(arr2[2]);
    var flag = true;
    if(arr1[0] == arr2[0]){//同年
        if(arr2[1]-arr1[1] < 6){ //月间隔小于6个月
            flag = false;
        }else if(arr2[1]-arr1[1] == 6){ //月相隔6个月，比较日
            if(arr2[2] < arr1[2]){ //结束日期的日小于开始日期的日
                flag = false;
            }
        }
    }else{ //不同年
        if(arr2[0] - arr1[0] < 0){
            flag = false;
        }else if(arr2[0] - arr1[0] == 1){
            if(arr1[1] < 6){ //开始年的月份于6时，不需要跨年
                if(arr2[1] - arr1[2] < 6){
                    flag = false;
                }
            }else if(arr1[1]+6-arr2[1] > 12){ //月相隔小于6个月
                flag = false;
            }else if(arr1[1]+6-arr2[1] == 12){ //月相隔6个月，比较日
                if(arr2[2] < arr1[2]){ //结束日期的日大于开始日期的日
                    flag = false;
                }
            }
        }
    }
    if(!flag){
        return false;
    }
    return true;
}
