/*
 * @Author: wfl 
 * @Date: 2018-07-10 09:36:57 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-11 16:46:29
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


