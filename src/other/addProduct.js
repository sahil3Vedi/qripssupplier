import React, {Component} from 'react'
import { Button, Form, Input, Steps, Space, Upload, message, Modal } from 'antd'
import { UploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import axios from 'axios'
import FileViewer from 'react-file-viewer'

class AddProduct extends Component{
    constructor(props){
        super(props)
        this.state={
            supplier: "Sahil Traders",//integrate with login API
            current_add_product_stage: 0,
            product_img:{},
            view_file:{},
            basic_details: {},
            storage_details:{},
            product_img_uploading: false,
            view_file_modal_visible: false,
            adding_product: false,
        }
    }

    setAddProductStage = (x) => {
        this.setState({
            current_add_supplier_stage: x
        })
    }

    updateBasicDetails = (values) => {
        this.setState({
            basic_details: values
        },()=>{
            this.setAddProductStage(1)
        })
    }

    updateStorageDetails = (values) => {
        this.setState({
            storage_details: values
        },()=>{
            this.setAddProductStage(2)
        })
    }

    addSupplier = () => {
        this.toggleAddingProduct()
        let supplier = this.state.supplier
        let {basic_details,storage_details} = this.state
        let {supplier_name,supplier_company,supplier_description,supplier_unit_price,qty} = basic_details
        let {expiry,mfd,product_id_type,product_id} = storage_details
        let supplier_image_url = this.state.product_image.url
        let supplier_image_name = this.state.product_image.name
        let formData = {
            supplier_name,supplier_company,supplier_description,supplier_unit_price,qty,
            expiry,mfd,product_id_type,product_id,
            supplier_image_url,supplier_image_name
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
        this.setState(prevState=>({
            product_img_uploading: !prevState.product_img_uploading
        }))
    }

    toggleViewFileModal = () => {
        this.setState(prevState=>({
            view_file_modal_visible: !prevState.view_file_modal_visible,
        }))
    }

    deleteProductImg = () => {
        this.setState({
            product_img:{}
        })
    }

    setViewUrl = (file) => {
        this.setState({
            view_file: file
        },()=>{
            this.toggleViewFileModal()
        })
    }

    render(){
        // View File Modal
        let view_file_modal = <Modal destroyOnClose centered width="35%" closable={true} onCancel={this.toggleViewFileModal} visible={this.state.view_file_modal_visible} footer={null}>
            <FileViewer
            fileType={this.state.view_file.name ? this.state.view_file.name.split('.')[1]: null}
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
                    formData.append("file",file)
                    formData.append("upload_preset","msiuxpoc")
                    axios.post("https://api.cloudinary.com/v1_1/dxti6efrg/image/upload",formData)
                    .then(res=>{
                        this.setState({
                            product_img:{
                                url: res.data.secure_url,
                                name: `${res.data.public_id.split('/')[1]}.${res.data.format}`
                            }
                        },()=>{
                            this.toggleProductImgUploading()
                        })
                    })
                }
                return false;
            },
            multiple: false,
            showUploadList: false,
            accept:".png,.jpg"
        }

        // Add Components later
        return (
            <div>
                <p className="workspace-title">Add Product</p>
            </div>
        )
    }
}

export default AddProduct
