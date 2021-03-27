import React from 'react'
import { Button, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import axios from 'axios'

const ProductSettings = (props) => {

    const PullProductShop = (supplier_name) => {
        props.togglePullingProduct()
        const config = {headers:{'x-auth-token':localStorage.getItem('token')}}
        let formData = {supplier_name: supplier_name}
        axios.post(`${process.env.REACT_APP_BACKEND}/products/pullshopsupplier`,formData,config)
        .then(res=>{
            message.success(res.data.message)
            props.togglePullingProduct()
            props.fetchProducts()
            props.toggleModal()
        })
        .catch(err=>{
            console.log(err)
            props.togglePullingProduct()
        })
    }

    const DeleteProductInventory = (id) => {
        props.togglePullingProduct()
        const config = {headers:{'x-auth-token':localStorage.getItem('token')}}
        axios.delete(`${process.env.REACT_APP_BACKEND}/products/deleteinventorysupplier/${id}`,config)
        .then(res=>{
            message.success(res.data.message)
            props.togglePullingProduct()
            props.fetchProducts()
            props.toggleModal()
        })
        .catch(err=>{
            props.togglePullingProduct()
        })
    }

    return (
        <div>
            <p className="modal-subtitle">Danger Zone</p>
            {
                props.data.approved
                ?
                <Button type="danger" icon={<DeleteOutlined/>} onClick={()=>PullProductShop(props.data.supplier_name)} loading={props.pullingProduct}>Pull product from Store</Button>
                :
                <Button type="danger" icon={<DeleteOutlined/>} onClick={()=>DeleteProductInventory(props.data._id)} loading={props.pullingProduct}>Delete product from Inventory</Button>
            }
        </div>
    )
}

export default ProductSettings
