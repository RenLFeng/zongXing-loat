
import React from 'react';

import './recharge.scss'
import { Modal, Upload, Form, Input, Tooltip,message, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import Recharge from '../rechargecomponents'
import Card from './card';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
export default class Loaninfo extends React.Component {
    constructor(pops) {
        super(pops)
        this.state = {
            proObj: [
                {
                    time: '2018/12/12 12:12',
                    id: 1,
                    title: "活动标题活动标题活动标题活动标题活动标题活动标题活动标题活动标……",
                    img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531132500715&di=da0ae4c0d62834f8319197d47562b95f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F019ac2594b2f7da8012193a33446d6.jpeg'
                },
                {
                    time: '2018/12/12 12:12',
                    id: 2,
                    title: "活动标题活动标题活动标题活动标题活动标题活动标题活动标题活动标……",
                    img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531132500715&di=da0ae4c0d62834f8319197d47562b95f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F019ac2594b2f7da8012193a33446d6.jpeg'
                }, {
                    time: '2018/12/12 12:12',
                    id: 3,
                    title: "活动标题活动标题活动标题活动标题活动标题活动标题活动标题活动标……",
                    img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531132500715&di=da0ae4c0d62834f8319197d47562b95f&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F019ac2594b2f7da8012193a33446d6.jpeg'
                }
            ],
            addMOdel: false,
            loading: false,
        }
    }
    add() {
        this.setState({
            addMOdel: true
        })
    }
    handleOk() {

    }
    handleCancel() {

    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    // up
    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => this.setState({
                imageUrl,
                loading: false,
            }));
        }
    }

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;

        return (
            <div>
                {/* < Recharge types='1' /> */}


                <Row>
                    <Col span={15}>
                        <div className="pro-active-title">
                            <p className="recharge-title">项目活动</p>
                            <Button size="small" className='btn-styles' onClick={this.add.bind(this)}  >+添加</Button>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA4QAAAACCAYAAAAATxJjAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABCSURBVFhH7cuxDcAwDANBeQHtP6cWSMAglRvXQe4qgsCvmbnqoLvXOx8aTWg0odGERhMaTWg0oflGs/8AAAD8RtUNNBgYEbUteewAAAAASUVORK5CYII=" />
                        </div>
                        <Card param={this.state.proObj} />
                    </Col>
                    <Col span={9}>col-12</Col>
                </Row>


                <Modal
                    title="新增活动项目"
                    visible={this.state.addMOdel}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}

                >
                    <div>
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                            <FormItem>
                                <Input placeholder="输入活动标题" style={{ width: '95%', marginLeft: '-21px' }} />
                            </FormItem>
                            <FormItem>
                                <TextArea placeholder="输入活动内容" autosize={{ minRows: 2, maxRows: 6 }} style={{ width: '95%', marginLeft: '-21px' }} />
                            </FormItem>
                        </Form>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="//jsonplaceholder.typicode.com/posts/"
                            beforeUpload={beforeUpload}
                            onChange={this.handleChange}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                        </Upload>
                    </div>
                </Modal>



            </div>
        )
    }
}

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
        message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
}