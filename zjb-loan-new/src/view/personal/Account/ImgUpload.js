import React from 'react';
import { Upload, Icon, message ,Modal} from 'antd';
import {PIC_BUCKET as Bucket, REGION as Region } from '../../common/systemParam';
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('只能上传图片格式');
  }
  const isLt2M = file.size / 1024 / 1024 < 10;
  if (!isLt2M) {
    message.error('照片限制在2MB以内');
  }
  return isJPG && isLt2M;
}

export default class ImgUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      showReview: false,
      imageUrl: props.value
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        imageUrl: nextProps.value,
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
    if(suffix !== '.jpeg' && suffix !== '.jpg' && suffix !== '.png' && suffix !== '.gif'){
      message.error('只支持jpeg/jpg/png/gif格式图片的上传');
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
        console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
      },
      onFileFinish: function (err, data, options) {
        console.log(options.Key + ' 上传' + (err ? '失败' : '完成'));
      },
    },  (err, data) => {
      this.setState({ loading: false });
      if (err) {
        console.log(err);
        message.error("图片上传失败");
      } else {
        this.setState({imageUrl: this.props.prefix +realName});
        console.log(this.props.prefix + realName);
        this.props.onChange(this.props.prefix + realName);
      }
    });
  };

  handleCancel() {
    this.setState({visible: false})
  }

  changeReview(type) {
    if (this.state.imageUrl) {
      this.setState({showReview: type});
    }
  }

  render() {
    const uploadButton = (
      <div style={this.props.style?this.props.style:styles.div} >
        <Icon type={this.state.loading ? 'loading' : 'plus-circle-o'} />
        <div className="ant-upload-text">{this.props.tipText}</div>
      </div>
    );
    const fileButton = (
      <div style={this.props.style?this.props.style:styles.div} >
        <Icon type={'down-circle-o'} />
        <div className="ant-upload-text">上传成功</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    const {type} = this.props;
    const {visible, showReview} = this.state;
    if (this.state.loading) {
      return (
        <Upload
          name="avatar"
          listType="picture-card"
          showUploadList={false}
          className={this.props.className}
          action="//jsonplaceholder.typicode.com/posts/"
          customRequest={this.uploadRequest}
        >
          <div style={this.props.style?this.props.style:styles.div}>
            <Icon type={'loading'} />
            <div className="ant-upload-text">{this.props.tipText}</div>
          </div>
        </Upload>
      );
    }
    return (
      <div
        style={{width: 256}}
        onMouseEnter={()=>this.changeReview(true)}
        onMouseLeave={()=>this.changeReview(false)}
      >
        <Upload
          name="avatar"
          listType="picture-card"
          showUploadList={false}
          className={this.props.className}
          action="//jsonplaceholder.typicode.com/posts/"
          customRequest={this.uploadRequest}

        >
          {type === 'images/' ? imageUrl ?
            <div style={{position: 'relative'}}>
              <img
                style={this.props.style?this.props.style:styles.div}
                src={this.props.baseUrl + imageUrl}
                alt=""
              >
              </img>
            </div>
            : uploadButton :
            imageUrl ? fileButton : uploadButton}
        </Upload>
        <Modal visible={visible} footer={null} onCancel={()=>this.setState({visible: false})}>
          <img style={{ width: '100%' }} src={this.props.baseUrl + imageUrl} />
        </Modal>
      </div>
    );
  }
}

const styles = {
  div: {
    width: '100px',
    height: '100px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
};
