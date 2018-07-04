
import React from 'react';
import LeftMenu from '../../components/UCenterComponent/leftMenu';
import '../../assets/ucenter/myinvitioncode.scss';
import {Input,Button,Table} from 'antd';

class MyInvitationCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            data:[]
         }
    }
    componentDidMount(){
        $("#qrcodeCanvas").qrcode({
            render : "canvas",    //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
            text : '邀请码具体如果开发，后期待商量！',    //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
            width : "130",               //二维码的宽度
            height : "130",              //二维码的高度
            background : "#fff",       //二维码的后景色
            foreground : "#000",        //二维码的前景色 
        });
    }
    render() { 
        //提现
    const Column = [{
        title: '序号', 
        align:'center',
        width:80,
        size:16,
        render:function(text,record,index){
          return index+1;
        }
        },  {
        title: '邀请时间',  
        align:'center',
        }, {
        title: '好友名称', 
        align:'center', 
        }]; 
      const locale = {
        filterTitle: '筛选',
        filterConfirm: '确定',
        filterReset: '重置',
        emptyText: '暂无数据',
      };
        return ( 
            <div>
                <LeftMenu  param={this.props} />
                <div  className="fr my-code">
                    <div className='top-content'>
                        <p className='top-title'>邀请好友投资 </p>
                        <p className='t1'>
                            <span >我的好友邀请码</span>
                            <span className='text2'>24356668059</span>
                        </p>
                        <p className='t2'>
                            <span >邀请链接</span>
                            <span className='text2'>http://localhost:8000/#/index/uCenter/myinvitationcode</span>
                            <Button type='primary' style={{fontSize:16}}>复制链接</Button>
                        </p>
                        <div className='t3'>
                            <div className='div1'>
                                <div id='qrcodeCanvas' className='code'> </div>
                                <p>邀请码：24356668059</p>
                            </div>
                            <div className='text1'>
                                <p style={{fontSize:14}}>可用手机拍照，将照片分享给朋友；通过长按图片识别图中二维码，来打开邀请链接</p>
                            </div>
                        </div>
                        <p className='t4'>
                            <span className='text2'>分享至 </span>
                            <i className='zjb zjb-weixin'></i> 
                            <i className='zjb zjb-kongjian'></i>
                            <i className='zjb zjb-weibo'></i>
                            <i className='zjb zjb-icon_QQ'></i> 
                        </p>
                    </div> 
                    <div  className='top-content m20'>
                        <p className='top-title'>邀请到的好友 <span className='sub-title'>奖励发放记录</span> </p>
                        <p className='t5'>您目前共邀请2位好友成为用户</p> 
                        <Table columns={Column} locale={locale}  dataSource={this.state.data} pagination={false} bordered size="small" />
                    </div>
                </div>
                
            </div> 
        )
    }
}
 
export default MyInvitationCode;


