import React, { Component } from 'react'
import { Button, Form, Input, Steps, Space, Upload, message, Modal, Select, DatePicker, InputNumber } from 'antd'
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import moment from 'moment'
import axios from 'axios'
import FileViewer from 'react-file-viewer'

const { Step } = Steps
const { TextArea } = Input
const { Option } = Select
const dateFormat = "DD-MMM-YYYY"

class AddProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            supplier: "Sahil Traders",//integrate with login API
            current_add_product_stage: 0,
            product_img: [],
            view_file: {},
            basic_details: {},
            storage_details: {"supplier_unit_price":100,"qty":5},
            product_img_uploading: false,
            view_file_modal_visible: false,
            adding_product: false,
        }
    }

    setAddProductStage = (x) => {
        this.setState({
            current_add_product_stage: x
        })
    }

    updateBasicDetails = (values) => {
        this.setState({
            basic_details: values
        }, () => {
            this.setAddProductStage(1)
        })
    }

    updateStorageDetails = (values) => {
        this.setState({
            storage_details: values
        }, () => {
            this.setAddProductStage(2)
        })
    }

    addProduct = () => {
        this.toggleAddingProduct()
        let supplier = this.state.supplier
        let { basic_details, storage_details } = this.state
        let { supplier_name, supplier_company, supplier_description } = basic_details
        let { expiry, mfd, product_id_type, product_id, supplier_unit_price, qty } = storage_details
        let expiry_date = moment(expiry).format("DD-MMM-YYYY")
        let mfg_date = moment(mfd).format("DD-MMM-YYYY")
        // Manip supplier_img
        let supplier_img = this.state.product_img
        let formData = {
            supplier_name, supplier_company, supplier_description, supplier_unit_price, qty,
            mfg_date, expiry_date, product_id_type, product_id,
            supplier_img
        }
        console.log(formData)
        // const config = {headers:{'x-auth-token':localStorage.getItem('token')}}
        // axios.post(`${process.env.REACT_APP_BACKEND}/products`,formData,config)
        // .then(res=>{
        //     this.toggleAddingProduct()
        //     this.props.fetchProducts()
        //     this.props.toggleModal()
        // })
        // .catch(err=>{
        //     console.log(err)
        //     this.toggleAddingProduct()
        // })
    }

    toggleProductImgUploading = () => {
        this.setState(prevState => ({
            product_img_uploading: !prevState.product_img_uploading
        }))
    }

    toggleAddingProduct = () => {
        this.setState(prevState => ({
            adding_product: !prevState.adding_product
        }))
    }

    toggleViewFileModal = () => {
        this.setState(prevState => ({
            view_file_modal_visible: !prevState.view_file_modal_visible,
        }))
    }

    deleteProductImg = () => {
        this.setState({
            product_img: {}
        })
    }

    setViewUrl = (file) => {
        this.setState({
            view_file: file
        }, () => {
            this.toggleViewFileModal()
        })
    }

    onPreview = (file) => {
        for (var img in this.state.product_img){
            if (file.uid===this.state.product_img[img].uid){
                this.setViewUrl(this.state.product_img[img])
            }
        }
    }

    onRemove = (file) => {
        let temp_img = []
        for (var img in this.state.product_img){
            if (file.uid!==this.state.product_img[img].uid){
                temp_img.push(this.state.product_img[img])
            }
        }
        this.setState({product_img: temp_img})
    }

    disabledExpirationDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    }

    disabledMfgDate = (current) => {
        // Can not select days after today and today
        return current && current > moment().endOf('day');
    }


    render() {
        // View File Modal
        let view_file_modal = <Modal destroyOnClose centered width="35%" closable={true} onCancel={this.toggleViewFileModal} visible={this.state.view_file_modal_visible} footer={null}>
            <FileViewer
                fileType={this.state.view_file.name ? this.state.view_file.name.split('.')[1] : null}
                filePath={this.state.view_file.url}
                errorComponent={<div><p>Error Loading File</p></div>}
            />
        </Modal>

        // ID Upload Props
        let product_img_upload_props = {
            beforeUpload: file => {
                this.toggleProductImgUploading()
                //validating file size
                const isLt3M = file.size / 1024 / 1024 < 3;
                if (!isLt3M) message.error('Image must smaller than 2MB!')
                else {
                    const formData = new FormData()
                    formData.append("file", file)
                    formData.append("upload_preset", "msiuxpoc")
                    axios.post("https://api.cloudinary.com/v1_1/dxti6efrg/image/upload", formData)
                        .then(res => {
                            let product_img = this.state.product_img
                            product_img.push({
                                url: res.data.secure_url,
                                name: `${res.data.public_id.split('/')[1]}.${res.data.format}`,
                                uid: file.uid
                            })
                            this.setState({
                                    product_img
                            }, () => {
                                this.toggleProductImgUploading()
                            })
                        })
                }
                return false;
            },
            loading:true,
            listType:"picture-card",
            multiple: false,
            showUploadList: true,
            accept: ".png,.jpg",
            onPreview: this.onPreview,
            onRemove: this.onRemove,
            defaultFileList: this.state.basic_details.img_upload ? this.state.basic_details.img_upload.fileList : []
        }

        //Basic Form: supplier_name, supplier_company, supplier_description, supplier_unit_price, qty
        let basic_form = (
            <Form name="add_basics" onFinish={this.updateBasicDetails} initialValues={this.state.basic_details}>
                <p className="modal-subtitle">Basic Details</p>
                <Form.Item name="supplier_name" rules={[{ required: true, message: 'Please enter Product Name' }]}>
                    <Input placeholder="Product Name" />
                </Form.Item>
                <Form.Item name="supplier_company" rules={[{ required: true, message: 'Please enter Product Company' }]}>
                    <Input placeholder="Product Company" />
                </Form.Item>
                <Form.Item name="supplier_description" rules={[{ required: true, message: 'Please enter Product Description' }]}>
                    <TextArea rows={4} placeholder="Product Description" />
                </Form.Item>
                <p className="modal-subtitle">Product Images</p>
                <Form.Item name="img_upload">
                    <Upload {...product_img_upload_props}>{this.state.product_img_uploading ? <LoadingOutlined spin /> : <UploadOutlined/>}</Upload>
                </Form.Item>
                <Space>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={!this.state.product_img.length}>Next</Button>
                    </Form.Item>
                </Space>
            </Form>
        )

        //Storage Form: expiry, mfd, product_id_type, product_id
        let storage_form = (
            <Form name="add_storage" onFinish={this.updateStorageDetails} initialValues={this.state.storage_details}>
                <p className="modal-subtitle">Storage Details</p>
                <div className="supplier-form-2">
                    <Form.Item name="mfd" rules={[{ required: true, message: 'Please select Manufacturing Date' }]}>
                        <DatePicker  disabledDate={this.disabledMfgDate} format={dateFormat} placeholder="Manufacturing Date"/>
                    </Form.Item>
                    <Form.Item name="expiry" rules={[{ required: true, message: 'Please select Expiration Date' }]}>
                        <DatePicker format={dateFormat} disabledDate={this.disabledExpirationDate} placeholder="Expiration Date"/>
                    </Form.Item>
                    <Form.Item name="product_id_type" rules={[{ required: true, message: 'Please select Product ID Type' }]}>
                        <Select placeholder="Product ID Type">
                            <Option value="EAN-13">EAN-13</Option>
                            <Option value="EAN-8">EAN-8</Option>
                            <Option value="UPC-E">UPC-E</Option>
                            <Option value="GTIN">GTIN</Option>
                            <Option value="UPC-A">UPC-A</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="product_id" rules={[{ required: true, message: 'Please enter Product ID' }]}>
                        <Input placeholder="Product ID"/>
                    </Form.Item>
                    <Form.Item name="supplier_unit_price" rules={[{ required: true, message: 'Please enter Supplier Unit Price' }]}>
                        <InputNumber precision={0} placeholder="Supplier Unit Price" min={100} max={1500} formatter={value => `₹ ${value}`} step={10} parser={value => value.replace('₹ ', '')}/>
                    </Form.Item>
                    <Form.Item name="qty" rules={[{ required: true, message: 'Please enter Product Quantity' }]}>
                        <InputNumber precision={0} placeholder="Quantity" min={5} max={100} formatter={value => `${value} Units`} step={5} parser={value => value.replace(' Units', '')}/>
                    </Form.Item>
                </div>
                <Space>
                    <Form.Item>
                        <Button type="danger" onClick={()=>{this.setAddProductStage(0)}}>Back</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Next</Button>
                    </Form.Item>
                </Space>
            </Form>
        )

        // Verfication of Details
        let verification = (
            <div>
                <p className="modal-subtitle">Basic Details</p>
                <div className="supplier-form-2">
                    <div><p className="attribute-key"><b>Name</b></p><p className="attribute-value">{this.state.basic_details.supplier_name}</p></div>
                    <div><p className="attribute-key"><b>Company</b></p><p className="attribute-value">{this.state.basic_details.supplier_company}</p></div>
                </div>
                <div><p className="attribute-key"><b>Description</b></p><p className="attribute-value">{this.state.basic_details.supplier_description}</p></div>
                <p className="modal-subtitle">Product Images</p>
                <div className="view-uploaded-images">
                    {
                        this.state.product_img.map(d=><div key={d.url}>
                            <img className="uploaded-image" src={d.url} alt=""/>
                        </div>)
                    }
                </div>
                <p className="modal-subtitle">Storage Details</p>
                <div className="supplier-form-2">
                    <div><p className="attribute-key"><b>Supplier Unit Price</b></p><p className="attribute-value">{`₹ ${this.state.storage_details.supplier_unit_price}`}</p></div>
                    <div><p className="attribute-key"><b>Quantity</b></p><p className="attribute-value">{`${this.state.storage_details.qty} Units`}</p></div>
                    <div><p className="attribute-key"><b>Expiration Date</b></p><p className="attribute-value">{moment(this.state.storage_details.expiry).format("DD-MMM-YYYY")}</p></div>
                    <div><p className="attribute-key"><b>Manufacturing Date</b></p><p className="attribute-value">{moment(this.state.storage_details.mfd).format("DD-MM-YYYY")}</p></div>
                    <div><p className="attribute-key"><b>Product ID Type</b></p><p className="attribute-value">{this.state.storage_details.product_id_type}</p></div>
                    <div><p className="attribute-key"><b>Product ID</b></p><p className="attribute-value">{this.state.storage_details.product_id}</p></div>
                </div>
                <Space>
                    <Button type="danger" onClick={()=>{this.setAddProductStage(1)}}>Back</Button>
                    <Button type="primary" onClick={this.addProduct} loading={this.state.adding_product}>Add Product</Button>
                </Space>
            </div>
        )

        return (
            <div>
                {view_file_modal}
                <Steps current={this.state.current_add_product_stage}>
                    <Step title="Basic"/>
                    <Step title="Storage"/>
                    <Step title="Verify"/>
                </Steps>
                {this.state.current_add_product_stage===0 && basic_form}
                {this.state.current_add_product_stage===1 && storage_form}
                {this.state.current_add_product_stage===2 && verification}
            </div>
        )
    }
}

export default AddProduct
