import React from 'react';
import {Upload, Button, Icon, message, Modal} from 'antd';
import _ from 'lodash'; 
import {PIC_BUCKET as Bucket, REGION as Region } from '../../../../../../common/SystemParam';
export default class UploadPicMultipleFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: props.value,
      previewVisible: false,
      previewImage: '',
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
    if (this.state.fileList.length === this.props.maxNum) {
      return;
    }
    const file = data.file;
    const fileName = data.file.name;
    const fileUid = data.file.uid;
    const suffix = data.file.name.substring(fileName.lastIndexOf('.'), fileName.length);
    const fileNames = this.uuid();
    const realName = this.props.type + fileNames.replace(/-/g, '') + suffix;
    if(suffix !== '.jpeg' && suffix !== '.jpg' && suffix !== '.png' && suffix !== '.gif'){
      return;
    }
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
        const fileList = this.state.fileList;
        for (let obj of fileList) {
          if (obj.uid === fileUid) {
            obj.status = 'error';
            obj.url = '';
          }
        }
        this.setState({
          fileList
        });
        message.error("上传失败");
      } else {
        const fileList = this.state.fileList;
        for (let obj of fileList) {
          if (obj.uid === fileUid) {
            obj.status = 'done';
            obj.url = this.props.baseUrl + this.props.prefix + realName;
            obj.realUrl = this.props.prefix + realName;
          }
        }
        this.setState({
          fileList
        } ,() => {
          let arr = this.state.fileList;
          this.props.onChange(arr);
        })

      }
    });
  };
  onChange = (info) => {
    const fileName = info.file.name;
    const suffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length);
    if(suffix !== '.jpeg' && suffix !== '.jpg' && suffix !== '.png' && suffix !== '.gif'){
      message.error('只支持jpeg/jpg/png/gif格式图片的上传');
      return;
    }
    if (this.state.fileList.length === this.props.maxNum) {
      message.error(`最多上传${this.props.maxNum}个文件`);
      return;
    }
    const fileList = this.state.fileList;
    fileList.push({
      uid: info.file.uid,
      name: info.file.name,
      status: 'uploading',
      url: ''
    });
    this.setState({
      fileList
    });
  };

  remove = (info) => {
    const fileList = this.state.fileList;
    this.setState({
      fileList: fileList.filter((item)=>item.uid !== info.uid)
    }, () => {
      let url = [];
      for (let obj of this.state.fileList) {
        if (obj.realUrl) {
          url.push(obj.realUrl);
        }
      }
      this.props.onChange(this.state.fileList);
    })
  };

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传照片</div>
      </div>
    );
    const { children } = this.props;
    return (
      <div className="clearfix">
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          customRequest={this.uploadRequest}
          onPreview={this.handlePreview}
          onChange={this.onChange}
          onRemove={this.remove}
        >
          {fileList.length >= 10 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
