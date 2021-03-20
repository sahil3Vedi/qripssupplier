import React, { Component } from 'react'
import { Button, Form, Input, Steps, Space, Upload, message, Modal } from 'antd'
import { UploadOutlined, EyeOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import axios from 'axios'
import FileViewer from 'react-file-viewer'

const { Step } = Steps

class AddProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            supplier: "Sahil Traders",//integrate with login API
            current_add_product_stage: 0,
            product_img: [],
            view_file: {},
            basic_details: {},
            storage_details: {},
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
        console.log(values)
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
        let { supplier_name, supplier_company, supplier_description, supplier_unit_price, qty } = basic_details
        let { expiry, mfd, product_id_type, product_id } = storage_details
        // Manip supplier_img
        let supplier_img = this.state.product_img
        let formData = {
            supplier_name, supplier_company, supplier_description, supplier_unit_price, qty,
            expiry, mfd, product_id_type, product_id,
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
                    <Input placeholder="Product Description" />
                </Form.Item>
                <Form.Item name="img_upload">
                    <Upload {...product_img_upload_props}>{this.state.product_img_uploading ? <LoadingOutlined spin /> : <UploadOutlined/>}</Upload>
                </Form.Item>
                <div className="supplier-form-2">
                    <Form.Item name="supplier_unit_price" rules={[{ required: true, message: 'Please enter Supplier Unit Price' }]}>
                        <Input placeholder="Supplier Unit Price" />
                    </Form.Item>
                    <Form.Item name="qty" rules={[{ required: true, message: 'Please enter Product Quantity' }]}>
                        <Input placeholder="Quantity" />
                    </Form.Item>
                    <Space>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={!this.state.product_img.length}>Next</Button>
                        </Form.Item>
                    </Space>
                </div>
            </Form>
        )

        //Storage Form: expiry, mfd, product_id_type, product_id
        let storage_form = (
            <Form name="add_storage" onFinish={this.updateStorageDetails} initialValues={this.state.storage_details}>
                <p className="modal-subtitle">Storage Details</p>
                <Form.Item name="expiry" rules={[{ required: true, message: 'Please enter Expiration Date' }]}>
                    <Input placeholder="Expiration Date"/>
                </Form.Item>
                <Form.Item name="mfd" rules={[{ required: true, message: 'Please enter Manufacturing Date' }]}>
                    <Input placeholder="Manufacturing Date"/>
                </Form.Item>
                <Form.Item name="product_id_type" rules={[{ required: true, message: 'Please select Product ID Type' }]}>
                    <Input placeholder="Product ID Type"/>
                </Form.Item>
                <Form.Item name="product_id" rules={[{ required: true, message: 'Please enter Product ID Type' }]}>
                    <Input placeholder="Product ID"/>
                </Form.Item>
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
                    <div><p><b>Name</b></p><p>{this.state.basic_details.supplier_name}</p></div>
                    <div><p><b>Company</b></p><p>{this.state.basic_details.supplier_company}</p></div>
                    <div><p><b>Description</b></p><p>{this.state.basic_details.supplier_description}</p></div>
                    <div><p><b>Supplier Unit Price</b></p><p>{this.state.basic_details.supplier_unit_price}</p></div>
                    <div><p><b>Quantity</b></p><p>{this.state.basic_details.qty}</p></div>
                    // Add Product Images
                </div>
                <p className="modal-subtitle">POC Details</p>
                <div className="supplier-form-2">
                    <div><p><b>Expiration Date</b></p><p>{this.state.storage_details.expiry}</p></div>
                    <div><p><b>Manufacturing Date</b></p><p>{this.state.storage_details.mfd}</p></div>
                    <div><p><b>Product ID Type</b></p><p>{this.state.storage_details.product_id_type}</p></div>
                    <div><p><b>Product ID</b></p><p>{this.state.storage_details.product_id}</p></div>
                </div>
                <Space>
                    <Button type="danger" onClick={()=>{this.setAddProductStage(1)}}>Back</Button>
                    <Button type="primary" onClick={this.addProduct} loading={this.state.adding_product}>Add Product</Button>
                </Space>
            </div>
        )

        console.log(this.state.product_img)

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
