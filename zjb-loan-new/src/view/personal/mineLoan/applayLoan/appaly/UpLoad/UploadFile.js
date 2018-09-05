import React from 'react';
import {Upload, Button, Icon,message} from 'antd';
import {PIC_BUCKET as Bucket, REGION as Region } from '../../../../../../common/SystemParam';

export default class UploadFile extends React.Component {
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

  uploadRequest = (data) => {
    const file = data.file;
    const fileName = data.file.name;
    const suffix = data.file.name.substring(fileName.lastIndexOf('.'), fileName.length);
    const fileNames = this.uuid();
    const realName = this.props.type + fileNames.replace(/-/g, '') + suffix;
    this.setState({ loading: true });
    global.cos.putObject({
      Bucket: Bucket,
      Region: Region,
      Key: this.props.prefix+realName || 'error/'+realName,
      Body: file,
      onProgress: function (info) {
        const percent = parseInt(info.percent * 10000) / 100;
        const speed = parseInt(info.speed / 1024 / 1024 * 100) / 100;
      },
      onFileFinish: function (err, data, options) {
      },
    },  (err, data) => {
      this.setState({ loading: false });
      if (err) {
        this.setState({
          fileList: [{uid: -1,
          name: fileName,
          status: 'error',
          url: ''}]
        });
        message.error("上传失败");
      } else {
        this.setState({
          fileList: [{uid: -1,
          name: fileName,
          status: 'done',
          url: this.props.baseUrl + this.props.prefix + realName}]
        });
        this.props.onChange([{uid: -1, url: this.props.baseUrl + this.props.prefix + realName, status: 'done',name: fileName,fileurl: this.props.prefix + realName}]);
      }
    });
  };
  onChange = (info) => {
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
      <Upload customRequest={this.uploadRequest} onChange={this.onChange} fileList={this.state.fileList} onRemove={this.remove}  >
        <Button>
          <Icon type="upload" /> {children}
        </Button>
      </Upload>
    );
  }
}
