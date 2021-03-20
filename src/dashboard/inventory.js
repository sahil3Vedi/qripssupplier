import React, {Component} from 'react'
import { PlusOutlined } from '@ant-design/icons'
import AddProduct from '../other/addProduct'
import QripsSpin from '../other/qripsSpin'
import { Button, Modal } from 'antd'
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
            loading_suppliers: true,
            loading_products: false
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


        return (
            <div>
                {add_product_modal}
                <p className="workspace-title">Inventory</p>
                <Button type="primary" icon={<PlusOutlined/>} onClick={this.toggleAddProductModal}>Add Product</Button>
            </div>
        )
    }
}

export default Inventory
