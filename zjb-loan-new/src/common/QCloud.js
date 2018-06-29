import Config  from './myqcloudConfig';
import CryptoJS from './CryptoJS';

export default QCloud ={
  GetSign(){
    let random = parseInt(Math.random() * Math.pow(2, 32));
    let now = parseInt(new Date().getTime() / 1000);
    let e = now + 60*60*24*30; //签名过期时间为当前+60s
    let path = '';//多次签名这里填空
    let str = 'a=' + Config.appid +'&b='+Config.bucket+ '&k=' + Config.sid + '&e=' + e + '&t=' + now + '&r=' + random+ '&u=0&f=' + path ;
    let sha1Res = CryptoJS.HmacSHA1(str, Config.skey);//这里使用CryptoJS计算sha1值，你也可以用其他开源库或自己实现
    let strWordArray = CryptoJS.enc.Utf8.parse(str);
    let resWordArray = sha1Res.concat(strWordArray);
    let sign = resWordArray.toString(CryptoJS.enc.Base64);
    return sign;
  },
  Guid(){
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  },
  UploadFile(imgUrl,fileName){
    let formData = new FormData();
    let file = {uri: imgUrl, type: 'multipart/form-data'};
    formData.append("filecontent",file);
    formData.append("op","upload");
    let sign =this.GetSign();
    let url='http://'+Config.region+'.file.myqcloud.com/files/v2/'+Config.appid+'/'+Config.bucket+fileName;
    let options = {
      'method':'POST',
      'headers':{
        'Accept':'application/json',
        'Content-Type':'multipart/form-data',
        'Authorization': sign,
      },
      body:formData,
    };
    console.log(options);
    console.log(url);
    return fetch(url,options)
      .then((response) => response.json());
  },
  DeleteFile(url){
    let formData = new FormData();
    formData.append("op","delete");
    let sign =this.GetSign();
    let options = {
      'method':'POST',
      'headers':{
        'Accept':'application/json',
        'Authorization': sign,
      },
      body:formData,
    };
    console.log(options);
    console.log(url);
    return fetch(url,options)
      .then((response) => response.json());
  }
};


