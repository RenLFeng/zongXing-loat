import React from 'react';
import {Upload, Button, Icon, message} from 'antd';
import {PIC_BUCKET as Bucket, REGION as Region } from '../../../../../../common/SystemParam';
import { baseService} from '../../../../../../services/api';

export default class UploadVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: props.value
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        fileList: nextProps.value,
      });
    }
  }

  uuid = () => {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("");
  };

  getKey = (callback) => {
    baseService.createKey()
      .then((data)=>{
        if (data.code === 0) {
          callback(data.data);
        } else {
          message.error('获取签名失败');
        }
      })
      .catch((err) => {
        message.error('获取签名失败');
      })
  };

  uploadRequest = (data) => {
    const file = data.file;
    const fileName = data.file.name;
    const suffix = data.file.name.substring(fileName.lastIndexOf('.'), fileName.length);
    if (suffix!=='.mp4') {
      message.warning('只支持mp4的视频格式上传');
      return;
    }
    if (file.size > 100*1024*1024) {
      message.warning('上传文件不能大于40MB');
      return;
    }
    const fileNames = this.uuid();
    const realName = this.props.type + fileNames.replace(/-/g, '') + suffix;
    window.qcVideo.ugcUploader.start({
      videoFile: file,
      getSignature: this.getKey,
      allowAudio: 1,
      success:(result) => {
      },
      error:(result) => {
        this.setState({
          fileList: [{uid: -1,
            name: fileName,
            status: 'error',
            url: ''}]
        });
        message.error("上传失败");
      },
      finish:(result) => {
        this.setState({
          url:result.videoUrl,
          fileList: [{uid: -1,
            name: fileName,
            status: 'done',
            url: result.videoUrl}]
        });
        this.props.onChange([{uid: -1, url: result.videoUrl, status: 'done',name: fileName, fileId: result.fileId}]);
      }
    });
  };
  onChange = (info) => {
    const index1=info.file.name.lastIndexOf(".");
    const index2=info.file.name.length;
    const postf=info.file.name.substring(index1,index2);
    if (postf!=='.mp4') {
      return;
    }
    if (info.file.size > 40*1024*1024) {
      // message.warning('上传文件不能大于40MB');
      return;
    }
    this.setState({fileList: [{
        uid: info.file.uid,
        name: info.file.name,
        status: 'uploading',
        url: ''
      }]
    })
  };
  remove = () => {
    this.setState({
      fileList: []
    });
    this.props.onChange([]);
  };
  render() {
    const { children } = this.props;
    return (
      <Upload customRequest={this.uploadRequest} onChange={this.onChange} fileList={this.state.fileList} onRemove={this.remove}>
        <Button>
          <Icon type="upload" /> {children}
        </Button>
      </Upload>
    );
  }
}

