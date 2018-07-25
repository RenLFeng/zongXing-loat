/*
 * @Author: wfl 
 * @Date: 2018-07-04 17:49:38 
 * @Last Modified by: wfl
 * @Last Modified time: 2018-07-24 19:13:17
 * 步骤数据
 */
import {connect} from 'dva';
export const stepDate = [
    {
        name: '申请借款',
        state: [0]
    },
    {
        name: '进入初审',
        state: [1]
    },
    {
        name: '大数据风控',
        state: [2,3]
    },
    {
        name: '进入终审',
        state: [4,5,6,7]
    },
    {
        name: '确认借款',
        state: [8]
    },
    {
        name: '发优惠券',
        state: [9]
    },
    {
        name: '上线筹款',
        state: [10,11,12,13]
    },
    {
        name: '满标放款',
        state: [14]
    },
    {
        name: '按月还款',
        state: [15]
    },
    {
        name: '还清借款',
        state: [14]
    }
]