import React, {Component} from 'react'
import { Button, Modal, Table, Space } from 'antd'
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import AddProduct from '../other/addProduct'
import ViewProduct from '../other/viewProduct'
import QripsSpin from '../other/qripsSpin'
import axios from 'axios'
import '../stylesheets/products.css'

class Inventory extends Component{
    constructor(props){
        super(props)
        this.state = {
            add_product_modal_visible: false,
            products:[],
            loading_products: true,
            productData:null,
            view_product_modal_visible: false,
        }
    }

    componentDidMount(){
        this.fetchProducts()
    }

    fetchProducts = () => {
        this.setState({
            loading_products: true
        }, () => {
            const config = { headers: { 'x-auth-token': localStorage.getItem('token') } }
            axios.get(`${process.env.REACT_APP_BACKEND}/products`, config)
            .then(res => {
                this.setState({
                    products: res.data,
                    loading_products: false
                })
            })
        })
    }

    toggleAddProductModal = () => {
        this.setState(prevState=>({
            add_product_modal_visible: !prevState.add_product_modal_visible
        }))
    }

    toggleViewProductModal = () => {
        this.setState(prevState=>({
            view_product_modal_visible: !prevState.view_product_modal_visible
        }))
    }

    viewProductDetails = (record) => {
        this.setState({
            productData: record
        },()=>{
            this.toggleViewProductModal()
        })
    }

    render(){
        //ADD PRODUCT MODAL
        let add_product_modal = <Modal centered maskClosable={false} destroyOnClose width="35%" title="Add Product" visible={this.state.add_product_modal_visible} footer={null} onCancel={this.toggleAddProductModal}>
            <AddProduct fetchProducts={this.fetchProducts} toggleModal={this.toggleAddProductModal}/>
        </Modal>

        //VIEW PRODUCT MODAL
        let view_product_modal = <Modal destroyOnClose width="35%" title="View Product" visible={this.state.view_product_modal_visible} footer={null} onCancel={this.toggleViewProductModal}>
            <ViewProduct data={this.state.productData}/>
        </Modal>

        //DISPLAY PRODUCTS
        const product_columns = [
            {
                title: 'Product Name',
                dataIndex: 'supplier_name',
                key: 'supplier_name'
            },
            {
                title: 'Company',
                dataIndex: 'supplier_company',
                key: 'supplier_company'
            },
            {
                title: 'Unit Price',
                dataIndex: 'supplier_unit_price',
                key: 'supplier_unit_price'
            },
            {
                title: 'Quantity',
                dataIndex: 'qty',
                key: 'qty'
            },
            {
                title: 'Manufactured',
                dataIndex: 'mfg_date',
                key: 'mfg_date'
            },
            {
                title: 'Expiring',
                dataIndex: 'expiry_date',
                key: 'expiry_date'
            },
            {
                title: 'Status',
                dataIndex: 'approved',
                key: 'approved',
                render: text => (
                    text ? <p style={{color:"green",margin:0}}>Approved</p> : <p style={{color:"orange",margin:0}}>Not Approved</p>
                )
            },
            {
                title:'',
                dataIndex:'',
                keyIndex:'',
                render: (text,record) => (
                    <Space>
                        <Button icon={<EyeOutlined/>} onClick={()=>this.viewProductDetails(record)}/>
                        <Button icon={<DeleteOutlined/>} type="danger"/>
                    </Space>
                )
            }
        ]

        console.log(this.state.products)

        let products = <div className="display-suppliers">{this.state.loading_products ? <QripsSpin/> : <Table rowKey={"supplier_name"} columns={product_columns} dataSource={this.state.products}/>}</div>

        return (
            <div>
                {add_product_modal}
                {view_product_modal}
                <p className="workspace-title">Inventory</p>
                <Button type="primary" icon={<PlusOutlined/>} onClick={this.toggleAddProductModal}>Add Product</Button>
                {products}
            </div>
        )
    }
}

export default Inventory
